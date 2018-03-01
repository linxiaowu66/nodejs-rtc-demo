$(document).ready(function(){
  // const es = new EventSourcePolyfill('/sse')
  // const es = new EventSourcePolyfill('http://localhost:3000/sse')
  const es = new EventSource('/sse')
  es.addEventListener('open', function() {
    $('#prepare').text(`客户端与服务器建立连接了`)
  })
  es.addEventListener('server-time', function (e) {
    $('#message').text(`收到推送的消息: ${e.data}`)
  })
  es.addEventListener('close', function() {
    $('#close').text(`客户端与服务器断开连接了`)
  })
  es.addEventListener('error', function(error) {
    $('#close').text(`发生错误:${error}`)
  })
})
