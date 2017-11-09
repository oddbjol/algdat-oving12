class CircularBuffer{

    constructor(length){
        this.length = length;
        this.pointer = 0;
        this.buffer = [];
    }

    get window(){
        return this.buffer.slice(this.pointer).join("") + this.buffer.slice(0,this.pointer).join("");
    }

    write(val){
        this.buffer[this.pointer] = val;
        this.pointer = (this.pointer +1) % this.length;

    }
}

module.exports = CircularBuffer;