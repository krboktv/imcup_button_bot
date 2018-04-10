const bitcore = require('./node_modules/bitcore-explorers/node_modules/bitcore-lib/index.js'),
    bitcoinjs = require('bitcoinjs-lib'),
    Insight = require('bitcore-explorers').Insight,
    safeMath = require('./safeMath.js'),
    wif = require('wif'),
    rp = require('request-promise');

var PrivateKey = bitcore.PrivateKey;
var Networks = bitcore.Networks.mainnet;
// var Networks = bitcore.Networks.testnet;
var Transaction = bitcore.Transaction;
var Script = bitcore.Script;
var network = bitcoinjs.networks.bitcoin;
// var network = bitcoinjs.networks.testnet;

// Для тестнета
function anyWIFtoTestnetWIF(aWIF) {
    let obj = wif.decode(aWIF)
    return wif.encode(network.wif, obj.privateKey, obj.compressed)
}

function createNewAccount() {
    var randomPrvtKey = new PrivateKey(Networks);
    return randomPrvtKey.toString();
}

function getAddress(privateKey) {
    var prvtKey = new PrivateKey(privateKey, Networks);
    return prvtKey.toAddress().toString();
}

function getBalance(address, callback) {
    var insight = new Insight(Networks);
    insight.address(address, (err, addr) => {
        callback(addr.balance);
    });
}

function sendTx(_prvtKey, _sender, _receiver, _amount, callback) {
    var privateKey = new bitcore.PrivateKey(_prvtKey, Networks);
    var unspentTx = [];
    var unspentTxAmount = 0;
    var minerFee = safeMath.currencyToSatoshi(0.001);

    var insight = new Insight(Networks);
    // Получаем utxo
    insight.getUnspentUtxos(_sender, (err, utxos) => {
        if (utxos.length != 0) {
            utxos = JSON.parse(JSON.stringify(utxos));
            for (let i in utxos) {
                if (unspentTxAmount < (safeMath.currencyToSatoshi(_amount) + minerFee)) {
                    let txObj = {
                        "address": utxos[i].address,
                        "txId": utxos[i].txid,
                        "outputIndex": utxos[i].vout,
                        "script": utxos[i].scriptPubKey,
                        // "script": Script.buildPublicKeyHashOut(utxos[i].address).toString(),
                        "satoshis": safeMath.currencyToSatoshi(utxos[i].amount)
                    }
                    unspentTx.push(txObj);
                    unspentTxAmount += safeMath.currencyToSatoshi(utxos[i].amount);
                } else {
                    break;
                }
            }
            console.log(unspentTx)

            // Добавляем секретный ключ
            var privateKey = new Buffer(_prvtKey, 'hex')
            // Кодируем его в WiF
            var pvtWif = wif.encode(128, privateKey, true);

            var account = bitcoinjs.ECPair.fromWIF(anyWIFtoTestnetWIF(pvtWif), network); // Функция внутри для тестнета

            var txb = new bitcoinjs.TransactionBuilder(network);

            for (let i in unspentTx) {
                txb.addInput(unspentTx[i].txId, unspentTx[i].outputIndex);
            }

            // Посылаем деньги
            txb.addOutput(_receiver, safeMath.currencyToSatoshi(_amount));
            // Остаток возвращаем себе - остальное майнеру
            txb.addOutput(_sender, (Number(unspentTxAmount) - safeMath.currencyToSatoshi(_amount) - Number(minerFee)));

            // Подписываем все входы транзакции
            for (let i in unspentTx) {
                txb.sign(Number(i), account)
            }

            insight.broadcast(txb.build().toHex(), (err, returnedTxId) => {
                callback(err, returnedTxId);
            });
        } else {
            callback(true, null);
        }
    })
}

// sendTx('4007c24bb51fc19e9e34739b67a70332a4f46bcbbb56bdb31b6ba25ec5b1fe05', 'mxTrQvUC5VvvWChSVBVuWCDKqsv36wftnG', 'mm2m5aMLJBPicW97dLD9ZJWUbvFNfQcSgU', 0.015)
// Для тестов
// 4007c24bb51fc19e9e34739b67a70332a4f46bcbbb56bdb31b6ba25ec5b1fe05
// mxTrQvUC5VvvWChSVBVuWCDKqsv36wftnG

// Для тестов
// 19fa12c1c792bcad72b250993b2941f14a8c794389773233ac3141d2da264b3b
// mm2m5aMLJBPicW97dLD9ZJWUbvFNfQcSgU
module.exports.createNewAccount = createNewAccount;
module.exports.getAddress = getAddress;
module.exports.getBalance = getBalance;
module.exports.sendTx = sendTx;