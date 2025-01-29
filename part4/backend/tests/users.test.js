const { test, after, describe, beforeEach } = require('node:test');
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest');
const helper = require('../utils/test_helper')
const app = require('../app');
const api = supertest(app);
const assert = require('assert');


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })
  test('creation with fresh username', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'haha',
      name: 'Lemuel Apistar',
      password: 'admin'
    }

    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'lemuel apistarz',
      password: 'admin',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Username must be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})