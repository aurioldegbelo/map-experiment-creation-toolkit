<template>
    <h4>{{ title }}</h4>
    <div :id="id" class="map"></div>
</template>

<script lang="ts">
import type { ClassificationMethod } from '@/types/widgets/MapWidget';
import type { PropType } from 'vue';
import type {
    GeoJSONOptions,
    Map,
    MapOptions,
    PathOptions
} from 'leaflet';
import type { FeatureCollection } from 'geojson';

import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
/* FIXME: Add declaration file for geobuckets. */
import {
    equalIntervalBuckets,
    jenksBuckets,
    quantileBuckets
} from 'geobuckets';

import colorbrewer from 'colorbrewer';

type MapWidgetData = {
    id: string,
    map: Leaflet.Map,
    mapOptions: Leaflet.MapOptions,
    mapData: FeatureCollection,
    classes: number[],
    dataLayer: Leaflet.FeatureGroup
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
            id: `map_${Date.now()}`, //Generate unique map id
            map: {} as Leaflet.Map,
            mapOptions: {
                zoomSnap: 0
            } as Leaflet.MapOptions,
            mapData: {} as FeatureCollection,
            classes: [] as number[],
            dataLayer: {} as Leaflet.FeatureGroup
        }
    },
    computed: {
        numberOfClasses(): number {
            const url = new URL(this.colorScheme);
            const numberOfClasses = Number(url.searchParams.get("n"));
            return numberOfClasses;
        },
        colorPalette(): string {
            const url = new URL(this.colorScheme);
            const scheme = url.searchParams.get("scheme");
            /* FIXME: Fix TypeScript */
            return colorbrewer[scheme][this.numberOfClasses];
        },
        mapDataValues(): number[] {
            return this.mapData.features.map(feature => feature?.properties && feature.properties[this.variableName]);
        }
    },
    mounted() {
        this._initMap();
    },
    methods: {
        async _initMap() {
            this.map = await Leaflet.map(this.id, this.mapOptions);
            await this._addBasemap();
            this.mapData = await this._getData();
            this.classes = await this._calculateClasses();
            await this._addData();
            const bounds = this.dataLayer.getBounds();
            this.map.fitBounds(bounds);

            /* FIXME: TypeScript */
            this.dataLayer.eachLayer(layer  => {
                layer.on({
                    "mouseover": () => {
                        layer.setStyle({
                            color: "red",
                            weight: 5
                        });

                        layer.bringToFront();
                    },
                    "mouseout": event => {
                        this.dataLayer.resetStyle();
                    },
                });
            });
        },
        _addBasemap() {
            //TODO: Configure basemaps via leaflet-providers (https://leaflet-extras.github.io/leaflet-providers/preview/index.html)
            const basemapLayer = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });

            this.map.addLayer(basemapLayer);
        },
        async _getData() {
            //FIXME: Ensure input data follows GeoJSON spec
            const dataSource = `/data/experiments/${import.meta.env.VITE_EXPERIMENT_ID}/src/${this.data}`;
            const data = await (await fetch(dataSource)).json();
            return data;
        },
        async _calculateClasses(): Promise<number[]> {
            const classificationMethod = this.classificationMethod.toString();
            let classes = null;

            switch (classificationMethod) {
                case "equal interval": {
                    classes = equalIntervalBuckets && equalIntervalBuckets(this.mapDataValues, this.numberOfClasses);
                    break;
                }

                case "jenks": {
                    classes = jenksBuckets && jenksBuckets(this.mapDataValues, this.numberOfClasses);
                    break;
                }

                case "quantiles": {
                    classes = quantileBuckets && quantileBuckets(this.mapDataValues, this.numberOfClasses);
                    break;
                }
            }

            return classes;
        },
        _addData() {
            const layerOptions: GeoJSONOptions = {
                style: (feature): PathOptions => {
                    return {
                        fillColor: this._getColor(feature?.properties[this.variableName], this.classes),
                        fillOpacity: 1,
                        color: "black",
                        weight: 0.5
                    }
                }
            }

            this.dataLayer = Leaflet.geoJSON(this.mapData, layerOptions);
            this.map.addLayer(this.dataLayer);
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