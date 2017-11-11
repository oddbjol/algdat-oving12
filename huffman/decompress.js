let Huffman = require("./Huffman");
let fs = require("fs");
let argv = process.argv.slice(2);

//
// fs.stat(argv[0],function(error, stats){
//     "use strict";
//
//     fs.open(argv[0],"r", function(error, fd){
//         "use strict";
//         let buffer = new Buffer(stats.size);
//         fs.readSync(fd, buffer, 0, )
//
//
//     });
//
// });


let raw = fs.readFileSync(argv[0],'utf8');
let compressed = JSON.parse(raw);
let huffman = new Huffman();
let decompressed = huffman.huffmanDecode(compressed.data, compressed.frequencies);

fs.writeFileSync(argv[1],decompressed,'utf8');