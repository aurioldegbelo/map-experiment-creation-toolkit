import './assets/app.scss'

import { createApp } from 'vue'
import App from './components/App.vue'

//Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const light: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#E8F9E8',
        surface: '#F7F7F7',
        'on-surface': '#333333',
        primary: '#89BE31'
    }
}

const dark: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#2C2C2C',
        surface: '#2C2C2C',
        'on-surface': '#E0E0E0',
        primary: '#89BE31'
    }
}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light,
            dark
        }
    }
});

createApp(App).use(vuetify).mount('#app')
