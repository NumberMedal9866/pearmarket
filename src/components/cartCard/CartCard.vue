<template>
  <div
    class="cart-holder-item"
    v-for="item in props.storeProducts"
    :key="item.id"
  >
    <div class="cart-info">
      <div class="cart-info-price">
        <span>Without discount:{{ item.price }}$<br>
        (per item)</span>
        <p> Price:{{ calculateDiscountedPrice(item.price, item.discountPercentage, item.id) }}$</p>
        <!-- <p>{{total}}</p> -->
      </div>
      <div class="cart-info-section">
        <span class="button" v-if="!getAmount(item.id)" @click.stop="log(item)"
          >ADD TO CART</span
        >
        <div class="cart-info-section-amountt" v-else>
          <button @click="decrease(item.id)">-</button>
          <p>{{ getAmount(item.id) }}</p>
          <button @click="increase(item.id)">+</button>
        </div>
      </div>
    </div>
    <RouterLink :to="`product/${item.id}`" class="cart">
      <div @click.stop="takeItem(item.id)"  class="cart-item">
        <img :src="item.thumbnail" alt="" />
        <p>{{ item.title }}</p>
      </div>
    </RouterLink>
    <!-- <div class="just" v-if="itWillNeverHappen">
      {{calculateTotalDiscountedPrice }}
    </div> -->
  </div>
</template>

<script setup>

// import { defineProps } from "vue";
import { onMounted, ref, watch, computed, provide } from "vue";
import { useItem } from "@/store/item";
import { updateData } from '@/store/EventBus.js';
// const itWillNeverHappen = false
const cartItemsLength = ref(0);
const itemAmounts = ref({});
const props = defineProps({
  storeProducts: {
    type: Array,
    required: true,
  },
});
    const getAmount = (itemId) => {
      return itemAmounts.value[itemId] || 0;
    };
  const calculateDiscountedPrice = (price, discountPercentage, id) => {
    const discountAmount = (price * discountPercentage) / 100;
    const discountedPrice = (price - discountAmount) * getAmount(id);
    return Math.round(discountedPrice);
  };
const calculateTotalDiscountedPrice = computed(() => {
  let totalDiscountedPrice = 0;
  props.storeProducts.forEach((item) => {
    const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage, item.id);
    totalDiscountedPrice += discountedPrice;
  });
  return totalDiscountedPrice;
});
//в этой переменной хранится значение для emit которое должен принять parent
const total = calculateTotalDiscountedPrice;
const emit = defineEmits('totalPrice', 'delete') // ПЕРВЫЙ ШАГ
emit('totalPrice', total)  // ВТОРОЙ ШАГ
const items = useItem();
const storeItems = ref(null);
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
  itemAmounts.value[itemId] = (itemAmounts.value[itemId] || 0) + 1;
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productWithAmount = {
    ...item,
    amount: itemAmounts.value[itemId],
  };
  cart.push(productWithAmount);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateLocalStorage();
  console.log(productWithAmount);
};

const increase = (itemId) => {
  console.log(getAmount(itemId));

  itemAmounts.value[itemId]++;
  updateLocalStorage();
  // this.$emit('total', total);

  // emit('total', total);
};
  // const emitt = defineEmits('delete')
  // emit('totalPrice', total)
  const deleteItem = async(itemId) => {
    updateCartItemsLength()
     await emit('delete', itemId); // Emit the delete event with the itemId
  };
const decrease = (itemId) => {
  if (itemAmounts.value[itemId] <= 1) {
    delete itemAmounts.value[itemId];

    //AN OLD SOLUTION
    const updatedCart = props.storeProducts.filter(item => item.id !== itemId);
    //PART OF AN OLD SOLUTION
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    localStorage.setItem('itemAmounts', JSON.stringify(itemAmounts.value));
    // window.location.reload() //OLD
    //for now, it is this dumb solution
    //trying to emit once again
    // emit('cartUpdated', updatedCart);
    updateData(0)
    updateCartItemsLength();
    deleteItem(itemId);
    // updateCartItemsLength();
  // getItemAmountsFromLocalStorage();


  } else {
    itemAmounts.value[itemId]--;
    // updateCartItemsLength();

    updateLocalStorage();
  }
};
const getItemAmountsFromLocalStorage = () => {
  const storedItemAmounts = JSON.parse(localStorage.getItem("itemAmounts"));
  if (storedItemAmounts) {
    itemAmounts.value = storedItemAmounts;
  }
};
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
onMounted(() => {
  getItemAmountsFromLocalStorage();
  //ПЫТАЛСЯ СДЕЛАТЬ EMIT НЕ РАБОТАЕТ
  // emit('total', total);
});
//I HAVE COMMENTED ALL THE EMITS FOR NOW
//UNTIL I HAVE THE TIME TO RESOLVE THE ISSUE
</script>

<style lang="scss" scoped>
    .cart-holder-item{
        width: 100% !important;
        align-items: center;
        display: flex;
        width: max-content;
        flex-direction: row;
        flex-direction: row !important;
        justify-content: space-between;
        background: white;
        padding: 20px 30px;
        border-radius: 20px;
        @media (max-width: 960px) {
          padding: 10px;
        }
        img{
            width: 300px;
            height: 200px;
            @media (max-width: 960px) {
              width: 100%;
            }
            object-position: center;
            object-fit: cover;
            border-radius: 0 20px 20px 0;
        }
    }
    .cart-info{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        gap: 80px;
        @media (max-width: 960px) {
          margin-right: 10px;
          gap: 10px;
          justify-content: center;
          align-items: start;
        }
    }
    .cart{
        &-item{
            display: flex;
            flex-direction: column;
            // justify-content: center; 
            align-items: center;
            color: #000;
            p{
                margin-top: 10px;
                font-family: I7;
                font-size: 30px;
            }
        }
    }
    .cart-info-section-amountt{
        display: flex !important;
        // gap: 10px;
        padding: 5px 10px; 
        user-select: none;
        border: 1px solid black;
        border-radius: 15px;
        align-items: center;
        button{
            padding: 10px 15px;
        }
        // @media (max-width: 960px) {
        //   width: 100%;
        // }
        // .cart-info-section{
        //   @media (max-width: 960px) {
        // width: 100% !important;
        // }
        // }
    }
    .cart-info-price{
        display: flex;
        flex-direction: column;
        gap: 10px;
        span{
            // text-decoration: line-through;
            font-family: I7;
            color: gray;
            @media (max-width: 960px) {
              display: none;
            }
            // font-size: 20px;
        }
        p{
          font-size: 30px !important;
          text-decoration: underline;
          @media (max-width: 960px) {
            font-size: 20px !important;
            margin-bottom: 10px;
          }
        }
    }
</style>