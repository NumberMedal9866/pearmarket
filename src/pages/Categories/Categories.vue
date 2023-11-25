<template>
        <div class="container mod">
            <div class="btn-holder">
                <div class="btn" @click="categorie('smartphones')">
                    <p>smartphones</p>
                </div>
                <div class="btn" @click="categorie('laptops')">
                    <p>laptops</p>
                </div>
                <div class="btn" @click="categorie('fragrances')">
                    <p>fragrances</p>
                </div>
                <div class="btn" @click="categorie('skincare')">
                    <p>skincare</p>
                </div>
                <div class="btn" @click="categorie('groceries')">
                    <p>groceries</p>
                </div>
                <div class="btn" @click="categorie('furniture')">
                    <p>furniture</p>
                </div>
                <div class="btn" @click="categorie('tops')">
                    <p>tops</p>
                </div>
                <div class="btn" @click="categorie('motorcycle')">
                    <p>motorcycle</p>
                </div>
                <div class="btn" @click="categorie('womens-dresses')">
                    <p>womens-dresses</p>
                </div>
                <div class="btn" @click="categorie('home-decoration')">
                    <p>home-decoration</p>
                </div>
            </div>
            <div class="card-holder container">
                <transition name="fade">
                <Card 
                    :storeProducts="storeCat"
                />
                </transition>
            </div>
        </div>
</template>

<script setup>
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
    // }
            // <RouterLink :to="`product/${item.id}`" class="card">
            //     <div @click.stop="takeItem(item.id)">
            //         <img :src="item.thumbnail" alt="">
            //         <p>{{item.title}}</p>
            //     </div>
            // </RouterLink>
            // <div class="card-info">
            //     <div class="card-info-price">
            //         <span>{{item.price}}$</span>
            //         <p>{{calculateDiscountedPrice(item.price, item.discountPercentage)}}$</p>
            //     </div>
            //     <span class="button" @click.stop="log(item)">BUY</span>
            // </div>
    import Card from '@/components/Card/Card.vue'
    import {onMounted, ref} from 'vue'
    import {useCat} from '@/store/cat'
    // import {useItem} from '@/store/item'
    // const items = useItem()
    const cats = useCat()
    const storeCat = ref(null)
    const categorie = async(info) => {
        await cats.getCat(info)
        storeCat.value = cats.cat

        console.log(storeCat.value);
        // console.log(info);
    }
    //     const calculateDiscountedPrice = (price, discountPercentage) => {
    //   const discountAmount = (price * discountPercentage) / 100;
    //   const discountedPrice = price - discountAmount;
    //   return Math.round(discountedPrice);
    // };
    // const takeItem = async(id) => {
    //     await items.getItem(id)
    //     storeItems.value = items.item
    // }
</script>

<style lang="scss" scoped>
    .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>