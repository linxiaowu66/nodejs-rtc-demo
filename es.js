const express = require('express')
const http = require('http')
const uuid = require('uuid')
const SseStream = require('ssestream')
const path = require('path')

const app = express()

let sendCount = 1

app.use(express.static(path.join('./public'), { maxAge: 86400000 }))

app.get('/sse', (req, res) => {
  req.id = uuid.v4()
  console.log(`client[${req.id}] connect to server`)

  const lastEventId = req.headers['last-event-id']
  // 实现断点续传
  if (lastEventId) {
    sendCount = +lastEventId + 1
  }
  const sseStream = new SseStream(req)
  sseStream.pipe(res)
  const pusher = setInterval(() => {
    sseStream.write({
      id: sendCount,
      event: 'server-time',
      retry: 20000, // 告诉客户端,如果断开连接后,20秒后再重试连接
      data: {ts: new Date().toTimeString(), count: sendCount++}
    })
  }, 5000)

  res.on('close', () => {
    console.log(`client[${req.id}] disconnect to server`)
    clearInterval(pusher)
    sseStream.unpipe(res)
  })

  // res.json({msg: 'ok'})
})

app.use('/', (req, res) => res.sendFile(path.join(__dirname, './es.html')))


const server = http.createServer(app)
server.listen(3000, function listening() {
  console.log('Listening on %d', server.address().port)
})