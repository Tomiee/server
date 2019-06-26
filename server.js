var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]



if (!port) {
  console.log('请指定端口号\n 比如: node server.js 8888 ')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var path = request.url
  var query = ''
  if (path.indexOf('?') >= 0) {
    query = path.substring(path.indexOf('?') + 1)
  }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看 ************/

  console.log('HTTP 路径为\n' + path)
  if (path == '/style.js') {
    response.setHeader('Content-Type', 'text/css; charset=utf-8')
    response.write('body{background-color: #ddd;}h1{color: red;}')
    response.end()
  } else if (path == '/script.html') {
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
    response.write('alert("这是JS执行的")')
    response.end()
  } else if (path == '/index.css') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write('<!DOCTYPE>\n<html>' +
      '<head><link rel="stylesheet" href="/style.js">' +
      '</head><body>' +
      '<h1>你好</h1>' +
      '<script src="/script.html"></script>' +
      '</body></html>')
    response.end()
  } else if (path == '/ajax') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    fs.readFile('./ajax.html', function (err, data) {
      if (err) {
        console.log(err)
      }
      let res = data.toString()
      response.end(res)
    })
  } else if (path == '/ajaxRequest') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.write('do something')
    response.end()
  } else if (path == '/message') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080')
    fs.readFile('./data-mes.json', function (err, data) {
      if (err) {
        console.log(err + ' err')
      }
      console.log(data)
      let mes = data.toString()
      response.end(mes)
    })
  } else if (pathNoQuery == '/add') {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080')
    fs.readFile('./data-mes.json', function (err, data) {
      if (err) {
        console.log(err)
      }
      let mes = data.toString(); //将二进制的数据转换为字符串
      console.log(mes)
      mes = JSON.parse(mes); //将字符串转换为json对象
      console.log(mes)
      console.log('M:' + mes.Message)
      // console.log('q'+queryObject)
      console.log(Array.isArray(mes.Message))
      console.log(typeof (queryObject))
      console.log(queryObject)
      mes.Message.push(queryObject)
      console.log(mes)
      newMes = JSON.stringify(mes)
      // console.log('arr:' + mes.Message)

      fs.writeFile('./data-mes.json', newMes, function (err) {
        console.log('写入失败:' + err)
      })
      console.log('写入成功')
      response.end(newMes)
    })
    console.log('接收到了')
  } else if (path == '/pay') {
    // response.statusCode = 404
    // response.end()
    let callbackName = queryObject.callback
    console.log(callbackName)
    response.setHeader('Content-Type', 'application/javascript')
    response.write(`
        ${callbackName}.call(undefined, 'success')
    `)
    response.end()
  } else {

  }
  /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 请在浏览器打开 http://localhost:' + port)