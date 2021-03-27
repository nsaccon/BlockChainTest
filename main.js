const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        var hash = SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
        return hash;
    }

    mineBlock(diff){
        while(this.hash.substring(0, diff) != Array(diff +1).join("0")){
            console.log("First: "+this.hash.substring(0, diff) + "    Second: "+Array(diff +1).join("0")+ "      Nonce: "+this.nonce);
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("CORRECT: First: "+this.hash.substring(0, diff) + "    Second: "+Array(diff +1).join("0"));
        console.log("Block mined: " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.diff = 4;
    }

    createGenesisBlock(){
        return new Block(0, Date.now().toString(), "Genesis Block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.diff);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

let newChain = new BlockChain();
console.log("Mining Block 1...");
newChain.addBlock(new Block(1, Date.now().toString(), { amount: 6 }));
console.log("Mining Block 2...");
newChain.addBlock(new Block(2, Date.now().toString(), { amount: 14 }));
console.log("Mining Block 3...");
newChain.addBlock(new Block(3, Date.now().toString(), { amount: 38 }));
