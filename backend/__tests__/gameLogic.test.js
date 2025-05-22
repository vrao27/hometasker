// backend/__tests__/gameLogic.test.js

jest.setTimeout(60000);

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const gameLogic = require('../service/gameLogic');
const User = require('../models/user');
const Task = require('../models/task');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongo.getUri();
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

afterEach(async () => {
  for (const col of Object.values(mongoose.connection.collections)) {
    await col.deleteMany({});
  }
});

describe('gameLogic.completeTask()', () => {
  it('marks a task complete and awards points once', async () => {
    const householdId = new mongoose.Types.ObjectId();

    const user = await User.create({
      name:       'Bob',
      email:      'bob@example.com',
      password:   'Password123',
      householdId,
    });

    const task = await Task.create({
      taskName:   'Test Task',
      assignedTo: user._id,
      points:     7,
      completed:  false,
    });

    const { task: updatedTask, user: updatedUser } =
      await gameLogic.completeTask(user._id.toString(), task._id.toString());

    expect(updatedTask.completed).toBe(true);
    expect(updatedUser.points).toBe(7);
  });

  it('throws if the task does not exist', async () => {
    const householdId = new mongoose.Types.ObjectId();
    const user = await User.create({
      name:       'X',
      email:      'x@x.com',
      password:   'Password123',
      householdId,
    });

    await expect(
      gameLogic.completeTask(
        user._id.toString(),
        new mongoose.Types.ObjectId().toString()
      )
    ).rejects.toThrow(/not found/i);
  });

  it('throws if a different user tries to complete', async () => {
    const householdId = new mongoose.Types.ObjectId();
    const u1 = await User.create({
      name:       'A',
      email:      'a@a.com',
      password:   'Password123',
      householdId,
    });
    const u2 = await User.create({
      name:       'B',
      email:      'b@b.com',
      password:   'Password123',
      householdId,
    });

    const task = await Task.create({
      taskName:   'Other Task',
      assignedTo: u1._id,
      points:     3,
      completed:  false,
    });

    await expect(
      gameLogic.completeTask(u2._id.toString(), task._id.toString())
    ).rejects.toThrow(/not your task/i);
  });

  it('throws on double-completion (points only once)', async () => {
    const householdId = new mongoose.Types.ObjectId();
    const user = await User.create({
      name:       'C',
      email:      'c@c.com',
      password:   'Password123',
      householdId,
    });

    const task = await Task.create({
      taskName:   'Done Task',
      assignedTo: user._id,
      points:     5,
      completed:  false,
    });

    // First completion succeeds
    await expect(
      gameLogic.completeTask(user._id.toString(), task._id.toString())
    ).resolves.toMatchObject({ user: { points: 5 } });

    // Second completion should throw
    await expect(
      gameLogic.completeTask(user._id.toString(), task._id.toString())
    ).rejects.toThrow(/task already completed/i);
  });
});
