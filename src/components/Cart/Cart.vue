<template>
  <div class="container cart">
    <div v-if="cartItems.length > 0">
      <h2>Shopping Cart</h2>
      <div class="card-holder-wrapper">
        <div class="cart-holder">
          <CartCard :storeProducts="cartItems" @totalPrice="totalPrice($event)" @delete="deleteItem($event)"/>
          <!-- ТРЕТИЙ ШАГ ДОБАВИЛ  @totalPrice="totalPrice($event)" -->
          <!-- did not remove this here fix the emit reciever -->
        </div>
        <div class="card-holder-fix">
          <p @click="launch">Your cart</p>
            Total:{{total}}$
            <button @click="buy()" class="button">Buy</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="empty">Your cart is empty</p>
    </div>
  </div>
</template>

<script setup>
import CartCard from '@/components/cartCard/CartCard.vue';
import { useRouter } from 'vue-router';
import { ref, computed, onMounted, inject } from 'vue';
import { updateData } from '@/store/EventBus.js';
// const total = inject('total', null);
const router = useRouter();
const total = ref(0) // 4 ШАГ ДОБАВИЛ РЕАКТИВНУЮ ПЕРЕМЕННУЮ
const totalPrice = (event) =>{ 
  total.value = event // 5 ШАГ УКАЗАЛ, ЧТО БЛАГОДАРЯ ЭММИТУ ПЕРЕДАЮ ДАННЫЕ В ПЕРЕМЕННУЮ TOTAL ИЗ САМОГО ЭММИТА
}
// ХРЕН ЕГО ЗНАЕТ ПОЧЕМУ ЭТО НЕ РАБОТАЛО СРАЗУ, ТАК И НЕ ПОНЯЛ ЧТО БЫЛО НЕ ТАК, ТАК ДАННЫЙ СПОСОБ Я УЖЕ ПРОПИСЫВАЛ ДВА РАЗА ПО МЕРЕ ИЗУЧЕНИЯ КОДА, НО СРАЗУ ПОЧЕМУ-ТО ОН НЕ СРАБОТАЛ. ПО ТАКОМУ ЖЕ ПРИНЦИПУ МОЖНО ВСЕ ОСТАЛЬНЫЕ ЭММИТЫ ПЕРЕДАВАТЬ С НЕКОЙ ПОДГТОВЛЕННОЙ ИНФОРМАЦИЕЙ С РЕБЕНКА К РОДИТЕЛЮ)
const cartItems = ref([]);
const handleCartUpdate = (updatedCart) => {
  cartItems.value = updatedCart;
};
const calculateDiscountedPrice = (price, discountPercentage) => {
  const discountAmount = (price * discountPercentage) / 100;
  const discountedPrice = price - discountAmount;
  return Math.round(discountedPrice);
};
// const launch = ()=>{
//   console.log(total);
// }
const buy = () => {
  alert('Thank you for your purchase!');
  reset()
};
const reset = async()=>{
  await   localStorage.clear();
  router.push('/');
  // console.log('got it');
  updateData(0);
  // window.location.reload
}
const updateLocalStorage = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};
const deleteItem = (idToDelete) => {
  const indexToDelete = cartItems.value.findIndex(item => item.id === idToDelete);
  if (indexToDelete !== -1) {
    cartItems.value.splice(indexToDelete, 1); // Remove the item from the array
  }
  // console.log('triggered', idToDelete);
}
//  ДОЛЖЕН ПОЛУЧАТЬ ЗНАЧЕНИЕ ИЗ EMIT
  // const total = (val)=>{
  //   console.log(val);
  // }
onMounted(() => {
  cartItems.value = JSON.parse(localStorage.getItem('cart')) || [];
  // calculateTotal();
});
</script>

<style lang="scss" scoped>
.button{
  padding: 5px 10px;
  border-radius: 10px;
  border: 1px solid black;
  font-size: 30px;
  text-align: center;
}
</style>