let Compressor = require("./Compressor");
let fs = require("fs");
let argv = process.argv.slice(2);

fs.readFile(argv[0],'utf8',function(err,data){
    "use strict";
    let compressor = new Compressor();
    let compressed = compressor.huffmanCode(data);
    fs.writeFile(argv[1],JSON.stringify(compressed));
});