const {BlockChain, Transaction} = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate("4e40c3fc003378153e28977c81fea55fa51dda851e4d74787ad411ea28ea23e3");
const myWalletAddress = myKey.getPublic('hex');



let newChain = new BlockChain();

newChain.minePendingTransactions(myWalletAddress);

const tx1 = new Transaction(myWalletAddress, "public key here", 10);
tx1.signTransaction(myKey);
newChain.addTransaction(tx1);


console.log("\nStarting Miner...");
newChain.minePendingTransactions(myWalletAddress);

console.log("Balance of my account: " + newChain.getBalanceOfAddress(myWalletAddress));

console.log("Is Chain valid?: " + newChain.isChainValid());