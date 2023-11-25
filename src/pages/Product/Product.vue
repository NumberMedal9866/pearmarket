<template>
    <div class="container product">
        <Swiper
            :modules="modules"
            pagination
            class="media-slider"
            slidesPerView="1"
            spaceBetween="0"
            :loop="true"
        >
            <SwiperSlide class="swiper-slider-item" v-for="item in image" :key="item.id" >
                <img :src="item" alt="">
            </SwiperSlide>
        </Swiper>
        <div class="product-info"  v-if="storeItem">
            <h2>{{storeItem.title}}</h2>
            <p>{{storeItem.description}}</p>
            <span>{{calculateDiscountedPrice(storeItem.price, storeItem.discountPercentage)}}$</span>
            <h3>Stock:{{storeItem.stock}}</h3>
            <div class="cart-info-section">
                <span class="button" v-if="!getAmount(id)" @click.stop="log">ADD TO CART</span>
                <div class="cart-info-section-wrap container" v-else>
                  <div class="cart-info-section-amount disable-dbl-tap-zoom">
                      <button @click="decrease(id)">-</button>
                      <p>{{ getAmount(id) }}</p>
                      <button @click="increase(id)">+</button>
                  </div>
                  <router-link to="/cart" class="cart-info-section-link">Go to cart →</router-link>
                </div>
            </div>          
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
    import { Navigation, Pagination } from 'swiper/modules';
    import "swiper/scss";
    import 'swiper/scss/navigation';
    import 'swiper/scss/pagination';
    const modules = ref([Navigation, Pagination])
    import { Swiper, SwiperSlide } from "swiper/vue";
    const image = ref(null)

    //
    import { useRoute } from 'vue-router'
    import { useGetItemById } from '@/store/getItemById'
    const storeItem = ref(null)
    const getItemById = useGetItemById()
    const ans = storeItem.value
    const idx = ref(useRoute().params.id);
    const id = idx.value
    // onMounted (async() => {
    //     await getItemById.getItemById({id: useRoute().params.id})
    //     storeItem.value = getItemById.item
    //     image.value = storeItem.value.images
    //     // console.log(storeItem.value.images);
    //     // console.log(storeItem.value);
    //     // console.log(useRoute().params.id);
    // })
    //
    const calculateDiscountedPrice = (price, discountPercentage) => {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedPrice = price - discountAmount;
  return discountedPrice.toFixed(2); // Round to two decimal places for cents
};
import {  watch, provide } from "vue";
import { useItem } from "@/store/item";
import { updateData } from '@/store/EventBus.js';
// const amount = ref(0);
// const selectedOption = ref('')
// const options = ref([
//       { label: 'Price ↓', value: 'low' },
//       { label: 'Price ↑', value: 'high' },
//       { label: 'Stock', value: 'check' },
// ]);
const cartItemsLength = ref(0);
const itemAmounts = ref({});
const items = useItem();
const storeItems = ref(null);
const getAmount = () => {
  return itemAmounts.value[id] || 0;
  // console.log(getAmount);
};
const takeItem = async () => {
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
const log = () => {
  console.log(id);
//   const itemId = item.id;
  // Increment the amount for the corresponding item id
  itemAmounts.value[id] = (itemAmounts.value[id] || 0) + 1;
  // Store product information along with amount in local storage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const productWithAmount = {
    ...storeItem.value,
    amount: itemAmounts.value[id],
  };
  cart.push(productWithAmount);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateLocalStorage();
  console.log(productWithAmount);
  updateCartItemsLength();
};

const increase = () => {
  console.log(getAmount(id));

  itemAmounts.value[id]++;
  updateLocalStorage();
};

