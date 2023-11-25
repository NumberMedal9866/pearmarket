import { defineStore } from "pinia";
import axios from "axios";
export const useCat = defineStore({
    id: 'categorie',
    state: () => ({
        cat: null,
        url: `https://dummyjson.com/products/category/`
    }),
    actions: {
        async getCat(info){
            try {
                const res = await axios.get(`${this.url}${info}`)
                this.cat = res.data.products
                // console.log(this.cat);
                // this.item = res.data
                // console.log(this.cat);
            } catch (error) {
                console.error('Произошла ошибка при получении товара', error);
            }
        }
    }
})