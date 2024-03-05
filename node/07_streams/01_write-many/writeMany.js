import fs from 'fs'

console.time('writeMany')

// (Watch Mode: On, Inspect Mode: On)
// Execution Time: 2:00.172 (m:ss.mmm)
// CPU Usage: 115%
// Memory Usage: 65MB

// (Watch Mode: On, Inspect Mode: Off)
// Execution Time: 45.606s
// CPU Usage: 95%
// Memory Usage: 45MB

// (Watch Mode: Off, Inspect Mode: Off)
// Execution Time: 45.405s
// CPU Usage: 95%
// Memory Usage: 45MB

// fs.writeFile('./test.txt', '')
// for (let i = 1; i <= 1000000; i++) {
//   await fs.appendFile('./test.txt', `${i}, `)
// }

// (Watch Mode: On, Inspect Mode: On)
// Execution Time: 34.476s
// CPU Usage: 120%
// Memory Usage: 65MB

// (Watch Mode: On, Inspect Mode: Off)
// Execution Time: 11.339s
// CPU Usage: 103%
// Memory Usage: 45MB

// (Watch Mode: Off, Inspect Mode: Off)
// Execution Time: 10.976s
// CPU Usage: 103%
// Memory Usage: 45MB

// const fileHandler = await fs.open('./test.txt', 'w')

// for (let i = 1; i <= 1000000; i++) {
//   await fileHandler.write(`${i}, `)
// }

// for (let i = 1; i <= 1000000; i++) {
//   await fileHandler.write(`${i}, `)
// }

// (Watch Mode: Off, Inspect Mode: Off)
// Execution Time: 0.286ms
// CPU Usage: 197%
// Memory Usage: 1GB
// It doesn't write numbers in correct order

// fs.open('./test.txt', 'w', (err, fd) => {
//   for (let i = 1; i <= 1000000; i++) {
//     fs.write(fd, `${i}, `, () => {})
//   }
// })

// (Watch Mode: Off, Inspect Mode: Off)
// Execution Time: 0.109ms
// CPU Usage: N/A
// Memory Usage: 25MB
// It writes numbers in correct order

// fs.open('./test.txt', 'w', (err, fd) => {
//   for (let i = 1; i <= 1000000; i++) {
//     fs.writeSync(fd, `${i}, `)
//   }
// })

fs.open('./test.txt', 'w', (err, fd) => {
  for (let i = 1; i <= 1000000; i++) {
    const buff = Buffer.from(`${i}, `)
    fs.writeSync(fd, buff)
  }
})

console.timeEnd('writeMany')
