import fs from 'fs/promises'
import { pipeline } from 'stream/promises'

console.time('copy')
const srcFile = await fs.open('./text-small.txt', 'r')
const destFile = await fs.open('./dest-copy.txt', 'w')

const readStream = srcFile.createReadStream()
const writeStream = destFile.createWriteStream()

// readStream.pipe(writeStream)

// readStream.on('end', () => console.timeEnd('copy'))

try {
  await pipeline(readStream, writeStream)
  console.timeEnd('copy')
} catch (error) {
  console.error(error)
}

