// hometasker/backend/__tests__/auth.test.js

jest.setTimeout(60000);

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;
let app;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  app = require('../app');
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

describe('Auth Endpoints', () => {
  const user = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',   // matches your password regex
  };

  it('POST /api/auth/signup ➔ 200 & accessToken', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(user);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /api/auth/signup duplicate ➔ 400 & error message', async () => {
  // First signup succeeds
  await request(app)
    .post('/api/auth/signup')
    .send(user);

  // Second with same email
  const res = await request(app)
    .post('/api/auth/signup')
    .send({ ...user, password: 'Password123' });

  // Expect a 400 Bad Request for duplicates
  expect(res.status).toBe(400);

  // Capture whichever key your controller uses
  const errText = res.body.error || res.body.message;
  // Match the actual message “Email already in use”
  expect(errText).toMatch(/email.*already.*in use/i);
});

  it('POST /api/auth/login correct ➔ 200 & accessToken', async () => {
    // Create the user first
    await request(app)
      .post('/api/auth/signup')
      .send(user);

    // Then log in
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: user.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /api/auth/login wrong ➔ 401 & message', async () => {
    // Signup
    await request(app)
      .post('/api/auth/signup')
      .send(user);

    // Attempt login with wrong password
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: 'WrongPass123' });

    expect(res.status).toBe(401);
    // Your controller sends { message: "Invalid password" }
    expect(res.body.message).toMatch(/invalid password/i);
  });
});
