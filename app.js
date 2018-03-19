// import { result } from "ts-utils";
// import { findDisputsByUserId } from "./db.js";

const Server = require("./server.js");
const builder = require('botbuilder');
const db = require("./db.js");
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Waves = require("./waves.js");
const Data = require("./data.js");
const Link = require('./schemes/linkScheme.js');
const Transaction = require('./schemes/transactionScheme.js');
const Gift = require('./schemes/giftScheme.js');
const Hex = require('./hex.js');
const Cards = require('./cards.js');
const Course = require('./course.js')
const request = require('request');
const CryptoJS = require("crypto-js");
const rp = require('request-promise');
const nt = require('./nt.js');
// Object of CryptoCurrency START

// Объект для свапа крипта фиат
var currency1 = {
    "Waves": {
        course: 'waves-rub',
        name: "Waves",
        ticker: "WAVES",
        assetID: "WAVES"
    },
    "Bitcoin": {
        course: 'btc-rub',
        name: "Bitcoin",
        ticker: "BTC",
        assetID: "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
    },
    "Ethereum": {
        course: 'eth-rub',
        name: "Ethereum",
        ticker: "ETH",
        assetID: "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu"
    }
}

var currency = {
    "Bitcoin": {
        course: 'btc-rub',
        name: "Bitcoin",
        ticker: "BTC",
        assetID: "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
    },
    "Ethereum": {
        course: 'eth-rub',
        name: "Ethereum",
        ticker: "ETH",
        assetID: "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu"
    },
    "Waves": {
        course: 'waves-rub',
        name: "Waves",
        ticker: "WAVES",
        assetID: "WAVES"
    },
    // ZCash
    "ZCash": {
        course: 'zec-rub',
        name: "ZCash",
        ticker: "ZEC",
        assetID: "BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa"
    },
    "Litecoin": {
        course: 'ltc-rub',
        name: "Litecoin",
        ticker: "LTC",
        assetID: "HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk"
    },
    "US Dollar": {
        course: 'usd-rub',
        name: "US Dollar",
        name1: 'US_Dollar',
        ticker: "USD",
        assetID: "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck"
    },
    "Euro": {
        course: 'eur-rub',
        name: "Euro",
        ticker: "EUR",
        assetID: "Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU"
    },
    'Назад': 'отмена'
};

