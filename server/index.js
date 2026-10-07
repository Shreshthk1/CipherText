require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5000

const http = require('http')
const registerController = require('./Controllers/ResgisterController')
const loginController = require('./Controllers/LoginController')
const userController = require('./Controllers/UserController')
const messageController = require('./Controllers/MessageController')
const webSocket = require('./Controllers/ws')
const twoFactorAuth = require('./Controllers/2fa')

app.use(cors())
app.use(express.json())




registerController.register(app)
loginController.login(app)
userController.getUserKey(app)
userController.getUsers(app)
messageController.getMessages(app)
messageController.sendMessage(app)
twoFactorAuth.setup2FA(app)
twoFactorAuth.verify2FA(app)

const server = http.createServer(app);
webSocket.setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`CipherText server listening on http://localhost:${PORT}`);
});

