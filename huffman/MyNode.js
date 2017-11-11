class MyNode{
    constructor(key, value){
        this.key = key;
        this.value = value;

        this.left = null;
        this.right = null;
    }

    /**
     *     Return a number if the number is stored in both key and val.
     *     Return the character if there's a difference.
     *     This is because some of the numbers stored in key are charcodes, some are just numbers.
     *
     *     This is used to print the huffman tree later on.
     *
     *     @returns String
     */

    get keyChar(){
        let out;

        if(this.key == this.value)
            out = this.key;
        else
            out = String.fromCharCode(this.key);

        return out;
    }

    isLeafNode(){
        return (!this.left && !this.right);
    }
}

module.exports = MyNode;