const Server = require("./server.js");
const WavesAPI = require('waves-api');
const Course = require('./course.js');
const builder = require('botbuilder');
const db = require('./db.js');
const nt = require('./nt.js');

const LuisModelUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d896d777-c71e-4daa-b4fa-c72eb4ab6e11?subscription-key=c387a1314b264fc7a6946958617eeb52&verbose=true&timezoneOffset=180&q=";

var recognizer = new builder.LuisRecognizer(LuisModelUrl);

const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
// Listen for messages from users 
const newConfig = {

    // The byte allowing to distinguish networks (mainnet, testnet, devnet, etc)
    networkByte: Waves.constants.MAINNET_BYTE,

    // Node and Matcher addresses, no comments here
    nodeAddress: 'https://nodes.wavesnodes.com',
    matcherAddress: 'https://nodes.wavesnodes.com/matcher',

    // If a seed phrase length falls below that value an error will be thrown
    minimumSeedLength: 50

};

Waves.config.set(newConfig);

module.exports.returnedWaves = Waves

module.exports.wavesAcc = (session, newAcc, user_id, encrSeed,bot) => {
    var seed;
    if (newAcc == 'decryptSeed') {
        const restoredPhrase = Waves.Seed.decryptSeedPhrase(encrSeed, user_id);
        seed = Waves.Seed.fromExistingPhrase(restoredPhrase);
        return seed;
    } else if(newAcc == 'createNewAcc') {
        seed = Waves.Seed.create();
        var encrypted = seed.encrypt(user_id);

        // // НА ВРЕМЯ ДЛЯ РАСПРЕДЕЛЕНИЯ ДЕНЕГ ПОЛЬЗОВАТЕЛЯМ НАЧАЛО
        // const transferData = { 
        // // An arbitrary address; mine, in this example
        // recipient: seed.address,
        // // ID of a token, or WAVES
        // assetId: 'WAVES',
        // // The real amount is the given number divided by 10^(precision of the token)
        // amount: 1200000,
        // // The same rules for these two fields
        // feeAssetId: 'WAVES',
        // fee: 100000,
        // // 140 bytes of data (it's allowed to use Uint8Array here) 
        // attachment: '',
        // timestamp: Date.now()
        // };
        // // var msg = 
        // // '➡️ <b>Вступай</b> в наш чат, где вместе мы делаем сервис лучше! https://t.me/joinchat/EmC2Qw8D4BbSVx7XiLW9jA';
        // // nt.sendNot(session,bot, session.message.user.id, '',msg);
        // var seed1 = Waves.Seed.fromExistingPhrase('cargo print junior august rocket upper broom south menu bamboo feel shy guilt syrup mesh');

        // Waves.API.Node.v1.assets.transfer(transferData, seed1.keyPair).then((responseData) => { 
        //     var msg = '💰 <b>BUTTON дарит 0.012 Waves</b> - символическое количество криптовалюты, чтобы оценить функционал нашего криптокошелька.\nНапример: <b>обменять</b> в меню <b>"💹 Криптобиржа"</b> <b>0.008 WAVES</b> в <b>Bitcoin</b>\n\n'+
        //     '<b>Продать</b> и <b>Купить</b> криптовалюту можно в меню'+
        //     '<b> "⚡️Быстрая покупка"</b>\n\n'+
        //     'Покупка и продажа осуществляется через <b>QIWI</b> и <b>Сбербанк</b>!'
        //     nt.sendNot(session, bot, session.message.user.id, '', msg);

        //     checkWavesBalance('3PA1n2NYDZQjisxFiojTxCaGjNbGfsXkFnG', (balance) => {
        //         if (balance <= 0.5) {
        //             nt.sendNot(session, bot, '308328003', '', 'Саша, осталось 0.5 WAVES на новых пользователей!');
        //         }
        //     })

        // })
        // .catch(
        //     (err) => {
        //         db.findUser(session.message.user.id) 
        //             .then(
        //                 (account) => {
        //                     db.badTransfer(session.message.user.id, session.message.user.name, account[0].address);
        //                 }
        //             );
        //         nt.sendNot(session, bot, '308328003', '', 'Саша, закончились деньги для новых пользователей!');
        //     }
        // );
        // // НА ВРЕМЯ ДЛЯ РАСПРЕДЕЛЕНИЯ ДЕНЕГ ПОЛЬЗОВАТЕЛЯМ КОНЕЦ
        return [encrypted,seed];
    } else if (newAcc == 'addNewAcc') {
        // Тут незашифрованный сид передаётся, если что 
        seed = Waves.Seed.fromExistingPhrase(encrSeed);
        var encrypted = seed.encrypt(user_id);
        return [encrypted,seed];
    }   
}

