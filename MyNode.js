class MyNode{
    constructor(key,value){
        this.key = key;
        this.value = value;

        this.left = null;
        this.right = null;
    }

    isLeafNode(){
        return (!this.left && !this.right);
    }
}

module.exports = MyNode;