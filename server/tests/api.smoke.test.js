const test = require('node:test');
const assert = require('node:assert/strict');

const base = process.env.API_BASE_URL || 'http://localhost:3001/api';
let accessToken;
let productId;
let packageId;
let courierId;

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const response = await fetch(base + path, { ...options, headers });
  const data = await response.json();
  return { response, data };
}

test('health y catálogo público', async () => {
  const health = await request('/health');
  assert.equal(health.response.status, 200);
  const products = await request('/productos?disponible=true');
  assert.equal(products.response.status, 200);
  assert.ok(Array.isArray(products.data.productos));
  const denied = await request('/repartidores');
  assert.equal(denied.response.status, 401);
});

test('login, scopes y endpoint protegido', async () => {
  await request('/auth/seed', { method: 'POST', body: '{}' });
  const login = await request('/auth/login', { method: 'POST', body: JSON.stringify({ username: 'admin', password: process.env.TEST_ADMIN_PASSWORD || 'strng2025' }) });
  assert.equal(login.response.status, 200);
  accessToken = login.data.accessToken;
  assert.ok(accessToken);
  assert.ok(login.data.user.scopes.includes('productos:write'));
  const verify = await request('/auth/verify', { headers: { Authorization: `Bearer ${accessToken}` } });
  assert.equal(verify.response.status, 200);
  const list = await request('/repartidores', { headers: { Authorization: `Bearer ${accessToken}` } });
  assert.equal(list.response.status, 200);
});

test('CRUD temporal de producto', async () => {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const created = await request('/productos', { method: 'POST', headers, body: JSON.stringify({ nombre: 'TEST API', marca: 'STRNG', precio: 1, categoria: 'salud', stock: 1 }) });
  assert.equal(created.response.status, 201);
  productId = created.data.producto._id;
  const updated = await request(`/productos/${productId}`, { method: 'PUT', headers, body: JSON.stringify({ precio: 2 }) });
  assert.equal(updated.response.status, 200);
  const deleted = await request(`/productos/${productId}`, { method: 'DELETE', headers });
  assert.equal(deleted.response.status, 200);
});

test('CRUD temporal de paquete y repartidor', async () => {
  const headers = { Authorization: `Bearer ${accessToken}` };
  const courier = await request('/repartidores', { method: 'POST', headers, body: JSON.stringify({ nombre: 'TEST API', telefono: '3000000000' }) });
  assert.equal(courier.response.status, 201);
  courierId = courier.data.repartidor._id;
  const packageResult = await request('/paquetes', { method: 'POST', body: JSON.stringify({ remitente: { nombre: 'STRNG' }, destinatario: { nombre: 'TEST API', telefono: '3000000001', direccion: 'Calle Test' }, total: 0 }) });
  assert.equal(packageResult.response.status, 201);
  packageId = packageResult.data.paquete._id;
  const updated = await request(`/paquetes/${packageId}`, { method: 'PUT', headers, body: JSON.stringify({ estado: 'En ruta', repartidor: courierId }) });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.data.paquete.historialEstados.at(-1).estado, 'En ruta');
  assert.equal((await request(`/repartidores/${courierId}`, { method: 'DELETE', headers })).response.status, 200);
  assert.equal((await request(`/paquetes/${packageId}`, { method: 'DELETE', headers })).response.status, 200);
});
