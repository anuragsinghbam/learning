import http from 'http'
import EventEmitter from 'events'

class Emitter extends EventEmitter {}

const myEmitter = new EventEmitter()

myEmitter.on('click', function (e) {
  console.log(e)
})

myEmitter.once('click', function (...args) {
  console.log(this, args)
})
console.log(myEmitter)

const server = http.createServer((req, res) => {
  res.end('Hello World from Node.js')
})


server.listen(8000)
