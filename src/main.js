import { createPinia } from "pinia";
import { createApp } from "vue";
import Platform from "@/app/Platform";
import Router from "@/app/Router";
import "./style.css";
import App from "./App.vue";

/**
 * Bootstrap the PiCoder SPA with Pinia, router, and platform detection.
 */
createApp(App).use(createPinia()).use(Platform).use(Router).mount("#app");
