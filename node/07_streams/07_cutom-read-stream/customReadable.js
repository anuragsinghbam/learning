import fs from 'fs'
import { Readable } from 'stream'
import { Buffer } from 'buffer'

class FileReadStream extends Readable {
  constructor({ fileName, highWaterMark }) {
    super({ highWaterMark })
    this.fileName = fileName
    this.fd = null
    this.readsCount = 0
  }
  _construct(callback) {
    fs.open(this.fileName, 'r', (err, fd) => {
      if (err) {
        return callback(err)
      }
      this.fd = fd
      callback()
    })
  }

  _read(size) {
    const buff = Buffer.alloc(size)
    fs.read(this.fd, buff, 0, size, null, (err, bytesRead) => {
      if (err) {
        return this.destroy(err)
      }
      this.push(bytesRead > 0 ? buff.subarray(0, bytesRead) : null)
      ++this.readsCount
    })
  }

  // _final(callback) {
  //   this._writeToDisk(callback)
  // }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err || error)
      })
    } else {
      callback(error)
    }
  }
}

const stream = new FileReadStream({
  fileName: 'test.txt',
})

stream.on('data', (chunk) => {
  console.log(chunk.toString())
})

stream.on('end', () => {
  console.log('End', stream.readsCount)
  
})
