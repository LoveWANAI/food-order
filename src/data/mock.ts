import { Category, Dish, Order } from '@/types';

// 菜品分类
export const categories: Category[] = [
  { id: 1, name: '热销套餐', icon: '🔥' },
  { id: 2, name: '主食', icon: '🍚' },
  { id: 3, name: '小菜', icon: '🥗' },
  { id: 4, name: '饮品', icon: '🥤' },
  { id: 5, name: '甜点', icon: '🍰' }
];

// 菜品数据
export const dishes: Dish[] = [];

// 模拟订单数据
export const mockOrders: Order[] = [];

// 获取分类下的菜品
export function getDishesByCategory(categoryId: number): Dish[] {
  return dishes.filter(d => d.categoryId === categoryId);
}

// 根据ID获取菜品
export function getDishById(dishId: number): Dish | undefined {
  return dishes.find(d => d.id === dishId);
}
