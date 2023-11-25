import { createApp } from 'vue'
import { router } from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/styles/main.scss'
// import VueLazyload from 'vue-lazyload';
// import noImage from "./assets/images/noImage.svg";
// import loadImage from "./assets/images/reload-cat.gif";


createApp(App)
.use(router)
.use(createPinia())
// .use(VueLazyload, {error: noImage, loading: loadImage})
// .use(emailjs)
// .use(blob)



.mount('#app')
