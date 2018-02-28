const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')

app.use(express.static(path.join('./public'), { maxAge: 86400000 }))

const ns1 = io.of('/ns1')
const ns2 = io.of('/ns2')
const ns3 = io.of('/ns3')

// 广播给指定room的所有成员
app.post('/broadcast/room', (req, res) => {
  const { room } = req.params
  ns3.to(room).emit('newMessage', `someone want to broadcast to the members of room[${room}]`)
  res.json({ msg: "ok" })
})

// 广播给指定的namespace的所有成员
app.post('/broadcast/namespace', (req, res) => {
  const { ns } = req.params
  io.of(ns).emit('newMessage', `someone want to broadcast to the members of ns[${ns}]`)
  res.json({ msg: "ok" })
})

app.post('/broadcast/all', (req, res) => {
  // 广播给所有的客户端,不论namespace/room
  io.sockets.emit("broadcast", { ts: Date.now() });
  res.json({ msg: "ok" });
})

app.use('/', (req, res) => res.sendFile(path.join(__dirname, './io.html')))

// 场景一: 用户加入不同的namespace

ns1.on('connnetion', (socket) => {
  console.log(`client[${socket.id}] connected to /ns1 namespace`)
  // 统计当前ns1中有多少个客户端连接着
  ns1.clients((error, clients) => {
    if (error) throw error
    console.log(`current ns1 namespace have ${clients.length} clients`)
  })
  // 通知给其他用户说,某某客户端上线了!
  // broadcast.emit可以发送给该namespace下的所有客户端除了当前连接的客户端
  socket.broadcast.emit('online', `client[${socket.id}] online, welcome him`)
})

ns2.on('connnetion', (socket) => {
  console.log(`client[${socket.id}] connected to /ns2 namespace`)
  // 统计当前ns2中有多少个客户端连接着
  ns2.clients((error, clients) => {
    if (error) throw error
    console.log(`current ns2 namespace have ${clients.length} clients`)
  })
  // 通知给其他用户说,某某客户端上线了!
  // broadcast.emit可以发送给该namespace下的所有客户端除了当前连接的客户端
  socket.broadcast.emit('online', `client[${socket.id}] online, welcome him`)
})

// 场景二: 加入不同的room

ns3.on('connection', (socket) => {
  console.log(`client[${socket.id}] connected to /ns3 namespace`)
  // 统计当前ns3中有多少个客户端连接着
  ns3.clients((error, clients) => {
    if (error) throw error
    const counts = clients.length
    if (counts % 2) {
      socket.join('room1')
      // 通知room中的其他客户端,除了当前连接的客户端
      ns3.to('room1').emit('online', `client[${socket.id}] online, welcome him`)
      // 或者也可以这么使用
      // socket.to('room1').emit('online', `client[${socket.id}] online, welcome him`)
      // 如果需要连当前的客户端也发送消息,则需要使用下面的语法
      // io.in('room1').emit('online', `client[${socket.id}] online, welcome him`)
    } else {
      socket.join('room2')
      // 通知room中的其他客户端,除了当前连接的客户端
      ns3.to('room2').emit('online', `client[${socket.id}] online, welcome him`)
    }
    console.log(`current ns2 namespace have ${clients.length} clients`)
  })
})


// io.on('connection', function(socket){
//   console.log(`client[${socket.id}] connected`)
//   console.log('current clients count: ', io.engine.clientsCount)

//   socket.on('disconnect', function(){
//     console.log(`user[${socket.id}] disconnected`);
//   });
//   socket.on('news', function(id, msg){
//     console.log(`client[${socket.id}] => server: message: ${msg}`)
//     console.log('id: ', id)
//       socket.broadcast.to(id).emit('news', `server => client[${socket.id}] ${Date.now()}`)
//   })

//   // setInterval(() => {
//   //   socket.emit('news', `server => client[${socket.id}] ${Date.now()}`)
//   // }, 5000)
// })

http.listen(3000, function(){
  console.log('listening on *:3000');
})

