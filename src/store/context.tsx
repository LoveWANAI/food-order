// 全局状态管理 - Supabase 云端 + 实时同步
// 女朋友下单 → 你手机立刻弹出通知
import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Category, Dish, CartItem, Order, UserRole, OrderStatus } from '@/types';
import { categories, defaultDishes } from '@/data/mock';
import {
  fetchDishes, fetchOrders, createOrderDb, updateOrderDb,
  addDishDb, updateDishDb, deleteDishDb,
  subscribeOrders, subscribeDishes
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

  // 初始化：从 Supabase 加载数据 + 订阅实时变化
  useEffect(() => {
    let unsubscribeOrders: (() => void) | null = null;
    let unsubscribeDishes: (() => void) | null = null;
    let cancelled = false;

    const init = async () => {
      let online = false;
      try {
        // 并行加载菜品和订单（5秒超时）
        const [d, o] = await Promise.all([fetchDishes(), fetchOrders()]);
        if (!cancelled) {
          setDishes(d);
          setOrders(o);
          online = true;
        }
      } catch (err) {
        console.warn('Supabase 未连接，使用本地数据');
        if (!cancelled) {
          setDishes(defaultDishes);
          setOrders([]);
        }
      }
      if (!cancelled) {
        setLoading(false);
      }

      // 只在 Supabase 可用时才启动订阅
      if (online && !cancelled) {
        try {
          unsubscribeOrders = subscribeOrders(
            (newOrder: Order) => setOrders(prev => [newOrder, ...prev]),
            (updatedOrder: Order) => setOrders(prev =>
              prev.map(o => o.id === updatedOrder.id ? updatedOrder : o)
            )
          );
          unsubscribeDishes = subscribeDishes(
            (newDish: Dish) => setDishes(prev => [...prev, newDish]),
            (updatedDish: Dish) => setDishes(prev =>
              prev.map(d => d.id === updatedDish.id ? updatedDish : d)
            ),
            (deletedId: number) => setDishes(prev => prev.filter(d => d.id !== deletedId))
          );
        } catch (_) {}
      }
    };

    init();

    return () => {
      cancelled = true;
      unsubscribeOrders?.();
      unsubscribeDishes?.();
    };
  }, []);

  // ====== 购物车（仅内存，不持久化） ======
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

  // ====== 订单管理 ======
  const addOrder = useCallback(async (items: CartItem[], remark?: string) => {
    const totalPrice = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const newOrder: Order = {
      id: Date.now(),
      orderNo: 'OD' + Date.now(),
      items: items.map(item => ({ dishId: item.dish.id, dishName: item.dish.name, price: item.dish.price, quantity: item.quantity })),
      totalPrice,
      status: 'pending' as OrderStatus,
      createTime: Date.now(),
      remark: remark || ''
    };
    // 立即更新本地状态（商家端立刻看到）
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    // 后台同步到 Supabase
    try {
      await createOrderDb({
        order_no: newOrder.orderNo,
        items: newOrder.items,
        total_price: totalPrice,
        status: 'pending',
        create_time: newOrder.createTime,
        remark: remark || undefined
      });
    } catch (_) {}
  }, [clearCart]);

  const updateOrderStatus = useCallback(async (orderId: number, status: OrderStatus) => {
    // 立即更新本地状态
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    // 后台同步到 Supabase
    try { await updateOrderDb(orderId, { status }); } catch (_) {}
  }, []);

  const getCustomerOrders = useCallback(() => orders, [orders]);
  const getMerchantOrders = useCallback(() => [...orders].sort((a, b) => b.createTime - a.createTime), [orders]);

  // ====== 菜品管理 ======
  const updateDishStatus = useCallback(async (dishId: number, status: 'available' | 'soldout') => {
    await updateDishDb(dishId, { status });
  }, []);

  const addDish = useCallback(async (dish: Omit<Dish, 'id'>) => {
    await addDishDb(dish);
  }, []);

  const editDish = useCallback(async (dish: Dish) => {
    const { id, name, description, price, image, categoryId: category_id, status } = dish;
    await updateDishDb(id, { name, description, price, image, category_id, status });
  }, []);

  const deleteDish = useCallback(async (dishId: number) => {
    await deleteDishDb(dishId);
  }, []);

  // ====== 今日统计 ======
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
