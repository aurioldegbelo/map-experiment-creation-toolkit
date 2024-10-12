<template>
    <div class="map-widget">
        <h4>{{ title }}</h4>
        <div :id="mapId" class="map"></div>
        <div :id="legendId" class="legend">
            <div class="title">
                <h4>{{ legendTitle }}</h4>
            </div>
            <div class="colors">
                <div v-for="color in colorPalette" class="legend-color" :style="{ backgroundColor: color }"></div>
            </div>
            <div class="labels">
                <span v-for="label in labels">
                    {{ label }}
                </span>
            </div>
        </div>
        <div :id="infoBoxId" class="info-box">
            <v-data-table
                :headers="headers"
                :items="featurePropertyValues"
                hide-default-footer
                density="compact"
                disable-sort
                class="info-box-table"
            >
            </v-data-table>
        </div>
    </div>
</template>

<script lang="ts">
import type { MapWidget } from '@/types/widgets/MapWidget';
import type { PropType } from 'vue';
import type { Feature, FeatureCollection } from 'geojson';
import type { VDataTable } from 'vuetify/components';

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
    dataLayer: Leaflet.Layer,
    highlightedFeature: Feature,
    headers: VDataTable['$props']['headers']
}

export default {
    props: {
        title: {
            type: String as PropType<MapWidget["title"]>,
            required: false,
            default: ""
        },
        data: {
            type: Object as PropType<MapWidget["data"]>,
            required: true
        },
        classificationMethod: {
            type: String as PropType<MapWidget["classificationMethod"]>,
            required: true
        },
        colorScheme: {
            type: String as PropType<MapWidget["colorScheme"]>,
            required: true
        },
        classLabels: {
            type: Array as PropType<MapWidget["classLabels"]>,
            required: false,
            default: []
        }
    },
    data(): MapWidgetData {
        return {
            id: Date.now().toString(), //Generate unique map id
            map: {} as Leaflet.Map,
            mapOptions: {
                zoomSnap: 0
            } as Leaflet.MapOptions,
            mapData: {} as FeatureCollection,
            classes: [] as number[],
            dataLayer: {} as Leaflet.Layer,
            highlightedFeature: {} as Feature,
            headers: [
                {
                    title: "Property",
                    value: "property",
                    align: "start",
                    width: "50%"
                },
                {
                    title: "Value",
                    value: "value",
                    align: "start",
                    width: "50%"
                }
            ]
        }
    },
    computed: {
        mapId(): string {
            return `map_${this.id}`;
        },
        legendId(): string {
            return `legend_${this.id}`;
        },
        infoBoxId(): string {
            return `infoBox_${this.id}`;
        },
        numberOfClasses(): number {
            const url = new URL(this.colorScheme);
            const numberOfClasses = Number(url.searchParams.get("n"));
            return numberOfClasses;
        },
        colorPalette(): string[] {
            const url = new URL(this.colorScheme);
            const scheme = url.searchParams.get("scheme");
            /* FIXME: Fix TypeScript */
            return colorbrewer[scheme][this.numberOfClasses];
        },
        mapDataValues(): number[] {
            return this.mapData.features.map(feature => feature?.properties && feature.properties[this.data.variable.id]);
        },
        labels(): string[] {
            if (this.classLabels.length > 0) {
                return this.classLabels;
            }

            const classes = this.classes;
            let result = [] as string[];
            for (let i = 0; i < classes.length - 1; i++) {
                result[i] = `${classes[i]} - ${classes[i+1]}`
            }
            return result;
        },
        infoBox(): (HTMLElement | null) {
            return document.getElementById(this.infoBoxId);
        },
        featurePropertyValues(): (VDataTable['$props']['items']) {
            const properties = this.highlightedFeature?.properties;
            const entries = properties && Object.entries(properties);
            return entries?.map((property: any[]) => {
                return new Object({
                    property: property[0],
                    value: property[1]
                });
            });
        },
        legendTitle(): string {
            return (this.data.variable.label ? this.data.variable.label : this.data.variable.id) + (this.data.variable.unit ? ` (in ${this.data.variable.unit})` : "");
        },
        attributionLabel(): string {
            const url = this.data?.attribution?.url;
            const label = this.data?.attribution?.label;

            if (!url || !label) {
                return "";
            }

            return `&copy; <a href=${url}>${label}</a>`;
        }
    },
    mounted() {
        this._initMap();
    },
    methods: {
        async _initMap() {
            this.map = await Leaflet.map(this.mapId, this.mapOptions);
            await this._addBasemap();
            this.mapData = await this._getData();
            this.classes = this._roundValues(await this._calculateClasses());
            await this._addData();
            const bounds = (this.dataLayer instanceof Leaflet.FeatureGroup) && await this.dataLayer.getBounds();
            bounds && await this.map.fitBounds(bounds);
            await this._addLegend();
            await this._addInfoBox();
        },
        _addBasemap() {
            //TODO: Configure basemaps via leaflet-providers (https://leaflet-extras.github.io/leaflet-providers/preview/index.html)
            const basemapLayer = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });

            this.map.addLayer(basemapLayer);
        },
        async _getData(): Promise<FeatureCollection> {
            //FIXME: Ensure input data follows GeoJSON spec
            const dataSource = `/data/${this.data.source}`;
            const data = await (await fetch(dataSource)).json();
            return data;
        },
        async _calculateClasses(): Promise<number[]> {
            const classificationMethod = this.classificationMethod.toString();
            let classes = null;
            const regex = /^\[.*\]$/;

            if (regex.test(classificationMethod)) {
                classes = JSON.parse(classificationMethod);
            }

            switch (classificationMethod) {
                case "EQUAL_INTERVAL": {
                    classes = equalIntervalBuckets && equalIntervalBuckets(this.mapDataValues, this.numberOfClasses);
                    break;
                }

                case "JENKS": {
                    classes = jenksBuckets && jenksBuckets(this.mapDataValues, this.numberOfClasses);
                    break;
                }

                case "QUANTILES": {
                    classes = quantileBuckets && quantileBuckets(this.mapDataValues, this.numberOfClasses);
                    break;
                }

                case "QUALITATIVE": {
                    let temp = Array.from(new Set(this.mapDataValues));
                    classes = temp.sort();
                    break;
                }
            }
    
            return classes;
        },
        _roundValues(values: number[]) {
            return values.map(value => Math.round(value * 100) / 100);
        },
        _addData(): void {
            const layerOptions: Leaflet.GeoJSONOptions = {
                style: (feature): Leaflet.PathOptions => {
                    return {
                        fillColor: this._getColor(feature?.properties[this.data.variable.id], this.classes),
                        fillOpacity: 1,
                        color: "black",
                        weight: 0.5
                    }
                },
                onEachFeature: (feature: Feature, layer: Leaflet.GeoJSON) => {
                    this._onEachFeature(feature, layer)
                },
                attribution: this.attributionLabel
            }

            this.dataLayer = Leaflet.geoJSON(this.mapData, layerOptions);
            this.dataLayer instanceof Leaflet.Layer && this.map.addLayer(this.dataLayer);
        },
        /* FIXME */
        _getColor(value: number, buckets: number[]): string {
            const numberOfClasses = buckets.length - 1;

            /* TODO: Generate color palette based in the number of classes and the provided color scheme */
            const colors = this.colorPalette;
            let color = "";

            for (let index = numberOfClasses - 1; index >= 0; index--) {
                /* Check if value is inside of interval [buckets[index], buckets[index+1]) */
                if (value >= buckets[index]) {
                    color = colors[index];
                    break;
                }
            }

            return color;
        },
        _onEachFeature(feature: Feature, layer: Leaflet.GeoJSON): void {
            layer.on({
                "mouseover": () => {
                    this._highlightFeature(layer),
                    this._updateFeatureInfo(feature)
                },
                "mouseout": () => {
                    this._resetHighlight()
                    this._resetFeatureInfo()
                }
            });
        },
        _highlightFeature(layer: Leaflet.GeoJSON): void {
            layer.setStyle({
                color: "cyan",
                weight: 5
            });

            layer.bringToFront();
        },
        _resetHighlight(): void {
            this.dataLayer instanceof Leaflet.GeoJSON && this.dataLayer.resetStyle();
        },
        _updateFeatureInfo(feature: Feature) {
            this.highlightedFeature = feature;
            if (this.infoBox) {
                this.infoBox.setAttribute("style", "visibility: visible");
            }
        },
        _resetFeatureInfo() {
            this.infoBox && this.infoBox.setAttribute("style", "visibility: hidden");
        },
        _addLegend(): void {
            const Legend = Leaflet.Control.extend({
                onAdd: () => {
                    return Leaflet.DomUtil.get(this.legendId);
                }
            });

            const legend = new Legend({
                position: "bottomleft"
            });

            this.map.addControl(legend);
        },
        _addInfoBox(): void {
            const InfoBox = Leaflet.Control.extend({
                onAdd: () => {
                    return Leaflet.DomUtil.get(this.infoBoxId);
                }
            });

            const infoBox = new InfoBox({
                position: "topright"
            });

            this.map.addControl(infoBox);
        }
    }
}
</script>