import net from 'net'

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log(data.toString())
    // socket.end('Hii')
  })
})

server.listen(8080, '127.0.0.1', () =>
  console.log('opened server on', server.address())
)
