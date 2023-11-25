<template>
    <div class="nav container">
        <router-link to="/">
            <img src="@/assets/images/pearlogo.png" alt="">       
        </router-link>
        <ul>
            <li><router-link to="/categories">Categories</router-link></li>
            <li><router-link to="/search">Search</router-link></li>
            <!-- <li><router-link to="/">Chinchilla</router-link></li> -->
        </ul>
        <router-link to="/cart" class="cart-info">
            <p>{{val || cartItemsLength}}</p>
            <img src="@/assets/images/cart.svg" alt="" class="cart">
        </router-link>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import { computed, watch } from 'vue';
import { EventBus } from '@/store/EventBus.js';
// import { inject } from 'vue'
const val = ref(null)
const receivedData = computed(() => EventBus.dataChanged);

watch(receivedData, (newData) => {
  if(newData)val.value = newData
  else val.value = 0
});
const updateCartItemsLength = () => {
  cartItemsLength.value = getCartItems().length;
};
const cartItemsJSON = localStorage.getItem('cart');
const cartItems = cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
console.log('Cart items:', cartItems);
const cartItemsLength = computed(() => cartItems.length);
if (cartItemsLength.value > 0) {
  console.log('There are items in the cart:', cartItemsLength.value);
} else {
  console.log('The cart is empty');
}
</script>

<style lang="scss" scoped>

</style>