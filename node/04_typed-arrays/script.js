function Buffer() {
  
}


const buffer = new ArrayBuffer(16)

let intView = new Int8Array(buffer);

console.log(intView)

// Set values in the array
for (let i = 0; i < intView.length; i++) {
    intView[i] = i * 2;
}
