<template>
    <v-stepper :items="taskTitles">
    </v-stepper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Leaflet from 'leaflet';

import 'leaflet/dist/leaflet.css';
import experiment from '../data/experiments/UncertaintyViz/UncertaintyViz.json';
import data from '../data/experiments/UncertaintyViz/data/LakeCounty_Health_NationalObesityByState_2015.json';
import type { Feature } from 'geojson';

type Experiment = {
    title: String,
    description: String,
    authors: String[],
    tasks: Array<Task>
}

type Task = {
    title: String,
    widgets: Object[]
}

export default defineComponent({
    data() {
        return {
            map: undefined,
            experiment: {} as Experiment,
            taskTitles: [] as String[]
        }
    },
    computed: {
    },
    methods: {
        setTaskTitles() {
            const tasks = this.experiment?.tasks;

            this.taskTitles = tasks.map(task => {
                return task.title
            });
        }
    },
    mounted() {
        this.experiment = experiment;

        this.setTaskTitles();

        var map = Leaflet.map('map').setView([51.505, -0.09], 13);

        const tiles = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        console.log(experiment);

        /* data: {
            type: "FeatureCollection",
            crs: {
                type: "name",
                properties: {
                    name: "EPSG:4326"
                }
            },
            features: [
                {
                    id: 0,
                    type: "Feature",
                    geometry: <Polygon>,
                    properties: {
                        OBJECTID: 0,
                        NAME: "Texas",
                        Obesity: 32.4
                    }
                }
            ]
        }
        */

        /* input parameters: {
             classification method: 'equal interval', 'quantiles', 'natural breaks',
             number of classes: <number>,
             color scheme: 'sequential', 'diverging', 'qualitative'
             variable: <String> e.g. "Obesity"
         
        } */

        const features = data?.features;

        const getColor = (value: number) => {
            return value <= 25 ? 'green' : 'red';
        }

        const style = (feature: Feature) => {
            return {
                fillColor: getColor(feature?.properties?.Obesity)
            }
        };

        Leaflet.geoJSON(data, { style: style }).addTo(map);
    }
});
</script>
