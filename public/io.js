$(document).ready(function(){
  const socket = socketInit();
  $('.ns1').click(() => {
    nsSocketInit('ns1')
  })
  $('.ns2').click(() => {
    nsSocketInit('ns2')
  })
  $('.ns3').click(() => {
    nsSocketInit('ns3')
  })
  $('.broadcast-all').click(() => {
    fetch('http://localhost:3000/broadcast/all', {
      method: 'post'
    })
  })
})

function socketInit(){
  var socket = io();
  socket.on('news', (event) => {
    $('#message').text(event)
  })
  return socket
}

function nsSocketInit(path) {
  const socket = io(path)
}