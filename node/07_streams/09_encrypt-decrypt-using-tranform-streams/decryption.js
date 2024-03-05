import fs from 'fs/promises'
import { Transform } from 'stream'

class Decrypt extends Transform {
  totalBytesRead = 0
  async _transform(chunk, encoding, callback) {
    this.totalBytesRead += chunk.length
    const readPercent = (this.totalBytesRead / readFileSize) * 100
    console.log(`${readPercent.toFixed(2)}% Decrypted`)
    for (let i = 0; i <= chunk.length; i++) {
      if (chunk[i] !== 255) chunk[i] = chunk[i] - 1
    }
    this.push(chunk)
    callback()
  }
}

const readFileHandle = await fs.open('write.txt', 'r')
const writeFileHandle = await fs.open('decrypt.txt', 'w')

const readFileSize = (await readFileHandle.stat()).size

const readStream = readFileHandle.createReadStream()
const writeStream = writeFileHandle.createWriteStream()

const decrypt = new Decrypt()
readStream.pipe(decrypt).pipe(writeStream)
