/**
 * By Mateo @ https://articles.leetcode.com/how-to-pretty-print-binary-tree/
 * @type {MyNode}
 */

let MyNode = require("./MyNode");
// Find the maximum height of the binary tree
function maxHeight(p) {
    if (!p) return 0;
    var leftHeight = maxHeight(p.left);
    var rightHeight = maxHeight(p.right);
    return (leftHeight > rightHeight) ? leftHeight + 1: rightHeight + 1;
}

var fillChar = " ";
function setw(length) {
    var spaces = "";

    for (var i = 0; i < length; i++)
        spaces += fillChar;

    return spaces;
}

function setfill(aChar) {
    fillChar = aChar;
    return "";
}

// Print the arm branches (eg, /    \ ) on a line
function printBranches(branchLen, nodeSpaceLen, startLen, nodesInThisLevel, nodesQueue) {
    var cont = 0;

    for (var i = 0; i < parseInt(nodesInThisLevel / 2); i++) {
        out += ((i == 0) ? setw(startLen-1) : setw(nodeSpaceLen-2)) + "" + ((nodesQueue[cont++]) ? "/" : " ");
        out += setw(2*branchLen+2) + "" + ((nodesQueue[cont++]) ? "\\" : " ");
    }

    out += (parseInt(nodesInThisLevel / 2) == 0) ? "\n" : "\n";
}

// Print the branches and node (eg, ___10___ )
function printNodes(branchLen, nodeSpaceLen, startLen, nodesInThisLevel, nodesQueue) {
    var cont = 0;

    for (var i = 0; i < nodesInThisLevel; i++, cont++) {
        out += ((i == 0) ? setw(startLen) : setw(nodeSpaceLen)) + "" + ((nodesQueue[cont] && nodesQueue[cont].left) ? setfill('_') : setfill(" "));
        out += setw(branchLen) + ((nodesQueue[cont]) ? nodesQueue[cont].keyChar : "");
        out += ((nodesQueue[cont] && nodesQueue[cont].right) ? setfill('_') : setfill(" ")) + setw(branchLen) + "" + setfill(" ");
    }

    out += "\n";
}

// Print the leaves only (just for the bottom row)
function printLeaves(indentSpace, level, nodesInThisLevel, nodesQueue) {
    var cont = 0;

    for (var i = 0; i < nodesInThisLevel; i++, cont++) {
        out += ((i == 0) ? setw(indentSpace) : setw(2*level+1)) + ((nodesQueue[cont]) ? nodesQueue[cont].keyChar : "");
    }
}

// Pretty formatting of a binary tree to the output stream
// @ param
// level  Control how wide you want the tree to sparse (eg, level 1 has the minimum space between nodes, while level 2 has a larger space between nodes)
// indentSpace  Change this to add some indent space to the left (eg, indentSpace of 0 means the lowest level of the left node will stick to the left margin)
function printPretty(root, level, indentSpace) {
    var h = maxHeight(root);
    var nodesInThisLevel = 1;

    var branchLen = 2*(parseInt(Math.pow(2.0,h))-1) - (3-level)*parseInt(Math.pow(2.0,h-1));  // eq of the length of branch for each node of each level
    var nodeSpaceLen = 2 + (level+1)*parseInt(Math.pow(2.0,h));  // distance between left neighbor node's right arm and right neighbor node's left arm
    var startLen = branchLen + (3-level) + indentSpace;  // starting space to the first node to print of each level (for the left most node of each level only)

    nodesQueue = [];
    nodesQueue.push(root);
    for (var r = 1; r < h; r++) {
        printBranches(branchLen, nodeSpaceLen, startLen, nodesInThisLevel, nodesQueue);
        branchLen = branchLen/2 - 1;
        nodeSpaceLen = nodeSpaceLen/2 + 1;
        startLen = branchLen + (3-level) + indentSpace;
        printNodes(branchLen, nodeSpaceLen, startLen, nodesInThisLevel, nodesQueue);

        for (var i = 0; i < nodesInThisLevel; i++) {
            var currNode = nodesQueue.shift();

            if (currNode) {
                nodesQueue.push(currNode.left);
                nodesQueue.push(currNode.right);
            } else {
                nodesQueue.push(null);
                nodesQueue.push(null);
            }
        }
        nodesInThisLevel *= 2;
    }

    printBranches(branchLen, nodeSpaceLen, startLen, nodesInThisLevel, nodesQueue);
    printLeaves(indentSpace, level, nodesInThisLevel, nodesQueue);
}

var out = "";
function drawATree(root) {
    printPretty(root, 1, 0);
    console.log(out);
}
module.exports = drawATree;