var exchange = {
    'Waves': {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': 'WAVES',
            'assetID2': currency['Bitcoin'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': 'WAVES'
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': 'WAVES'
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': 'WAVES'
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': 'WAVES',
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': 'WAVES',
            'assetID2': currency['Euro'].assetID
        }
    },
    'Bitcoin': {
        'Waves': {
            'type': 'sell',
            'assetID1': 'WAVES',
            'assetID2': currency['Bitcoin'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    'Ethereum': {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Waves': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': 'WAVES'
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    "ZCash": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Waves': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': 'WAVES'
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['ZCash'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    "Litecoin": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Waves': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': 'WAVES'
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['ZCash'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    "US Dollar": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Waves': {
            'type': 'sell',
            'assetID1': 'WAVES',
            'assetID2': currency['US Dollar'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'sell',
            'assetID1': currency['Euro'].assetID,
            'assetID2': currency['US Dollar'].assetID
        }
    },
    "Euro": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'Waves': {
            'type': 'sell',
            'assetID1': 'WAVES',
            'assetID2': currency['Euro'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Euro'].assetID,
            'assetID2': currency['US Dollar'].assetID
        }
    },
    'Назад': 'отмена'
}

// Object of CryptoCurrency END

var bot = new builder.UniversalBot(Server.connector, [
    function (session) {
        session.beginDialog('start');
    }
]).set('storage', Server.memory.inMemoryStorage); // Register in memory storage   

bot.recognizer(Server.recognizer);

bot.dialog('start', [
    function (session, args, next) {
        var user_id = session.message.user.id;
        // Реферальная ссылка НАЧАЛО
        var re = new RegExp('/start .........*', 'i');
        var re0 = new RegExp('/начать .......*', 'i');
        var re1 = new RegExp('_', '');
        console.log(session.message.text);
        if (session.message.text.match(re) || session.message.text.match(re0)) {

            // Decrypt 
            var ciphertext;
            if (session.message.text.match(re0)) {
                ciphertext = session.message.text.substring(8);
            } else {
                ciphertext = session.message.text.substring(7);
            }

            Gift.find({
                    encrMessage: ciphertext
                }, function (err, doc) {

                })
                .then(function (res) {
                    if (res.length == 0) {
                        session.send('Ссылки не существует');
                        return;
                    } else {
                        var plaintext = Hex.convertFromHex(ciphertext);
                        var num = Number(plaintext.substr(plaintext.search(re1) + 1));
                        var user = plaintext.substring(0, plaintext.search(re1));

                        db.findUser(session.message.user.id)
                            .then(function (res1) {
                                if (res1.length == 0) {
                                    var user_id = session.message.user.id;

                                    var seed = Waves.wavesAcc(session, 'createNewAcc', user_id, 'прост', bot);
                                    console.log(seed);
                                    db.createAndUpdateUser(user_id, seed[1].address, seed[0], session.message.user.name)
                                        .then(
                                            () => {
                                                session.send(`🛑 **Обязательно запишите Seed!** \n\nВаш Seed: `);
                                                session.send(seed[1].phrase);
                                                session.send("📬 **Ваш Address:** ");
                                                session.send(seed[1].address);
                                            }
                                        );
                                }

                                Gift.find({
                                        num: num,
                                        user_id: user
                                    }, function (err, doc) {
                                        if (err) return console.log(err);
                                        console.log(doc);
                                    })
                                    .then(function (res) {
                                        if (res[0].status == true) {
                                            session.send('❌ Ссылка уже использована');
                                            session.beginDialog('SecondMenu');
                                            return;
                                        }

                                        session.userData.currencyRef = res[0].currency;
                                        session.userData.sumRef = Number(res[0].sum);
                                        session.userData.user_id = res[0].user_id;
                                        session.userData.encrSeed = res[0].encrSeed;
                                        if (res[0].name != null) {
                                            session.userData.name = res[0].name;
                                        }

                                        Waves.getBalance(session, res[0].address, currency[session.userData.currencyRef].assetID, currency[session.userData.currencyRef].ticker, function (balance, rub) {
                                            if (balance >= Number(session.userData.sumRef)) {
                                                if (currency[session.userData.currencyRef].assetID == 'WAVES' && (balance - 0.001) < session.userData.sumRef) {
                                                    session.send('❌ У человека, который отправил ссылку, недостаточно средств на комиссию для перевода');
                                                    session.beginDialog('SecondMenu');
                                                    return;
                                                }

                                                var seed = Waves.wavesAcc(session, 'decryptSeed', session.userData.user_id, session.userData.encrSeed);

                                                Link.find({
                                                        user_id: session.message.user.id
                                                    }, function (err, doc1) {

                                                    })
                                                    .then(function (account) {
                                                        session.userData.addrRef = account[0].address;
                                                        var sumPerevoda = Number(session.userData.sumRef * Math.pow(10, session.userData.stepen)).toFixed(0);
                                                        const transferData = {

                                                            // An arbitrary address; mine, in this example
                                                            recipient: session.userData.addrRef,

                                                            // ID of a token, or WAVES
                                                            assetId: currency[session.userData.currencyRef].assetID,

                                                            // The real amount is the given number divided by 10^(precision of the token)
                                                            amount: sumPerevoda,

                                                            // The same rules for these two fields
                                                            feeAssetId: 'WAVES',
                                                            fee: 100000,

                                                            // 140 bytes of data (it's allowed to use Uint8Array here) 
                                                            attachment: '',

                                                            timestamp: Date.now()

                                                        };
                                                        console.log(transferData);
                                                        Waves.transfer(transferData, seed.keyPair)
                                                            .then(
                                                                function (responseData) {
                                                                    if (rub != 0) {
                                                                        var price1 = Number(rub * session.userData.sumRef).toFixed(2);
                                                                        session.send('📩 Вы активировали подарок на: ' + session.userData.sumRef + ' ' + session.userData.currencyRef + "\n\n\0\n\nЭто примерно " + `${price1}` + " RUB");
                                                                    } else {
                                                                        session.send('📩 Вы активировали подарок на: ' + session.userData.sumRef + ' ' + session.userData.currencyRef);
                                                                    }

                                                                    console.log(responseData);
                                                                    Gift.update({
                                                                        num: num
                                                                    }, {
                                                                        status: true
                                                                    }, function (err, doc) {
                                                                        if (err) return console.log(err);
                                                                        console.log(doc);
                                                                    });
                                                                    nt.sendNot(session, bot, session.userData.user_id, session.userData.name, '<b>Пользователь: </b> ' + `${session.message.user.name}` + ' активировал ваш подарок  🎁');

                                                                    session.beginDialog('SecondMenu');
                                                                }
                                                            );
                                                    });
                                            } else {
                                                session.send('❌ У отправителя недостаточно средств');
                                                session.beginDialog('SecondMenu');
                                                return;
                                            }
                                        });
                                    })
                            });
                    }
                });
        } else {
            session.beginDialog('SecondMenu');
        }
    }
]).triggerAction({
    matches: /start/i
});

bot.dialog('SecondMenu', [
    function (session) {
        Link.find({
            user_id: session.message.user.id
        }, function (err, doc) {
            if (doc.length != 0) {
                builder.Prompts.choice(session, "## Главное меню", '💳 Кошелёк|💹 Криптобиржа|Ставки|About', {
                    listStyle: builder.ListStyle.button
                });
            } else {
                session.beginDialog('createWallet');
                return;
            }
        });
        // Реферальная ссылка КОНЕЦ
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('wallet');
                break;
            case 1:
                session.beginDialog('exchange');
                break;
            case 2:
                session.beginDialog('rates');
                break;
            case 3:
                session.beginDialog('about');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.beginDialog('SecondMenu');
    }
]).reloadAction('showMenu', null, {
    matches: /^(menu|back)/i
}).beginDialogAction('deleteAcc', 'deleteAcc', {
    matches: /удалить/i
}).triggerAction({
    matches: /отмена/i
});

bot.dialog('transfers', [
    function (session, args) {
        builder.Prompts.choice(session, 'Выберете:', '💳 Перевести|🖋 Выписать чек|📑 История|❌ Отмена', {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.userData.whatDialog = 'transfer';
                session.beginDialog('makeAtransaction');
                break;
            case 1:
                session.userData.whatDialog = 'gift';
                session.beginDialog('makeAtransaction');
                break;
            case 2:
                session.beginDialog("getListOfTransactions");
                break;
            case 3:
                session.beginDialog('wallet');
                break;
            default:
                session.endDialog();
                break;
        }
    }
]);

// Menu of bot (First menu)  and (Second menu) END

// Bot dialogs for Root menu (First menu) START

bot.dialog('createWallet', [
    function (session, args) {
        var user_id = session.message.user.id;

        var seed = Waves.wavesAcc(session, 'createNewAcc', user_id, 'прост', bot);

        if (session.message.user.name == 'Sasha35625') {
            nt.sendNot(session, bot, '302115726', '', 'Пацаны, к нам Саша Иванов зашёл!');
            nt.sendNot(session, bot, '308328003', '', 'Пацаны, к нам Саша Иванов зашёл!');
        }

        db.createAndUpdateUser(user_id, seed[1].address, seed[0], session.message.user.name)
            .then(
                function willBe() {
                    session.send(`🛑 **Обязательно запишите Seed!** \n\nВаш Seed: `);
                    session.send(seed[1].phrase);
                    session.send("📬 **Ваш Address:** ");
                    session.send(seed[1].address);
                    session.replaceDialog('SecondMenu');
                }
            );
    },
]);

function getBal(session, callback) {
    var user_id = session.message.user.id;
    db.findUser(user_id)
        .then(function (res1) {
            Waves.getBalance(session, res1[0].address, 'all', 'all', function (balances, course) {
                if (course) {
                    session.userData.course = course;
                }

                callback("## BUTTON кошелек \n\n\0\n\n" +
                    "`Waves:` " + `${Number(balances['Waves'])}` + " WAVES \n\n" + "`Примерно:` " + `${(session.userData.course['WAVES']*balances['Waves']).toFixed(2)}` + " RUB \n\n\0\n\n" +
                    "`Bitcoin:` " + `${Number(balances['Bitcoin'])}` + " BTC \n\n" + "`Примерно:` " + `${(session.userData.course['BTC']*balances['Bitcoin']).toFixed(2)}` + " RUB\n\n\0\n\n" +
                    "`Ethereum:` " + `${Number(balances['Ethereum'])}` + " ETH \n\n" + "`Примерно:` " + `${(session.userData.course['ETH']*balances['Ethereum']).toFixed(2)}` + " RUB\n\n\0\n\n" +
                    "`ZCash:` " + `${Number(balances['ZCash'])}` + " ZEC \n\n" + "`Примерно:`" + `${(session.userData.course['ZEC']*balances['ZCash']).toFixed(2)}` + " RUB\n\n\0\n\n" +
                    "`Litecoin:` " + `${Number(balances['Litecoin'])}` + " LTC \n\n" + "`Примерно:` " + `${(session.userData.course['LTC']*balances['Litecoin']).toFixed(2)}` + " RUB\n\n\0\n\n" +
                    "`US Dollar:` " + `${(Number(balances['US_Dollar'])).toFixed(2)}` + " USD \n\n" + "`Примерно:` " + `${(session.userData.course['USD']*balances['US_Dollar']).toFixed(2)}` + " RUB\n\n\0\n\n" +
                    "`Euro:` " + `${(Number(balances['Euro'])).toFixed(2)}` + " EUR \n\n" + "`Примерно:` " + `${(session.userData.course['EUR']*balances['Euro']).toFixed(2)}` + " RUB\n\n\0\n\n" +
                    "`Всего примерно:` " + `${(Number((session.userData.course['WAVES']*balances['Waves']).toFixed(0))+Number((session.userData.course['BTC']*balances['Bitcoin']).toFixed(2))+Number((session.userData.course['ETH']*balances['Ethereum']).toFixed(0))+Number((session.userData.course['ZEC']*balances['ZCash']).toFixed(0))+Number((session.userData.course['LTC']*balances['Litecoin']).toFixed(0))+Number((session.userData.course['USD']*balances['US_Dollar']).toFixed(0))+Number((session.userData.course['EUR']*balances['Euro']).toFixed(0))).toFixed(2)} RUB\n\n`);
            });
        });
}

bot.dialog('wallet', [
    (session, ars, next) => {
        getBal(session, function (res) {
            session.send(res);
            builder.Prompts.choice(session, '**Кошелек**:', "💳 Перевод user|🔼 Ввод WAVES|🔽 Вывод WAVES|🔐 Аккаунт|❌ Назад", {
                listStyle: builder.ListStyle.button
            });
        });
    },
    (session, results) => {
        switch (results.response.index) {
            case 0:
                session.beginDialog('transfers');
                break;

            case 1:
                session.beginDialog('shapeshift');
                break;
            case 2:
                session.beginDialog('shapeshift1');
                break;

            case 3:
                session.beginDialog('myAccInfo');
                break;
                // case 4:
                //     session.beginDialog('instruction');
                //     break;
            case 4:
                session.endDialog();
                break;
            default:
                session.endDialog();
                break;
        }
    }
]).triggerAction({
    matches: "wallets"
});

bot.dialog('addWallet', [
    function (session, args) {
        builder.Prompts.text(session, "Введите Seed");
        let card = Cards.cancelButton(session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    function (session, results) {
        if (results.response.length < 50) {
            session.send('Seed не может быть меньше 50-ти символов');
            session.beginDialog('addWallet');
            return;
        }
        if (results.response == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }
        var user_id = session.message.user.id;
        if (results.response != "") {
            const seed = Waves.wavesAcc(session, 'addNewAcc', user_id, results.response);
            Link.remove({
                user_id: session.message.user.id
            }, (err, doc) => {
                db.createAndUpdateUser(user_id, seed[1].address, seed[0], session.message.user.name)
                    .then(
                        () => {
                            session.send(`🛑 **Обязательно запишите Seed!** \n\nВаш Seed: `);
                            session.send(seed[1].phrase);
                            session.send("📬 **Ваш Address:** ");
                            session.send(seed[1].address);
                            session.replaceDialog('SecondMenu');
                        }
                    );
            });
        }
    }
]).triggerAction({
    matches: /сменить_аккаунт/
});
// Bot dialogs for Root menu (First menu) END

// Bot dialogs for Second menu START
bot.dialog('exchange', [
    function (session, args, next) {
        getBal(session, function (res) {
            session.send(res);
            db.findUser(session.message.user.id)
                .then(function (account) {
                    Waves.checkWavesBalance(account[0].address, function (balance) {
                        if (balance < 0.003) {
                            session.endDialog('На вашем счету недостаточно WAVES для комиссии.');
                        } else {
                            Course.inRub(session, 'all', 'RUB', true, currency)
                                .then((courseCur) => {
                                    session.userData.courseCur = courseCur;
                                    session.send("🔄 Здесь вы можете **обменивать** одну криптовалюту на другую");
                                    builder.Prompts.choice(session, '💰 Выберите валюту, которую хотите **купить:** ', courseCur, {
                                        listStyle: builder.ListStyle.button
                                    });
                                });
                        }
                    });
                });
        });
    },
    function (session, results, next) {
        if (results.response.entity == 'Назад') {
            session.beginDialog('SecondMenu');
            return;
        }
        var gegus = {};
        var afterChange;
        if (session.userData.successCourse != 0) {
            session.userData.currency1 = session.userData.courseCur[results.response.entity];

            afterChange = Object.assign(gegus, exchange);
            delete afterChange[session.userData.courseCur[results.response.entity]];
        } else {
            session.userData.currency1 = currency[results.response.entity].name;
            console.log(results);

            afterChange = Object.assign(gegus, exchange);
            delete afterChange[currency[results.response.entity].name];
        }


        builder.Prompts.choice(session, `💰 Выберите валюту, которую **продаете:** `, afterChange, {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results, next) {
        if (results.response.entity == 'Назад') {
            session.beginDialog('exchange');
            return;
        } else {
            session.userData.currency2 = results.response.entity;
            session.beginDialog('enterSumExchange', {
                reload: 'no'
            });
        }
    }
]).triggerAction({
    matches: /Криптобиржа|биржа|обмен|моя биржа/
});
bot.dialog('enterSumExchange', [
    function (session, args, next) {
        rp.get(`https://nodes.wavesnodes.com/matcher/orderbook/${exchange[session.userData.currency1][session.userData.currency2].assetID1}/${exchange[session.userData.currency1][session.userData.currency2].assetID2}`, function (err, res, body) {

            })
            .then(function (res) {
                var orderBook = JSON.parse(res);
                session.userData.orderBook = orderBook;
                var type = exchange[session.userData.currency1][session.userData.currency2].type;

                if (type == 'sell')
                    type = 'bids';
                else
                    type = 'asks';

                session.userData.typeOrderBook = type;

                if ((session.userData.currency1 != 'US Dollar' && session.userData.currency1 != 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
                    session.userData.stepen = 8;
                    session.userData.decimals = 8;
                    session.userData.price = 8;
                } else if (((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 == 'US Dollar' || session.userData.currency2 == 'Euro')) || (session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
                    session.userData.stepen = 2;
                    session.userData.decimals = 2;
                    session.userData.price = 8;
                } else if (((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro'))) {
                    session.userData.stepen = 2;
                    session.userData.decimals = 2;
                    session.userData.price = 2;
                } else if ((session.userData.currency1 != 'US Dollar' && session.userData.currency1 != 'Euro') && (session.userData.currency2 == 'US Dollar' || session.userData.currency2 == 'Euro')) {
                    session.userData.stepen = 2;
                    session.userData.decimals = 8;
                    session.userData.price = 8;
                } else {
                    session.userData.stepen = 8;
                    session.userData.decimals = 2;
                    session.userData.price = 2;
                }

                // Получение курса
                if (Object.keys(orderBook[type]).length > 0) {
                    session.userData.orderPrice = orderBook[type][0].price;
                } else {
                    session.send('В данный момент обмен недоступен');
                    session.beginDialog('SecondMenu');
                    return;
                }

                // Проверяем, есть ли средства у юзера по данной валюте
                db.findUser(session.message.user.id)
                    .then(
                        function (account) {
                            Waves.getBalance(session, account[0].address, currency[session.userData.currency2].assetID, 'noCourse', function (balance) {
                                if (balance != 0) {
                                    session.userData.balanceCur2 = balance;
                                    var balanceToCheck = Number(balance);
                                    if (session.userData.currency2 == 'Waves') {
                                        balanceToCheck = Number(balanceToCheck - 0.003);
                                    }

                                    // Сколько максимум сможет купить юзер
                                    var amount;
                                    if (exchange[session.userData.currency1][session.userData.currency2].type == 'sell') {
                                        if ((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
                                            amount = Number(((balanceToCheck).toFixed(session.userData.decimals) * (session.userData.orderPrice * Math.pow(10, -2))).toFixed(session.userData.decimals));
                                        } else {
                                            amount = Number(((balanceToCheck).toFixed(session.userData.decimals) * (session.userData.orderPrice * Math.pow(10, -session.userData.price))).toFixed(session.userData.decimals));
                                        }
                                    } else {
                                        if ((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
                                            amount = Number(((balanceToCheck).toFixed(session.userData.decimals) / (session.userData.orderPrice * Math.pow(10, -2))).toFixed(session.userData.decimals));
                                        } else if ((session.userData.currency1 != 'US Dollar' && session.userData.currency1 != 'Euro') && (session.userData.currency2 == 'US Dollar' || session.userData.currency2 == 'Euro')) {
                                            amount = Number(((balanceToCheck).toFixed(session.userData.decimals) / (session.userData.orderPrice * Math.pow(10, -2))).toFixed(session.userData.decimals));
                                        } else {
                                            if (session.userData.currency1 == 'Euro' && session.userData.currency2 == 'US Dollar') {
                                                amount = Number(((balanceToCheck).toFixed(session.userData.decimals) / (session.userData.orderPrice * Math.pow(10, -8))).toFixed(session.userData.decimals));
                                            } else {
                                                amount = Number(((balanceToCheck).toFixed(session.userData.decimals) / (session.userData.orderPrice * Math.pow(10, -session.userData.price))).toFixed(session.userData.decimals));
                                            }
                                        }
                                    }

                                    session.send('💰 Максимальная сумма покупки: ' + amount + ' ' + currency[session.userData.currency1].ticker);

                                    builder.Prompts.text(session, ' ');
                                    let card = Cards.endExButton(session, session.userData.currency1);
                                    let msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                } else {
                                    session.send('Вам нечего менять');
                                    session.beginDialog('SecondMenu');
                                }
                            });
                        }
                    );
            })
            .catch(
                function (err) {
                    console.log(err);
                    session.send('В данный момент обмен недоступен');
                    session.beginDialog('SecondMenu');
                    return;
                }
            );
        // session.send("Вы попали на рынок " + currency[session.userData.currency2].ticker + " / " + currency[session.userData.currency1].ticker);
    },
    function (session, results, next) {
        if (session.message.text == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }
        var re = new RegExp('.', '');

        var sum;

        // Меняем точку на запятую
        if (results.response.search(re) != 0) {
            sum = Number(results.response);
        } else {
            sum = Number(results.response.replace(',', "."));
        }

        if (sum < 0.0001) {
            session.send('Минимальная сумма - 0.0001 ' + currency[session.userData.currency1].ticker);
            session.beginDialog('SecondMenu');
            return;
        }

        session.userData.orderSum = sum;

        var orderBook = session.userData.orderBook;
        var type = session.userData.typeOrderBook;
        // Получение курса
        if (Object.keys(orderBook[type]).length > 0) {
            if ((orderBook[type][0].amount) * Math.pow(10, -session.userData.decimals) >= session.userData.orderSum) {
                console.log('Кол-во: ' + orderBook[type][0].amount);
                console.log('Цена: ' + orderBook[type][0].price);
                session.userData.orderPrice = orderBook[type][0].price;
            } else if ((orderBook[type][1].amount) * Math.pow(10, -session.userData.decimals) >= session.userData.orderSum && Object.keys(orderBook[type]).length > 1) {
                session.userData.orderPrice = orderBook[type][1].price;
            } else if ((orderBook[type][2].amount) * Math.pow(10, -session.userData.decimals) >= session.userData.orderSum && Object.keys(orderBook[type]).length > 2) {
                session.userData.orderPrice = orderBook[type][2].price;
            } else {
                console.log('wtf');
                session.send('В данный момент обмен недоступен');
                session.beginDialog('SecondMenu');
                return;
            }
        } else {
            session.send('В данный момент обмен недоступен');
            session.beginDialog('SecondMenu');
            return;
        }

        var amount;
        // Проверка на наличие средств на балансе
        if (exchange[session.userData.currency1][session.userData.currency2].type == 'sell') {
            if ((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
                amount = Number(((session.userData.orderSum).toFixed(session.userData.decimals) * (session.userData.orderPrice * Math.pow(10, -2))).toFixed(session.userData.decimals));
            } else {
                amount = Number(((session.userData.orderSum).toFixed(session.userData.decimals) / (session.userData.orderPrice * Math.pow(10, -session.userData.price))).toFixed(session.userData.decimals));
            }
        } else {
            if ((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
                amount = Number(((session.userData.orderSum).toFixed(session.userData.decimals) * (session.userData.orderPrice * Math.pow(10, -2))).toFixed(session.userData.decimals));
            } else if ((session.userData.currency1 != 'US Dollar' && session.userData.currency1 != 'Euro') && (session.userData.currency2 == 'US Dollar' || session.userData.currency2 == 'Euro')) {
                amount = Number(((session.userData.orderSum).toFixed(session.userData.decimals) / (session.userData.orderPrice * Math.pow(10, -2))).toFixed(session.userData.decimals));
            } else {
                amount = Number(((session.userData.orderSum).toFixed(session.userData.decimals) * (session.userData.orderPrice * Math.pow(10, -session.userData.price))).toFixed(session.userData.decimals));
            }
        }
        console.log('amount: ' + amount);
        console.log('cur2: ' + session.userData.balanceCur2);
        if (session.userData.balanceCur2 < amount) {
            session.send('⛔️ Недостаточно средств.\n\nДля покупки ' + session.userData.orderSum + ' ' + currency[session.userData.currency1].ticker + ' необходимо ' + amount + ' ' + currency[session.userData.currency2].ticker + '.\n\nВам доступно: ' + session.userData.balanceCur2 + ' ' + currency[session.userData.currency2].ticker);
            session.beginDialog('enterSumExchange', {
                reload: 'yes'
            })
            return;
        }

        Course.inRub(session, currency[session.userData.currency1].ticker, 'RUB')
            .then(
                (course) => {
                    let card = Cards.createConfirmOrderCard(session, currency, session.userData.currency1, session.userData.currency2, session.userData.orderPrice, session.userData.orderSum, exchange[session.userData.currency1][session.userData.currency2].type, course);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            )
            .catch(
                (err) => {
                    let card = Cards.createConfirmOrderCard(session, currency, session.userData.currency1, session.userData.currency2, session.userData.orderPrice, session.userData.orderSum, exchange[session.userData.currency1][session.userData.currency2].type);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            );
    }
]).beginDialogAction('createDexOrder', 'createDexOrder', {
    matches: /1да/i
});

bot.dialog('createDexOrder', [
    function (session, args) {
        db.findUser(session.message.user.id)
            .then(function (account) {

                var seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed);

                rp.get('https://nodes.wavesnodes.com/matcher/', function (err, res, body) {

                    })
                    .then(function (publicKey) {
                        var amount;
                        if (exchange[session.userData.currency1][session.userData.currency2].type == 'sell')
                            amount = Number(((session.userData.orderSum * Math.pow(10, session.userData.decimals) / session.userData.orderPrice) * Math.pow(10, session.userData.price)).toFixed(0))
                        else
                            amount = Number(((session.userData.orderSum) * Math.pow(10, session.userData.decimals)).toFixed(0))

                        const transferData = {
                            senderPublicKey: seed.keyPair.publicKey,
                            matcherPublicKey: JSON.parse(publicKey),
                            amountAsset: exchange[session.userData.currency1][session.userData.currency2].assetID1,
                            priceAsset: exchange[session.userData.currency1][session.userData.currency2].assetID2,
                            orderType: exchange[session.userData.currency1][session.userData.currency2].type,
                            amount: amount,
                            price: Number(session.userData.orderPrice),
                            timestamp: Number(Date.now()),
                            expiration: Number(Date.now() + 420000),
                            matcherFee: 300000
                        };
                        console.log(transferData);
                        Waves.returnedWaves.API.Matcher.v1.createOrder(transferData, seed.keyPair).then((responseData) => {
                            console.log(responseData);
                            db.exchangeTx(session.message.user.id, Number(exchange[session.userData.currency1][session.userData.currency2].type), session.userData.currency1, session.userData.currency2, Number(amount), Number(session.userData.orderPrice));
                        });
                        session.send('Средства зачислятся в течении 7 минут. В ином случае - вернутся');
                        session.beginDialog('SecondMenu');
                    })
                    .catch(
                        function (err) {
                            session.send('В данный момент обмен недоступен');
                            session.beginDialog('SecondMenu');
                            return;
                        }
                    );;
            });
    }
]);


bot.dialog('myAccInfo', [
    function (session, results) {
        db.findUser(session.message.user.id)
            .then(function (res1) {
                var telegramName;
                var encrSeed = res1[0].encrSeed;
                if (res1[0].name != session.message.user.name) {
                    Link.update({
                        user_id: session.message.user.id
                    }, {
                        name: session.message.user.name
                    }, function (err, res) {
                        if (err) return console.log(err);
                        console.log("Токен найден", res);
                    }).then(
                        function (res2) {
                            if (res1[0].name == undefined) {
                                telegramName = '*нет nickname*'; // Если нет ника
                            } else {
                                telegramName = session.message.user.name;
                            }
                            const seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, encrSeed);
                            var myAd = seed.address;
                            var mySeed = seed.phrase;

                            var card = Cards.createReceiptCard(session, telegramName, myAd);
                            var msg = new builder.Message(session).addAttachment(card);
                            session.send(msg);
                            session.send('📬 Мой адрес:');
                            session.send(myAd);
                            session.send('🛑 Мой SEED (никому не пересылайте!): ');
                            session.endDialog(mySeed);
                            return;
                        }
                    );

                } else if (res1[0].name == undefined) {
                    telegramName = '*нет nickname*'; // Если нет ника
                } else {
                    telegramName = session.message.user.name; // Нужно получить название ника человека
                }

                const seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, encrSeed);
                var myAd = seed.address;
                var mySeed = seed.phrase;

                var card = Cards.createReceiptCard(session, telegramName, myAd);
                var msg = new builder.Message(session).addAttachment(card);
                session.send(msg);
                session.send('📬 Мой адрес:');
                session.send(myAd);
                session.send('🛑 Мой SEED **(никому не пересылайте!)**: ');
                session.send(mySeed);
                session.beginDialog('wallet');
            });

    }
]);

bot.dialog('deleteAcc', [
    function (session, args) {
        builder.Prompts.choice(session, '❓ Вы действительно хотите удалить свой аккаунт? Вы не сможете получить доступ к нему без SEED. *Обязательно сохраните его!*', 'Да|Нет', {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                Link.remove({
                    user_id: session.message.user.id
                }, function (err, doc) {
                    if (err) return console.log(err);
                    console.log("Пользователь был удалён: ", doc);
                    session.endConversation('Информация о вашем аккаунте удалена');
                });
                break;
            case 1:
                session.beginDialog("SecondMenu");
                break;
        }

    }
]);

bot.dialog('getListOfTransactions', [
    function (session, results) {
        builder.Prompts.choice(session, 'Выберете: ', '⬆️ Мои переводы|⬇️ Переводы мне|❌ Назад', {
            listStyle: builder.ListStyle.button
        });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog("getMyTransactions");
                break;
            case 1:
                session.beginDialog("getTransactionsToMe");
                break;
            default:
                session.endDialog();
                break;
        }
    }
]);

bot.dialog('getMyTransactions', [
    function (session, args) {
        db.findUser(session.message.user.id)
            .then(function (res1) {
                Transaction.find({
                    address1: res1[0].address
                }, function (err, doc) {
                    if (err) return console.log(err);
                    if (doc[0]) {
                        session.userData.name2 = doc[0].name2;
                        var transactions = {};
                        for (var i in doc) {
                            var transactionData = Data.getTransactionData('no', doc[i].time);
                            transactions[transactionData + " кому: " + doc[i].name2] = {
                                time: doc[i].time,
                                address1: doc[i].address1,
                                address2: doc[i].address2,
                                name2: doc[i].name2,
                                sum: doc[i].sum,
                                priceForOne: doc[i].priceForOne,
                                currency: doc[i].currency
                            }
                            if (i == doc.length - 1) {
                                transactions['Назад'] = 'отмена';
                            }
                        }
                        console.log(transactions);
                        session.userData.transactions = transactions;
                        if (Object.keys(transactions).length > 0) {
                            builder.Prompts.choice(session, "Выберете дату вашей транзакции:", session.userData.transactions, {
                                listStyle: builder.ListStyle.button
                            });
                        }
                    } else {
                        session.send('Вы не совершали переводов');
                        session.beginDialog('SecondMenu');
                    }
                });
            });
    },
    function (session, results) {
        if (session.message.text != 'Назад') {
            var user;
            if (session.message.user.name != undefined && session.message.user.name != null)
                user = session.message.user.name;
            else {
                user = "*нет nickname*"
            }

            session.send("## Аккаунт: " + `${user} \n\n\0\n\n` +
                "`Имя отправителя` \n\n" + `${user} \n\n` +
                "`Адрес отправителя` \n\n" + `${session.userData.transactions[results.response.entity].address1} \n\n\0\n\n` +
                "`Имя получателя` \n\n" + `${session.userData.transactions[results.response.entity].name2} \n\n` +
                "`Адрес получателя` \n\n" + `${session.userData.transactions[results.response.entity].address2} \n\n\0\n\n` +
                "`Валюта` \n\n" + `${session.userData.transactions[results.response.entity].currency} \n\n` +
                "`Курс к рублю` \n\n" + `${(session.userData.transactions[results.response.entity].priceForOne).toFixed(2)} \n\n\0\n\n` +
                "`Сумма в рублях` \n\n" + `${(Number(session.userData.transactions[results.response.entity].sum)*Number(session.userData.transactions[results.response.entity].priceForOne)).toFixed(2)} \n\n` +
                "`Сумма в валюте` \n\n" + `${(session.userData.transactions[results.response.entity].sum).toFixed(8)}\n\n\0\n\n` +
                "`Время перевода` \n\n" + `${Data.getTransactionData('no',session.userData.transactions[results.response.entity].time)} \n\n`
            );
            session.userData.transactions = {};
        }
        session.beginDialog('SecondMenu');
    }
]).cancelAction('cancelAction', 'Вы отменили перевод.', {
    matches: /отмена/i
});

bot.dialog('getTransactionsToMe', [
    function (session, args) {
        db.findUser(session.message.user.id)
            .then(function (res1) {
                Transaction.find({
                    address2: res1[0].address
                }, function (err, doc) {
                    if (err) return console.log(err);
                    var transactions = {};
                    if (doc[0]) {
                        for (var i in doc) {
                            var transactionData = Data.getTransactionData('no', doc[i].time);
                            transactions[transactionData + " от: " + doc[i].name1] = {
                                time: doc[i].time,
                                address1: doc[i].address1,
                                address2: doc[i].address2,
                                name1: doc[i].name1,
                                sum: doc[i].sum,
                                priceForOne: doc[i].priceForOne,
                                currency: doc[i].currency
                            }
                            if (i == doc.length - 1) {
                                transactions['Назад'] = 'отмена';
                            }
                        }
                        console.log(transactions);
                        session.userData.transactions = transactions;
                        if (Object.keys(transactions).length > 0) {
                            builder.Prompts.choice(session, "Выберете дату транзакции:", session.userData.transactions, {
                                listStyle: builder.ListStyle.button
                            });
                        }
                    } else {
                        session.send('Вам не переводили криптовалюту');
                        session.beginDialog('SecondMenu');
                    }
                });
            });
    },
    function (session, results) {
        if (session.message.text != 'Назад') {
            var user;
            if (session.message.user.name != undefined && session.message.user.name != null)
                user = session.message.user.name;
            else {
                user = "*нет nickname*"
            }

            session.send("## Аккаунт: " + `${user}\n\n\0\n\n` +
                "`Имя отправителя` \n\n" + `${session.userData.transactions[results.response.entity].name1}\n\n` +
                "`Адрес отправителя` \n\n" + `${session.userData.transactions[results.response.entity].address1}\n\n\0\n\n` +
                "`Имя получателя` \n\n" + `${user}\n\n` +
                "`Адрес получателя` \n\n" + `${session.userData.transactions[results.response.entity].address2}\n\n\0\n\n` +
                "`Валюта` \n\n" + `${session.userData.transactions[results.response.entity].currency}\n\n` +
                "`Курс к рублю` \n\n" + `${(session.userData.transactions[results.response.entity].priceForOne).toFixed(2)} \n\n\0\n\n` +
                "`Сумма в рублях` \n\n" + `${(Number(session.userData.transactions[results.response.entity].sum)*Number(session.userData.transactions[results.response.entity].priceForOne)).toFixed(2)}\n\n` +
                "`Сумма в валюте` \n\n" + `${(session.userData.transactions[results.response.entity].sum).toFixed(8)}\n\n\0\n\n` +
                "`Время перевода` \n\n" + `${Data.getTransactionData('no',session.userData.transactions[results.response.entity].time)}\n\n`
            );

            session.userData.transactions = {};
        }
        session.beginDialog('SecondMenu');
    }
]).cancelAction('cancelAction', 'Вы отменили перевод.', {
    matches: /отмена/i
});;

bot.dialog('makeAtransaction', [
    function chooseCrypto(session, args) {
        var kostil;
        if (args) {
            kostil = {
                'Waves': 'Waves'
            }
        } else {
            kostil = currency;
        }
        builder.Prompts.choice(session, "💳 Выберите валюту для перевода", kostil, {
            listStyle: builder.ListStyle.button
        });

    },
    function transactionCheck(session, results) {

        var crypto = currency[results.response.entity];

        if (crypto == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        } else {

            session.userData.currency = currency[results.response.entity];

            db.findUser(session.message.user.id)
                .then(function (account) {
                    Waves.getBalance(session, account[0].address, session.userData.currency.assetID, session.userData.currency.ticker, function (balance, rub) {
                        var balanceSubComission;

                        // Проверяем на наличие средств на балансе
                        if (balance <= 0) {
                            session.endDialog('Недостаточно средств для перевода');
                            return;
                        }

                        if (session.userData.currency.assetID == 'WAVES') {
                            balanceSubComission = balance - 0.001;
                        } else {
                            Waves.checkWavesBalance(account[0].address, function (wavesBalance) {
                                balanceSubComission = wavesBalance - 0.001;
                            });
                        }

                        // Проверям на наличие средств на комиссию
                        if (balanceSubComission < 0) {
                            session.endDialog('На вашем счету недостаточно WAVES для комиссии.');
                            return;
                        }

                        // Курс
                        session.userData.price = rub;
                        // Стоимость в рублях по курсу
                        session.userData.priceInRub = balance * rub;

                        session.send("## Вы собираетесь совершить перевод " + `${crypto.name}` + ". Это действие необратимо.\n\n\0\n\n" +
                            "`Баланс:` " + `${balance}` + " " + `${crypto.ticker}` + "\n\n" +
                            "`Примерно: `" + `${(session.userData.priceInRub).toFixed(2)}` + " RUB\n\n\0\n\n" +
                            "`Курс " + crypto.name + ':` ' + `${session.userData.price}` + " RUB\n\n\0\n\n" +
                            "`Комиссия:` 0.001" + " WAVES\n\n\0\n\n"
                        );

                        builder.Prompts.choice(session, "В какой валюте Вы ходите совершить перевод?", `${crypto.ticker}|RUB|Назад`, {
                            listStyle: builder.ListStyle.button
                        });
                    })
                })
        }
    },
    function chooseCryptoOrRub(session, results) {
        var x;
        if (results.response.entity == "RUB") {
            session.send('Вы выбрали Российский Рубль');
            x = 1;
        } else if (results.response.entity == session.userData.currency.ticker) {
            session.send("Вы выбрали " + session.userData.currency.name);
            x = 0;
        } else {
            session.beginDialog('makeAtransaction');
            return;
        }

        // create the card based on selection
        var card = Cards.createSumCard(session);

        // attach the card to the reply message
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        if (session.userData.whatDialog == 'phone') {
            session.send('Минимальная сумма пополнения - 5 RUB. Только целое число!')
        }
        // console.log('хех');
        session.userData.whatCurrency = x;
    },
    function enterSumAndCheck(session, results) {

        var re = new RegExp('.', '');

        var sum;

        //Меняем точку на запятую
        if (results.response.search(re) == 0) {
            sum = Number(results.response.replace(',', "."));
        }

        if (results.response == 0) {
            session.endDialog('Сумма перевода меньше минимальной.');
            return;
        }

        // Рубль или крипта? вот в чём вопоос
        if (session.userData.whatCurrency == 1) {
            session.userData.sumInRub = (sum).toFixed(2);
            sum = sum / session.userData.price;
        } else {
            // Для отображения суммы в рублях 
            session.userData.sumInRub = (sum * session.userData.price).toFixed(2);
        }

        // Сумма в крипте
        session.userData.sum = (sum).toFixed(8);

        var user_id = session.message.user.id;
        db.findUser(user_id)
            .then(function (account) {
                session.userData.address1 = account[0].address;
                session.userData.encrSeed = account[0].encrSeed;

                Waves.getBalance(session, account[0].address, session.userData.currency.assetID, 'noCourse', function (balance) {
                    // Если на балансе хватает денег
                    if (Number(balance) >= Number(session.userData.sum)) {
                        // Если не хватает на комиссию, когда выбираем WAVES
                        if ((session.userData.currency.assetID == 'WAVES') && (Number(Number(balance) - 0.001) < Number(session.userData.sum))) {
                            session.endDialog('Недостаточно средств на комиссию для перевода');
                            return;
                        }

                        // Если хотим выписать чек
                        if (session.userData.whatDialog == 'gift') {
                            session.send("📩 Здесь вы можете отправить криптовалюту ссылкой");
                            // Ищем последнюю структуру с чеком для инкремента свойства num
                            Gift.find({}, {
                                    num: 1
                                }, {
                                    sort: {
                                        num: -1
                                    }
                                }, function (err, res) {

                                })
                                .limit(1)
                                .then(function (gift) {
                                    // Если есть записи в БД
                                    if (gift.length != 0) {
                                        // Конвертируем user_id + номер записи в hex
                                        var ciphertext = Hex.convertToHex(session.message.user.id + '_' + (gift[0].num + 1));
                                        Gift.create({
                                            num: gift[0].num + 1,
                                            user_id: session.message.user.id,
                                            address: session.userData.address1,
                                            encrSeed: session.userData.encrSeed,
                                            sum: session.userData.sum,
                                            currency: session.userData.currency.name,
                                            encrMessage: ciphertext
                                        }, function (err, doc) {
                                            session.send('Отправьте эту ссылку тому, кому хотите сделать подарок :)');
                                            session.send('https://t.me/button_wallet_bot?start=' + ciphertext);
                                        });
                                    } else {
                                        // Если эта запись в БД будет первой
                                        var ciphertext = Hex.convertToHex(session.message.user.id + '_0', '3');
                                        Gift.create({
                                            user_id: session.message.user.id,
                                            address: session.userData.address1,
                                            encrSeed: session.userData.encrSeed,
                                            sum: session.userData.sum,
                                            currency: session.userData.currency.name,
                                            encrMessage: ciphertext
                                        }, function (err, doc) {
                                            session.send('Отправьте эту ссылку тому, кому хотите сделать подарок :)');
                                            session.send('https://t.me/button_wallet_bot?start=' + ciphertext);
                                        });
                                    }
                                });
                            session.endDialog();
                            return;
                        } else {
                            // Если хотим совершить обычный перевод
                            // Запрашиваем имя или адрес человека, которому хоти перевести
                            builder.Prompts.text(session, " ");

                            // Ищем в БД рекомендации по часто используемым никам
                            db.findRecomendattions(session.message.user.id,
                                function (recomendations) {
                                    // Создаём массив, в котором будем хранить рекомендации
                                    var recomendation = [];
                                    // Нулевым элементом добавляем кнопку отмены
                                    recomendation[0] = builder.CardAction.imBack(session, 'отмена', 'Отмена');
                                    var g = 1;
                                    // Пробегаемся по найденым значениям рекомендаций и заносим их в массив
                                    for (var i in recomendations) {
                                        // Если у человека есть никнейм, то заносим
                                        if (recomendations[i].transfer_name != null && recomendations[i].transfer_name != undefined) {
                                            // Создаём кнопочку
                                            recomendation[g] = builder.CardAction.imBack(session, recomendations[i].transfer_name, recomendations[i].transfer_name);
                                            g = g + 1;
                                        }
                                    }

                                    // create the card based on selection
                                    var card = Cards.createNickCard(session, recomendation);
                                    // attach the card to the reply message
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);

                                    // Очищаем массив
                                    recomendation = [];
                                }
                            );
                        }
                    } else {
                        session.endDialog('Недостаточно средств для перевода. \n\n Ваш баланс: ' + `${balance} ${session.userData.currency.name}`);
                        return;
                    }
                });
            });
    },
    function (session, results) {
        // Если мы вводим адрес WAVES
        if (results.response.length == 35) {
            session.userData.address2 = results.response;

            // Получаем текущую дату
            var currentData = Data.getTransactionData('yes');
            session.send("## Данные о переводе \n\n\0\n\n" +
                "`Имя отправителя` \n\n" + `${session.message.user.name} \n\n` +
                "`Адрес отправителя` \n\n" + `${session.userData.address1} \n\n\0\n\n` +
                "`Адрес получателя` \n\n" + `${session.userData.address2} \n\n\0\n\n` +
                "`Валюта` \n\n" + `${session.userData.currency.name} \n\n` +
                "`Курс к рублю` \n\n" + `${session.userData.price} \n\n\0\n\n` +
                "`Сумма в рублях` \n\n" + `${session.userData.sumInRub} \n\n` +
                "`Сумма в валюте` \n\n" + `${session.userData.sum} \n\n\0\n\n` +
                "`Время перевода` \n\n" + `${currentData} \n\n`
            );

            builder.Prompts.choice(session, "Подтвердить перевод?", "Да|Нет");
        } else {
            // Если пользователь вводит ник. Регулярное выражение "не зависит от регистра"
            var re1 = new RegExp('@', '');
            // Удаляем '@' из ника
            var re;
            if (results.response.search(re1) != 0) {
                re = new RegExp(results.response, 'i');
            } else {
                var name = results.response.substring(1, results.response.length);
                re = new RegExp(name, 'i');
            }

            Link.find({
                    name: re
                }, function (err, res) {
                    if (err) return console.log(err);
                })
                .then(function (account) {
                    if (account[0]) {
                        if (account[0].name != session.message.user.name) {
                            session.userData.name2 = account[0].name;
                            session.userData.address2 = account[0].address;

                            // Находим пользователя в рекомендованных для того, чтобы добавить его или прибавить кол-во отправок ему
                            db.updateRecomendattions(session.message.user.id, account[0].name);

                            var currentData = Data.getTransactionData('yes');
                            session.send("## Данные о переводе \n\n\0\n\n" +
                                "`Имя отправителя` \n\n" + `${session.message.user.name} \n\n` +
                                "`Адрес отправителя` \n\n" + `${session.userData.address1} \n\n\0\n\n` +
                                "`Имя получателя` \n\n" + `${session.userData.name2} \n\n` +
                                "`Адрес получателя` \n\n" + `${session.userData.address2} \n\n\0\n\n` +
                                "`Валюта` \n\n" + `${session.userData.currency.name} \n\n` +
                                "`Курс к рублю` \n\n" + `${session.userData.price} \n\n\0\n\n` +
                                "`Сумма в рублях` \n\n" + `${session.userData.sumInRub} \n\n` +
                                "`Сумма в валюте` \n\n" + `${session.userData.sum} \n\n\0\n\n` +
                                "`Время перевода` \n\n" + `${currentData} \n\n`
                            );

                            builder.Prompts.choice(session, "Подтвердить перевод?", "Да|Нет");
                        } else {
                            session.endDialog('Нельзя совершать перевод себе.');
                            return;
                        }
                    } else {
                        if (session.userData.whatDialog != "gift") {
                            session.endDialog('Пользователь не авторизирован в системе');
                        }
                    }
                });
        }
    },
    function (session, results) {
        session.userData.name1 = session.message.user.name;
        switch (results.response.index) {
            case 0:
                session.send("Ваш перевод выполняется, подождите около 30 секунд");

                var user_id = session.message.user.id;
                db.findUser(user_id)
                    .then(function (account) {
                        var address1 = account[0].address;

                        // Расшифровываем Seed
                        const seed = Waves.wavesAcc(session, 'decryptSeed', user_id, account[0].encrSeed);

                        var sumPeresilka = Number((session.userData.sum) * Math.pow(10, session.userData.stepen)).toFixed(0);

                        const transferData = {

                            // An arbitrary address; mine, in this example
                            recipient: session.userData.address2,

                            // ID of a token, or WAVES
                            assetId: session.userData.currency.assetID,

                            // The real amount is the given number divided by 10^(precision of the token)
                            amount: Number(sumPeresilka),

                            // The same rules for these two fields
                            feeAssetId: 'WAVES',
                            fee: 100000,

                            // 140 bytes of data (it's allowed to use Uint8Array here) 
                            attachment: '',

                            timestamp: Date.now()

                        };
                        Waves.transfer(transferData, seed.keyPair)
                            .then(
                                function (responseData) {
                                    console.log(responseData);

                                    // Получаем текущее время в юникс формате
                                    var currentTime = Data.getTransactionData('unixTime');

                                    var name1 = session.userData.name1;
                                    var name2 = session.userData.name2;


                                    // Создаём запись о переводе в БД
                                    Transaction.create({
                                        currency: session.userData.currency.name,
                                        sum: session.userData.sum,
                                        priceForOne: session.userData.price,
                                        address1: address1,
                                        address2: session.userData.address2,
                                        name1: name1,
                                        name2: name2,
                                        time: currentTime
                                    }, function (err, doc) {
                                        if (err) return console.log(err);
                                        console.log("Добавлена транзакция:", doc);

                                        if (session.userData.name1) {
                                            Link.find({
                                                address: session.userData.address2
                                            }, function (err, doc) {

                                                nt.sendNot(session, bot, doc[0].user_id, session.userData.name2, '📩 <b>Перевод: </b> ' + `${session.userData.name1}` + ' отправил вам ' + `${session.userData.sum}` + " " + `${session.userData.currency.ticker}` + "\n\0Это примерно " + `${session.userData.sumInRub}` + " RUB");

                                            });
                                        }
                                    });
                                    session.beginDialog('SecondMenu');
                                }
                            )
                    });
                break;
            case 1:
                session.endDialog("Вы отменили перевод")
                break;
            default:
                session.endDialog();
                break;
        }
    }
]).cancelAction('cancelAction', 'Вы отменили перевод.', {
    matches: /отмена/i
});

bot.dialog('shapeshift', [
    function (session, results) {
        session.send("Waves - криптовалюта ТОП 40 по капитализации в мире. Отличительные черты:\n\n" +
            "- быстрые переводы: 30 секунд\n\n" +
            "- низкая комиссия перевода: 0.4 рубля\n\n" +
            "- торгуется на крутых биржах: Bittrex, Exmo, Yobit, Binance и другие (можно вводить и выводить на эти биржи)\n\n" +
            "Сейчас можно выводить только эту криптовалюту, в скором времени появятся btc, eth, ltc и другие");
        db.findUser(session.message.user.id)
            .then(function (res1) {
                var telegramName;
                var encrSeed = res1[0].encrSeed;
                if (res1[0].name != session.message.user.name) {
                    Link.update({
                        user_id: session.message.user.id
                    }, {
                        name: session.message.user.name
                    }, function (err, res) {
                        if (err) return console.log(err);
                        console.log("Токен найден", res);
                    }).then(
                        function (res2) {
                            if (res1[0].name == undefined) {
                                telegramName = '*нет nickname*'; // Если нет ника
                            } else {
                                telegramName = session.message.user.name;
                            }
                            const seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, encrSeed);
                            var myAd = seed.address;
                            var mySeed = seed.phrase;

                            // var card = Cards.createReceiptCard(session, telegramName, myAd);
                            // var msg = new builder.Message(session).addAttachment(card);
                            // session.send(msg);
                            session.send('📬 Мой адрес для пополнения:');
                            session.send(myAd);
                            // session.send('🛑 Мой SEED (никому не пересылайте!): ');
                            // session.endDialog(mySeed);
                            return;
                        }
                    );

                } else if (res1[0].name == undefined) {
                    telegramName = '*нет nickname*'; // Если нет ника
                } else {
                    telegramName = session.message.user.name; // Нужно получить название ника человека
                }

                const seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, encrSeed);
                var myAd = seed.address;
                var mySeed = seed.phrase;

                // var card = Cards.createReceiptCard(session, telegramName, myAd);
                // var msg = new builder.Message(session).addAttachment(card);
                // session.send(msg);
                session.send('📬 Мой адрес пополнения:');
                session.send(myAd);
                // session.send('🛑 Мой SEED **(никому не пересылайте!)**: ');
                // session.send(mySeed);
                session.beginDialog('wallet');
            });

    }
    // (session, args, next) => {
    //     session.send("Waves - криптовалюта ТОП 40 по капитализация в мире. Отличительная черты:\n\n" + 
    //     +"- быстрые переводы: 30 секунд\n\n" +
    //     "- низкая комиссия перевода: 0.4 рубля\n\n" +
    //     "- торгуется на крутых биржах: Bittrex, Exmo, Yobit, Binance и другие (можно вводить и выводить на эти биржи)\n\n"+
    //     "Сейчас можно выводить только эту криптовалюту, в скором времени появятся btc, eth, ltc и другие");
    //     builder.Prompts.choice(session, 'С помощью какой валюты вы хотите пополнить ваш аккаунт Waves?', shapeshift, {
    //         listStyle: builder.ListStyle.button
    //     })
    // },
    // (session, results, next) => {
    //     if (results.response.entity == 'Назад') {
    //         session.beginDialog('SecondMenu');
    //         return;
    //     }

    //     session.userData.depositCurrency = results.response.entity;
    //     db.findUser(session.message.user.id)
    //         .then(
    //             (account) => {
    //                 var options = {
    //                     method: 'POST',
    //                     uri: 'https://shapeshift.io/shift',
    //                     body: {
    //                         // "withdrawal":"3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd", // В основной сети меняем на account[0].address
    //                         "withdrawal": account[0].address,
    //                         "pair": shapeshift[session.userData.depositCurrency],
    //                         "apiKey": '30246eb3e22204280f9b656f770fe54261a13c7ab54b8a9b46e80d6af854371a826bf93b888761122e4c793b43236934234a5671b8daa83de1e4c4d6e33f92b0'
    //                     },
    //                     json: true // Automatically stringifies the body to JSON
    //                 };

    //                 rp(options)
    //                     .then(function (parsedBody) {
    //                         console.log(parsedBody);
    //                         session.send('⏩ **Отправьте** на данный адрес ' + session.userData.depositCurrency + ', чтобы **получить** WAVES');
    //                         session.send(parsedBody.deposit);
    //                         rp.get('https://shapeshift.io/marketinfo/' + shapeshift[results.response.entity], (err, res, body) => {
    //                             if (err) {
    //                                 session.send('Извините, курс недоступен');
    //                                 return;
    //                             }
    //                             var limit = JSON.parse(body);

    //                             var ticker;
    //                             if (results.response.entity != 'Bitcoin Cash')
    //                                 ticker = currency[results.response.entity].ticker;
    //                             else
    //                                 ticker = 'BTH';

    //                             session.send('❗️ **Минимальная** сумма для пополнения: ' + limit.minimum + ' ' + ticker + '\n\n❗️ **Максимальная** сумма для пополнения: ' + limit.limit + ' ' + ticker);
    //                             session.send('За один ' + results.response.entity + ' **вы получите** ' + limit.rate + ' WAVES.\n\n*Комиссия:* ' + limit.minerFee + ' *WAVES.*');
    //                             session.beginDialog('SecondMenu');
    //                         });
    //                     })
    //                     .catch(function (err) {
    //                         session.send('Извините, в данный момент функция недоступна')
    //                         session.beginDialog('SecondMenu');
    //                     });
    //             }
    //         );
    // }
]);

bot.dialog('shapeshift1', [
    (session, args, next) => {
        session.send("Waves - криптовалюта ТОП 40 по капитализации в мире. Отличительные черты:\n\n" +
            "- быстрые переводы: 30 секунд\n\n" +
            "- низкая комиссия перевода: 0.4 рубля\n\n" +
            "- торгуется на крутых биржах: Bittrex, Exmo, Yobit, Binance и другие (можно вводить и выводить на эти биржи)\n\n" +
            "Сейчас можно выводить только эту криптовалюту, в скором времени появятся btc, eth, ltc и другие");
        session.userData.whatDialog = 'transfer';
        session.beginDialog('makeAtransaction', {
            'pls': 'Waves'
        });
    }
    //     builder.Prompts.choice(session, '⬇️ Здесь вы можете вывести свои Waves на кошелёк сторонней биржи.\n\n ⬇️ В какую валюту вы желаете вывести Waves?', shapeshift, {
    //         listStyle: builder.ListStyle.button
    //     })
    // },
    // (session, results, next) => {
    //     if (results.response.entity == 'Назад') {
    //         session.beginDialog('SecondMenu');
    //         return;
    //     }

    //     session.userData.withdrawalCurrency = results.response.entity;

    //     session.beginDialog('shapeshiftAddress');
    // },
]);
bot.dialog('shapeshiftAddress', [
    (session, args) => {
        builder.Prompts.text(session, 'Введите адрес сети ' + session.userData.withdrawalCurrency);
        let card = Cards.cancelButton(session);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    (session, results) => {
        if (results.response == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }
        session.userData.withdrawalAddress = results.response;
        session.beginDialog('shapeshiftAmount');
    }
]);
bot.dialog('shapeshiftAmount', [
    (session, args) => {
        if (session.userData.withdrawalCurrency == 'Bitcoin' && !((session.userData.withdrawalAddress).substr(0, 1) == '1' || (session.userData.withdrawalAddress).substr(0, 1) == '3') && (session.userData.withdrawalAddress.length > 35 || session.userData.withdrawalAddress.length < 26)) {
            session.send('Вы ввели неверный адрес. Повторите ввод.');
            session.beginDialog('shapeshiftAddress');
            return;
        }

        if (session.userData.withdrawalCurrency == 'Ethereum' && !((session.userData.withdrawalAddress).substr(0, 1) == '0') && (session.userData.withdrawalAddress.length > 44 || session.userData.withdrawalAddress.length < 40)) {
            session.send('Вы ввели неверный адрес. Повторите ввод.');
            session.beginDialog('shapeshiftAddress');
            return;
        }

        rp.get('https://shapeshift.io/marketinfo/' + shapeshift1[session.userData.withdrawalCurrency], (err, res, body) => {
            if (err) {
                session.send('Извините, курс недоступен');
                return;
            }
            var limit = JSON.parse(body);

            var ticker;
            if (session.userData.withdrawalCurrency != 'Bitcoin Cash')
                ticker = currency[session.userData.withdrawalCurrency].ticker;
            else
                ticker = 'BTH';

            session.userData.minWaves = limit.minimum;
            session.userData.maxWaves = limit.limit;
            session.userData.limitRate = limit.rate;
            session.userData.limitMinerFee = limit.minerFee;

            session.send('❗️ Минимальная сумма для вывода ' + ticker + ': ' + limit.minimum + ' WAVES\n\n❗️ Максимальная сумма для вывода ' + ticker + ': ' + limit.limit + ' WAVES');
            session.send('За один WAVES вы получите ' + limit.rate + ' ' + ticker + '.\n\nКомиссия: ' + limit.minerFee + ' ' + currency[session.userData.withdrawalCurrency].ticker + '.');
            builder.Prompts.text(session, 'Сколько WAVES вы желаете обменять в ' + session.userData.withdrawalCurrency);
            let card = Cards.cancelButton(session);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);
        });
    },
    (session, results) => {
        if (results.response == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }
        var re = new RegExp('.', '');

        var sum;

        // Меняем точку на запятую
        if (results.response.search(re) != 0) {
            sum = Number(results.response);
        } else {
            sum = Number(results.response.replace(',', "."));
        }

        if (sum < session.userData.minWaves) {
            session.send('Сумма вывода меньше минимальной');
            session.beginDialog('shapeshiftAmount');
            return;
        } else if (sum > session.userData.maxWaves) {
            session.send('Сумма вывода больше максимальной');
            session.beginDialog('shapeshiftAmount');
            return;
        }

        session.userData.withdrawalAmount = sum;

        session.send('Информация о выводе: \n\n\0\n\n`Валюта на входе:` ' + 'WAVES' + '\n\n\0\n\n`' + currency[session.userData.withdrawalCurrency].ticker + ' адрес: ` ' + session.userData.withdrawalAddress + '\n\n\0\n\n`Валюта на выходе: ` ' + currency[session.userData.withdrawalCurrency].ticker + '\n\n\0\n\n`Сумма в ' + 'WAVES: ` ' + session.userData.withdrawalAmount + '\n\n\0\n\n`Сумма в ' + currency[session.userData.withdrawalCurrency].ticker + ': ` ' + (session.userData.withdrawalAmount * session.userData.limitRate) + '\n\n\0\n\n`Комиссия в ' + currency[session.userData.withdrawalCurrency].ticker + ': ` ' + session.userData.limitMinerFee);
        builder.Prompts.text(session, " ");
        let card = new builder.HeroCard(session)
            .title('Подтвердить вывод')
            .buttons([
                builder.CardAction.imBack(session, "Да", "Да"),
                builder.CardAction.imBack(session, "Нет", "Нет")
            ]);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    (session, results) => {
        if (results.response == 'Да') {
            db.findUser(session.message.user.id)
                .then(
                    (account) => {
                        var options = {
                            method: 'POST',
                            uri: 'https://shapeshift.io/shift',
                            body: {
                                "withdrawal": session.userData.withdrawalAddress, // В основной сети меняем на account[0].address
                                "pair": shapeshift1[session.userData.withdrawalCurrency],
                                "apiKey": '30246eb3e22204280f9b656f770fe54261a13c7ab54b8a9b46e80d6af854371a826bf93b888761122e4c793b43236934234a5671b8daa83de1e4c4d6e33f92b0'
                            },
                            json: true // Automatically stringifies the body to JSON
                        };

                        rp(options)
                            .then(function (parsedBody) {

                                var seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed);
                                console.log(parsedBody);
                                const transferData = {
                                    recipient: parsedBody.deposit,
                                    assetId: 'WAVES',
                                    amount: Number((session.userData.withdrawalAmount * Math.pow(10, 8)).toFixed(0)),
                                    feeAssetId: 'WAVES',
                                    fee: 100000,
                                    attachment: '',
                                    timestamp: Date.now()
                                }

                                Waves.transfer(transferData, seed.keyPair)
                                    .then(
                                        (good) => {
                                            db.outCurrency(session.message.user.id, session.userData.withdrawalCurrency, session.userData.withdrawalAmount, session.userData.withdrawalAddress);
                                            session.send('Перевод прошёл успешно. Средства зачислятся в течении часа');
                                            session.beginDialog('SecondMenu');
                                        }
                                    )
                                    .catch(
                                        (err) => {
                                            session.send('Извините, по каким-то причинам перевод не был совершён');
                                            session.beginDialog('SecondMenu');
                                        }
                                    );
                            })
                            .catch(function (err) {
                                console.log('ShapeShift недоступен или адрес неправильный')
                                console.log(err);
                                session.send('Введённый адрес не соответствует сети ' + session.userData.withdrawalCurrency);
                                session.beginDialog('SecondMenu');
                            });
                    }
                );
        } else if (results.response == 'Нет') {
            session.send('Вы отменили вывод.');
            session.beginDialog('SecondMenu');
            return;
        } else {
            session.beginDialog('shapeshiftAmount');
            return;
        }
    }
]);

bot.dialog('about', [
    (session) => {
        session.send('**Team:**\n\n@EnormousRage\n\n@kirbej\n\n\0\n\n**BUTTON | FOOD:** @button_food_bot\n\n**BUTTON | COURSE:** @button_course_bot');
        session.beginDialog('SecondMenu');
    }
]);

// СПОРЫ НАЧАЛО
bot.dialog('rates', [
    (session) => {
        builder.Prompts.choice(session, 'Выберите', 'Мои споры|Создать спор|Принять участие в споре|Назад', {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results, next) => {
        switch (results.response.index) {
            case 0:
                session.beginDialog('myDisputs');
                break;
            case 1:
                session.beginDialog('createDisput');
                break;
            case 2:
                session.beginDialog('takePlaceInDisput');
                break;
            case 3:
                session.beginDialog('SecondMenu');
                break;
        }
    }
]).triggerAction({
    matches: /^(bets|rates)/
})

bot.dialog('myDisputs', [
    (session) => {
        db.findDisputsByUserId(session.message.user.id, (disputsArr) => {
            if (disputsArr.length == 0) {
                session.send('Вы ещё не создали ни одного спора')
                session.beginDialog('rates');
                return;
            }
            for (let i in disputsArr) {
                var card;
                if (disputsArr[i].user_id2 != '') {
                    card = Cards.myDisputCard(session, disputsArr[i].num, disputsArr[i].whatType, disputsArr[i].match, disputsArr[i].score1, true);
                } else {
                    card = Cards.myDisputCard(session, disputsArr[i].num, disputsArr[i].whatType, disputsArr[i].match, disputsArr[i].score1, false);
                }
                let msg = new builder.Message(session).addAttachment(card);
                session.send(msg);

                if (i == (disputsArr.length - 1)) {
                    let card = Cards.cancelButtonToRate(session);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            }
        });
    }
]);

const teams = {
    'Германия-Россия': 'g-r',
    'Россия-Франция': 'r-f',
    'Англия-США': 'a-u',
    'Италия-Швеция': 'i-s'
}

bot.dialog('createDisput', [
    (session) => {
        db.findUser(session.message.user.id)
            .then(
                (account) => {
                    Waves.checkWavesBalance(account[0].address, (
                        (balance) => {
                            if (balance < 0.001) {
                                session.send('Недостаточно средств, чтобы создать спор');
                                session.beginDialog('rates');
                                return;
                            } else {
                                builder.Prompts.choice(session, 'Выберите на что ставить', 'ЧМ по Футболу|Ещё что-то|И ещё что-то|И ещё немного|Назад', {
                                    listStyle: builder.ListStyle.button
                                });
                            }
                        }
                    ));
                }
            );
    },
    (session, results) => {
        session.userData.disputType = results.response.entity;
        builder.Prompts.choice(session, 'Выберите матч', teams, {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results, next) => {
        session.userData.match = results.response.entity;
        builder.Prompts.text(session, 'Введите предполагаемый счёт. \n\n\0\n\nПример: 0-0');
    },
    (session, results) => {
        session.userData.score = results.response;
        builder.Prompts.choice(session, 'Выберите валюту', 'Waves|Bitcoin|Ethereum', {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results) => {
        session.userData.currency = results.response.entity;
        session.beginDialog('enterDisputPrice');
    }
]);

bot.dialog('enterDisputPrice', [
    (session) => {
        builder.Prompts.text(session, 'Введите сумму, на которую будете спорить');
    },
    (session, results) => {
        var re = new RegExp('.', '');

        var sum;

        // Меняем точку на запятую
        if (results.response.search(re) != 0) {
            sum = Number(results.response);
        } else {
            sum = Number(results.response.replace(',', "."));
        }

        db.findUser(session.message.user.id)
            .then(
                (account) => {
                    let seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed);

                    const transferData = {
                        recipient: '3PM4AZgoddsCrsgGCD9ZQVq2KF4PCTjtK4w',
                        assetId: currency[session.userData.currency].assetID,
                        amount: Number((Number(sum) * Math.pow(10, 8)).toFixed(0)) + 100000,
                        feeAssetId: 'WAVES',
                        fee: 100000,
                        attachment: '',
                        timestamp: Date.now()
                    };

                    Waves.transfer(transferData, seed.keyPair)
                        .then(
                            (done) => {
                                session.send('Вы создали спор');
                                db.createDisput(session.message.user.id, session.userData.disputType, session.userData.match, session.userData.score, session.userData.currency, sum);
                                session.beginDialog('rates');
                            }
                        )
                        .catch(
                            (err) => {
                                session.send('Ошибка в создании спора. Возможно, у вас недостаточно средств на балнсе.\n\n\0\n\nПопробуйте ввести другую сумму');
                                session.beginDialog('enterDisputPrice');
                                let card = Cards.cancelButtonToRate(session);
                                let msg = new builder.Message(session).addAttachment(card);
                                session.send(msg);
                            }
                        );
                }
            );
    }
]);

bot.dialog('takePlaceInDisput', [
    (session) => {
        db.findUnconfirmedDisputs((disputsArr) => {
            if (disputsArr.length == 0) {
                session.send('Активных споров не обнаружено')
                session.beginDialog('rates');
                return;
            }
            for (let i in disputsArr) {
                let card = Cards.disputCard(session, disputsArr[i].num, disputsArr[i].whatType, disputsArr[i].match, disputsArr[i].score1, disputsArr[i].currency, disputsArr[i].price)
                let msg = new builder.Message(session).addAttachment(card);
                session.send(msg);

                if (i == (disputsArr.length - 1)) {
                    let card = Cards.cancelButtonToRate(session);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            }
        });
    }
]);

bot.dialog('deleteDisput', [
    (session) => {
        var num = Number(session.message.text.substring(12));
        session.userData.num = num;
        db.findDisputsByNum(session.userData.num, (disput) => {
            builder.Prompts.choice(session, 'Вы точно желаете удалить спор №' + num + '?\n\n После удаления вам вернётся ' + disput.price + ' ' + currency[disput.currency].ticker, 'Да|Нет');
        });
    },
    (session, results) => {
        if (results.response.index == 1) {
            session.send('Спор не был удален');
            session.beginDialog('takePlaceInDisput');
            return;
        }

        db.findDisputsByNum(session.userData.num, (disput) => {
            var seed = Waves.wavesAcc(session, 'addNewAcc', session.message.user.id, 'layer model party horse metal aspect custom horn forum biology mask salt ahead ribbon comfort', bot);

            db.findUser(disput.user_id1)
                .then(
                    (account) => {
                        const transferData = {
                            recipient: account[0].address,
                            assetId: currency[disput.currency].assetID,
                            amount: Number((Number(disput.price) * Math.pow(10, 8)).toFixed(0)),
                            feeAssetId: 'WAVES',
                            fee: 100000,
                            attachment: '',
                            timestamp: Date.now()
                        };
                        Waves.transfer(transferData, seed[1].keyPair)
                            .then(
                                (done) => {
                                    db.removeDisputsByNum(session.userData.num, (isTrue) => {
                                        session.send('Вы удалили спор\n\nДеньги были возвращены вам на аккаунт');
                                        session.beginDialog('myDisputs');
                                    });
                                }
                            )
                            .catch(
                                (err) => {
                                    session.send('Не удалось удалить спор');
                                    session.beginDialog('myDisputs');
                                }
                            );
                    }
                );
        });

    }
]).triggerAction({
    matches: /^deleteDisput\d{1,}/
});

bot.dialog('acceptDisput', [
    (session) => {
        var num = Number(session.message.text.substring(17));
        session.userData.num = num;

        builder.Prompts.text(session, 'Введите предполагаемый счёт. \n\n\0\n\nПример: 0-0');
    },
    (session, results) => {
        session.userData.score2 = results.response;
        db.findDisputsByNum(session.userData.num, (disput) => {
            builder.Prompts.choice(session, 'Подтвердить участие в спорте. (с вас спишется ' + disput.price + ' ' + currency[disput.currency].ticker + ')', 'Да|Нет');
        });
    },
    (session, results) => {
        if (results.response.index == 1) {
            session.send('Спор не был принят');
            session.beginDialog('takePlaceInDisput');
            return;
        }

        db.findDisputsByNum(session.userData.num, (disput) => {
            if (disput.user_id1 != session.message.user.id) {
                db.findUser(session.message.user.id)
                    .then(
                        (account) => {
                            let seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed);

                            const transferData = {
                                recipient: '3PM4AZgoddsCrsgGCD9ZQVq2KF4PCTjtK4w',
                                assetId: currency[disput.currency].assetID,
                                amount: Number((Number(disput.price) * Math.pow(10, 8)).toFixed(0)) + 100000,
                                feeAssetId: 'WAVES',
                                fee: 100000,
                                attachment: '',
                                timestamp: Date.now()
                            };

                            Waves.transfer(transferData, seed.keyPair)
                                .then(
                                    (done) => {
                                        db.updateDisput(session.userData.num, session.userData.score2);
                                        db.acceptDisput(session.userData.num, session.message.user.id);
                                        nt.sendNot(session, bot, disput.user_id1, '', 'Ваш спор номер ' + num + ' приняли');
                                        session.send('Вы приняли заявку на спор');
                                        session.beginDialog('rates');
                                    }
                                )
                                .catch(
                                    (err) => {
                                        session.send('Не удалось принять участие в споре. Возможно, из-за недостатка средств на балансе.');
                                        session.beginDialog('rates');
                                    }
                                );
                        }
                    );
            } else {
                session.send('Нельзя принять свою ставку. Попробуйте принять другую.');
                session.beginDialog('takePlaceInDisput');
            }
        });
    }
]).triggerAction({
    matches: /^takePlaceInDisput\d{1,}/
});

// СПОРЫ КОНЕЦ




// var intents = new builder.IntentDialog({
//     recognizers: [Server.recognizer]
// })

// .matches('wallets', (session) => {
//     // session.send('You reached Eat intent, you said \'%s\'.', session.message.text);
//     session.beginDialog('wallet');
// })
// .onDefault((session) => {
//     // session.send('Sorry, I did not understand \'%s\'.', session.message.text);
// });

// bot.beginDialogAction('wallet', 'wallets');