let fs = require("fs");
let Huffman = require("./Huffman");
let argv = process.argv.slice(2);

fs.stat(argv[0],function(error, stats){
    "use strict";

    fs.open(argv[0],"r", function(error, fd){
        "use strict";
        let buffer = new Buffer(stats.size);
        fs.readSync(fd, buffer, 0, stats.size, 0);
        let frequencies = {};
        for(let i = 0; i < 256; i++){
            let numChar = buffer.readInt32LE(i*4);
            if(numChar > 0)
                frequencies[String.fromCharCode(i)] = numChar;
        }
        let data = buffer.toString('binary',256*4);
        let decompressed = new Huffman().huffmanDecode(data, frequencies);
        fs.writeFileSync(argv[1],decompressed,'utf8');
    });

});