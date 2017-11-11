let Huffman = require("./Huffman");
let fs = require("fs");
let argv = process.argv.slice(2);


let data = fs.readFileSync(argv[0],'binary');
let huffman = new Huffman();
let compressed = huffman.huffmanCode(data);

fs.open(argv[1],"w", function(error, fd){
    "use strict";
    let buffer = Buffer.alloc(256 * 4 + compressed.data.length,0,'binary');
    for(let i = 0; i < 256; i++)
        buffer.writeInt32LE(compressed.frequencies[i],i*4);
    buffer.write(compressed.data,256*4,compressed.data.length,'binary');

    fs.writeSync(fd, buffer, 0, buffer.length,0);
});