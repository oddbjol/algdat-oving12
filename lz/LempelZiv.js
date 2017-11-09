let CircularBuffer = require("./CircularBuffer");

class LempelZiv{
    constructor(){
    }

    compress(text, buffer_size){
        let buffer = new CircularBuffer(buffer_size);
        let out = "";

        let match = "", match_pos = -1;
        let nonmatch = "";

        for(let char of text){
            buffer.write(char);

            if(match){
                console.log("match+char is " + match+char);
                console.log("buffer is " + buffer.window);
                console.log("sliced buffer is " + buffer.window.slice(0, -match.length-1));

                match_pos = buffer.window.slice(0, -match.length-1).lastIndexOf(match+char);
                if(match_pos != -1){
                    match += char;
                    console.log("match on " + match + " at " + match_pos);
                }

                else{
                    nonmatch += char;
                    out += "[MATCH]" + match;
                    match = "";
                }
                console.log("\n\n");
            }
            else if(nonmatch){
                match_pos = buffer.window.slice(0, -1).lastIndexOf(char);
                if(match_pos != -1){
                    console.log("simple match on " + char + " at " + match_pos);
                    console.log("\n\n");
                    match += char;
                    out += "[MIS]" + nonmatch;
                    nonmatch = "";
                }
                else{
                    nonmatch += char;
                }
            }
            else{
                match_pos = buffer.window.slice(0,-1).lastIndexOf(char);
                if(match_pos != -1)
                    match += char;
                else
                    nonmatch += char;
            }
        }
        if(match)
            out += "[MATCH]" + match;
        if(nonmatch)
            out += "[MIS]" + nonmatch;
        return out;
    }

    decompress(text){

    }
}

module.exports = LempelZiv;