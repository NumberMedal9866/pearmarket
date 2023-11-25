<template>
  <select v-model="selectedOption" id="sdf" class="sel" v-if="props.storeProducts"  @change="optionSelected">
    <option value="">Filter</option>
    <option v-for="option in options" :key="option.value" :value="option.value">{{option.label}}</option>
  </select>
<div class="wrapper">
  <div
    class="card-holder-item"
    v-for="item in props.storeProducts"
    :key="item.id"
  >
    <RouterLink :to="`product/${item.id}`" class="card">
      <div @click.stop="takeItem(item.id)">
        <img :src="item.thumbnail" alt="" />
        <p>{{ item.title }}</p>
      </div>
    </RouterLink>
    <div class="card-info">
      <div class="card-info-price">
        <span>{{ item.price }}$</span>
        <p>
          {{ calculateDiscountedPrice(item.price, item.discountPercentage) }}$
        </p>
      </div>
      <div class="cart-info-section">
        <span class="button" v-if="!getAmount(item.id)" @click.stop="log(item)"
          >ADD TO CART</span
        >
        <div class="cart-info-section-amount disable-dbl-tap-zoom" v-else>
          <button @click="decrease(item.id)">-</button>
          <p>{{ getAmount(item.id) }}</p>
          <button @click="increase(item.id)">+</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>

// import { defineProps } from "vue";
// import { provide } from 'vue'
import { onMounted, ref, watch, provide } from "vue";
import { useItem } from "@/store/item";
import { updateData } from '@/store/EventBus.js';
// const amount = ref(0);
const selectedOption = ref('')
const options = ref([
      { label: 'Price ↓', value: 'low' },
      { label: 'Price ↑', value: 'high' },
      { label: 'Stock', value: 'check' },
      // { label: 'Clear', value: 'clear' },
]);
const cartItemsLength = ref(0);
const itemAmounts = ref({});
const props = defineProps({
  storeProducts: {
    type: Array
  },
});

// console.log(props.storeProducts);
const optionSelected = ()=>{
  // console.log(selectedOption.value);
  if (selectedOption.value == 'low') {
    // console.log('low' , props.storeProducts)
    props.storeProducts.sort((a, b) => a.price - b.price);
  }else if (selectedOption.value == 'high') {
    props.storeProducts.sort((a, b) => b.price - a.price);
  }else if (selectedOption.value == 'check') {
    props.storeProducts.sort((a, b) => a.stock - b.stock);
  }else{
    window.location.reload()
  }
}
const items = useItem();
const storeItems = ref(null);
const getAmount = (itemId) => {
  return itemAmounts.value[itemId] || 0;
  // console.log(getAmount);
};
const calculateDiscountedPrice = (price, discountPercentage) => {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedPrice = price - discountAmount;
  return Math.round(discountedPrice);
};
const takeItem = async (id) => {
  await items.getItem(id);
  storeItems.value = items.item;
};
const updateLocalStorage = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.map((cartItem) => {
    const itemId = cartItem.id;
    if (itemAmounts.value[itemId]) {
      return { ...cartItem, amount: itemAmounts.value[itemId] };
    }
    return cartItem;
  });
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  localStorage.setItem("itemAmounts", JSON.stringify(itemAmounts.value));
};
const log = (item) => {
  console.log(getAmount(item.id));
  const itemId = item.id;
  // Increment the amount for the corresponding item id
  itemAmounts.value[itemId] = (itemAmounts.value[itemId] || 0) + 1;
  // Store product information along with amount in local storage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productWithAmount = {
    ...item,
    amount: itemAmounts.value[itemId],
  };
  cart.push(productWithAmount);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateLocalStorage();
  console.log(productWithAmount);
  updateCartItemsLength();
};

const increase = (itemId) => {
  console.log(getAmount(itemId));

  itemAmounts.value[itemId]++;
  updateLocalStorage();
};

const decrease = (itemId) => {
  if (itemAmounts.value[itemId] <= 1) {
    // Remove the item from itemAmounts when its value becomes zero
    delete itemAmounts.value[itemId];

    // Remove the item from cart in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter((cartItem) => cartItem.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Update the 'itemAmounts' key in localStorage after removing the item
    localStorage.setItem('itemAmounts', JSON.stringify(itemAmounts.value));
    // window.location.reload()
    updateCartItemsLength();
    // alert('You cannot go lower than this number');
  } else {
    itemAmounts.value[itemId]--;
    updateLocalStorage(); // Update localStorage after decrementing the value
  }
};
const getItemAmountsFromLocalStorage = () => {
  const storedItemAmounts = JSON.parse(localStorage.getItem("itemAmounts"));
  if (storedItemAmounts) {
    itemAmounts.value = storedItemAmounts;
  }
};
onMounted(() => {
  getItemAmountsFromLocalStorage(); // Fetch itemAmounts on component mount
});
const getCartItems = () => {
  const cartItemsJSON = localStorage.getItem('cart');
  return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
};
const updateCartItemsLength = () => {
  cartItemsLength.value = getCartItems().length;
};
watch(cartItemsLength, (newData) => {
  updateData(newData);
});
</script>

<style lang="scss" scoped>
  .wrapper{
        margin: 100px auto;
        @media (max-width: 840px) {
          margin-top: 20px;
          margin-bottom: 0px;
        }
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
  }
  .sel{
    color: #000;
    height: max-content;
    margin-left: 100px;
    @media (max-width: 840px) {
      margin-left: 10px;
    }
    padding: 5px 20px;
    width: max-content;
    border: 1px solid black;
    background: #fff;
    border-radius: 15px;
    font-size: 20px;
  }
</style>