const Accounts = require('web3-eth-accounts'),
	Tx = require('ethereumjs-tx'),
	rp = require('request-promise'),
	Web3 = require('web3'),
	safeMath = require('./safeMath.js'),
	nt = require('./nt.js'),
	Objects = require('./objects.js');


var accounts = new Accounts('ws://localhost:8546');

if (typeof web3 !== 'undefined') {
	web3 = new Web3(web3.currentProvider);
} else {
	// set the provider you want from Web3.providers
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

// Создаём контракт
const CONTRACT = new web3.eth.Contract(Objects.CONTRACT_ABI_ARRAY, Objects.CONTRACT_ADDRESS, {
	gasPrice: '12345678',
	from: "0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433"
});


const apiKeyToken = 'KF2VV1A88HNTQMKFBD3VYBD59SVKR5Z1QA';
const Network = 'api-rinkeby'

// Голосуем
function voteForProposal(_prvtKey, _proposalID, vote, callback) {
	var account = web3.eth.accounts.wallet.add(_prvtKey);
	CONTRACT.methods.voteForProposal(Number(_proposalID), vote).send({
			from: account.address,
			gas: "1234422"
		})
		.on('transactionHash', function(hash){
			console.log('Хэш транзакции');
			console.log(hash)
			callback('https://rinkeby.etherscan.io/tx/'+hash)
		})
		.on('error', (err) => {
			console.log(err)
			callback('false')
		});
}

// Получаем результаты голосования
function getResults(_voteNum, callback) {
	var account = web3.eth.accounts.wallet.add(_prvtKey);
	CONTRACT.methods.showFinalResultofProposal(Number(_voteNum)).send({
			from: account.address,
			gas: "1234422"
		})
		.on('transactionHash', function(hash){
			console.log('Хэш транзакции');
			callback('https://rinkeby.etherscan.io/tx/'+hash)
		})
		.on('error', (err) => {
			console.log(err)
			callback('false')
		});
}

// Добавляем голосование
function addVote(description, sum, callback) {
	var account = web3.eth.accounts.wallet.add("0x61d94d1c3335c6c30c1336da9e4d54a586f1ffa882338a8bb9f8268296434bc9");
	// последний параметр - время окончания
	CONTRACT.methods.makeProposal(description, Number(sum), "0x6D377De54Bde59c6a4B0fa15Cb2EFB84BB32D433", 0).send({
			from: account.address,
			gas: "1234422"
		})
		.on('transactionHash', function(hash){
			console.log('Хэш транзакции');
			console.log(hash)
			callback('https://rinkeby.etherscan.io/tx/'+hash)
		})
		.on('error', (err) => {
			callback('false')
		});
}

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
								callback(true);
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
module.exports.voteForProposal = voteForProposal;
module.exports.addVote = addVote;