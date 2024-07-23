<template>
    <h4>{{ title }}</h4>
    <div :id="id" class="map"></div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import type { ClassificationMethod } from '@/types/widgets/MapWidget';
import type { Map } from 'leaflet';

import Leaflet from 'leaflet';

import 'leaflet/dist/leaflet.css';

type MapWidgetData = {
    id: string
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
    data() {
        return {
            id: `map_${Date.now()}`,
            map: {} as Map
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
            this.map = Leaflet.map(this.id);

            const tileLayer = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            
            this.map.addLayer(tileLayer);
            this.map.setView([51.505, -0.09], 13);
        }
    }
}
</script>