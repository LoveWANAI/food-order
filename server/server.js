const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const DATA_FILE = path.join(__dirname, 'data.json');
const DIST_DIR = path.join(__dirname, '..', 'dist');

app.use(express.json());

// 提供前端静态文件（用于远程访问模式）
app.use(express.static(DIST_DIR));

// SPA fallback: 所有非API请求返回index.html
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// CORS - allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// --- Data helpers ---
function readData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Broadcast to all WebSocket clients
function broadcast(msg) {
  const str = JSON.stringify(msg);
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(str); });
}

// --- REST API ---

// Get all dishes
app.get('/api/dishes', (req, res) => {
  const data = readData();
  res.json({ code: 0, data: data.dishes });
});

// Add dish (merchant)
app.post('/api/dishes', (req, res) => {
  const data = readData();
  const dish = { ...req.body, id: data.nextDishId };
  data.dishes.push(dish);
  data.nextDishId++;
  writeData(data);
  broadcast({ type: 'dishAdded', dish });
  res.json({ code: 0, data: dish });
});

// Update dish (merchant)
app.put('/api/dishes/:id', (req, res) => {
  const data = readData();
  const idx = data.dishes.findIndex(d => d.id === Number(req.params.id));
  if (idx === -1) return res.json({ code: 404, msg: 'Not found' });
  data.dishes[idx] = { ...data.dishes[idx], ...req.body, id: data.dishes[idx].id };
  writeData(data);
  broadcast({ type: 'dishUpdated', dish: data.dishes[idx] });
  res.json({ code: 0, data: data.dishes[idx] });
});

// Delete dish (merchant)
app.delete('/api/dishes/:id', (req, res) => {
  const data = readData();
  data.dishes = data.dishes.filter(d => d.id !== Number(req.params.id));
  writeData(data);
  broadcast({ type: 'dishDeleted', id: Number(req.params.id) });
  res.json({ code: 0 });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  const data = readData();
  res.json({ code: 0, data: data.orders });
});

// Create order (customer)
app.post('/api/orders', (req, res) => {
  const data = readData();
  const order = {
    ...req.body,
    id: data.nextOrderId,
    orderNo: 'ORD' + Date.now(),
    status: 'pending',
    createTime: Date.now()
  };
  data.orders.push(order);
  data.nextOrderId++;
  writeData(data);
  // Broadcast new order to all clients (for merchant real-time update)
  broadcast({ type: 'newOrder', order });
  res.json({ code: 0, data: order });
});

// Update order status (merchant)
app.patch('/api/orders/:id', (req, res) => {
  const data = readData();
  const idx = data.orders.findIndex(o => o.id === Number(req.params.id));
  if (idx === -1) return res.json({ code: 404, msg: 'Not found' });
  data.orders[idx] = { ...data.orders[idx], ...req.body };
  writeData(data);
  broadcast({ type: 'orderUpdated', order: data.orders[idx] });
  res.json({ code: 0, data: data.orders[idx] });
});

// Get today stats
app.get('/api/stats', (req, res) => {
  const data = readData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = data.orders.filter(o => o.createTime >= today.getTime());
  res.json({
    code: 0,
    data: {
      orderCount: todayOrders.length,
      totalAmount: todayOrders.reduce((sum, o) => sum + o.totalPrice, 0),
      pendingCount: todayOrders.filter(o => o.status === 'pending').length
    }
  });
});

// WebSocket
wss.on('connection', (ws) => {
  console.log('WebSocket client connected, total:', wss.clients.size);
  ws.on('error', (err) => console.error('WS error:', err.message));
  ws.on('close', () => console.log('WebSocket client disconnected, total:', wss.clients.size));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('Backend server running on http://localhost:' + PORT);
  console.log('WebSocket server ready');
});
