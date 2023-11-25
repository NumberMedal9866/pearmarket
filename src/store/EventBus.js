import { reactive, watch } from 'vue';

export const EventBus = reactive({
  dataChanged: null,
});

export function updateData(newData) {
  EventBus.dataChanged = newData;
}