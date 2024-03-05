import fs from 'fs'
import { Writable } from 'stream'
import { Buffer } from 'buffer'

class FileWriteStream extends Writable {
  constructor({ fileName, highWaterMark }) {
    super({ highWaterMark })
    this.fileName = fileName
    this.fd = null
    this.chunks = []
    this.chunksSize = 0
    this.writesCount = 0
  }
  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fd) => {
      if (err) {
        return callback(err)
      }
      this.fd = fd
      callback()
    })
  }

  _writeToDisk(callback) {
    const buffer = Buffer.concat(this.chunks)
    fs.write(this.fd, buffer, 0, buffer.length, null, (err) => {
      if (err) {
        return callback(err)
      }
      this.chunks = []
      this.chunksSize = 0
      ++this.writesCount
      callback()
    })
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk)
    this.chunksSize += chunk.length

    if (this.chunksSize >= this.writableHighWaterMark) {
      this._writeToDisk(callback)
    } else {
      callback()
    }
  }

  _final(callback) {
    this._writeToDisk(callback)
  }

  _destroy(error, callback) {
    console.log('Writes count:', this.writesCount)
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error)
      })
    } else {
      callback(error)
    }
  }
}

const stream = new FileWriteStream({
  fileName: 'test.txt',
})

let writtenLength = 0

function writeToTheFile() {
  while (true)
    if (writtenLength >= 1000000 || !stream.write(`${++writtenLength}, `)) {
      if (writtenLength >= 1000000) {
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
  console.log('Finish writes count:', stream.writesCount)
})
