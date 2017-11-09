let Huffman = require("./Huffman");
let fs = require("fs");
let argv = process.argv.slice(2);


let data = fs.readFileSync(argv[0],'utf8');
let huffman = new Huffman();
let compressed = huffman.huffmanCode(data);
fs.writeFileSync(argv[1],JSON.stringify(compressed));