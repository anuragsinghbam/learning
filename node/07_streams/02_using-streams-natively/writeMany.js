import fs from 'fs/promises'
import http from 'http'

// http
//   .createServer((_, res) => {
//     console.log(res)
//     res.end('Hello Worlda')
//   })
//   .listen(8000)

console.time('writeMany')
const fileHandler = await fs.open('./test.txt', 'w')
// (Watch Mode: Off, Inspect Mode: Off)
// Execution Time: 190ms
// CPU Usage: N/A
// Memory Usage: 250MB
// It writes numbers in correct order
// It is not a good practice

// const stream = fileHandler.createWriteStream()

// for (let i = 1; i <= 1000000; i++) {
//   const buff = Buffer.from(`${i}, `)
//   stream.write(buff)
// }

// (Watch Mode: Off, Inspect Mode: Off)
// Execution Time: 38ms
// CPU Usage: N/A
// Memory Usage: 32MB
// It writes numbers in correct order

const stream = fileHandler.createWriteStream()

console.log(stream)

let writtenLength = 0

function writeToTheFile() {
  while (true)
    if (writtenLength >= 100000000 || !stream.write(`${++writtenLength}, `)) {
      if (writtenLength >= 100000000) {
        stream.end()
      }
      break
    }
}
writeToTheFile()

stream.on('drain', () => {
  console.log('Draining')
  writeToTheFile()
})

stream.on('finish', () => {
  console.timeEnd('writeMany')
  fileHandler.close()
})
