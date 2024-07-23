<template>
    <h4>{{ title }}</h4>
    <div :id="id" class="map"></div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ClassificationMethod } from '@/types/widgets/MapWidget';
import type { Map, MapOptions } from 'leaflet';
import type { GeoJsonObject } from 'geojson';

import Leaflet from 'leaflet';

import json from 'experiments/UncertaintyViz/src/LakeCounty_Health_NationalObesityByState_2015.json';

import 'leaflet/dist/leaflet.css';

type MapWidgetData = {
    id: string,
    map: Map,
    mapOptions: MapOptions,
    mapData: GeoJsonObject
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
        numberOfClasses: {
            type: Number,
            required: false,
            default: 0
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
            mapData: {} as GeoJsonObject
        }
    },
    mounted() {
        //console.log(this.title);
        //console.log(this.data);
        //console.log(this.variableName);
        //console.log(this.numberOfClasses);
        //console.log(this.classificationMethod);
        //console.log(this.colorScheme);
        this._initMap();
    },
    methods: {
        _initMap() {
            this.map = Leaflet.map(this.id, { zoomSnap: this.mapOptions.zoomSnap });
            //this.map.setView([51.505, -0.09], 13);
            
            //TODO: Configure basemaps via leaflet-providers (https://leaflet-extras.github.io/leaflet-providers/preview/index.html)
            const basemapLayer = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });

            this.map.addLayer(basemapLayer);

            //TODO: Data has to be dynamically imported here based on the name of the experiment
            //FIXME: Input data has to follow GeoJSON specification
            this.mapData = json;
            const dataLayer = Leaflet.geoJSON(this.mapData);
            const bounds = dataLayer.getBounds();
            this.map.addLayer(dataLayer);

            this.map.fitBounds(bounds);
        }
    }
}
</script>