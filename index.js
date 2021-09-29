const Web3 = require('web3');
const rlp = require('rlp');
const keccak = require('keccak');
const contractData = require('./contractData.json');

const web3 = new Web3('ws://127.0.0.1:8546');
var proposalNames = ["0x63616e6469646174653100000000000000000000000000000000000000000000","0x6332000000000000000000000000000000000000000000000000000000000000","0x6333000000000000000000000000000000000000000000000000000000000000"];
var ballotContract = new web3.eth.Contract(contractData.abi);

// Resolves contract address using transaction.from and transaction.nonce
function computeContractAddress(from, nonce) {
    // https://ethereum.stackexchange.com/a/46960
    const inputArray = [from, nonce];
    const rlpEncoded = rlp.encode(inputArray);

    const contractAddressLong = keccak('keccak256').update(rlpEncoded).digest('hex').substring(24);
    return web3.utils.toChecksumAddress(`0x${contractAddressLong}`)
}

(async () => {
    const accounts = await web3.eth.getAccounts();
    const unlockedAccount = accounts[0];

    web3.eth.subscribe('pendingTransactions', (err, transactionHash) => {
        if (err !== null) console.error(err);

        if (transactionHash !== null) {
            web3.eth.getTransaction(transactionHash).then(transaction => {
                // Check if transaction is contract deployment
                if (transaction.to === null && transaction.input !== null) {
                    console.log(`Pending contract deployment`);
                    console.log(`From: ${transaction.from}`);
                    console.log(`Contract address: ${computeContractAddress(transaction.from, transaction.nonce)}`);
                    console.log('.............................................................');
                }
            })
        }
    });

    web3.eth.subscribe('newBlockHeaders', (err, newBlockheader) => {
        if (err !== null) console.error(err);

        if (newBlockheader !== null) {
            web3.eth.getBlock(newBlockheader.hash, true).then(block => {
                for (const transaction of block.transactions) {
                    // Check if transaction is contract deployment
                    if (transaction.to === null && transaction.input !== null) {

                        // Makes a network call to get contract address
                        // web3.eth.getTransactionReceipt(transaction.hash).then(receipt => {
                        //     console.log(`Mined contract deployment`);
                        //     console.log(`From: ${transaction.from}`);
                        //     console.log(`Contract address: ${receipt.contractAddress}`);
                        //     console.log(`Transaction hash: ${transaction.hash}`);
                        //     console.log('.............................................................');    
                        // })
                        
                        // Computes contract address from transaction
                        console.log(`Mined contract deployment`);
                        console.log(`Block: ${block.number}`);
                        console.log(`From: ${transaction.from}`);
                        console.log(`Contract address: ${computeContractAddress(transaction.from, transaction.nonce)}`);
                        console.log(`Transaction hash: ${transaction.hash}`);
                        console.log('.............................................................');    
                    }
                }
            });
        }
    });

    await ballotContract.deploy({
        data: contractData.bytecode,
        arguments: [proposalNames]
    }).send({
        from: unlockedAccount, 
        gas: '4700000'
    });

    setInterval(() => {
        ballotContract.deploy({
            data: contractData.bytecode,
            arguments: [proposalNames]
       }).send({
            from: unlockedAccount, 
            gas: '4700000'
        });
    }, 3500)
})()