// app.js文件

const express = require('express');
const app = express();
// 设置静态文件夹，会默认找当前目录下的index.html文件当做访问的页面
app.use(express.static(__dirname));

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const socket = require('socket.io')
var _ = require('underscore');

let hashSocket = new Array()
let hashName = [{ id: 151, name: 'Ben' }, { id: 152, name: 'Linda' }, { id:153, name: 'Curry' }]

// 监听与客户端的连接事件
io.on('connection', socket => {
    socket.on('setName', function(data) {
        const id = data;
        hashSocket[id] = socket.id;
    })

    socket.on('sayTo', function(data) {
        let id = data.id, toId, me = data.me
        if(toId = hashSocket[id]){
            meId = hashSocket[me]
            const name = hashName.find(c => c.id === data.me).name
            let toSocket = _.findWhere(io.sockets.sockets,{id:toId});
            let meSocket = _.findWhere(io.sockets.sockets,{id:meId});
            const msg = {name,id: data.me, msg: data.msg, date: Date.now()}
            toSocket.emit('message',msg);
            meSocket.emit('message', msg)
        }
    })

    // socket.broadcast.emit("msg",{text:"hello,everyone"}); 
    // socket.on('message', (id, msg) => {
    //     socket.on('someon', data => {
    //         console.log(data)
    //     })
    //     // socket.broadcast.to(id).emit('my message', msg)

    //     // io.sockets.emit('my message', `{"text": "${msg}", "date":"${Date.now()}"}`)
    // })
    // console.log('服务端连接成功');
});
server.listen(3000);
