require("google-closure-library");
goog.require('goog.structs.PriorityQueue');
let _ = require("lodash");
let MyNode = require("./MyNode");

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
     * @returns {{}} A map of letter frequencies.
     */
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

    /**
     * Builds a huffman tree based on the frequencies of characters.
     *
     * For example, given the following frequencies:
     *
     * {
     *  a: 2,
     *  b: 5,
     *  c: 4,
     *  d: 1
     * }
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
    makeHuffmanTree(frequencies){
        let queue = new goog.structs.PriorityQueue();
        for(let char in frequencies){
            let node = new MyNode(char, frequencies[char]);
            queue.enqueue(frequencies[char], node);
        }
        // The virtual terminator symbol needs to be a part of the huffman tree.
        // Assign frequency of 1 to terminator, this way it won't waste "good" spots in the tree.
        queue.enqueue(0, new MyNode("terminator", 1));

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

    /**
     *
     * @param text Text to be huffman encoded
     * @returns {string} The encoded text
     */
    huffmanCode(text){
        let frequencies = Huffman.getFrequencies(text);
        let tree = this.makeHuffmanTree(frequencies);

        this.encoding = {};

        this.generateEncoding(tree, "");

        console.log("frequencies: " + JSON.stringify(frequencies));
        console.log("encoding: " + JSON.stringify(this.encoding));

        let out = "";

        for(let char of text){
            out += this.encoding[char];
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
        let tree = this.makeHuffmanTree(frequencies);
        this.encoding = {};
        this.generateEncoding(tree, "");

        console.log("frequencies: " + JSON.stringify(frequencies));
        console.log("encoding: " + JSON.stringify(this.encoding));


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
            decoded += reverse_encoding[key];
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
     * The following encoding will be returned:
     *
     * {
     *  c: '00',
     *  g: '01',
     *  d: '100',
     *  c: '101',
     *  f: '11'
     * }
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