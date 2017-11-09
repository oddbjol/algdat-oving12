let LempelZiv = require("./LempelZiv");

let lz = new LempelZiv();
let compressed = lz.compress("abcdeabcffff", 8);
console.log(compressed);