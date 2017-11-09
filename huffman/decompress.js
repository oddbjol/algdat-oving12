let Huffman = require("./Huffman");
let fs = require("fs");
let argv = process.argv.slice(2);


let raw = fs.readFileSync(argv[0],'utf8');
let compressed = JSON.parse(raw);
let huffman = new Huffman();
let decompressed = huffman.huffmanDecode(compressed.data, compressed.frequencies);
fs.writeFileSync(argv[1],decompressed);