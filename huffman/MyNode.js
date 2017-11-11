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

    toString(depth = 0){
        let string = "";
        for(let i = 0; i < depth; i++)
            string += "    ";

        string += "key: " + this.key + " val: " + this.value + "\n";

        if(this.left)
            string += this.left.toString(depth + 1);
        if(this.right)
            string += this.right.toString(depth + 1);

        return string;
    }
}

module.exports = MyNode;