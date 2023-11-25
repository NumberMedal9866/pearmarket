import { defineStore } from "pinia";
import axios from "axios";
export const useProducts = defineStore({
    id: 'products',
    state: () => ({
        products: null,
        url: `https://dummyjson.com/products`,
        params: `?limit=12&skip=`
    }),
    actions: {
        async getProducts(skip){
            try {
                const res = await axios.get(`${this.url}${this.params}${skip}`)
                this.products = res.data.products
                // console.log(this.products);
            } catch (error) {
                console.error('Произошла ошибка при получении продуктов', error);
            }
        }
    }
})