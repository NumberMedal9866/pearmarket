<template>
    <div class="card-holder container  ">
        <CardMain 
            :storeItems="displayedItems"
            @option="option($event)"
        />
        <!-- <div class="card-holder-item" v-for="item in storeProducts" :key="item.id">
            <RouterLink :to="`product/${item.id}`" class="card">
                <div @click.stop="takeItem(item.id)">
                    <img :src="item.thumbnail" alt="">
                    <p>{{item.title}}</p>
                </div>
            </RouterLink>
            <div class="card-info">
                <div class="card-info-price">
                    <span>{{item.price}}$</span>
                    <p>{{calculateDiscountedPrice(item.price, item.discountPercentage)}}$</p>
                </div>
                <span class="button" @click.stop="log(item)">ADD TO CART</span>
            </div>
        </div> -->
    </div>
    <div class="pagination">
        <button :disabled="currentPage == 1" @click="changePage('back')">BACK</button>
        <span>Page {{currentPage}} - {{totalPages}}</span>
        <button :disabled="currentPage == totalPages" @click="changePage('next')">NEXT</button>
    </div>
</template>

<script setup>
    import CardMain from '@/components/CardMain/CardMain.vue'
    import {useProducts} from '@/store/products'
    import { useAllItems } from '@/store/allitems'
    import {onMounted, ref, computed} from 'vue'
    import {useItem} from '@/store/item'

    const pageSize = 12
    const currentPage = ref(1)
    const allitems = useAllItems()
    const storeItems = ref(null)

    const totalPages = computed(() => Math.ceil((storeItems.value && storeItems.value.length) / pageSize))

    const displayedItems = computed(() => {
        const start = (currentPage.value - 1) * pageSize
        const end = start + pageSize
        return storeItems.value && storeItems.value.slice(start, end)
    })

    const changePage = (dir) => {
        window.scrollTo(0, 0);
        if (dir === 'back' && currentPage.value > 1) {
            currentPage.value--
        } else if (dir === 'next' && currentPage.value < totalPages.value) {
            currentPage.value++
        }
    }

    onMounted(async() => {
        // await products.getProducts(skip.value)
        // storeProducts.value = products.products
        await allitems.getAll(homeOption.value)
        storeItems.value = allitems.product
        // console.log(storeItems.value);
        // console.log(storeItems.value);
    })
    // const changePage  = async (dir) => {
    //     if (dir === 'back') {
    //         skip.value -= 12; 
    //         currentPage.value--
    //     }
    //     else {
    //         skip.value += 12;
    //         currentPage.value++
    //     }
    //     await products.getProducts(skip.value)
    //     storeProducts.value = products.products
    //     window.scroll(0,0)
    // }
    const def = async()=>{
        await allitems.getAll(homeOption.value)
        storeItems.value = allitems.product
    }

    const homeOption = ref(null)
    const option = (val) =>{
        currentPage.value = 1
        // console.log(val);
        // this.homeOption.value == val
        // console.log(homeOption.value);
        // currentPage.value == 1
        if (val == 'low') {
            storeItems.value.sort((a, b) => a.price - b.price);
            console.log(storeItems.value);
        }else if (val == 'high') {
            storeItems.value.sort((a, b) => b.price - a.price);
        }else if (val == 'check') {
            storeItems.value.sort((a, b) => a.stock - b.stock);
        }else{
            // window.location.reload()
            def()
        }
    }
    onMounted(() => {
        option('else')  
        // displayedItems()
    })
    //
    // const takeItem = async(id) => {
    //     await items.getItem(id)
    //     storeItems.value = items.item
    // }
    // const calculateDiscountedPrice = (price, discountPercentage) => {
    //   const discountAmount = (price * discountPercentage) / 100;
    //   const discountedPrice = price - discountAmount;
    //   return Math.round(discountedPrice);
    // };
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

</style>