import http from 'http'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { join } from 'path'

const PROT = 8000
const __filename = fileURLToPath(import.meta.url)
const __dirname = join(__filename, '..')

const server = http.createServer(async (req, res) => {
  console.log(req)
  const contentBuffer = await fs.readFile(__dirname + '/text.txt')
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  setTimeout(() => {
    res.end(contentBuffer.toString('utf-8'))
  }, 1000)
})

server.listen(PROT, () => {
  console.log(`Server running on port ${PROT}`)
})
