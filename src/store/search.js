import { defineStore } from "pinia";
import axios from "axios";
export const useSearch = defineStore({
    id: 'search',
    state: () => ({
        search: null,
        url: `https://dummyjson.com/products/search?q=`
    }),
    actions: {
        async getSearch(query){
            try {
                const res = await axios.get(`${this.url}${query}`)
                this.search = res.data.products
                console.log(this.search, 'asl;dfk');
            } catch (error) {
                console.error('Произошла ошибка при получении товара', error);
            }
        }
    }
})