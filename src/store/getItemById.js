import { defineStore } from "pinia";

import axios from "axios";
export const useGetItemById = defineStore({
    id: 'getItemById',
    state: () => ({
        item: null,
        url: `https://dummyjson.com/products/`
    }),
    actions: {
        async getItemById({id}){
            try {
                const res = await axios.get(`${this.url}/${id}`)
                // if(type == 'movie') this.movie = res.data
                // else this.tv = res.data
                this.item = res.data
                // console.log(res, 'this one;lasdjf;lajkds;jfsdk');
            } catch (error) {
                console.error('Произошла ошибка при получении фильма или сериала', error);
            }
        }
    }
})