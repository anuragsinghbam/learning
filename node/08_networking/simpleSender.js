import net from 'net'

const socket = net.createConnection({ port: 8080, host: '127.0.0.1' }, () => {
  const buff = Buffer.alloc(12)
  buff[0] = 65
  buff[1] = 56
  socket.write('This is simple message')
})
