// API服务层 - 与后端通信
// 前端和后端运行在同一端口，使用相对路径

async function request(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
}

// ====== 菜品 ======
export async function fetchDishes() {
  const r = await request('/api/dishes');
  return r.data || [];
}

export async function addDishApi(dish: any) {
  const r = await request('/api/dishes', { method: 'POST', body: JSON.stringify(dish) });
  return r.data;
}

export async function updateDishApi(id: number, data: any) {
  const r = await request('/api/dishes/' + id, { method: 'PUT', body: JSON.stringify(data) });
  return r.data;
}

export async function deleteDishApi(id: number) {
  await request('/api/dishes/' + id, { method: 'DELETE' });
}

// ====== 订单 ======
export async function fetchOrders() {
  const r = await request('/api/orders');
  return r.data || [];
}

export async function createOrderApi(order: any) {
  const r = await request('/api/orders', { method: 'POST', body: JSON.stringify(order) });
  return r.data;
}

export async function updateOrderApi(id: number, data: any) {
  const r = await request('/api/orders/' + id, { method: 'PATCH', body: JSON.stringify(data) });
  return r.data;
}

// ====== 统计 ======
export async function fetchStats() {
  const r = await request('/api/stats');
  return r.data;
}

// ====== WebSocket ======
// 前端和后端同端口，直接用当前host
export function createSocket(onMessage: (msg: any) => void) {
  const ws = new WebSocket(`ws://${location.host}`);
  ws.onmessage = (e) => {
    try { onMessage(JSON.parse(e.data)); } catch {}
  };
  ws.onclose = () => {
    setTimeout(() => createSocket(onMessage), 3000);
  };
  return ws;
}
