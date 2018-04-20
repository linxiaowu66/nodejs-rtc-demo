$(document).ready(function(){
  $('.btn').click(() => {
    socketInit();
  })
})

function socketInit(){
  connection = new WebSocket("ws://localhost:3000")
  //uid用来区分是哪一个用户
  connection.uid = Date.now();
  connection.onopen = function () {
      console.log("Connection opened")
  }
  connection.onclose = function () {
      console.log("Connection closed")
  }
  connection.onerror = function () {
      console.error("Connection error")
  }
  connection.onmessage = function (event) {
    console.log(event.data)
    connection.send(`client => server: ${new Date()}`)
    $('#message').text(event.data)
  }
}