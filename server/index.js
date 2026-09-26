require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000


const registerController = require('./Controllers/ResgisterController')
const loginController = require('./Controllers/LoginController')
const userController = require('./Controllers/UserController')


app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ message: 'CipherText server is running' })
})

app.listen(PORT, () => {
  console.log(`CipherText server listening on http://localhost:${PORT}`)
})

registerController.register(app)
loginController.login(app)
userController.getUserKey(app)
userController.getUsers(app)
userController.purgeUsers(app)


