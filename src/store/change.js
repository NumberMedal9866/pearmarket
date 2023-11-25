import { ref, watch } from 'vue';
// don't have the skills to implement it yet
const getItem = (key) => {
  const item = localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error parsing item with key ${key} from localStorage:`, error);
    }
  }
  return null;
};

const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export default function useCartLocalStorage(initialValue) {
  const key = 'cart';
  const cart = ref(getItem(key) || initialValue);

  watch(cart, (newValue) => {
    setItem(key, newValue);
  }, { deep: true });

  return cart;
}