const decrease = () => {
  if (itemAmounts.value[id] <= 1) {
    // Remove the item from itemAmounts when its value becomes zero
    delete itemAmounts.value[id];

    // Remove the item from cart in localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter((cartItem) => {
      // Ensure the id comparison matches the structure of the ids in cart items
      return cartItem.id.toString() !== id.toString(); // Adjust the comparison as per your id structure
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Update the 'itemAmounts' key in localStorage after removing the item
    localStorage.setItem('itemAmounts', JSON.stringify(itemAmounts.value));
    updateCartItemsLength();
    // window.location.reload()
    // Perform UI update here if necessary
  } else {
    itemAmounts.value[id]--; // Decrease the amount for the specified id
    updateLocalStorage(); // Update localStorage after decrementing the value
  }
};
const getItemAmountsFromLocalStorage = () => {
  const storedItemAmounts = JSON.parse(localStorage.getItem("itemAmounts"));
  if (storedItemAmounts) {
    itemAmounts.value = storedItemAmounts;
  }
};
// onMounted(() => {
//   getItemAmountsFromLocalStorage(); // Fetch itemAmounts on component mount
// });
    onMounted (async() => {
        await getItemById.getItemById({id: useRoute().params.id})
        storeItem.value = getItemById.item
        image.value = storeItem.value.images
        // console.log(storeItem);
        // console.log(storeItem.value.images);
        getItemAmountsFromLocalStorage(); 
        // console.log(storeItem.value);
        // console.log(useRoute().params.id);
    })
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
// const getCartItems = () => {
//   const cartItemsJSON = localStorage.getItem('cart');
//   return cartItemsJSON ? JSON.parse(cartItemsJSON) : [];
// };
// const updateCartItemsLength = () => {
//   cartItemsLength.value = getCartItems().length;
// };
// watch(cartItemsLength, (newData) => {
//   updateData(newData);
// });
</script>
<style lang="scss" scoped>
// .product-info
// .swiper{
//   @media  (max-width: 1060px) {
//           flex-direction: column;
//         }
// }
    .media-slider{
        width: 630px;
        @media  (max-width: 665px) {
          width: 550px;
        }
        @media  (max-width: 585px) {
          width: 450px;
        }
        @media  (max-width: 475px) {
          width: 350px;
        }
        @media  (max-width: 385px) {
          width: 300px;
        }
        @media  (max-width: 325px) {
          width: 250px;
        }
        object-position: center;
        user-select: none;
        padding: 40px 0;
    }
    .swiper-slider-item{
        // width: 50px;
        // height: 300px;
        object-fit: cover;
        object-position: center;
        width: 100%;
        >img {
            object-fit: cover;
        object-position: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 548px;
            width: 630px;
            @media  (max-width: 665px) {
              width: 550px;
            }
            @media  (max-width: 585px) {
              width: 450px;
            }
            @media  (max-width: 475px) {
              width: 350px;
              height: 400px;
            }
            @media  (max-width: 385px) {
              width: 300px;
              height: 400px;
            }
            @media  (max-width: 325px) {
              width: 250px;
              height: 200px;
            }
            color: white;
            font-weight: 700;
            font-size: 20px;
            gap: 10px;
        }
    }
    .product{
        padding: 0;
        display: flex;
        flex-direction: row-reverse;
        @media  (max-width: 1060px) {
          flex-direction: column;
        }
        &-info{
          // padding-left: 20px;
          @media  (max-width: 1060px) {
          text-align: center !important;
          margin-bottom: 50px;
        }
            h2{
                font-family: I8;
                font-size: 50px;
                padding: 50px 0 100px;
                @media  (max-width: 1060px) {
          padding: 20px 50px;
        }
            }
            p{

              @media  (max-width: 1060px) {
          max-width: 100%;
        }
                max-width: 600px;
                font-size: 20px;
                font-family: I4;
                padding-bottom: 30px;
            }
            span{
                font-family: I6;
                font-size: 40px;
            }
            h3{
              margin-left: -90px;
              margin-bottom: 40px;
            }
        }
    }
    // .swiper-pagination-bullet-active{
    //       color: #000;
    // }
//     .swiper-button-prev, .swiper-button-next{
//     color: white;
//     transition: .2s;
//     width: 100px;
//     height: 110%;
//     top: 0;
//     backdrop-filter: blur(5px);
//     &::after{
//         font-size: 40px;
//     }
//     &.swiper-button-disabled{
//         opacity: 0;
//     }
// }
// .swiper-button-next{
//     right: 0;
//     background: linear-gradient(270deg, rgba(20, 20, 20, 0.90) 0%, rgba(20, 20, 20, 0.60) 36.46%, rgba(20, 20, 20, 0.15) 91.67%, rgba(20, 20, 20, 0.00) 100%);
// }
// .swiper-button-prev{
//     left: 0;
//     background: linear-gradient(89deg, rgba(20, 20, 20, 0.90) 1.08%, rgba(20, 20, 20, 0.60) 36.72%, rgba(20, 20, 20, 0.15) 90.68%, rgba(20, 20, 20, 0.00) 98.82%);
// }
h3{
    font-family: I7;
    font-size: 12px;
}
.button{
  font-size: 30px !important;
  background: white;
  padding: 5px 10px;
  border-radius: 10px;
}
.cart-info-section-amount{
  // font-size: 20px;
    user-select: none;
    width: max-content;
    // margin: 0 auto;
    display: flex;
    align-items: center !important;
    gap: 10px;
    padding: 5px 10px;
    border-radius: 5px;
    border: 1px solid black;
    // background: white;
    justify-content: space-between;
    p{
      padding-bottom: 0;
    }
    button{
        padding: 0 10px;
    }
    
}
.cart-info-section-wrap{
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  a{
    color: #000;
    text-decoration: underline;
    padding: 5px 10px;

  }
  // width: 100%;
  // margin: 0 auto;
}
.disable-dbl-tap-zoom {
  touch-action: manipulation;
}
</style>