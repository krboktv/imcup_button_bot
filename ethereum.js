const Accounts = require('web3-eth-accounts'),
	Tx = require('ethereumjs-tx'),
	rp = require('request-promise'),
	Web3 = require('web3'),
	safeMath = require('./safeMath.js');

// if (typeof web3 !== 'undefined') {
// 	web3 = new Web3(web3.currentProvider);
// } else {
// 	// set the provider you want from Web3.providers
// 	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
// }

// var contractABI = [{"constant":false,"inputs":[],"name":"finalress","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"showTotal","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"res","type":"int256"}],"name":"vote","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"showVotres","outputs":[{"name":"","type":"int256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"investPart","outputs":[{"name":"","type":"uint256"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"showFinalRes","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"showAdd","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}]

// var ContractAddress = "0x6C1773936cbae3c0b7814E118b10b84A272a3Bd4";

// var contract1 = new web3.eth.Contract(contractABI, ContractAddress, {gasPrice: '12345678', from: "0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433"});

// contract1.methods.vote().call({res: 1},(err, addr) => {
// 	console.log(addr)
// })

// contract1.methods.showVotres().call({from: "0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433"},function(error, result){
//     console.log(result)
// });



var accounts = new Accounts('ws://localhost:8546');

const apiKeyToken = 'KF2VV1A88HNTQMKFBD3VYBD59SVKR5Z1QA';
const Network = 'api-rinkeby'

function createNewAccount() {
	let randomPrvtKey = accounts.create().privateKey;
	return randomPrvtKey.toString();
}

function getBalance(address, callback) {
	rp('https://' + Network + '.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey=' + apiKeyToken, {
			json: true
		})
		.then((balance) => {
			callback(safeMath.weiToCurrency(balance.result));
		})
}

function getAddress(privateKey) {
	let account = accounts.privateKeyToAccount(privateKey);
	return account.address;
}

function sendTx(_prvtKey, _sender, _receiver, _amount, callback) {
	let privateKey = new Buffer(_prvtKey.substring(2), 'hex');

	var tx = new Tx();

	// Узнаём цену газа
	rp('https://' + Network + '.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=' + apiKeyToken, {
			json: true
		})
		.then(
			(res) => {
				rp('https://' + Network + '.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=' + _sender + '&tag=latest&apikey=' + apiKeyToken, {
						json: true
					})
					.then((txCount) => {
						console.log(txCount)
						tx.nonce = Number(txCount.result);
						tx.gasPrice = Number(res.result);
						tx.gasLimit = 400000;
						tx.value = Number(_amount);
						tx.from = String(_sender);
						tx.to = String(_receiver);

						tx.sign(privateKey);

						const serializedTx = tx.serialize();

						var options = {
							uri: 'https://' + Network + '.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0x' + serializedTx.toString('hex') + '&apikey=' + apiKeyToken,
							json: true
						}
						rp(options)
							.then((tx) => {

								if (tx.error) {
									console.log('Транзакция не произведена');
									console.log(tx);
									callback(false);
								} else {
									console.log(tx);
									callback(true);
								}
							})
							.catch((err) => {
								console.log('Транзакция не произведена')
								allback(true);
							});
					});
			}
		)
}

// sendTx('0x61d94d1c3335c6c30c1336da9e4d54a586f1ffa882338a8bb9f8268296434bc9','0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433','0xeeD5460d1d286c406F2ADbC3CaF53ED45f898988', 20000000000000000)

module.exports.createNewAccount = createNewAccount;
module.exports.getBalance = getBalance;
module.exports.getAddress = getAddress;
module.exports.sendTx = sendTx;