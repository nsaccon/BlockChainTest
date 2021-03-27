const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}



class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
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
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.diff = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(Date.now().toString(), "Genesis Block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.diff);
        console.log("Block successfully mined!");
        this.chain.push(block);
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const transaction of block.transactions){
                if(transaction.fromAddress == address){
                    balance -= transaction.amount;
                }
                if(transaction.toAddress == address){
                    balance += transaction.amount;
                }
            }
        }
        return balance;
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
newChain.createTransaction(new Transaction("a1", "a2", 280));
newChain.createTransaction(new Transaction("a2", "a1", 80));
newChain.createTransaction(new Transaction("a3", "a1", 20));

console.log("\nStarting Miner...");
newChain.minePendingTransactions("ns");

console.log("Balance of account a2: " + newChain.getBalanceOfAddress("a2"));
console.log("Balance of account ns: " + newChain.getBalanceOfAddress("ns"));

console.log("\nStarting Miner... Again");
newChain.minePendingTransactions("ns");
console.log("Balance of account ns: " + newChain.getBalanceOfAddress("ns"));