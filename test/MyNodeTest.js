let assert = require("assert");
let MyNode = require("../huffman/MyNode");

describe('MyNode', function() {
    "use strict";

    it("Node children",function(){
        let nodeL = new MyNode(1, "test");
        let nodeR = new MyNode(2, "test2");
        let parent = new MyNode(3, "parent");

        parent.left = nodeL;
        parent.right = nodeR;

        assert.equal(parent.left, nodeL);
        assert.equal(parent.right, nodeR);
    });

    it("isLeafNode",function(){
        let leafNode = new MyNode(1,1);
        let parentNode1 = new MyNode(1,1);
            parentNode1.left = new MyNode(1,1);
        let parentNode2 = new MyNode(1,1);
            parentNode2.right = new MyNode(1,1);
        let parentNode3 = new MyNode(1,1);
            parentNode3.left  = new MyNode(1,1);
            parentNode3.right = new MyNode(1,1);

        assert(leafNode.isLeafNode());
        assert(!parentNode1.isLeafNode());
        assert(!parentNode2.isLeafNode());
        assert(!parentNode3.isLeafNode());
    });
});