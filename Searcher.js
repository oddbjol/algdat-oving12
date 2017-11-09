class Searcher{
    constructor(text){
        this.text = text;
    }

    simpleSearch(query){
        let out = [];
        loop: for(let i = 0; i < this.text.length - query.length + 1; i++){
            for(let j = 0; j < query.length; j++){
                if(this.text[i+j] != query[j])
                    continue loop;
            }
            out.push(i);
        }
        return out;
    }

    //TODO: Finish
    kpmMatch(query){
        let lps = [];
        let matches = [];

        for(let i = 0; i < query.length; i++){
            let substring = query.slice(0,i+1);

            lps[i] = 0;

            for(let j = 0; j < substring.length - 1; j++){
                let left = substring.slice(0,j+1);
                let right = substring.slice(substring.length - 1 - j, substring.length+1);

                if(left == right)
                    lps[i] = j+1;
            }
        }

        console.log("lps: " + lps);

        let j = 0;
        for(let i = 0; i < this.text.length; i++){
            if(j >= query.length){
                console.log("i: " + i + "   j: " + j + "   match");
                matches.push(i-j);
                j = lps[j-1];
            }
            if(this.text[i] == query[j]){
                console.log("i: " + i + "   j: " + j + "   partial match");
                j++;
            }
            else {
                console.log("i: " + i + "   j: " + j + "   mismatch");
                if(j != 0)
                    j = lps[j-1];
            }
        }

        return matches;

    }

    boyerMooreBadCharSearch(query){

        let badChar = [];

        for(let j = 'a'.charCodeAt(0); j < 'z'.charCodeAt(0); j++)
            badChar[String.fromCharCode(j)] = -1;

        for(let j = 'A'.charCodeAt(0); j <
        'Z'.charCodeAt(0); j++)
            badChar[String.fromCharCode(j)] = -1;

        for(let j = 0; j < query.length; j++)
            badChar[query[j]] = j;


        let s = 0;

        while(s <= (this.text.length-query.length)){

            let j = query.length-1;

            while(j >= 0 && this.text[s+j] == query[j])
                j--;

            // match
            if(j < 0){
                let move = (s+query.length < this.text.length)? query.length-badChar[this.text[s+query.length]] : 1;
                console.log("Match at " + (s) + ". shifting pattern by " + move);
                s += move;
            }
            else{ // mismatch
                let move = Math.max(j - badChar[this.text[s+j]], 1);
                //console.log("Mismatch at " + (s) + ". shifting pattern by " + move);
                s += move;
            }
        }

    }

}

module.exports = Searcher;