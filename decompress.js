let Compressor = require("./Compressor");
let fs = require("fs");
let argv = process.argv.slice(2);

fs.readFile(argv[0],'utf8',function(err,data){
    "use strict";
    let wrapper = JSON.parse(data);
    let compressor = new Compressor();
    let decompressed = compressor.huffmanDecode(wrapper.data, wrapper.frequencies);
    fs.writeFile(argv[1],decompressed);
});