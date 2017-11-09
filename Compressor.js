require("google-closure-library");
goog.require('goog.structs.PriorityQueue');

let MyNode = require("./MyNode");

let _ = require("lodash");

class Compressor{

    constructor(){
        this.encoding = {};
    }

    runLengthCompress(text){
        let out = "";
        let prev = null;
        let num = 0;
        for(let i = 0; i < text.length; i++){
            let char = text[i];
            if((char != prev && prev != null) || i == text.length-1){ // flush{
                if(num > 1)
                    out += "["+num+"]" + prev;
                else
                    out += prev;
                num = 0;
            }

            num++;
            prev = char;
        }

        out += prev;

        return out;
    }

    runLengthDecompress(text){
        let out = "";

        for(let i = 0; i < text.length; i++){
            let times = 1;
            if(text[i] == '['){
                times = "";
                i++;
                do{
                    times += text[i];
                    i++;
                }
                while(text[i] != ']');

                i++;
            }

            for(let j = 0; j < times; j++)
                out += text[i];
        }
        return out;
    }

    getFrequencies(text){
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
        let frequencies = this.getFrequencies(text);
        console.log("freq: " + JSON.stringify(frequencies));
        let tree = this.makeHuffmanTree(frequencies);

        this.encoding = {};

        this.generateEncoding(tree, "");

        let out = "";

        for(let char of text){
            out += this.encoding[char];
        }

        out = this.fromBitString(out);
        return {frequencies: frequencies, data: out};
    }

    huffmanDecode(text, frequencies){
        console.log("freq: " + JSON.stringify(frequencies));
        let tree = this.makeHuffmanTree(frequencies);
        this.encoding = {};
        this.generateEncoding(tree, "");

        text = this.toBitString(text);
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

    toBitString(text){
        let out = "";
        for(let char of text){
            let bits = char.charCodeAt(0).toString(2);
            out += _.padStart(bits, 8, "0");
        }

        return out;
    }

    fromBitString(bit_string){
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