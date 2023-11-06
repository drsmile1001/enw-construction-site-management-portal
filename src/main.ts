/// <reference types="vite-svg-loader" />
import "@/styles/index.scss"
import "virtual:uno.css"
import "@unocss/reset/tailwind-compat.css"

import { createApp } from "vue"
import { createPinia } from "pinia"

import App from "@/App.vue"
import router from "./router"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount("#app")
