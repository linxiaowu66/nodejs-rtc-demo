const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const path = require('path')
const uuid = require('uuid')

const app = express()

app.use(express.static(path.join('./public'), { maxAge: 86400000 }))
app.use('/', (req, res) => res.sendFile(path.join(__dirname, './ws.html')))

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

let targetClient = null

wss.on('connection', function connection(ws, req) {
  // const location = url.parse(req.url, true)
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.id = uuid.v4()

  ws.on('message', function incoming(message) {
    console.log(`received client[${ws.id}]: ${message}`)
  })

  ws.on('close', function close() {
    console.log(`client[${ws.id}] close`)
  })

  console.log('current clients count: ', wss.clients.size)

  if (wss.clients.size === 2) {
    targetClient = ws
  }

  try {
    setInterval(() => {
      // 如果这里不判断客户端状态是否是OPEN状态的,那么客户端主动断开连接的时候，这边的代码会直接崩溃掉
      if (ws.readyState === ws.OPEN) {
        ws.send(`server => client[${ws.id}]: ${new Date()}`)
      } else {
        ws.close()
      }}
      , 60000)
  } catch (err) {
    console.log('websocket error: ', err)
  }
})

// 2分钟之后广播给所有的客户端
setTimeout(() => {
  wss.clients.forEach(client => {
    client.send(`server broadcast to all client => [${client.id}]: ${new Date()}`)
  })
}, 8 * 1000)

// 5分钟后给指定的客户端发送消息
setTimeout(() => {
  targetClient.send(`server send to specific client[${targetClient.id}]: ${new Date()}`)
}, 10 * 1000)

server.listen(3000, function listening() {
  console.log('Listening on %d', server.address().port)
})