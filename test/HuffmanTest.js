let assert = require("assert");
let Huffman = require("../huffman/Huffman");

describe('Huffman', function(){
    "use strict";

    it('getFrequencies(text)',function() {
        let frequencies = Huffman.getFrequencies("test");

        assert.equal(frequencies['t'.charCodeAt(0)],2, "there should be two t's");
        assert.equal(frequencies['e'.charCodeAt(0)],1, "there should be one e");
        assert.equal(frequencies['s'.charCodeAt(0)],1, "there should be one s");
    });

    it('makeHuffmanTree(frequencies)',function(){
        let freq = {t: 4, e: 2, s: 1}; // tteestt
        let tree = Huffman.makeHuffmanTree(freq);
        /*
               Expecting this huffman tree (T is terminator):
                            7
                           / \
                          3   t
                         / \
                        1   e
                       / \
                      T   s
         */
        assert.equal(tree.value,7);
            assert.equal(tree.right.key, 't');
            assert.equal(tree.left.key,3);
                assert.equal(tree.left.right.key, 'e');
                assert.equal(tree.left.left.key,1);
                    assert.equal(tree.left.left.left.key,'terminator');
                    assert.equal(tree.left.left.right.key, 's');
    });

    it("toBitString(string)",function(){
        let result = Huffman.toBitString('aab');
        assert.equal(result,"011000010110000101100010");
    });

    it("fromBitString(string)",function(){
        let result = Huffman.fromBitString('011000010110000101100010');
        assert.equal(result,"aab");
    });

    it("huffmanCode(text)",function(){
        let compressed = {frequencies:{"t":2,"e":1,"s":1},data:'y'};
        let result = new Huffman().huffmanCode("test");
        assert.equal(result.data, compressed.data);
    });

    it("huffmanDecode(text,frequencies)",function(){
        let frequencies = {};
        frequencies['t'.charCodeAt(0)] = 2;
        frequencies['e'.charCodeAt(0)] = 1;
        frequencies['s'.charCodeAt(0)] = 1;

        let compressed = {frequencies: frequencies, data: 'y'};
        let result = new Huffman().huffmanDecode(compressed.data, compressed.frequencies);
        assert.equal(result,"test");
    });

    it("compress and decompress with same result",function(){
        let huffman = new Huffman();
        let compressed = huffman.huffmanCode("test");
        let decompressed = huffman.huffmanDecode(compressed.data, compressed.frequencies);
        assert.equal(decompressed,"test");
    });
});