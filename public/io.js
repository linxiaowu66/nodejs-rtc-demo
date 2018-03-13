$(document).ready(function(){
  // const socket = socketInit();
  let ns = null
  $('.ns1').click(() => {
    if (!ns) {
      nsSocketInitNs1()
      ns = 'ns1'
    }
  })
  $('.ns2').click(() => {
    if (!ns) {
      nsSocketInitNs2()
      ns = 'ns2'
    }
  })
  $('.ns3').click(() => {
    if (!ns) {
      nsSocketInitNs3()
      ns = 'ns3'
    }
  })
  $('.main').click(() => {
    socketInit()
  })
  $('.broadcast-all').click(() => {
    fetch('http://localhost:3000/broadcast/all', {
      method: 'post'
    })
  })
  $('.broadcast-ns').click(() => {
    fetch('http://localhost:3000/broadcast/namespace', {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: `ns=${ns}`
    })
  })
  $('.broadcast-room').click(() => {
    if (ns !== 'ns3') {
      console.log('没有加入到namespace3中')
      return
    }
    fetch('http://localhost:3000/broadcast/room', {
      method: 'post',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: 'room=room1'
    })
  })
})


function socketInit(){
  var socket = io();

  ss(socket).on('script', (stream) => {
    let buffer = ''
    stream.on("data", function (data) {
      buffer += data.toString();
    })
    stream.on("end", function () {
      $('#message').text(`根ns收到流数据: ${buffer}`)
    })
  })
  socket.on('error', (err) => {
    $('#message').text(`根ns收到错误的消息: ${err}`)
  })
}

// io不支持path动态传递进去,所以只能分开

function nsSocketInitNs1() {
  const socket = io('/ns1')
  socket.on('online', (event) => {
    $('#message').text(`ns1收到消息: ${event}`)
  })
  socket.on('newMessage', (event) => {
    $('#message').text(`ns1收到消息: ${event}`)
  })
  socket.on('offline', (event) => {
    $('#message').text(`ns1收到消息: ${event}`)
  })
  socket.on('error', (err) => {
    $('#message').text(`ns1收到错误的消息: ${err}`)
  })
}

function nsSocketInitNs2() {
  const socket = io('/ns2')
  socket.on('online', (event) => {
    $('#message').text(`ns2收到消息: ${event}`)
  })
  socket.on('newMessage', (event) => {
    $('#message').text(`ns2收到消息: ${event}`)
  })
  socket.on('offline', (event) => {
    $('#message').text(`ns2收到消息: ${event}`)
  })
  socket.on('error', (err) => {
    $('#message').text(`ns2收到错误的消息: ${err}`)
  })
}

function nsSocketInitNs3() {
  const socket = io('/ns3')
  socket.on('online', (event) => {
    $('#message').text(`ns3收到消息: ${event}`)
  })
  socket.on('newMessage', (event) => {
    $('#message').text(`ns3收到消息: ${event}`)
  })
  socket.on('offline', (event) => {
    $('#message').text(`ns3收到消息: ${event}`)
  })
  socket.on('error', (err) => {
    $('#message').text(`ns3收到错误的消息: ${err}`)
  })
}