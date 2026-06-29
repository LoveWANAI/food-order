// API 桥接层 - 全部数据通过 Supabase 云端同步
export {
  fetchDishes,
  addDishDb,
  updateDishDb,
  deleteDishDb,
  fetchOrders,
  createOrderDb,
  updateOrderDb,
  subscribeOrders,
  subscribeDishes
} from './supabase';
