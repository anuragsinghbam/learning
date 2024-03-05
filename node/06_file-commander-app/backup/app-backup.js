import fs from 'fs/promises'
import http from 'http'
http.createServer((_, res) => res.end('Hello World!')).listen(8000)

const commandsList = [
  'create a file',
  'delete the file',
  'rename the file',
  'write to the file',
]

const [CREATE_FILE, DELETE_FILE, RENAME_FILE, WRITE_TO_FILE] = commandsList

const clearConsole = async () => {
  try {
    setTimeout(() => {
      fs.writeFile('./command.txt', '')
      console.log('Clearing')
    }, 100)
  } catch (err) {
    console.log(err.message)
  }
}

const suggestCommands = async (initialCharacters) => {
  const suggestedCommand = commandsList.find((command) => {
    return initialCharacters
      .trim()
      .split('')
      .every((char, index) => char === command[index])
  })

  try {
    if (!suggestedCommand) return
    setTimeout(() => {
      fs.writeFile('./command.txt', suggestedCommand)
      console.log({ suggestedCommand })
    }, 100)
  } catch (err) {
    console.log(err.message)
  }
}

const createFile = async (path) => {
  try {
    const existingFileHandle = await fs.open(path, 'wx')
    existingFileHandle.close()
    console.log('A new file was successfully created.')
    clearConsole()
  } catch (err) {
    return console.log(`The file ${path} already exists.`)
  }
}

const deleteFile = async (path) => {
  try {
    await fs.unlink(path)
    // await fs.rm(path)
    console.log('File deleted successfully.')
    clearConsole()
  } catch (err) {
    console.log(err.message)
  }
}

const renameFile = async (oldPath, newPath) => {
  try {
    const existingFileHandle = await fs.open(oldPath, 'r')
    existingFileHandle.close()
    await fs.rename(oldPath, newPath)
    console.log(`The file ${oldPath} renamed successfully to ${newPath}.`)
    clearConsole()
  } catch (err) {
    console.dir(err.message)
  }
}

let addedContent

const writeToFile = async (path, content) => {
  if (addedContent === content) return
  try {
    const fileHandle = await fs.open(path, 'w')
    fileHandle.write(content)
    fileHandle.close()
    addedContent = content
    console.log(`Content added to the file successfully.`)
    clearConsole()
  } catch (err) {
    console.dir(err.message)
  }
}

const commandFileHandler = await fs.open('./command.txt', 'r')

commandFileHandler.on('change', async () => {
  const { size } = await commandFileHandler.stat()

  // allocate our buffer with size of the file
  const buff = Buffer.alloc(size)

  // the location at which we want to start filling our buffer
  const offset = 0

  // how many byte we want to read
  const length = buff.byteLength

  // the position that we want to start reading the file from
  const position = 0

  // we alway want to read the whole content (from beginning all the way to the end)
  await commandFileHandler.read(buff, offset, length, position)
  const command = buff.toString('utf-8')

  // create a file <path>
  if (command.includes('  ')) {
    suggestCommands(command)
  }

  if (command.includes(CREATE_FILE)) {
    const filePath = command.substring(CREATE_FILE.length + 1).split(' ')[0]
    if (filePath) createFile(filePath)
  }

  if (command.includes(DELETE_FILE)) {
    const filePath = command.substring(DELETE_FILE.length + 1).split(' ')[0]
    if (filePath) deleteFile(filePath)
  }

  if (command.includes(RENAME_FILE)) {
    const [firstPart, newPath] = command.split(' to ')
    const oldPath = firstPart.split(' ').pop()
    if (oldPath && newPath) renameFile(oldPath, newPath)
  }

  if (command.includes(WRITE_TO_FILE)) {
    const [firstPart, content] = command.split(' this content: ')
    const path = firstPart.split(' ').pop()
    if (path && content) writeToFile(path, content)
  }

  if (command.includes('clear')) clearConsole()
})

const watcher = fs.watch('./command.txt')
for await (const { eventType } of watcher) {
  if (eventType === 'change') commandFileHandler.emit('change')
}
