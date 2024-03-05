import fsSync from 'fs'
import fsPromise from 'fs/promises'

await fsPromise.copyFile('text.txt', 'copy-async.txt')
console.log('Async File copied!')

fsSync.copyFile('text.txt', 'copy-callback.txt', () => {
  console.log('Callback File copied!')
})

fsSync.copyFileSync('text.txt', 'copy-sync.txt')
console.log('Sync File copied!')
