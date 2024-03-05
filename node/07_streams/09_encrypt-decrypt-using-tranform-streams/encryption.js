import fs from 'fs/promises'
import { Transform } from 'stream'

class Encrypt extends Transform {
  totalBytesRead = 0
  readCount = 0
  _transform(chunk, encoding, callback) {
    ++this.readCount
    this.totalBytesRead += chunk.length
    if (this.readCount % 10 === 0) {
      const readPercent = (this.totalBytesRead / readFileSize) * 100
      console.log(`${readPercent.toFixed(2)}% Encrypted`)
    }
    for (let i = 0; i <= chunk.length; i++) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] + 1
    }
    this.push(chunk)
    callback()
  }
}

const readFileHandle = await fs.open('src.txt', 'r')
const writeFileHandle = await fs.open('write.txt', 'w')

const readFileSize = (await readFileHandle.stat()).size

const readStream = readFileHandle.createReadStream()
const writeStream = writeFileHandle.createWriteStream()

const encrypt = new Encrypt()
readStream.pipe(encrypt).pipe(writeStream)
