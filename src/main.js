import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './core/store/store'
import router from './routes'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import i18n from './i18n'

createApp(App).use(router).use(store).use(i18n).mount('#app')
