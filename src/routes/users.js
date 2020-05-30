var express = require('express')
var router = express.Router()

const User = require('../models/User')
const auth = require('../middleware/auth')

router.post('/register', async (req, res, next) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.post('/login', async (req, res) => {
  // Login a registered user
  try {
    const user = await User.findByCredentials(req.body.user, req.body.password)

    if (!user) {
      return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
    }
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send({
      error: error.message
    })
  }
})

router.get('/info', auth, async (req, res) => {
  res.send({
    username: req.user.username,
    email: req.user.email,
    name: req.user.name
  })
})

module.exports = router
