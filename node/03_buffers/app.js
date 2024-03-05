import http from 'http'
http.createServer((_, res) => res.end('Hello World!')).listen(8000)

import { Buffer, constants } from 'buffer'
const buff = Buffer.alloc(16, 'h')

console.log(Buffer)

for (let i = 0; i < buff.length; i++) {
  buff[i] = i * 2;
}

console.log(buff)