import { Server } from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
        socket.on('canvas-change', canvas => {
            socket.broadcast.emit('update-canvas', canvas)
        })
        socket.on('color-change', color => {
          socket.broadcast.emit('update-color', color)
        })
    })
  }
  res.end()
}

export default SocketHandler