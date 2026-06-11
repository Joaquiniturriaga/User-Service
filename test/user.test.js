process.env.INTERNAL_SECRET = 'test-secret-123';

const request = require('supertest');
const app = require('../app');

jest.mock('../src/controller/user.controller', () => ({
  getProfile:           jest.fn((req, res) => res.json({ id: req.user.id })),
  updateUser:           jest.fn((req, res) => res.json({ id: req.user.id, ...req.body })),
  getAllUsers:          jest.fn((req, res) => res.json([])),
  updateUserAdmin:      jest.fn((req, res) => res.json({})),
  getAllBrigadas:        jest.fn((req, res) => res.json([])),
  createBrigada:        jest.fn((req, res) => res.status(201).json({})),
  updateBrigada:        jest.fn((req, res) => res.json({})),
  brigadeRespond:       jest.fn((req, res) => res.json({})),
  updateBrigadeLocation: jest.fn((req, res) => res.json({})),
  getActiveBrigades:    jest.fn((req, res) => res.json([])),
}));

const SECRET = process.env.INTERNAL_SECRET;

// ── Auth / Internal Secret ────────────────────────────────────────────────────

test('GET /profile - debe rechazar sin INTERNAL_SECRET', async () => {
  const response = await request(app)
    .get('/api/users/profile');

  expect(response.statusCode).toBe(401);
  expect(response.body.error).toBe('Unauthorized');
});

test('GET /profile - debe rechazar sin x-user-id', async () => {
  const response = await request(app)
    .get('/api/users/profile')
    .set('x-internal-key', SECRET);

  expect(response.statusCode).toBe(401);
  expect(response.body.error).toBe('Token required');
});

// ── Role authorization ────────────────────────────────────────────────────────

test('GET /users - debe rechazar usuario sin rol admin', async () => {
  const response = await request(app)
    .get('/api/users/users')
    .set('x-internal-key', SECRET)
    .set('x-user-id', '1')
    .set('x-user-role', 'user');

  expect(response.statusCode).toBe(403);
  expect(response.body.error).toBe('Access denied');
});

test('GET /users - debe permitir acceso a usuario con rol admin', async () => {
  const response = await request(app)
    .get('/api/users/users')
    .set('x-internal-key', SECRET)
    .set('x-user-id', '1')
    .set('x-user-role', 'admin');

  expect(response.statusCode).toBe(200);
});

// ── validateUserData ──────────────────────────────────────────────────────────

test('PUT /update - debe actualizar usuario', async () => {
  const response = await request(app)
    .put('/api/users/update')
    .set('x-internal-key', SECRET)
    .set('x-user-id', '1')
    .set('x-user-role', 'user')
    .send({ email: 'nuevo@mail.com', name: 'Joaquin' });

  expect(response.statusCode).toBe(200);
});

test('PUT /update - email inválido', async () => {
  const response = await request(app)
    .put('/api/users/update')
    .set('x-internal-key', SECRET)
    .set('x-user-id', '1')
    .set('x-user-role', 'user')
    .send({ email: 'correo-malo', name: 'Joaquin' });

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe('Invalid email format');
});

test('PUT /update - name requerido', async () => {
  const response = await request(app)
    .put('/api/users/update')
    .set('x-internal-key', SECRET)
    .set('x-user-id', '1')
    .set('x-user-role', 'user')
    .send({ email: 'test@mail.com' });

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe('Email and name are required');
});