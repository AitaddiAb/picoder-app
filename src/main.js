import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

/**
 * Bootstrap the PiCoder SPA with Pinia for auth/session state.
 */
createApp(App).use(createPinia()).mount('#app')
