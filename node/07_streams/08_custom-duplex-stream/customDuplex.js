import fs from 'fs'
import { Duplex } from 'stream'
import { Buffer } from 'buffer'

class DuplexStream extends Duplex {
  constructor({
    writableHighWaterMark,
    readableHighWaterMark,
    writeFileName,
    readFileName,
  }) {
    super({ writableHighWaterMark, readableHighWaterMark })
    this.readFileName = readFileName
    this.writeFileName = writeFileName
    this.writeFd = null
    this.readFd = null
    this.chunks = []
    this.chunksSize = 0
    this.writesCount = 0
    this.readsCount = 0
  }
  _construct(callback) {
    fs.open(this.readFileName, 'r', (err, readFd) => {
      if (err) return callback(err)
      this.readFd = readFd
      fs.open(this.writeFileName, 'w', (err, writeFd) => {
        if (err) return callback(err)
        this.writeFd = writeFd
        callback()
      })
    })
  }

  _writeToDisk(callback) {
    const buffer = Buffer.concat(this.chunks)
    fs.write(this.writeFd, buffer, 0, buffer.length, null, (err) => {
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

  _read(size) {
    const buff = Buffer.alloc(size)
    fs.read(this.readFd, buff, 0, size, null, (err, bytesRead) => {
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

const duplex = new DuplexStream({
  writeFileName: './write.txt',
  readFileName: './read.txt',
})

duplex.write('this is string from 0')
duplex.write('this is string from 1')
duplex.write('this is string from 2')
duplex.write('this is string from 3')
duplex.write('this is string from 4')
duplex.write('this is string from 5')
duplex.write('this is string from 6')
duplex.write('this is string from 7')
duplex.write('this is string from 8')
duplex.write('this is string from 9')
duplex.end('this is end')

duplex.on('data', (chunk) => {
  console.log(chunk.toString())
})

duplex.on('end', () => {
  console.log('End', duplex.readsCount)
})
