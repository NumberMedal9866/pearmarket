import { createRouter,createWebHashHistory } from "vue-router";
import Home from '@/pages/Home/Home.vue'
export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', name: 'homepage', component: Home},
        {path: '/categories', name: 'categories', component: () => import('@/pages/Categories/Categories.vue')},
        {path: '/search', name: 'search', component: () => import('@/pages/Search.vue')},
        {path: '/cart', name: 'cart', component: () => import('@/components/Cart/Cart.vue')},
        {path: '/product/:id', name: 'product', component: () => import('./pages/Product/Product.vue')},
    ],
    scrollBehavior(){
        return {top: 0}
    }
})