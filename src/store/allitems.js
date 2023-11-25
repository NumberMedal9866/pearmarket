import { defineStore } from "pinia";
import axios from "axios";
export const useAllItems = defineStore({
    id: 'allitems',
    state: () => ({
        allitems: null,
        url: `https://dummyjson.com/products?limit=100`
    }),
    actions: {
        async getAll(){
            try {
                const res = await axios.get(`${this.url}`)
                // this.products = res.data.products
                // console.log(res.data.products);
                this.product = res.data.products
                // console.log(this.products);
            } catch (error) {
                console.error('Произошла ошибка при получении продуктов', error);
            }
        }
    }
})