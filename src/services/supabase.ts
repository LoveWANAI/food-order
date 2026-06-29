// Supabase 数据库服务 - 通过 REST API 直接调用（兼容微信小程序）
import Taro from '@tarojs/taro';

// ====== 在这里填你的 Supabase 配置 ======
const SUPABASE_URL = 'https://cexqwrevtzrqbfegifbt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OJ64Bp1o1ZpWXxrUy75Cng_8Q8x1qNj';

// ====== 通用请求函数 ======
async function supabaseRequest<T>(path: string, options: {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  params?: Record<string, string>;
} = {}): Promise<T> {
  const { method = 'GET', body, params } = options;

  let url = `${SUPABASE_URL}/rest/v1/${path}`;
  if (params) {
    const qs = Object.entries(params)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    url += `?${qs}`;
  }

  const header: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
  if (method === 'GET') {
    header['Accept'] = 'application/json';
  }
  // Prefer 返回最小化结果
  header['Prefer'] = 'return=representation';

  return new Promise((resolve, reject) => {
    Taro.request({
      url,
      method: method as any,
      header,
      data: body,
      timeout: 5000, // 5秒超时
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T);
        } else {
          reject(new Error(`请求失败: ${res.statusCode} ${JSON.stringify(res.data)}`));
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

// ====== 字段映射 ======
function mapDish(db: any) {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    price: db.price,
    image: db.image,
    categoryId: db.category_id,
    status: db.status
  };
}

function mapOrder(db: any) {
  return {
    id: db.id,
    orderNo: db.order_no,
    items: typeof db.items === 'string' ? JSON.parse(db.items) : db.items,
    totalPrice: db.total_price,
    status: db.status,
    createTime: db.create_time,
    remark: db.remark
  };
}

// ====== 菜品 CRUD ======

export async function fetchDishes() {
  const data = await supabaseRequest<any[]>('dishes', {
    params: { select: '*', order: 'category_id,id' }
  });
  return (data || []).map(mapDish);
}

export async function addDishDb(dish: any) {
  const body: any = {
    name: dish.name,
    description: dish.description,
    price: dish.price,
    image: dish.image,
    category_id: dish.categoryId ?? dish.category_id ?? 1,
    status: dish.status || 'available'
  };
  const data = await supabaseRequest<any[]>('dishes', {
    method: 'POST',
    body,
    params: { select: '*' }
  });
  return mapDish(data[0] || data);
}

export async function updateDishDb(id: number, updates: any) {
  const body: any = {};
  if (updates.name !== undefined) body.name = updates.name;
  if (updates.description !== undefined) body.description = updates.description;
  if (updates.price !== undefined) body.price = updates.price;
  if (updates.image !== undefined) body.image = updates.image;
  if (updates.category_id !== undefined) body.category_id = updates.category_id;
  if (updates.categoryId !== undefined) body.category_id = updates.categoryId;
  if (updates.status !== undefined) body.status = updates.status;

  await supabaseRequest(`dishes?id=eq.${id}`, {
    method: 'PATCH',
    body
  });
}

export async function deleteDishDb(id: number) {
  await supabaseRequest(`dishes?id=eq.${id}`, { method: 'DELETE' });
}

// ====== 订单 CRUD ======

export async function fetchOrders() {
  const data = await supabaseRequest<any[]>('orders', {
    params: { select: '*', order: 'create_time.desc' }
  });
  return (data || []).map(mapOrder);
}

export async function createOrderDb(order: {
  order_no: string;
  items: any;
  total_price: number;
  status: string;
  create_time: number;
  remark?: string;
}) {
  const body = {
    ...order,
    items: typeof order.items === 'object' ? JSON.stringify(order.items) : order.items
  };
  const data = await supabaseRequest<any[]>('orders', {
    method: 'POST',
    body,
    params: { select: '*' }
  });
  return mapOrder(data[0] || data);
}

export async function updateOrderDb(id: number, updates: { status?: string }) {
  await supabaseRequest(`orders?id=eq.${id}`, {
    method: 'PATCH',
    body: updates
  });
}

// ====== 实时监听（轮询方式，兼容小程序） ======
const timers: number[] = [];

export function subscribeOrders(onInsert: (order: any) => void, onUpdate: (order: any) => void) {
  let lastOrders: any[] = [];

  const timer = setInterval(async () => {
    try {
      const orders = await fetchOrders();
      if (lastOrders.length === 0) {
        lastOrders = orders;
        return;
      }
      // 检测新增
      const lastIds = new Set(lastOrders.map((o: any) => o.id));
      orders.forEach((o: any) => {
        if (!lastIds.has(o.id)) {
          onInsert(o);
        }
      });
      // 检测状态变化
      orders.forEach((o: any) => {
        const old = lastOrders.find((lo: any) => lo.id === o.id);
        if (old && old.status !== o.status) {
          onUpdate(o);
        }
      });
      lastOrders = orders;
    } catch (_) { /* 静默忽略 */ }
  }, 5000);

  timers.push(timer as unknown as number);
  return () => {
    clearInterval(timer);
  };
}

export function subscribeDishes(
  onInsert: (dish: any) => void,
  onUpdate: (dish: any) => void,
  onDelete: (id: number) => void
) {
  let lastDishes: any[] = [];

  const timer = setInterval(async () => {
    try {
      const dishes = await fetchDishes();
      if (lastDishes.length === 0) {
        lastDishes = dishes;
        return;
      }
      const lastIds = new Set(lastDishes.map((d: any) => d.id));
      const newIds = new Set(dishes.map((d: any) => d.id));

      dishes.forEach((d: any) => {
        if (!lastIds.has(d.id)) onInsert(d);
      });
      dishes.forEach((d: any) => {
        const old = lastDishes.find((ld: any) => ld.id === d.id);
        if (old && JSON.stringify(old) !== JSON.stringify(d)) onUpdate(d);
      });
      lastDishes.forEach((d: any) => {
        if (!newIds.has(d.id)) onDelete(d.id);
      });

      lastDishes = dishes;
    } catch (_) { /* 静默忽略 */ }
  }, 5000);

  timers.push(timer as unknown as number);
  return () => {
    clearInterval(timer);
  };
}

// 清理所有定时器
export function clearAllSubscriptions() {
  timers.forEach(t => clearInterval(t));
  timers.length = 0;
}
