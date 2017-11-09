require("google-closure-library");
goog.require('goog.structs.PriorityQueue');

let _ = require("lodash");
let MyNode = require("./MyNode");

class Compressor{

    constructor(){
        this.encoding = {};
    }

    static getFrequencies(text){
            let frequencies = {};

            for(let char of text){
                if(!frequencies[char])
                    frequencies[char] = 1;
                else
                    frequencies[char]++;
            }

            return frequencies;
    }

    makeHuffmanTree(frequencies){
        let queue = new goog.structs.PriorityQueue();
        for(let char in frequencies){
            let node = new MyNode(char, frequencies[char]);
            queue.enqueue(frequencies[char], node);
        }

        while(queue.getCount() > 1){
            let left = queue.dequeue();
            let right = queue.dequeue();

            let sum_frequency = left.value + right.value;

            let parent = new MyNode(sum_frequency,sum_frequency);

            parent.left = left;
            parent.right = right;

            queue.enqueue(sum_frequency, parent);
        }

        return queue.dequeue(); // root of huffman tree
    }

    huffmanCode(text){
        let frequencies = Compressor.getFrequencies(text);
        let tree = this.makeHuffmanTree(frequencies);

        this.encoding = {};

        this.generateEncoding(tree, "");

        console.log("frequencies: " + JSON.stringify(frequencies));
        console.log("encoding: " + JSON.stringify(this.encoding));

        let out = "";

        for(let char of text){
            out += this.encoding[char];
        }

        out = Compressor.fromBitString(out);
        return {frequencies: frequencies, data: out};
    }

    huffmanDecode(text, frequencies){
        let tree = this.makeHuffmanTree(frequencies);
        this.encoding = {};
        this.generateEncoding(tree, "");

        console.log("frequencies: " + JSON.stringify(frequencies));
        console.log("encoding: " + JSON.stringify(this.encoding));


        text = Compressor.toBitString(text);
        let reverse_encoding = [];
        for(let char in this.encoding)
            reverse_encoding[this.encoding[char]] = char;

        let decoded = "";
        let pos = 0;

        while(pos < text.length){
            let key = "";
            while(!(key in reverse_encoding) && pos < text.length){
                key += text[pos];
                pos++;
            }
            decoded += reverse_encoding[key];
        }
        return decoded;
    }

    generateEncoding(node, tmp){

        if(node.isLeafNode())
            this.encoding[node.key] = tmp;

        if(node.left)
            this.generateEncoding(node.left, tmp + "0");

        if(node.right)
            this.generateEncoding(node.right, tmp + "1");
    }

    static toBitString(text){
        let out = "";
        for(let char of text){
            let bits = char.charCodeAt(0).toString(2);
            out += _.padStart(bits, 8, "0");
        }

        return out;
    }

    static fromBitString(bit_string){
        let out = "";
        for(let i = 0; i < bit_string.length; i+= 8){
            let substring = bit_string.slice(i,i+8);
            substring = _.padEnd(substring, 8, '0');
            out += String.fromCharCode(parseInt(substring.toString(2),2));
        }
        return out;
    }
}
module.exports = Compressor;