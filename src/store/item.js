import { defineStore } from "pinia";
import axios from "axios";
export const useItem = defineStore({
    id: 'item',
    state: () => ({
        item: null,
        url: `https://dummyjson.com/products/`
    }),
    actions: {
        async getItem(id){
            try {
                const res = await axios.get(`${this.url}${id}`)
                this.item = res.data
                // console.log(this.item);
            } catch (error) {
                console.error('Произошла ошибка при получении товара', error);
            }
        }
    }
})