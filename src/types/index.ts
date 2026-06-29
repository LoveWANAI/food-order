// 菜品分类
export interface Category {
  id: number;
  name: string;
  icon: string;
}

// 菜品
export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: number;
  status: 'available' | 'soldout';
}

// 购物车项
export interface CartItem {
  dish: Dish;
  quantity: number;
}

// 订单状态
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// 订单项
export interface OrderItem {
  id: number;
  dishId: number;
  dishName: string;
  price: number;
  quantity: number;
}

// 订单
export interface Order {
  id: number;
  orderNo: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  createTime: number;
  remark?: string;
}

// 用户角色
export type UserRole = 'customer' | 'merchant';

// 全局状态
export interface AppState {
  role: UserRole;
  cart: CartItem[];
  orders: Order[];
  dishes: Dish[];
  categories: Category[];
}
