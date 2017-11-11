let Huffman = require("./Huffman");
let fs = require("fs");
let argv = process.argv.slice(2);


let data = fs.readFileSync(argv[0],'ascii');
let huffman = new Huffman();
let compressed = huffman.huffmanCode(data);

fs.open(argv[1],"w", function(error, fd){
    "use strict";
    let buffer = Buffer.alloc(256 * 4 + compressed.data.length,0,'binary');
    for(let i = 0; i < 256; i++) {
        let charNum = compressed.frequencies[String.fromCharCode(i)];
        if(charNum > 0)
            buffer.writeInt32LE(charNum,i*4);
        else
            buffer.writeInt32LE(0,i*4);
    }
    buffer.write(compressed.data,256*4,compressed.data.length,'binary');

    fs.writeSync(fd, buffer, 0, buffer.length,0);


});


//fs.writeFileSync(argv[1],JSON.stringify(compressed),'utf8');