module.exports.transfer = function transfer(transferData,keyPair) {
    return new Promise((resolve, reject) => {
        Waves.API.Node.v1.assets.transfer(transferData, keyPair).then((responseData) => {
                console.log(responseData);
                resolve(responseData);
            }).catch(function(err){console.log(err);reject('Waves нода не работает');});
    });
}

function balances(session,address, assetID, callback) {
    var assetId;
    if (assetID == 'all') {
        assetId = 'WAVES';
    } else {
        assetId = assetID;
    }
    Waves.API.Node.v1.assets.balance(address, assetId).then((balance)  => { 
        if (assetID == 'all') {
            var balances = {
                'Waves': Number(balance.balance * Math.pow(10, -8)).toFixed(8),
                'Bitcoin': 0.00000000,
                'Ethereum': 0.00000000,
                'ZCash': 0.00000000,
                'Litecoin': 0.00000000,
                'US_Dollar': 0.00,
                'Euro': 0.00
            };

            Waves.API.Node.v1.assets.balances(address).then((balancesList)  => { 

                var assets = {
                    'Bitcoin':'8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS', // биток
                    'Ethereum':'474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu', // эфир
                    'ZCash':'BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa', // zcash
                    'Litecoin':'HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk', // лайт
                    'US_Dollar':'Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck', // бакс
                    'Euro':'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU' // евро
                }

                for (var i in assets) {
                    for (var j in balancesList.balances) {
                        if (balancesList.balances[j].assetId == assets[i]) {
                            var balance;
                            if (i != "US_Dollar" && i != 'Euro') {
                                session.userData.stepen = 8;
                                balance = Number(balancesList.balances[j].balance * Math.pow(10, -8)).toFixed(8);
                            } else {
                                session.userData.stepen = 2;
                                balance = Number(balancesList.balances[j].balance * Math.pow(10, -2)).toFixed(2);
                            }
                            balances[i] = balance;
                        }
                    }
                }
                callback(balances);
            });
        } else {
            var bal;
            if (assetID != "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck" &&  assetID != 'Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU') {
                bal = Number(balance.balance * Math.pow(10, -8)).toFixed(8);
                session.userData.stepen = 8;
            } else {
                bal = Number(balance.balance * Math.pow(10, -2)).toFixed(2);
                session.userData.stepen = 2;
            }
            callback(bal);
        }
    });
}

// Функция которая получает баланс
module.exports.getBalance = function getBalance(session, address, assetID, ticker, callback) {
    // Ticker может быть all или криптой
    
    balances(session, address, assetID, (balances) => {
        if(ticker == 'noCourse') {
            callback(balances);
        } else {
            Course.inRub(session, ticker, 'RUB')
                .then(
                    function (rub) {
                        // В колбэк залетает название пары валют, баланс валюты и сколько в рублях
                        callback(balances, rub);
                    }
                )
                .catch(
                    function (zero) {
                        if(session.userData.error != 'yes') {
                            session.send('Извините, курс недоступен');
                        }
                        
                        session.userData.error = 'yes';
                        callback(balances, zero);
                    }
                );
        }  
    }
);
}

// Функция, которая проверяет баланс WAVES
function checkWavesBalance(address, callback) {
    Waves.API.Node.v1.assets.balance(address, 'WAVES').then((balance) => {
        callback(Number(balance.balance * Math.pow(10, -8)).toFixed(8));
    });
};
module.exports.checkWavesBalance = checkWavesBalance;