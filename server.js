const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
    socket.on('mouse', mouseMsg);
    function mouseMsg(data) {
      socket.to(roomId).broadcast.emit('mouse', data);
    }

    socket.on('color', colMsg);
    function colMsg(cdata) {
      socket.to(roomId).broadcast.emit('color', cdata);
    }

    socket.on('linew', linMsg);
    function linMsg(ldata) {
      socket.to(roomId).broadcast.emit('linew', ldata);
    }

    socket.on('eraser', EMsg);
    function EMsg(edata) {
      socket.to(roomId).broadcast.emit('eraser',edata);
    }
  })
})

server.listen(3000)