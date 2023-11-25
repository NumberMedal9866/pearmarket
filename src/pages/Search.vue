<template>
    <div class="container col">
        <input type="text" @input="input(query)" v-model="query" placeholder="Search">
        <div class="card-holder" v-if="storeSearch">
            <Card 
                :storeProducts="storeSearch"
            />
        </div>
        <!-- dont have the patience to do this, fix this later!!! -->
        <!-- <div v-else-if="query != ''">
            <p class="empty">Nothing is found</p>
        </div>
        <div v-else></div> -->
    </div>
</template>

<script setup>
    import Card from '@/components/Card/Card.vue'
    import {ref, onMounted} from 'vue'
    import {useSearch} from '@/store/search'
    // import {useItem} from '@/store/item'
    // const items = useItem()
    // const storeItems = ref(null)
    const storeSearch = ref(null)
    const see = storeSearch.value
    const search = useSearch()
    const query = ''
    const input = async(query) => {
        await search.getSearch(query)
        storeSearch.value = search.search
        console.log(storeSearch.value);
        if (query=='') storeSearch.value=null
    }
    // const calculateDiscountedPrice = (price, discountPercentage) => {
    //   const discountAmount = (price * discountPercentage) / 100;
    //   const discountedPrice = price - discountAmount;
    //   return Math.round(discountedPrice);
    // };
    // const takeItem = async(id) => {
    //     await items.getItem(id)
    //     storeItems.value = items.item
    // }
    // const log = (item) => {
    //     // Retrieve existing cart items from local storage
    // const existingCart = JSON.parse(localStorage.getItem('cart'));

    // // Check if existingCart is an array
    // if (!Array.isArray(existingCart)) {
    //     // If not, create a new array
    //     const newCart = [item];

    //     // Save the new array back to local storage
    //     localStorage.setItem('cart', JSON.stringify(newCart));
    // } else {
    //     // Append the new item to the existing cart
    //     existingCart.push(item);

    //     // Save the updated cart back to local storage
    //     localStorage.setItem('cart', JSON.stringify(existingCart));
    // }

    // console.log('Object added to local storage:', item);
    // alert('Your Item Has Been successfully added')
    // }
</script>

<style lang="scss" scoped>
    input{
        margin-top: 20px;
        width: 100%;
        background: #fff;
        padding: 10px 20px;
        font-size: 20px;
        border-radius: 15px;
    }
    .col{
        display: flex;
        flex-direction: column;
    }
</style>