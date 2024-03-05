import fs from 'fs/promises'
// import http from 'http'

// http
//   .createServer(async (_, res) => {
//     res.end('Hello Worlds')
//   })
//   .listen(8000)

const fileHandleRead = await fs.open('./src1.txt', 'r')
const fileHandleWrite = await fs.open('./dest.txt', 'w')
const streamRead = fileHandleRead.createReadStream()
const streamWrite = fileHandleWrite.createWriteStream()


let split

console.log(streamRead.readableFlowing)

streamRead.on('data', (chunk) => {
  console.time('readBig')
  const chunkArray = chunk
    .toString('utf-8')
    .trim()
    .split(', ')
    .map((el) => el.trim().replace(',', ''))
    .filter((el) => el !== '')

  const firstNumber = Number(chunkArray[0])
  const secondNumber = Number(chunkArray[1])
  const lastNumber = Number(chunkArray[chunkArray.length - 1])
  const secondLastNumber = Number(chunkArray[chunkArray.length - 2])

  // console.log(chunkArray)

  if (firstNumber + 1 !== secondNumber) {
    if (split) chunkArray.splice(0, 1, split + chunkArray[0])
  }

  if (secondLastNumber + 1 !== lastNumber) {
    split = chunkArray.pop()
  }

  const evenBuffer = Buffer.from(chunkArray.join(', ') + ', ')
  if (!streamWrite.write(evenBuffer)) {
    streamRead.pause()
    console.log(streamRead.readableFlowing)
  }
})

console.log(streamRead.readableFlowing)

streamWrite.on('drain', () => {
  streamRead.resume()
})

streamRead.on('end', () => {
  console.timeEnd('readBig')
})
