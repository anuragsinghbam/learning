function EventEmitter() {
  this._eventsCount = 0
  this._events = {}
}

EventEmitter.prototype.on = function on(eventName, callback) {
  if (Array.isArray(this._events[eventName])) {
    this._events[eventName].push(callback)
  } else if (this._events[eventName]) {
    this._events[eventName] = [this._events[eventName], callback]
  } else {
    this._events[eventName] = callback
    this._eventsCount = this._eventsCount + 1
  }
}

EventEmitter.prototype.emit = function emit(eventName, ...args) {
  const events = this._events[eventName]
  if(!events) return
  if (events.length) {
    events.forEach((event) => event(...args))
  } else {
    this._events[eventName](...args)
  }
}

const myEmitter = new EventEmitter()

myEmitter.on('click', () => {
  console.log('clicked 1')
})

myEmitter.on('click', () => {
  console.log('clicked 2')
})


myEmitter.on('foo', (e, e2) => {
  console.log('foo 1', e, e2)
})

myEmitter.on('foo', () => {
  console.log('foo 2')
})


myEmitter.emit('foo', 'Anurag', 'Singh')


console.log(myEmitter)
