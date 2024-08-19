<template>
    <h4>{{ title }}</h4>
    <div :id="id" class="map"></div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ClassificationMethod } from '@/types/widgets/MapWidget';
import type { Map, MapOptions, GeoJSONOptions, PathOptions, GeoJSON } from 'leaflet';
import type { Feature, FeatureCollection } from 'geojson';

import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { equalIntervalBuckets, jenksBuckets, quantileBuckets } from 'geobuckets';

import colorbrewer from 'colorbrewer';

type MapWidgetData = {
    id: string,
    map: Map,
    mapOptions: MapOptions,
    mapData: FeatureCollection,
    classes: number[]
}

export default {
    props: {
        title: {
            type: String,
            required: false,
            default: ""
        },
        data: {
            type: String,
            required: true
        },
        variableName: {
            type: String,
            required: true
        },
        classificationMethod: {
            type: Number as PropType<ClassificationMethod>,
            required: true
        },
        colorScheme: {
            type: String,
            required: true
        }
    },
    data(): MapWidgetData {
        return {
            id: `map_${Date.now()}`,
            map: {} as Map,
            mapOptions: {
                zoomSnap: 0
            } as MapOptions,
            mapData: {} as FeatureCollection,
            classes: [] as number[]
        }
    },
    computed: {
        /* TODO: Use the url for number of classes instead of parameter */
        colorPalette(): string {
            const url = new URL(this.colorScheme);
            const scheme = url.searchParams.get("scheme");
            /* FIXME: Fix TypeScript */
            return colorbrewer[scheme][this.numberOfClasses];
        },
        numberOfClasses(): number {
            const url = new URL(this.colorScheme);
            const numberOfClasses = Number(url.searchParams.get("n"));
            return numberOfClasses;
        }
    },
    mounted() {
        this._initMap();
    },
    methods: {
        async _initMap() {
            this.map = Leaflet.map(this.id, { zoomSnap: this.mapOptions.zoomSnap });
            //this.map.setView([51.505, -0.09], 13);
            
            //TODO: Configure basemaps via leaflet-providers (https://leaflet-extras.github.io/leaflet-providers/preview/index.html)
            const basemapLayer = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });

            this.map.addLayer(basemapLayer);

            //FIXME: Ensure input data follows GeoJSON spec
            const dataSource = `/data/experiments/${import.meta.env.VITE_EXPERIMENT_ID}/src/${this.data}`;
            this.mapData = await (await fetch(dataSource)).json();

            const values: number[] = this.mapData.features.map(feature => feature.properties[this.variableName]);
            const classificationMethod = this.classificationMethod.toString();
            let buckets = [] as number[];

            if (classificationMethod === "equal interval") {
                buckets = await equalIntervalBuckets(values, this.numberOfClasses);
            }

            if (classificationMethod === "quantiles") {
                buckets = await quantileBuckets(values, this.numberOfClasses);
            }

            if (classificationMethod === "jenks") {
                buckets = await jenksBuckets(values, this.numberOfClasses);
            }

            const layerOptions: GeoJSONOptions = {
                style: (feature): PathOptions => {
                    return {
                        fillColor: this._getColor(feature?.properties[this.variableName], buckets),
                        fillOpacity: 1,
                        color: "black",
                        weight: 0.5
                    }
                }
            }

            const dataLayer = Leaflet.geoJSON(this.mapData, layerOptions);
            const bounds = dataLayer.getBounds();
            this.map.addLayer(dataLayer);

            this.map.fitBounds(bounds);

            /* FIXME: TypeScript */
            dataLayer.eachLayer(layer  => {
                layer.on({
                    "mouseover": () => {
                        layer.setStyle({
                            color: "red",
                            weight: 5
                        });

                        layer.bringToFront();

                        dataLayer.openPopup();
                    },
                    "mouseout": event => {
                        dataLayer.resetStyle();
                        dataLayer.closePopup();
                    },
                });
            });
        },
        /* FIXME */
        _getColor(value: number, buckets: number[]): string {
            const numberOfClasses = buckets.length - 1;

            /* TODO: Generate color palette based in the number of classes and the provided color scheme */
            const colors = this.colorPalette;

            for (let index = numberOfClasses - 1; index >= 0; index--) {
                /* Check if value is inside of interval [buckets[index], buckets[index+1]) */
                if (value >= buckets[index]) {
                    return colors[index];
                }
            }
        }
    }
}
</script>