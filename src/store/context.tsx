import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { Category, Dish, CartItem, Order, UserRole, OrderStatus } from '@/types';
import { categories } from '@/data/mock';
import {
  fetchDishes, fetchOrders, createOrderApi, updateOrderApi,
  addDishApi, updateDishApi, deleteDishApi, createSocket
} from '@/services/api';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  categories: Category[];
  dishes: Dish[];
  cart: CartItem[];
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  orders: Order[];
  addOrder: (items: CartItem[], remark?: string) => Promise<void>;
  updateOrderStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  getCustomerOrders: () => Order[];
  getMerchantOrders: () => Order[];
  updateDishStatus: (dishId: number, status: 'available' | 'soldout') => Promise<void>;
  addDish: (dish: Omit<Dish, 'id'>) => Promise<void>;
  editDish: (dish: Dish) => Promise<void>;
  deleteDish: (dishId: number) => Promise<void>;
  getTodayStats: () => { orderCount: number; totalAmount: number; pendingCount: number };
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('customer');
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  // 初始化：加载数据 + WebSocket实时推送
  useEffect(() => {
    (async () => {
      const [d, o] = await Promise.all([fetchDishes(), fetchOrders()]);
      setDishes(d);
      setOrders(o.sort((a: Order, b: Order) => b.createTime - a.createTime));
      setLoading(false);
    })();

    wsRef.current = createSocket((msg) => {
      switch (msg.type) {
        case 'newOrder': setOrders(prev => [msg.order, ...prev]); break;
        case 'orderUpdated': setOrders(prev => prev.map(o => o.id === msg.order.id ? msg.order : o)); break;
        case 'dishAdded': setDishes(prev => [...prev, msg.dish]); break;
        case 'dishUpdated': setDishes(prev => prev.map(d => d.id === msg.dish.id ? msg.dish : d)); break;
        case 'dishDeleted': setDishes(prev => prev.filter(d => d.id !== msg.id)); break;
      }
    });

    return () => wsRef.current?.close();
  }, []);

  // 购物车（仅本地）
  const addToCart = useCallback((dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(item => item.dish.id === dish.id);
      if (existing) return prev.map(item => item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { dish, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((dishId: number) => setCart(prev => prev.filter(item => item.dish.id !== dishId)), []);
  const updateQuantity = useCallback((dishId: number, quantity: number) => {
    if (quantity <= 0) setCart(prev => prev.filter(item => item.dish.id !== dishId));
    else setCart(prev => prev.map(item => item.dish.id === dishId ? { ...item, quantity } : item));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);
  const getCartTotal = useCallback(() => cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0), [cart]);

  // 订单
  const addOrder = useCallback(async (items: CartItem[], remark?: string) => {
    const orderData = {
      items: items.map(item => ({ id: item.dish.id, dishId: item.dish.id, dishName: item.dish.name, price: item.dish.price, quantity: item.quantity })),
      totalPrice: items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0),
      remark
    };
    const order = await createOrderApi(orderData);
    setOrders(prev => [order, ...prev]);
  }, []);

  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    await updateOrderApi(orderId, { status });
    setOrders(prev => prev.map(order => (order.id === orderId ? { ...order, status } : order)));
  }, []);

  const getCustomerOrders = useCallback(() => orders, [orders]);
  const getMerchantOrders = useCallback(() => [...orders].sort((a, b) => b.createTime - a.createTime), [orders]);

  // 菜品管理
  const updateDishStatus = useCallback(async (dishId: number, status: 'available' | 'soldout') => {
    await updateDishApi(dishId, { status });
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, status } : d));
  }, []);

  const addDish = useCallback(async (dish: Omit<Dish, 'id'>) => {
    const newDish = await addDishApi(dish);
    setDishes(prev => [...prev, newDish]);
  }, []);

  const editDish = useCallback(async (dish: Dish) => {
    await updateDishApi(dish.id, dish);
    setDishes(prev => prev.map(d => d.id === dish.id ? dish : d));
  }, []);

  const deleteDish = useCallback(async (dishId: number) => {
    await deleteDishApi(dishId);
    setDishes(prev => prev.filter(d => d.id !== dishId));
  }, []);

  // 统计
  const getTodayStats = useCallback(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => o.createTime >= today.getTime());
    return {
      orderCount: todayOrders.length,
      totalAmount: todayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
      pendingCount: todayOrders.filter(o => o.status === 'pending').length
    };
  }, [orders]);

  return (
    <AppContext.Provider value={{ role, setRole, categories, dishes, cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, orders, addOrder, updateOrderStatus, getCustomerOrders, getMerchantOrders, updateDishStatus, addDish, editDish, deleteDish, getTodayStats, loading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
