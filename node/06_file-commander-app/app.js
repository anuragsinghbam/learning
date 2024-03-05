import fs from 'fs/promises'

const commandFileHandler = await fs.open('./command.txt', 'r')

commandFileHandler.on('change', async () => {
  const { size } = await commandFileHandler.stat()

  const buff = Buffer.alloc(size)
  await commandFileHandler.read(buff, 0, buff.byteLength, 0)
  const command = buff.toString('utf-8')

  console.log(command)

  if (command.includes('clear')) {
    setTimeout(() => {
      fs.writeFile('./command.txt', '')
    }, 10)
  }
})

const watcher = fs.watch('./command.txt')

for await (const { eventType } of watcher) {
  if (eventType === 'change') {
    commandFileHandler.emit('change')
  }
}
