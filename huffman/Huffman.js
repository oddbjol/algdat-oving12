require("google-closure-library");
goog.require('goog.structs.PriorityQueue');
let _ = require("lodash");
let MyNode = require("./MyNode");
let PrintTree = require("./PrintTree");
let properties = require('../properties.js');

class Huffman{

    constructor(){
        this.encoding = {};
    }

    /**
     * Builds up a map of frequencies for each letter in the text.
     *
     * For example, for the given text "abbcccddddeeeee", the following map will be produced:
     *
     * {
     *      a: 1,
     *      b: 2,
     *      c: 3,
     *      d: 4,
     *      e: 5
     * }
     *
     * @param An ascii string.
     * @returns [] A map of letter frequencies.
     */
    static getFrequencies(text){
            let frequencies = [];

            for(let i = 0; i < 256; i++)
                frequencies[i] = 0;

            for(let char of text){
                frequencies[char.charCodeAt(0)]++;
            }

            return frequencies;
    }

    /**
     * Builds a huffman tree based on the frequencies of characters.
     *
     * For example, given the following frequencies:
     *
     * [
     *  ...,
     *  ascii code of a: 2,
     *  ascii code of b: 5,
     *  ascii code of c: 4,
     *  ascii code of d: 1,
     *  ...
     * ]
     *
     * , the following tree might be produced:
     *
     *              *
     *             / \
     *            b   *
     *               / \
     *              c   *
     *                 / \
     *                a   d
     *
     *
     * @param frequencies An object with syntax: {a: 2, b: 3} etc
     * @returns {MyNode} Root node of the huffman tree.
     */
    static makeHuffmanTree(frequencies){
        let queue = new goog.structs.PriorityQueue();
        for(let charCode in frequencies){
            if(frequencies[charCode] > 0){
                let node = new MyNode(charCode, frequencies[charCode]);
                queue.enqueue(frequencies[charCode], node);
            }

        }
        // The virtual terminator symbol needs to be a part of the huffman tree.
        // Assign frequency of 1 to terminator, this way it won't waste "good" spots in the tree.
        queue.enqueue(0, new MyNode("terminator", 0));

        while(queue.getCount() > 1){
            let left = queue.dequeue();
            let right = queue.dequeue();

            let sum_frequency = left.value + right.value;

            let parent = new MyNode(sum_frequency,sum_frequency);

            parent.left = left;
            parent.right = right;

            queue.enqueue(sum_frequency, parent);
        }

        if(properties.debug){
            console.log("Here's the Huffman tree:");
            PrintTree(queue.peek());
        }

        return queue.dequeue(); // root of huffman tree
    }

    /**
     *
     * @param text Text to be huffman encoded
     * @returns {string} The encoded text
     */
    huffmanCode(text){
        let frequencies = Huffman.getFrequencies(text);
        let tree = Huffman.makeHuffmanTree(frequencies);

        this.encoding = {};

        this.generateEncoding(tree, "");

        if(properties.debug){
            console.log("frequencies: " + JSON.stringify(frequencies));
            console.log("encoding: " + JSON.stringify(this.encoding));
        }

        let out = "";

        for(let char of text){
            out += this.encoding[char.charCodeAt(0)];
        }
        out += this.encoding["terminator"]; // Add the terminating bit pattern at end.

        out = Huffman.fromBitString(out);
        return {frequencies: frequencies, data: out};
    }

    /**
     *
     * @param text Text to be huffman decoded
     * @param frequencies frequency of each character that was in the plaintext. Ex: {a: 2, f: 3}
     * @returns {string} The decoded text
     */
    huffmanDecode(text, frequencies){
        let tree = Huffman.makeHuffmanTree(frequencies);
        this.encoding = {};
        this.generateEncoding(tree, "");

        if(properties.debug){
            console.log("frequencies: " + JSON.stringify(frequencies));
            console.log("encoding: " + JSON.stringify(this.encoding));
        }

        text = Huffman.toBitString(text);
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
            // If the bit pattern matches the terminator, we are done.
            if(reverse_encoding[key] == "terminator")
                break;
            decoded += String.fromCharCode(reverse_encoding[key]);
        }
        return decoded;
    }

    /**
     * Builds up a table of encodings from a huffman tree.
     * Each character in the tree gets an entry in the encoding table with a corresponding bit pattern.
     *
     * For, example, if the following tree is input:
     *
     *                  *
     *             *         *
     *           c   g     *    f
     *                   d   c
     *
     * The following encoding array will be returned:
     *
     * [0,
     * 0,
     * ...,
     *  ascii code of c: '00',
     *  ascii code of g: '01',
     *  ascii code of d: '100',
     *  ascii code of c: '101',
     *  ascii code of f: '11',
     *  0,
     *  0,
     *  ...
     * ]
     *
     * The values of characters that weren't used will be 0.
     * The frequency of a is stored in index 97, as that is the ascii code of 'a'.
     *
     * @param node root node of huffman tree, or current node in recursive call
     * @param bit_string Only for internal use. Used for calculating bit strings through recursion.
     */
    generateEncoding(node, bit_string = ""){

        if(node.isLeafNode())
            this.encoding[node.key] = bit_string;

        if(node.left)
            this.generateEncoding(node.left, bit_string + "0");

        if(node.right)
            this.generateEncoding(node.right, bit_string + "1");
    }

    /**
     * Turns ascii string into bit pattern.
     *
     * Example: "aa" is turned into "0110000101100001"
     *
     * @param text ASCII text to be transformed
     * @returns {string} A string containing 0's and 1's.
     */
    static toBitString(text){
        let out = "";
        for(let char of text){
            let bits = char.charCodeAt(0).toString(2);
            out += _.padStart(bits, 8, "0");
        }
        return out;
    }

    /**
     * Turns bit pattern into string.
     *
     * Example: "0110000101100001" is turned into "aa".
     *
     * If there are not enough bits at the end for a whole character, the string is padded with enough zeros.
     *
     * Example: "010001" is first padded to "01000100" before being transformed to "D".
     *
     * @param text Bit pattern to be transformed into regular text
     * @returns {string} An ASCII string.
     */
    static fromBitString(bit_string){
        let out = "";
        for(let i = 0; i < bit_string.length; i+= 8){
            let substring = bit_string.slice(i,i+8);
            // If there are trailing bits at the end of the bit string,
            // pad in zeroes so we have a whole byte at the end.
            substring = _.padEnd(substring, 8, '0');
            out += String.fromCharCode(parseInt(substring.toString(2),2));
        }
        return out;
    }
}
module.exports = Huffman;