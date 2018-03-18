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
const Swap = require('./schemes/swapScheme.js');
const request = require('request');
const CryptoJS = require("crypto-js");
const rp = require('request-promise');
const nt = require('./nt.js');
// Object of CryptoCurrency START

// Данные для реферальной программы начало
var referalAssetId = 'WAVES';
var referalAmount1 = 4000000;
var referalAmount2 = 1400000;
var referalAmount3 = 800000;


// Данные для реферальной программы конец

var shapeshift = {
    'Bitcoin': 'btc_waves',
    'Bitcoin Cash': 'bch_waves',
    'Ethereum': 'eth_waves',
    'ZCash': 'zec_waves',
    'Litecoin': 'ltc_waves',
    'Назад': 'отмена'
}
var shapeshift1 = {
    'Bitcoin': 'waves_btc',
    'Bitcoin Cash': 'waves_bch',
    'Ethereum': 'waves_eth',
    'ZCash': 'waves_zec',
    'Litecoin': 'waves_ltc',
    'Назад': 'отмена'
}

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

var currency2 = {
    "Мгновенная покупка": 'Мгновенная покупка',
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

var placeObj = ['MarketOverview_12800_5000', 'true_crypto_signals_2700_2500', 'cryptomoney_4900_4000', 'cryptolamer_834_1000', 'cryptocurrency_1500_399', 'link235345342', 'link09876526', 'link2354342', 'link23454324', 'link0234923889'];

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

            if (ciphertext.substring(0, 5) == 'bonus') {
                db.findRefUser(session.message.user.id, (referal) => {

                    if (referal == undefined) {
                        db.findUser(session.message.user.id)
                            .then(
                                (account) => {
                                    if (account.length == 0) {
                                        var user_id = session.message.user.id;

                                        var seed1 = Waves.wavesAcc(session, 'createNewAcc', user_id, 'прост', bot);

                                        db.createAndUpdateUser(user_id, seed1[1].address, seed1[0], session.message.user.name)
                                            .then(
                                                function willBe() {
                                                    session.send(`🛑 **Обязательно запишите Seed!** \n\nВаш Seed: `);
                                                    session.send(seed1[1].phrase);
                                                    session.send("📬 **Ваш Address:** ");
                                                    session.send(seed1[1].address);

                                                    db.findRefLink(ciphertext, (referal) => {
                                                        if (referal == undefined) {
                                                            session.send('Такой реферальной ссылки не существует.');
                                                            session.beginDialog('SecondMenu');
                                                            return;
                                                        }
                                                        if (referal.user_id != session.message.user.id) {
                                                            db.createRefUser(session.message.user.id, referal.user_id, (created) => {
                                                                // Тут начинается РЕФЕРАЛЬНАЯ СИСТЕМА
                                                                db.findUser(session.message.user.id)
                                                                    .then(
                                                                        (account) => {
                                                                            var seed = Waves.returnedWaves.Seed.fromExistingPhrase('cargo print junior august rocket upper broom south menu bamboo feel shy guilt syrup mesh');
                                                                            db.createReferal(session.message.user.id, referal.user_id, 'no', 'no', (created) => {
                                                                                // Тут надо начислить лавандос referal.user_id (N монеток) (человеку, который кинул ссылку)
                                                                                // Добавляем referal.user_id + 1 в друга 1-го уровня
                                                                                session.userData.refUser_id = referal.user_id;
                                                                                db.findUser(referal.user_id)
                                                                                    .then(
                                                                                        (account) => {
                                                                                            // РАСКОММЕНТИРОВАТЬ ДЛЯ РЕФЕРАЛЬНОЙ СИСТЕМЫ НОМЕР 1 НАЧАЛО
                                                                                            // const transferData = { 
                                                                                            //     recipient: account[0].address,
                                                                                            //     assetId: referalAssetId,
                                                                                            //     amount: referalAmount1,
                                                                                            //     feeAssetId: 'WAVES',
                                                                                            //     fee: 100000,
                                                                                            //     attachment: '',
                                                                                            //     timestamp: Date.now()
                                                                                            // };

                                                                                            // Waves.transfer(transferData,seed.keyPair) 
                                                                                            //     .then(
                                                                                            //         (transferData) => {
                                                                                            //             // Тут + 1 идёт людям за рефералов
                                                                                            // db.findReferal(account[0].user_id, (referal1) => {
                                                                                            //     db.updateReferalCount1(account[0].user_id, referal1.refCount1);
                                                                                            // });

                                                                                            //             nt.sendNot(session,bot,account[0].user_id,account[0].name, 'Вашу реферальную ссылку активировал друг 1-го уровня. Вы получили '+referalAmount1*Math.pow(10, -8)+'WAVES');
                                                                                            //         }
                                                                                            //     );
                                                                                            // РАСКОММЕНТИРОВАТЬ ДЛЯ РЕФЕРАЛЬНОЙ СИСТЕМЫ НОМЕР 1 КОНЕЦ

                                                                                            // РЕФЕРАЛЬНАЯ СИСТЕМА НОМЕР 2
                                                                                            nt.sendNot(session, bot, account[0].user_id, account[0].name, 'По вашей реферальной ссылке перешёл <b>Друг 1-го уровня</b>. Вы получите <b>' + referalAmount1 * Math.pow(10, -8) + 'WAVES</b> как только <b>Друг</b> совершит первую покупку или продажу в меню <b>"⚡️ Быстрая покупка"</b>');
                                                                                        }
                                                                                    );


                                                                                if (referal.lastReferal3 != 'undefined') {
                                                                                    if (referal.lastReferal2 != 'no') {
                                                                                        // Скидываем referal.lastReferal2 N*0.02
                                                                                        // Записываем referal.lastReferal2 в текущего реферала под lastReferal3
                                                                                        // Добавляем referal.lastReferal2 + 1 в друга 3-го уровня
                                                                                        db.findUser(referal.lastReferal2)
                                                                                            .then(
                                                                                                (account) => {
                                                                                                    // РЕФЕРАЛЬНАЯ СИСТЕМА НОМЕР 1 НАЧАЛО
                                                                                                    // const transferData = { 
                                                                                                    //     recipient: account[0].address,
                                                                                                    //     assetId: referalAssetId,
                                                                                                    //     amount: referalAmount3,
                                                                                                    //     feeAssetId: 'WAVES',
                                                                                                    //     fee: 100000,
                                                                                                    //     attachment: '',
                                                                                                    //     timestamp: Date.now()
                                                                                                    // };

                                                                                                    // Waves.transfer(transferData,seed.keyPair) 
                                                                                                    //     .then(
                                                                                                    //         (transferData) => {
                                                                                                    // Тут + 1 идёт людям за рефералов
                                                                                                    // db.findReferal(account[0].user_id, (referal1) => {
                                                                                                    //     db.updateReferalCount3(referal.lastReferal2, referal1.refCount3);
                                                                                                    // });

                                                                                                    db.updateReferal3(session.message.user.id, referal.lastReferal2);
                                                                                                    // nt.sendNot(session,bot,account[0].user_id,account[0].name, 'Вашу реферальную ссылку активировал друг 3-го уровня. Вы получили '+referalAmount3*Math.pow(10, -8)+'WAVES');
                                                                                                    // nt.sendNot(session,bot,account[0].user_id,account[0].name, 'Вашу реферальную ссылку активировал друг 3-го уровня.');
                                                                                                    // }
                                                                                                    // );  
                                                                                                    // РЕФЕРАЛЬНАЯ СИСТЕМА НОМЕР 1 КОНЕЦ

                                                                                                    // РЕФЕРАЛЬНАЯ СИСТЕМА НОМЕР 2
                                                                                                    nt.sendNot(session, bot, account[0].user_id, account[0].name, 'По вашей реферальной ссылке перешёл <b>Друг 3-го уровня</b>. Вы получите <b>' + referalAmount3 * Math.pow(10, -8) + 'WAVES</b> как только <b>Друг 3-го уровня</b> совершит первую покупку или продажу в меню <b>"⚡️ Быстрая покупка"</b>');
                                                                                                }
                                                                                            );
                                                                                    }
                                                                                    // Скидываем referal.lastReferal1 N/5
                                                                                    // Записываем referal.lastReferal1 в текущего реферала под lastReferal2
                                                                                    // Добавляем referal.lastReferal1 + 1 в друга 2-го уровня
                                                                                    db.findUser(referal.lastReferal1)
                                                                                        .then(
                                                                                            (account) => {
                                                                                                // РЕФЕРАЛЬНАЯ СИСТЕМА НОМЕР 1
                                                                                                // const transferData = { 
                                                                                                //     recipient: account[0].address,
                                                                                                //     assetId: referalAssetId,
                                                                                                //     amount: referalAmount2,
                                                                                                //     feeAssetId: 'WAVES',
                                                                                                //     fee: 100000,
                                                                                                //     attachment: '',
                                                                                                //     timestamp: Date.now()
                                                                                                // };

                                                                                                // Waves.transfer(transferData,seed.keyPair) 
                                                                                                //     .then(
                                                                                                //         (transferData) => {
                                                                                                //             // Тут + 1 идёт людям за рефералов
                                                                                                // db.findReferal(account[0].user_id, (referal1) => {
                                                                                                //     db.updateReferalCount2(referal.lastReferal1, referal1.refCount2);
                                                                                                // });
                                                                                                db.updateReferal2(session.message.user.id, referal.lastReferal1);
                                                                                                //             nt.sendNot(session,bot,account[0].user_id,account[0].name, 'Вашу реферальную ссылку активировал друг 2-го уровня. Вы получили '+referalAmount2*Math.pow(10, -8)+'WAVES');
                                                                                                //         }
                                                                                                //     );
                                                                                                nt.sendNot(session, bot, account[0].user_id, account[0].name, 'По вашей реферальной ссылке перешёл <b>Друг 2-го уровня</b>. Вы получите <b>' + referalAmount2 * Math.pow(10, -8) + 'WAVES</b> как только <b>Друг 2-го уровня</b> совершит первую покупку или продажу в меню <b>"⚡️ Быстрая покупка"</b>');
                                                                                                session.beginDialog('SecondMenu');
                                                                                                return;
                                                                                            }
                                                                                        );
                                                                                } else {
                                                                                    session.beginDialog('SecondMenu');
                                                                                    return;
                                                                                }
                                                                            });
                                                                        });
                                                            });
                                                        } else {
                                                            session.send('Нельзя воспользоваться своей реферальной ссылкой.');
                                                            return;
                                                        }
                                                    });
                                                });
                                    } else {
                                        session.send('Нельзя воспользоваться реферальной ссылкой. У вас уже есть аккаунт.');
                                        return;
                                    }

                                }
                            );
                    } else {
                        session.send('Вы уже активировали реферальную ссылку.');
                        return;
                    }
                });
                return;
            }

            Gift.find({
                    encrMessage: ciphertext
                }, function (err, doc) {

                })
                .then(function (res) {
                    if (res.length == 0) {
                        var p = 0;
                        for (let i in placeObj) {
                            if (ciphertext == placeObj[i]) {
                                p = p + 1;
                            }
                        }
                        if (p != 0) {
                            // Трекинг маркетинговых площадок начало

                            var d = 0;
                            var p = 0;
                            for (let i in placeObj) {
                                if (session.message.text.substring(7) == placeObj[i]) {
                                    db.findUser(session.message.user.id)
                                        .then(
                                            (account) => {
                                                if (account.length == 0) {
                                                    db.whatPlace(session.message.user.id, session.message.text.substring(7), session.message.user.name, Data.getTransactionData('no', String(Date.now()).substring(0, String(Date.now()).length - 3)), () => {
                                                        session.beginDialog('createWallet');
                                                        console.log('Перешли по ссылке');
                                                        d = d + 1;
                                                        return;
                                                    })
                                                } else {
                                                    session.beginDialog('SecondMenu');
                                                    return;
                                                }
                                            }
                                        );
                                }
                            }
                            // Трекинг маркетинговых площадок конец
                            return;
                        }
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
                                            function willBe() {
                                                session.send(`Обязательно запишите Seed! \nВаш Seed: `);
                                                session.send(seed[1].phrase);
                                                session.send("Ваш Address: ");
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
                builder.Prompts.choice(session, "## Главное меню", '⚡️ Быстрая покупка|💳 Кошелёк|💹 Криптобиржа|📞 Оплатить телефон|🔥 Получить бонус|Ставки', {
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
                session.beginDialog('swapNew');
                break;
            case 1:
                session.beginDialog('wallet');
                break;
                // case 2:
                //     session.beginDialog('swap');
                //     break;
            case 2:
                session.beginDialog('exchange');
                break;
            case 3:
                session.userData.whatDialog = 'phone';
                session.beginDialog('makeAtransaction');
                break;
            case 4:
                session.beginDialog('referal');
                break;
            case 5:
                session.beginDialog('rates');
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
                        function willBe() {
                            session.send(`Обязательно запишите Seed! \nВаш Seed: `);
                            session.send(seed[1].phrase);
                            session.send("Ваш Address: ");
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

bot.dialog('aboutWallet', [
    function (session, results) {
        // var card = Cards.createHeroCard(session);
        // var msg = new builder.Message(session).addAttachment(card);
        var msg1;
        msg1 = "BUTTON - кошелек в твоём телеграмме. С помощью BUTTON можно хранить и переводить своим друзьям не только фиатные деньги, но и криптовалюту.\n\n\0\n\n";
        msg1 += 'Waves Light Client. Официальный веб-клиент платформы waves. \n\nhttps://beta.wavesplatform.com \n\nC помощью вашего SEED вы можете зайти в ваш кошелек.\n\n\0\n\n';
        msg1 += 'Наши контакты. Будем рады Вашим отзывам и предложениям.\n\n@stsasha\n\n@dictum_sapienti_sat_est\n\n';
        // msg1 +=`[img src=https://disruptordaily.com/wp-content/uploads/2017/03/crypto-currency-wallet.jpg alt=foobar]`;
        session.send(msg1);

        session.beginDialog('SecondMenu');
    }
]);

var instructionVars = {
    "1️⃣ Мой баланс": {
        name: 1
    },
    "2️⃣ Переводы": {
        name: 2
    },
    "3️⃣ Мой аккаунт": {
        name: 3
    },
    "4️⃣ Оплатить телефон": {
        name: 4
    },
    "5️⃣ Общая информация": {
        name: 5
    },
    "❌ Отмена": {
        name: 6
    }
}

bot.dialog('instruction', [
    function (session) {
        session.send("ℹ️ В данном разделе можно узнать о том, **как работать с ботом**");
        builder.Prompts.choice(session, "🔤 О каком разделе бота вам нужна информация?", instructionVars, {
            listStyle: builder.ListStyle.button
        })
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('instructionBal');
                break;

            case 1:
                session.beginDialog('instructionSends');
                break;

            case 2:
                session.beginDialog('instructionAccount');
                break;

            case 3:
                session.beginDialog('instructionTel');
                break;

            case 4:
                session.beginDialog('aboutWallet');
                break;

            case 5:
                session.beginDialog('wallet');
                break;

            default:
                session.endDialog();
                break;
        }
    },
]);

bot.dialog('instructionBal', [
    function (session) {
        var answer = "";
        answer += "**Мой баланс** показывает не только сбережения в валюте, но и их примерную стоимость в рублях\n\n\0\n\n";
        answer += "Курс берется с платформы **Crptonator** https://cryptonator.com";
        session.endDialog(answer);
    }
]);

bot.dialog('instructionSends', [
    function (session) {
        var answer = "";
        answer += "**Перевести** позволяет вам совершать переводы пользователям данного бота. Можно отправлять валюту, указывая nickname пользователя в Telegram.\n\n\0\n\n";
        answer += "**Выписать чек** позволяет вам передать нужную вам сумму тому пользователю, который перейдет по ссылке. Если пользователь не зарегистрирован в системе - ему автоматически будет создан аккаунт и начислены средства.\n\n\0\n\n";
        answer += "**История** позволяет вам получить статистику по переводам вам и от вас.\n\n\0\n\n";
        answer += "**ВАЖНО:** Комиссия за перевод всегда равна 0.001 WAVES. Для любой валюты. Комиссия снимается не с **перевода**, а с **баланса**. Советуем вам всегда иметь немного WAVES для переводов. Пары рублей - достаточно.";
        session.endDialog(answer);
    }
]);

bot.dialog('instructionAccount', [
    function (session) {
        var answer = "";
        answer += "**Мой аккаунт** содержит информацию, которая позволяет пользоватся аккаунтом вне бота\n\n\0\n\n";
        answer += "**Адрес** это уникальной идентификатор в сети WAVES, по нему вам отправляется любая валюта в данной сети\n\n\0\n\n";
        answer += "**SEED** это ваш пароль для доступа к аккаунту. Если вы его не знаете, получить доступ к аккаунту - невозможно.\n\n\0\n\n";
        answer += "**ВАЖНО:** никому не показывайте ваш SEED. Если пользователь знает SEED, то он считается владельцем аккаунта. Внутри нашего сервиса ваш SEED не хранится, для всех переводов мы используем шифрование.";
        session.endDialog(answer);
    }
]);

bot.dialog('instructionTel', [
    function (session) {
        var answer = "";
        answer += "**Оплатить телефон** позволяет пополнить баланс вашего телефона со счета вашего аккаунта\n\n\0\n\n";
        answer += "Для пополнения можно выбрать любую из представленных валют\n\n\0\n\n";
        answer += "**ВАЖНО:** требуется время на пополнение. В случае, если на ваш номер не пришли деньги и прошло больше 24 часов - обращайтесь к @StSasha";
        session.endDialog(answer);
    }
]);
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


// bot.dialog('getBalance', [
//     function (session, args) {
//         var user_id = session.message.user.id;
//         db.findUser(user_id)
//             .then(function (res1) {

//                 var balances = {};
//                 for (var i in currency) {

//                     if (currency[i] == 'отмена') {
//                         continue;
//                     } else {
//                         Waves.getBalance(session, res1[0].address, currency[i].assetID, currency[i].name, currency[i].course, function (balance, name, course) {

//                             balances[name] = balance;
//                             balances[name + "Rub"] = course;

//                             if (((Object.keys(balances).length / 2) + 1) == Object.keys(currency).length) {
//                                 console.log(balances);
//                                 session.send(
//                                     "## BUTTON кошелек \n\n\0\n\n" +
//                                     "`Waves:` " + `${balances['Waves']}` + " WAVES \n\n" + "`Примерно:` " + `${(balances['WavesRub']*balances['Waves']).toFixed(2)}` + " RUB \n\n\0\n\n" +
//                                     "`Bitcoin:` " + `${balances['Bitcoin']}` + " BTC \n\n" + "`Примерно:` " + `${(balances['BitcoinRub']*balances['Bitcoin']).toFixed(2)}` + " RUB\n\n\0\n\n" +
//                                     "`Ethereum:` " + `${balances['Ethereum']}` + " ETH \n\n" + "`Примерно:` " + `${(balances['EthereumRub']*balances['Ethereum']).toFixed(2)}` + " RUB\n\n\0\n\n" +
//                                     "`ZCash:` " + `${balances['ZCash']}` + " ZEC \n\n" + "`Примерно:`" + `${(balances['ZCashRub']*balances['ZCash']).toFixed(2)}` + " RUB\n\n\0\n\n" +
//                                     "`Litecoin:` " + `${balances['Litecoin']}` + " LTC \n\n" + "`Примерно:` " + `${(balances['LitecoinRub']*balances['Litecoin']).toFixed(2)}` + " RUB\n\n\0\n\n" +
//                                     "`US Dollar:` " + `${balances['US_Dollar']}` + " USD \n\n" + "`Примерно:` " + `${(balances['US_DollarRub']*balances['US_Dollar']).toFixed(2)}` + " RUB\n\n\0\n\n" +
//                                     "`Euro:` " + `${balances['Euro']}` + " EUR \n\n" + "`Примерно:` " + `${(balances['EuroRub']*balances['Euro']).toFixed(2)}` + " RUB\n\n\0\n\n" +
//                                     "`Всего примерно:` " + `${Number((balances['WavesRub']*balances['Waves']).toFixed(0))+Number((balances['BitcoinRub']*balances['Bitcoin']).toFixed(2))+Number((balances['EthereumRub']*balances['Ethereum']).toFixed(0))+Number((balances['ZCashRub']*balances['ZCash']).toFixed(0))+Number((balances['LitecoinRub']*balances['Litecoin']).toFixed(0))+Number((balances['US_DollarRub']*balances['US_Dollar']).toFixed(0))+Number((balances['EuroRub']*balances['Euro']).toFixed(0))} RUB\n\n`
//                                 );
//                             }
//                         });
//                     }
//                 }
//             });
//     }
// ]);

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
                        } else if (session.userData.whatDialog != 'phone') {
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
                        } else {

                            builder.Prompts.text(session, " ");
                            var card = Cards.createPhoneCard(session);
                            var msg = new builder.Message(session).addAttachment(card);
                            session.send(msg);
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
        } else if (session.userData.whatDialog == 'phone') {
            // Если переходим по диалогу "оплатить телефон", то проверяем на кол-во символов номера
            if (results.response.length == 11 && (results.response.substring(0, 2) == '89' || results.response.substring(0, 2) == '79' || results.response.substring(0, 3) == '+79' || results.response.substring(0, 4) == '+380', results.response.substring(0, 3) == '380')) {
                session.userData.telephone = results.response;
                session.userData.name2 = "StSasha";
                session.userData.address2 = "3PA1n2NYDZQjisxFiojTxCaGjNbGfsXkFnG";

                // Берём текущую дату и отправляем данные пользователю на подтверждение
                var currentData = Data.getTransactionData('yes');
                session.send("## Данные о переводе \n\n\0\n\n" +
                    "`Имя отправителя` \n\n" + `${session.message.user.name} \n\n` +
                    "`Адрес отправителя` \n\n" + `${session.userData.address1} \n\n` +
                    "`Телефон пополнения` \n\n" + `${session.userData.telephone} \n\n\0\n\n` +
                    "`Валюта` \n\n" + `${session.userData.currency.name} \n\n` +
                    "`Курс к рублю` \n\n" + `${session.userData.price} \n\n\0\n\n` +
                    "`Сумма в рублях` \n\n" + `${session.userData.sumInRub} \n\n` +
                    "`Сумма в валюте` \n\n" + `${session.userData.sum} \n\n\0\n\n` +
                    "`Время перевода` \n\n" + `${currentData} \n\n`
                );

                builder.Prompts.choice(session, "Подтвердить перевод?", "Да|Нет");
            } else {
                session.send('Вы ввели некорректный номер телефона');
                session.beginDialog('SecondMenu');
                return;
            }
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
                if (session.userData.whatDialog != 'phone')
                    session.send("Ваш перевод выполняется, подождите около 30 секунд");
                else {
                    session.send("Вы один из первых в мире людей, кто пополняет телефон криптовалютой! Операция выполнится в ближайшее время");
                    db.addPhoneTx(session.message.user.id, session.userData.telephone, session.userData.currency.ticker, session.userData.sum);
                }

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

                                    // Если мы не кладём деньги на телефон
                                    if (session.userData.whatDialog != 'phone') {
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
                                    } else {
                                        nt.sendNot(session, bot, '-261017675', 'Telephone chat', '📩 <b>Перевод: </b> ' + `${session.userData.name1}` + ' нужно пополнить на ' + `${session.userData.sum}` + " " + `${session.userData.currency.ticker}` + " для телефона " + `${session.userData.telephone}` + "\n\0Это примерно " + `${session.userData.sumInRub}` + " RUB");
                                    }
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






// ОБМЕН КРИПТА-ФИАТ НАЧАЛО
// Ну это самый ебанутый кусок кода
// Изначально идет swap => sellRubToCrypta || sellCryptaToRub || myChoice 
// Если sellRubToCrypta => buyCrMenu => BuyCrypto || findOrder || swap
// Если sellCryptaToRub => sellCrMenu => sellCrypto || findOrder || swap
// Если myChoice => myOrders || swap
// 
// BuyCrypto => swaporder
// sellCrypto => swaporder
// swaporder => endDialog 
// myOrders => Confirm => payOrder => end
// И тут еще не все
bot.dialog('swap', [
    // (session) => {
    //     session.endDialog("Функция будет доступна в ближайшее время");
    // }
    function (session) {
        session.send('💵 Тут можно **продавать и покупать** криптовалюту у других пользователей за **реальные деньги.**\n\n\0\n\n🔐 Бот выступает **гарантом** между участниками, это позволяет максимально **обезопасить** процесс обмена.\n\n\0\n\n⚠️ Для **безопасности** перевода, пока обе стороны не подтвердят заявку, средства у продавца временно **замораживаются.** В случае проблем с обменом, пишите в **техническую поддержку.**');
        builder.Prompts.choice(session, "Для этого вам требуется создать заявку на продажу или покупку", "📈 Купить валюту|📉 Продать валюту|📄 Мои заявки|❌ Назад", {
            listStyle: builder.ListStyle.button
        })
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('sellRubToCrypta');
                break;

            case 1:
                session.beginDialog('sellCryptaToRub');
                break;

            case 2:
                session.beginDialog('myChoice');
                break;

            default:
                session.beginDialog('SecondMenu');
                break;
        }
    }
]).triggerAction({
    matches: /RUB 🔄 Crypto/
});



// bot.dialog('AllList', [
//     function (session) {
//         builder.Prompts.choice(session, 'В данном разделе находятся **все** заявки на покупки и продажу криптовалюты.\n\n\0\n\nЗаявки на покупку - все заявки людей, которые хотят купить криптовалюту за RUB.\n\n\0\n\nЗаявки на продажу - все заявки людей, которые хотят продать криптовалюту и получить RUB. ', '🔴 Заявки на покупку|🔵 Заявки на продажу|❌ Назад', {
//             listStyle: builder.ListStyle.button
//         })
//     },
//     function (session, results) {
//         switch (results.response.index) {
//             case 0:
//                 var type = {
//                     type: results.response.index
//                 }
//                 session.beginDialog('findOrder', type);
//                 break;

//             case 1:
//                 var type = {
//                     type: results.response.index
//                 }
//                 session.beginDialog('findOrder', type);
//                 break;

//             case 2:
//                 session.beginDialog('swap');
//                 break;
//         }
//     }
// ]);

bot.dialog('findOrder', [
        (session, args, next) => {

            var skip; // сколько заявок пропустить

            var type; // тип продажа / покупка ( 1 / 0)

            var cur; // тип валюты

            if (args == undefined) {
                args = {
                    type: 0,
                    skip: 0,
                    currency: session.userData.zayvkaCrypto.name
                }
                cur = session.userData.zayvkaCrypto.name;
            }
            if (Object.keys(args).length > 1) {
                skip = args.skip;
                type = args.type;
                cur = args.currency;
            } else {
                cur = session.userData.zayvkaCrypto.name;
                skip = 0;
                type = args.type;
            }

            session.userData.skip = skip;
            session.userData.type = type;

            db.findOrders(cur, type, skip, session.userData.sellersService, function (orders) {
                var g = 0;
                for (let i in orders) {
                    if (orders[i].user_id2 == 'no') {
                        g = g + 1;
                        let card = Cards.createOrderCard(session, currency, orders[i].sumCripto, orders[i].sumRub, orders[i].currency, orders[i].cardService, 'noCardNum', orders[i].type, 'yes', orders[i].num);
                        let msg = new builder.Message(session).addAttachment(card);
                        session.send(msg);
                    }
                }
                if (g != 0) {
                    var msg1;
                    if (g > 4) {
                        msg1 = new builder.Message(session).addAttachment(Cards.createButtonCard(session, session.userData.type));
                    } else {
                        msg1 = new builder.Message(session).addAttachment(Cards.createButtonCard(session, session.userData.type, false));
                    }
                    session.send(msg1);
                    next();
                } else {
                    var whatOrder;
                    if (type == 0)
                        whatOrder = 'покупку';
                    else
                        whatOrder = 'продажу';

                    if (skip > 0) {
                        const card = new builder.ThumbnailCard(session);
                        card.buttons([
                            new builder.CardAction(session).title('В главное меню').value('start').type('imBack'),
                        ]).text(`Извините, заявок на ${whatOrder} больше нет`);
                        const message = new builder.Message(session).addAttachment(card);
                        session.send(message);
                    } else {
                        session.send('🔎 Извините, заявки на' + whatOrder + ' ещё не созданы. Вы можете создать новую.');
                        msg1 = new builder.Message(session).addAttachment(Cards.createButtonCard(session, session.userData.type, false));
                        console.log(msg1);
                        session.send(msg1);
                    }
                }
            });
        },
        (session, results) => {
            // не удалять эту функцию
            // почему? Что за костыль?
        }
    ])
    .beginDialogAction('NextOrders', 'Other', {
        matches: /отмена|other|pls*/,
        dialogArgs: {
            action: 'other'
        }
    });

bot.dialog('Other', [
    (session, args, next) => {
        if (session.message.text == 'other') {
            session.beginDialog('findOrder', {
                type: session.userData.type,
                skip: session.userData.skip + 5
            });
            return;
        } else if (session.message.text == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        } else {
            var num = Number(session.message.text.substring(3));
            session.userData.orderNum = num;

            db.findOrUpdateOrder('find', num, session.userData.type)
                .then(
                    function (swap) {
                        if (swap[0]) {
                            if (swap[0].user_id1 != session.message.user.id) {
                                if (session.userData.type == 0) {
                                    session.userData.swapCurrency = swap[0].currency;
                                    session.userData.swapSum = swap[0].sumCripto;
                                    db.findUser(session.message.user.id)
                                        .then(
                                            (account) => {
                                                Waves.getBalance(session, account[0].address, currency[swap[0].currency].assetID, 'noCourse', (balance) => {
                                                    if (balance >= session.userData.swapSum) {
                                                        session.beginDialog('enterCard2');
                                                    } else {
                                                        session.send('Недостаточно средств, чтобы подтвердить заявку');
                                                        session.beginDialog('SecondMenu');
                                                    }
                                                });
                                            }
                                        );
                                } else {
                                    db.findOrUpdateOrder('update', num, session.userData.type, session.message.user.id)
                                        .then(
                                            function (err, doc) {
                                                Swap.find({
                                                        num: session.userData.orderNum,
                                                        type: session.userData.type
                                                    })
                                                    .then(
                                                        function (swap) {
                                                            // Когда ты удаляешь свою заявку - (делать проверку на наличие второго человека, ибо ты можешь никому наявку кинуть)
                                                            db.findUser(swap[0].user_id1)
                                                                .then(
                                                                    (account) => {
                                                                        // let card = Cards.createNtCard(session, swap[0].type, swap[0].num, '1');

                                                                        let _text = 'Вашу заявку на продажу ' + swap[0].sumCripto + ' ' + swap[0].currency + ' приняли.';
                                                                        nt.sendNot(session, bot, swap[0].user_id1, account[0].name, _text);
                                                                        // session.send("Для гарантии совершения сделки бот выступает посрдеником между участниками. Требуется дополнительная комиссия при переводе. Она равна 0.001 Waves");
                                                                        session.send('Вы приняли участие в обмене.\n\n\0\n\n`Сумма к оплате:` ' + swap[0].sumRub + ' рублей.\n\n\0\n\n`Платёжное средство:` ' + swap[0].cardService + '.\n\n\0\n\n`Номер платёжного средства:` ' + swap[0].cardServiceNum);
                                                                        let card = Cards.createNtCard(session, swap[0].type, swap[0].num, '0');
                                                                        let msg = new builder.Message().addAttachment(card);
                                                                        session.send(msg);
                                                                    }
                                                                );
                                                        }
                                                    );
                                                session.beginDialog('SecondMenu');
                                                return;
                                            }
                                        );
                                }
                            } else {
                                session.send('Нельзя принять свою заявку');
                                session.beginDialog('SecondMenu');
                                return;
                            }

                        } else {
                            session.send('Такой заявки не существует');
                            session.beginDialog('SecondMenu');
                            return;
                        }
                    }
                );
        }
    },
]);
bot.dialog('enterCard2', [
    (session, results, next) => {



        if (session.userData.sellersService != 'QIWI' && session.userData.sellersService != 'Яндекс.Деньги') {
            builder.Prompts.number(session, `💳 Введите **номер вашей карты** ${session.userData.sellersService}\n\n *Например: 4568673647833762*`);
        } else {
            builder.Prompts.number(session, `💳 Введите **адрес вашего счета** ${session.userData.sellersService} `);
        }
        let card = Cards.cancelButton(session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    (session, results) => {
        if (String(results.response).length != 16) {
            session.send('Введите **16 цифр** без пробелов');
            session.beginDialog('enterCard2');
            return;
        }
        session.userData.numberservice = Number(results.response);

        if (session.userData.swapCurrency != 'US Dollar' && session.userData.swapCurrency != 'Euro') {
            session.userData.stepen = 8;
        } else {
            session.userData.stepen = 2;
        }

        sum = Number(((session.userData.swapSum) * Math.pow(10, session.userData.stepen)).toFixed(0));

        const transferData = {
            recipient: '3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd',
            assetId: currency[session.userData.swapCurrency].assetID,
            amount: sum,
            feeAssetId: 'WAVES',
            fee: 100000,
            attachment: '',
            timestamp: Date.now()
        };

        const transferData1 = {
            recipient: '3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd',
            assetId: 'WAVES',
            amount: 100000,
            feeAssetId: 'WAVES',
            fee: 100000,
            attachment: '',
            timestamp: Date.now()
        };

        db.findUser(session.message.user.id)
            .then(
                function (account) {
                    var seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed)
                    Waves.transfer(transferData, seed.keyPair)
                        .then(function (res) {
                            Waves.transfer(transferData1, seed.keyPair)
                                .then(function (res) {
                                    Swap.update({
                                        num: parseInt(session.userData.orderNum),
                                        type: session.userData.type
                                    }, {
                                        user_id2: session.message.user.id,
                                        cardServiceNum: session.userData.numberservice
                                    }, function (err, doc) {

                                        db.findOrUpdateOrder('find', parseInt(session.userData.orderNum), session.userData.type)
                                            .then(
                                                (swap) => {
                                                    db.findUser(swap[0].user_id1)
                                                        .then(
                                                            (account) => {
                                                                /* #менятьТекст
                                                                    Тут приходит уведомление человеку, который создал заявку на покупку крипты.
                                                                    т.е. нужно передавать следующие переменные:
                                                                    
                                                                    swap[0].cardService - средство оплаты (Сбер, Qiwi и тд)
                                                                    
                                                                    swap[0].cardServiceNum - номер карты (счёта)

                                                                    swap[0].sumCripto - сумма в крипте

                                                                    swap[0].sumRub - Сколько нужно скинуть в рублях
                                                                
                                                                    swap[0].currency - какую валюту покупают

                                                                    
                                                                    Пример текста:
                                                                    Вашу заявку на покупку swap[0].sumCripto swap[0].currency приняли.
                                                                    Сумма к оплате: swap[0].sumRub рублей. 
                                                                    Платёжное средство: swap[0].cardService. 
                                                                    Номер платёжного средства: swap[0].cardServiceNum

                                                                    После оплаты перейдите в меню "RUB 🔄 Crypto" -> Мои завки -> Есть участник,
                                                                    чтобы подтвердить отправку средств.
                                                                */
                                                                let card = Cards.createNtCard(session, swap[0].type, swap[0].num, '0');

                                                                let _text = 'Вашу заявку на покупку ' + swap[0].sumCripto + ' ' + swap[0].currency + ' приняли.\n\0`Сумма к оплате:` ' + swap[0].sumRub + ' рублей.\n\0`Платёжное средство:` ' + swap[0].cardService + '.\n\0`Номер платёжного средства:` ' + swap[0].cardServiceNum;

                                                                nt.sendNot(session, bot, account[0].user_id, account[0].name, _text, true, card);

                                                                /* #менятьТекст

                                                                    Вы приняли участие в обмене.
                                                                    Как только другой человек отправит вам swap[0].sumRub рублей - вам придёт уведомление.

                                                                */
                                                                session.send('Вы приняли участие в обмене.' + " Как только другой человек отправит вам " + swap[0].sumRub + " рублей - вам придёт уведомление.");
                                                                session.beginDialog('SecondMenu');
                                                            }
                                                        );
                                                }
                                            );
                                    });
                                });
                        })
                        .catch(
                            function (err) {
                                session.send('Недостаточно средств на балансе');
                                session.beginDialog('SecondMenu');
                                return;
                            }
                        );
                }
            );
    }
]).triggerAction({
    matches: /other/i,
    onSelectAction: (session, args) => {
        switch (args.action) {
            case 'other':

                break;
            default:
                session.send('Я вас не понимаю');
                break;
        }
    }
});

bot.dialog('myChoice', [
    function (session) {
        builder.Prompts.choice(session, "В данном разделе будут отображаться заявки, на которые **еще никто не ответил** 1️⃣\n\n\0\n\n А также те заявки, в которых **еще не произведена оплата, но есть 2 участник** 2️⃣", "1️⃣ Никто не ответил|2️⃣ Есть участник|❌ Назад", {
            listStyle: builder.ListStyle.button
        })
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('myOrders');
                session.userData.type1 = 'no';
                break;

            case 1:
                session.beginDialog('myOrders');
                session.userData.type1 = 'yes';
                break;
            default:
                session.beginDialog('swap');
                break;
        }
    }
]);

bot.dialog('myOrders', [
    function (session, args, next) {
        var g = 0;
        Swap.find({
                user_id1: session.message.user.id
            })
            .then(
                function (swap) {
                    for (let i in swap) {
                        if ((swap[i].user_id2 != 'no' && session.userData.type1 == 'yes') && (swap[i].end != true)) {
                            g = g + 1;
                            var btn;
                            var fct;
                            var cardNum;

                            if (swap[i].type == 0) {
                                cardNum = swap[i].cardServiceNum;
                                btn = [
                                    builder.CardAction.imBack(session, 'agtyu0' + (swap[i].type) + (swap[i].num).toString(), 'Подтвердить отправку средств'),
                                    builder.CardAction.imBack(session, swap[i].type + 'удалить_' + (swap[i].num).toString(), 'Удалить заявку')
                                ];
                                fct = swap[i].confirmSell;
                            } else {
                                cardNum = 'noCardNum';
                                btn = [
                                    builder.CardAction.imBack(session, 'agtyu1' + (swap[i].type) + (swap[i].num).toString(), 'Подтвердить получение средств'),
                                    builder.CardAction.imBack(session, swap[i].type + 'удалить_' + (swap[i].num).toString(), 'Удалить заявку')
                                ];
                                fct = swap[i].confirmBuy;
                            }

                            if (swap[i].confirmBuy == 'да' || swap[i].confirmSell == 'да') {
                                btn.splice(1, 1);
                                if (swap[i].type == 0) {
                                    if (swap[i].confirmBuy == 'да' && swap[i].user_id1 == session.message.user.id) {
                                        btn.splice(0, 1);
                                    }
                                } else {
                                    if (swap[i].confirmSell == 'да' && swap[i].user_id1 == session.message.user.id) {
                                        btn.splice(0, 1);
                                    }
                                }
                            }

                            let card = Cards.createOrderCard(session, currency, swap[i].sumCripto, swap[i].sumRub, swap[i].currency, swap[i].cardService, cardNum, swap[i].type, 'no', swap[i].num).buttons(btn);
                            let msg = new builder.Message(session).addAttachment(card);
                            session.send(msg);
                        } else if ((swap[i].user_id2 == 'no' && session.userData.type1 == 'no') && (swap[i].end != true)) {
                            g = g + 1;

                            let card = Cards.createOrderCard(session, currency, swap[i].sumCripto, swap[i].sumRub, swap[i].currency, swap[i].cardService, 'noCardNum', swap[i].type, 'no', swap[i].num).buttons([
                                builder.CardAction.imBack(session, swap[i].type + 'удалить_' + (swap[i].num).toString(), 'Удалить заявку')
                            ]);

                            let msg = new builder.Message(session).addAttachment(card);
                            session.send(msg);
                        }
                    }
                    if (session.userData.type1 == 'yes') {
                        Swap.find({
                                user_id2: session.message.user.id
                            })
                            .then(
                                function (swap) {
                                    for (let i in swap) {
                                        if (swap[i].end != true) {
                                            var btn;
                                            var fct;
                                            var cardNum;
                                            g = g + 1;

                                            if (swap[i].type == 1) {
                                                cardNum = swap[i].cardServiceNum;
                                                btn = [
                                                    builder.CardAction.imBack(session, 'agtyu0' + (swap[i].type) + (swap[i].num).toString(), 'Подтвердить отправку средств'),
                                                    builder.CardAction.imBack(session, swap[i].type + 'удалить!' + (swap[i].num).toString(), 'Отменить участие в обмене')
                                                ];
                                                fct = swap[i].confirmSell;
                                            } else {
                                                cardNum = 'noCardNum';
                                                btn = [
                                                    builder.CardAction.imBack(session, 'agtyu1' + (swap[i].type) + (swap[i].num).toString(), 'Подтвердить получение средств'),
                                                    builder.CardAction.imBack(session, swap[i].type + 'удалить!' + (swap[i].num).toString(), 'Отменить участие в обмене')
                                                ];
                                                fct = swap[i].confirmBuy;
                                            }
                                            if (swap[i].confirmBuy == 'да' || swap[i].confirmSell == 'да') {
                                                btn.splice(1, 1);
                                                if (swap[i].type == 0) {
                                                    if (swap[i].confirmSell == 'да' && swap[i].user_id2 == session.message.user.id) {
                                                        btn.splice(0, 1);
                                                    }
                                                } else {
                                                    if (swap[i].confirmBuy == 'да' && swap[i].user_id2 == session.message.user.id) {
                                                        btn.splice(0, 1);
                                                    }
                                                }
                                            }
                                            let card = Cards.createOrderCard(session, currency, swap[i].sumCripto, swap[i].sumRub, swap[i].currency, swap[i].cardService, cardNum, swap[i].type, 'no', swap[i].num).buttons(btn);
                                            let msg = new builder.Message(session).addAttachment(card);
                                            session.send(msg);
                                        }
                                    }

                                    if (g != 0) {
                                        var msg = new builder.Message(session).addAttachment(Cards.cancelButton(session));
                                        session.send(msg);
                                    } else {
                                        session.send('Нет заявок в состоянии "В ожидании оплаты"');
                                        session.beginDialog('SecondMenu');
                                    }
                                }
                            );
                    } else {
                        if (g != 0) {
                            var msg = new builder.Message(session).addAttachment(Cards.cancelButton(session));
                            session.send(msg);
                        } else {
                            session.send('Вы ещё не создавали заявок');
                            session.beginDialog('SecondMenu');
                        }
                    }
                }
            );
    },
    function (session, results) {
        // Не удалять функцию
    }
]).beginDialogAction('Confirm', 'Confirm', {
    matches: /.удалить*|отмена|^agtyu\d{2,}/,
    dialogArgs: {
        action: 'отмена'
    }
});

// Подтверждение отправки/получения средств
bot.dialog('Confirm', [
    (session, args, next) => {
        var re = new RegExp('удалить_'); // Для своей заявки
        var re1 = new RegExp('удалить!'); // Для чужой заявки


        if (session.message.text.match(re)) {
            var num = Number(session.message.text.substring(9));
            var type = Number(session.message.text.substr(0, 1));

            console.log('Номер заявки: ' + num);
            console.log('Тип заявки: ' + type);

            db.findOrUpdateOrder('find', num, type)
                .then(
                    function (swap) {

                        if (swap[0].end == true) {
                            let date = Data.getTransactionData('no', String(swap[0].exitTime).substring(0, String(swap[0].exitTime).length - 3));
                            session.send('Извините, эта заявка была завершена ' + date);
                            session.beginDialog('SecondMenu');
                            return;
                        }
                        console.log('swap: ' + swap[0]);
                        if (swap[0].currency != 'US Dollar' && swap[0].currency != 'Euro') {
                            session.userData.stepen = 8;
                        } else {
                            session.userData.stepen = 2;
                        }

                        var user_id = swap[0].user_id1;
                        session.userData.usId2 = swap[0].user_id2;
                        session.userData.swap = swap[0];
                        if (type == 1) {

                            db.findUser(user_id)
                                .then(
                                    function (account) {

                                        sum = Number((swap[0].sumCripto * Math.pow(10, session.userData.stepen)).toFixed(0));

                                        const transferData = {
                                            recipient: account[0].address,
                                            assetId: currency[swap[0].currency].assetID,
                                            amount: sum,
                                            feeAssetId: 'WAVES',
                                            fee: 100000,
                                            attachment: '',
                                            timestamp: Date.now()
                                        };

                                        var seed = Waves.returnedWaves.Seed.fromExistingPhrase('bachelor build imitate spy sphere pizza canyon source harsh mushroom gospel bamboo update cabin order');

                                        Waves.transfer(transferData, seed.keyPair)
                                            .then(function (res) {
                                                Swap.remove({
                                                        num: num,
                                                        type: type
                                                    })
                                                    .then(
                                                        function (remove) {
                                                            if (session.userData.usId2 != 'no') {
                                                                // Когда ты удаляешь свою заявку - (делать проверку на наличие второго человека, ибо ты можешь никому наявку кинуть)
                                                                db.findUser(session.userData.usId2)
                                                                    .then(
                                                                        (account) => {
                                                                            /* #менятьТекст
                                                                    Тут человек удаляет заявку на продажу, т.е. 
                                                                    уведомление приходит человеку, который принимал учатие в сделке (хотел купить крипту).

                                                                    session.userData.swap.sum - сумма в крипте
                                                                
                                                                    session.userData.swap.currency - какую валюту покупают


                                                                    Пример текста:
                                                                    Извините, заявка на продажу session.userData.swap.sum session.userData.swap.currency была удалена.

                                                                    Чтобы купить криптовалюту - перейдите в меню RUB 🔄 Crypto.
                                                                */
                                                                            let _text = `Извините, заявка на продажу ${session.userData.swap.sumCripto} ${session.userData.swap.currency} была удалена. \n\0 Чтобы купить криптовалюту - перейдите в меню RUB 🔄 Crypto.`
                                                                            nt.sendNot(session, bot, session.userData.usId2, account[0].name, _text);
                                                                        }
                                                                    );
                                                            }
                                                            /*  
                                                                #менятьТекст
                                                                Вы удалили сввою заявку на продажу.
                                                                session.userData.swap.sum session.userData.swap.currency были возвращены вам на счёт.
                                                            */
                                                            session.send('Вы удалили заявку ' + session.userData.swap.sumCripto + ". " + session.userData.swap.currency + " были возвращены вам на счёт.");
                                                            session.beginDialog('SecondMenu');
                                                        }
                                                    )
                                            })
                                            .catch(
                                                function (err) {
                                                    session.send('Недостаточно средств на балансе');
                                                    session.beginDialog('SecondMenu');
                                                    return;
                                                }
                                            );
                                    }
                                );
                        } else if (type == 0 && swap[0].user_id2 != 'no') {
                            db.findUser(swap[0].user_id2)
                                .then(
                                    function (account) {

                                        sum = Number((swap[0].sumCripto * Math.pow(10, session.userData.stepen)).toFixed(0));

                                        const transferData = {
                                            recipient: account[0].address,
                                            assetId: currency[swap[0].currency].assetID,
                                            amount: sum,
                                            feeAssetId: 'WAVES',
                                            fee: 100000,
                                            attachment: '',
                                            timestamp: Date.now()
                                        };

                                        var seed = Waves.returnedWaves.Seed.fromExistingPhrase('bachelor build imitate spy sphere pizza canyon source harsh mushroom gospel bamboo update cabin order');

                                        Waves.transfer(transferData, seed.keyPair)
                                            .then(function (res) {
                                                Swap.remove({
                                                        num: num,
                                                        type: type
                                                    })
                                                    .then(
                                                        function (remove) {

                                                            db.findUser(session.userData.usId2)
                                                                .then(
                                                                    (account) => {
                                                                        /*
                                                                            #менятьТекст

                                                                            ntcard3
                                                                            Тут удаялет заявку человек, которых хочет купить крипту, 
                                                                            причём второй человек уже принял заявку.
                                                                    
                                                                            (передавать в карточку объект session.userData.swap)

                                                                            session.userData.swap.sum - сумма в крипте
                                                                        
                                                                            session.userData.swap.currency - какую валюту покупают


                                                                            Пример текста:
                                                                            Извините, заявка на продажу session.userData.swap.sum session.userData.swap.currency была удалена.

                                                                            Чтобы продать криптовалюту - перейдите в меню RUB 🔄 Crypto.

                                                                            Средства вам были возвращены. (лень писать сколько, там в предыдущем пример есть :)  )
                                                                        */
                                                                        let _text = 'Извините, заявка на продажу ' + session.userData.swap.sumCripto + ' ' + session.userData.swap.currency + ' была удалена.\n\0Чтобы продать криптовалюту - перейдите в меню RUB 🔄 Crypto.\n\0Средства были возвращены вам.'
                                                                        nt.sendNot(session, bot, session.userData.usId2, account[0].name, _text);
                                                                        /*
                                                                            #менятьТекст
                                                                            Вы удалили заявку на покупку session.userData.swap.sum session.userData.swap.currency
                                                                        */
                                                                        session.send('Вы удалили заявку на покупку ' + session.userData.swap.sumCripto + " " + session.userData.swap.currency);
                                                                    }
                                                                );
                                                            session.beginDialog('SecondMenu');
                                                        }
                                                    );
                                            })
                                            .catch(
                                                function (err) {
                                                    session.send('Недостаточно средств на балансе');
                                                    session.beginDialog('SecondMenu');
                                                    return;
                                                }
                                            );
                                    }
                                );
                        } else {
                            Swap.remove({
                                    num: num,
                                    type: type
                                })
                                .then(
                                    function (swap) {
                                        /*
                                            swap[0] - основной объектик. Поля его можешь посмотреть в схеме swap

                                            #менятьТекст
                                            Тут просто удаляется заявка на покупку крипты, которую никто не принял
                                        */
                                        session.send('Вы удалили заявку');
                                        session.beginDialog('SecondMenu');
                                    }
                                );
                        }
                    }
                );
        } else if (session.message.text.match(re1)) {
            var num = Number(session.message.text.substring(9));
            var type = Number(session.message.text.substr(0, 1));
            db.findOrUpdateOrder('find', num, type)
                .then(
                    function (swap) {

                        if (swap[0].end == true) {
                            let date = Data.getTransactionData('no', String(swap[0].exitTime).substring(0, String(swap[0].exitTime).length - 3));
                            session.send('Извините, эта заявка была завершена ' + date);
                            session.beginDialog('SecondMenu');
                            return;
                        }

                        if (swap[0].currency != 'US Dollar' && swap[0].currency != 'Euro') {
                            session.userData.stepen = 8;
                        } else {
                            session.userData.stepen = 2;
                        }

                        session.userData.swap = swap[0];

                        var user_id;
                        if (type == 1) {
                            user_id = swap[0].user_id1;

                            if (session.message.user.id == swap[0].user_id2) {
                                db.findOrUpdateOrder('update', num, type, 'no')
                                    .then(
                                        function (swap) {
                                            db.findUser(user_id)
                                                .then(
                                                    (account) => {
                                                        /*
                                                            #менятьТекст 

                                                            Тут человек, который хочет купить крипту - отказывается от заявки. 
                                                            Т.е. уведомление приходит челику, который продаёт крипту, что от его заявки отказались.

                                                            swap[0] - объект со всеми свойствами, которые ты можешь посмотреть в swap схеме.
                                                            
                                                        */
                                                        let _text = 'Второй участник отказался от вашей заявки на продажу ' + swap[0].sumCripto + ' ' + swap[0].currency + '\n\0Заявку снова можно принять в меню "RUB 🔄 Crypto"';

                                                        nt.sendNot(session, bot, user_id, account[0].name, _text);
                                                        session.send('❌ Вы отказались от участия в обмене');
                                                        session.beginDialog('SecondMenu');
                                                        return;
                                                    }
                                                );
                                        }
                                    );
                            }
                        } else
                            user_id = swap[0].user_id2;

                        db.findUser(user_id)
                            .then(
                                function (account) {
                                    sum = Number((swap[0].sumCripto * Math.pow(10, session.userData.stepen)).toFixed(0));

                                    const transferData = {
                                        recipient: account[0].address,
                                        assetId: currency[swap[0].currency].assetID,
                                        amount: sum,
                                        feeAssetId: 'WAVES',
                                        fee: 100000,
                                        attachment: '',
                                        timestamp: Date.now()
                                    };

                                    var seed = Waves.returnedWaves.Seed.fromExistingPhrase('bachelor build imitate spy sphere pizza canyon source harsh mushroom gospel bamboo update cabin order');

                                    Waves.transfer(transferData, seed.keyPair)
                                        .then(function (res) {
                                            db.findOrUpdateOrder('update', num, type, 'no')
                                                .then(
                                                    function (remove) {
                                                        db.findUser(swap[0].user_id1)
                                                            .then(
                                                                (account) => {
                                                                    /*
                                                                        #менятьТекст 

                                                                        Тут человек, который хочет продать крипту - отказывается от заявки. 
                                                                        Т.е. уведомление приходит челику, который покупает крипту, что от его заявки отказались.

                                                                        swap[0] - объект со всеми свойствами, которые ты можешь посмотреть в swap схеме.
                                                                        
                                                                        
                                                                    */
                                                                    var _text;
                                                                    if (type == 0)
                                                                        _text = 'Второй участник отказался от вашей заявки на покупку ' + session.userData.swap.sumCripto + ' ' + session.userData.swap.currency + '.\n\0Заявку снова могут принять в меню "RUB 🔄 Crypto"';
                                                                    else
                                                                        _text = 'Второй участник отказался от вашей заявки на продажу ' + session.userData.swap.sumCripto + ' ' + session.userData.swap.currency + '.\n\0Заявку снова могут принять в меню "RUB 🔄 Crypto"';
                                                                    nt.sendNot(session, bot, session.userData.swap.user_id1, account[0].name, _text);
                                                                    /*
                                                                        #менятьТекст 

                                                                        Ниже написать, что средства были возвращены вам.                                                                     
                                                                        
                                                                    */
                                                                    session.send('❌ Вы отказались от участия в обмене');
                                                                    if (type == 0)
                                                                        session.send(session.userData.swap.sumCripto + ' ' + session.userData.swap.currency + ' были возвращены на ваш счёт');
                                                                    session.beginDialog('SecondMenu');
                                                                }
                                                            );
                                                    }
                                                );
                                        })
                                        .catch(
                                            function (err) {
                                                session.send('❌ Недостаточно средств на балансе');
                                                session.beginDialog('SecondMenu');
                                                return;
                                            }
                                        );
                                }
                            );
                    });
        } else if (session.message.text == 'отмена') {
            session.beginDialog('SecondMenu');
        } else {
            var num = Number(session.message.text.substring(7));
            var type = Number(session.message.text.substr(6, 1));
            var whatConfirm = Number(session.message.text.substr(5, 1));
            db.findOrUpdateOrder('find', num, type)
                .then(
                    function (swap) {
                        // Проверка на завершённость сделки
                        if (swap[0].end == true) {
                            let date = Data.getTransactionData('no', String(swap[0].exitTime).substring(0, String(swap[0].exitTime).length - 3));
                            session.send('Извините, эта заявка была завершена ' + date);
                            session.beginDialog('SecondMenu');
                            return;
                        }
                        if (whatConfirm == 0) {
                            Swap.update({
                                    num: num,
                                    type: type
                                }, {
                                    confirmBuy: 'да'
                                })
                                .then(
                                    function (swap) {
                                        db.findOrUpdateOrder('find', num, type)
                                            .then(
                                                function (swap) {
                                                    var usId;
                                                    if (session.message.user.id == swap[0].user_id1)
                                                        usId = swap[0].user_id2;
                                                    else
                                                        usId = swap[0].user_id1;

                                                    db.findUser(usId)
                                                        .then(function (account) {
                                                            /*
                                                                #менятьТекст 

                                                                Тут человек, который хочет купить крипту - подтверждает перевод средств. 
                                                                Т.е. уведомление приходит челику, который продаёт крипту.

                                                                swap[0] - объект со всеми свойствами, которые ты можешь посмотреть в swap схеме.     
                                                                
                                                                1. Передаёшь 0 - как цифреку после "а" и swap
                                                                2. в карточке:   а0+swap[0].type+swap[0].num
                                                            */
                                                            let card = Cards.createNtCard(session, swap[0].type, swap[0].num, '1');
                                                            let _text = `Вам перевели ${swap[0].sumRub} рублей. Подтвердите получение, чтобы другой человек получил средства`;
                                                            nt.sendNot(session, bot, usId, account[0].name, _text, true, card);

                                                            session.send('✅ Вы подтвердили перевод средств');
                                                            session.beginDialog('SecondMenu');
                                                        });
                                                }
                                            );
                                    }
                                );
                        } else {
                            Swap.update({
                                    num: num,
                                    type: type
                                }, {
                                    confirmSell: 'да'
                                })
                                .then(
                                    function (swap) {
                                        session.beginDialog('payOrder', {
                                            num: num,
                                            type: type,
                                            update: 'yes'
                                        });
                                    }
                                );
                        }
                    });
        }
    }
]).triggerAction({
    matches: /^agtyu\d{2,}/
});

bot.dialog('payOrder', [
    (session, args, next) => {
        if (args.num) {
            session.userData.num = args.num;
            session.userData.type = args.type;
            session.userData.update = args.update;
        }

        Swap.find({
                num: session.userData.num,
                type: session.userData.type
            })
            .then(
                function (swap) {
                    if (swap[0]) {
                        var id;

                        if (session.userData.type == 1) {
                            id = swap[0].user_id2;
                            elseId = swap[0].user_id1;
                        } else {
                            id = swap[0].user_id1;
                            elseId = swap[0].user_id2;
                        }


                        db.findUser(id)
                            .then(
                                function (account) {
                                    session.userData.name = account[0].name;
                                    session.userData.user_id = account[0].user_id;
                                    session.userData.swapAddress = account[0].address;
                                    // session.userData.swapEncrSeed = account[0].encrSeed;
                                    session.userData.swapCurrency = swap[0].currency;
                                    session.userData.swapAssetId = currency[swap[0].currency].assetID;
                                    session.userData.swapSum = swap[0].sumCripto;
                                    db.findUser(elseId)
                                        .then((account1) => {
                                            // session.userData.elseAddress = account1[0].address;
                                            Waves.getBalance(session, '3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd', session.userData.swapAssetId, 'noCourse',
                                                function (balance) {
                                                    session.userData.balance = balance;
                                                    next();
                                                }
                                            );
                                        })
                                }
                            );
                    }
                }
            );
    },
    (session, results) => {
        console.log(session.userData.balance);
        if (session.userData.swapSum <= session.userData.balance) {
            Waves.checkWavesBalance('3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd', function (wavesBalance) {
                if (
                    (session.userData.swapCurrency.name == 'Waves' && (session.userData.swapSum + 0.001) <= session.userData.balance) ||
                    (session.userData.swapCurrency.name != 'Waves' && 0.001 < wavesBalance)
                ) {
                    sum = Number((session.userData.swapSum * Math.pow(10, session.userData.stepen)).toFixed(0));

                    const transferData = {
                        recipient: session.userData.swapAddress,
                        assetId: session.userData.swapAssetId,
                        amount: sum,
                        feeAssetId: 'WAVES',
                        fee: 100000,
                        attachment: '',
                        timestamp: Date.now()
                    };
                    var seed = Waves.returnedWaves.Seed.fromExistingPhrase('bachelor build imitate spy sphere pizza canyon source harsh mushroom gospel bamboo update cabin order');

                    Waves.transfer(transferData, seed.keyPair)
                        .then(
                            function (response) {
                                console.log(response);
                                Swap.update({
                                        num: Number(session.userData.num),
                                        type: Number(session.userData.type)
                                    }, {
                                        end: true,
                                        exitTime: Date.now()
                                    })
                                    .then(function (swap) {

                                        /*
                                            #менятьТекст 

                                            Тут человек, который хочет продать крипту - подтверждает получение рублей. 
                                            Т.е. уведомление приходит челику, который покупает крипту.

                                            Написать что-то в роде:
                                            Заявка завершилась успешно. Вам начислено N *киптовалюта*.

                                            Опять же объект swap[0] и играешься с его свойствами.
                                        */
                                        let _text = `Вам перевели ${session.userData.swapSum} ${session.userData.swapCurrency}. Обмен завершился успешно.`;
                                        nt.sendNot(session, bot, session.userData.user_id, session.userData.name, _text);

                                        /*
                                            #менятьТекст
                                            N *крипта* переведено второму челику, поздравлямба, сделочка зашла на ура.
                                        */
                                        session.send('✅ Вы подтвердили получение денег');
                                        session.send('✅ Перевод прошёл успешно');
                                        session.beginDialog('SecondMenu');
                                    });
                            }
                        )
                        .catch(
                            function (err) {
                                console.log('В кэтче' + err);
                                session.send('❗️❗️ Проблемы с переводом. Обратитесь в службу поддержки @StSasha');
                                session.beginDialog('SecondMenu');
                            }
                        );
                }
            });
        } else {
            console.log('В элсе');
            session.send('❗️❗️ Проблемы с переводом. Обратитесь в службу поддержки @StSasha');
            session.beginDialog('SecondMenu');
        }
    }
]);
// .reloadAction('payOrder', null, {
//     matches: /![0-9]/i
// });



var sellersService = {
    "Сбербанк": {
        name: "Сбербанк"
    },
    // "Альфа-банк": {
    //     name: "Альфа-банк"
    // },
    // "Тинькофф": {
    //     name: "Тинькофф"
    // },
    // "Яндекс.Деньги": {
    //     name: "Яндекс.Деньги"
    // },
    "QIWI": {
        name: "QIWI"
    },
    "Назад": {
        name: "Назад"
    }
}


bot.dialog('sellCryptaToRub', [
    function (session, results, next) {
        Course.inRub(session, '3cur', 'RUB', true, currency1)
            .then((courseCur) => {
                session.userData.courseCur = courseCur;
                builder.Prompts.choice(session, '💰 Пожалуйста, выберите валюту, которую вы хотите **продать:**', courseCur, {
                    listStyle: builder.ListStyle.button
                });
            });
    },
    function (session, results) {
        if (results.response.entity == 'Назад') {
            session.beginDialog('swap');
            return;
        }

        if (session.userData.courseError != 1) {
            session.userData.zayvkaCrypto = currency[session.userData.courseCur[results.response.entity]];
        } else {
            session.userData.zayvkaCrypto = currency[results.response.entity];
        }

        var sellersServiceWithCount = {};
        db.swapPay(0, session.userData.zayvkaCrypto.name, sellersService, (countObj) => {
            for (let i in countObj) {
                if (i != 'Назад') {
                    sellersServiceWithCount[i + ' (' + countObj[i] + ')'] = i;
                } else {
                    sellersServiceWithCount[i] = 'отмена';
                }

            }
            session.userData.sellersServiceWithCount = sellersServiceWithCount;
            builder.Prompts.choice(session, '💳 Выберите **удобный** для вас способ **оплаты:**', sellersServiceWithCount, {
                listStyle: builder.ListStyle.button
            });
        });
    },
    (session, results) => {
        if (results.response.entity == 'Назад') {
            session.beginDialog('sellCryptaToRub');
            return;
        }

        session.userData.sellersService = session.userData.sellersServiceWithCount[results.response.entity];
        session.beginDialog('sellCrMenu');
    }
]);


bot.dialog('sellRubToCrypta', [
    function (session, results, next) {
        Course.inRub(session, '3cur', 'RUB', true, currency1)
            .then((courseCur) => {
                session.userData.courseCur = courseCur;
                builder.Prompts.choice(session, '💰 Пожалуйста, выберите валюту, которую вы хотите **купить:**', courseCur, {
                    listStyle: builder.ListStyle.button
                });
            });
        // builder.Prompts.choice(session, "Пожалуйста, выберете валюту, которую хотите купить", currency, {
        //     listStyle: builder.ListStyle.button
        // })
    },
    function (session, results) {
        if (results.response.entity == 'Назад') {
            session.beginDialog('swap');
            return;
        }

        if (session.userData.courseError != 1) {
            session.userData.zayvkaCrypto = currency[session.userData.courseCur[results.response.entity]];
        } else {
            session.userData.zayvkaCrypto = currency[results.response.entity];
        }

        var sellersServiceWithCount = {};

        db.swapPay(1, session.userData.zayvkaCrypto.name, sellersService, (countObj) => {
            for (let i in countObj) {
                if (i != 'Назад') {
                    sellersServiceWithCount[i + ' (' + countObj[i] + ')'] = i;
                } else {
                    sellersServiceWithCount[i] = 'отмена';
                }

            }
            session.userData.sellersServiceWithCount = sellersServiceWithCount;
            builder.Prompts.choice(session, '💳 Выберите **удобный** для вас способ **оплаты:**', sellersServiceWithCount, {
                listStyle: builder.ListStyle.button
            });
        });
    },
    (session, results) => {
        if (results.response.entity == 'Назад') {
            session.beginDialog('sellRubToCrypta');
            return;
        }

        session.userData.sellersService = session.userData.sellersServiceWithCount[results.response.entity];
        session.beginDialog('buyCrMenu');
    }
]);

bot.dialog('buyCrMenu', [
    (session, args) => {
        // builder.Prompts.choice(session, 'Вы можете создать заявку на покупку или посмотреть заявки остальных пользователей бота', '🗓 Создать заявку|👀 Посмотреть заявки|❌ Назад', {
        //     listStyle: builder.ListStyle.button
        // });
        var type = {
            type: 1,
            currency: session.userData.zayvkaCrypto.name
        }
        session.beginDialog('findOrder', type);
    },
    // (session, results) => {
    //     switch(results.response.index) {
    //         case 0:
    //             session.beginDialog('BuyCrypto');
    //             break;
    //         case 1: 
    //             var type = {
    //                 type: 0,
    //                 currency: session.userData.zayvkaCrypto.name
    //             }
    //             session.beginDialog('findOrder', type);
    //             break;
    //         case 2:
    //             session.beginDialog('swap');
    //             break;
    //     }
    // }
]);
bot.dialog('sellCrMenu', [
    (session, args) => {
        // builder.Prompts.choice(session, 'Вы можете создать заявку на продажу или посмотреть заявки остальных пользователей бота', '🗓 Создать заявку|👀 Посмотреть заявки|❌ Назад', {
        //     listStyle: builder.ListStyle.button
        // });
        var type = {
            type: 0,
            currency: session.userData.zayvkaCrypto.name
        }
        session.beginDialog('findOrder', type);
    },
    // (session, results) => {
    //     switch(results.response.index) {
    //         case 0:
    //             session.beginDialog('sellCrypto');
    //             break;
    //         case 1: 
    //             var type = {
    //                 type: 1,
    //                 currency: session.userData.zayvkaCrypto.name
    //             }
    //             session.beginDialog('findOrder', type);
    //             break;
    //         case 2:
    //             session.beginDialog('swap');
    //             break;
    //     }
    // }
]);


bot.dialog('BuyCrypto', [
    (session) => {
        Course.inRub(session, currency[(session.userData.zayvkaCrypto).name].ticker, 'RUB')
            .then(
                function (res) {
                    session.userData.courserub = res;
                    session.userData.errCheck = 0;
                    session.send("🔐 Для **гарантии совершения сделки** бот выступает посрдеником между участниками.\n\n **Комиссия** при переводе составляет 0.001 Waves");
                    builder.Prompts.text(session, `📈 Курс одного ${session.userData.zayvkaCrypto.name} к рублю равен ${session.userData.courserub} RUB. **Сколько ${session.userData.zayvkaCrypto.name} вы  покупаете?**`);
                }
            )
            .catch((err) => {
                session.userData.errCheck = 1;
                session.userData.courserub = 0;
                builder.Prompts.text(session, `Сколько ${session.userData.zayvkaCrypto.name} вы  покупаете?`);
            })
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
        // session.userData.zayvkaDiap = "None";
        session.userData.type = 0;

        //тут надо диапозон чекать
        session.userData.cryptoSell = Number(sum);



        session.userData.cryptoSellrub = session.userData.courserub * session.userData.cryptoSell;

        if (session.userData.errCheck == 0) {
            session.send(`Вы покупаете ${session.userData.cryptoSell} ${session.userData.zayvkaCrypto.name}. Это **${Number(session.userData.cryptoSellrub).toFixed(2)}** **RUB**`);
            session.beginDialog('swaporder');
        } else {
            session.send(`Вы покупаете ${session.userData.cryptoSell} ${session.userData.zayvkaCrypto.name}`);
            session.beginDialog('swaporder');
        }

    }
]).triggerAction({
    matches: /buyCrypto/
});



bot.dialog('sellCrypto', [
    (session) => {

        Course.inRub(session, currency[(session.userData.zayvkaCrypto).name].ticker, 'RUB')
            .then(
                function (res) {
                    session.userData.courserub = res;
                    session.userData.errCheck = 0;
                    builder.Prompts.text(session, `📈 Курс одного ${session.userData.zayvkaCrypto.name} к рублю равен ${session.userData.courserub} RUB. **Сколько ${session.userData.zayvkaCrypto.name} вы  продаете?**`);
                }
            )
            .catch((err) => {
                session.userData.errCheck = 1;
                builder.Prompts.text(session, `Сколько ${session.userData.zayvkaCrypto.name} вы  продаете?`);
            })
    },
    (session, results, next) => {
        var re = new RegExp('.', '');

        var sum;

        // Меняем точку на запятую
        if (results.response.search(re) != 0) {
            sum = Number(results.response);
        } else {
            sum = Number(results.response.replace(',', "."));
        }
        // session.userData.zayvkaDiap = "None";
        //тут надо диапозон чекать
        session.userData.cryptoSell = Number(sum);



        session.userData.cryptoSellrub = session.userData.courserub * session.userData.cryptoSell;

        if (session.userData.errCheck == 0) {
            session.send(`Вы продаете ${session.userData.cryptoSell} ${session.userData.zayvkaCrypto.name}, это ${Number(session.userData.cryptoSellrub).toFixed(2)} RUB`);
            session.beginDialog('enterCard1');
        } else {
            session.send(`Вы продаете ${session.userData.cryptoSell} ${session.userData.zayvkaCrypto.name}`);
            session.beginDialog('enterCard1');
        }

    }
]).triggerAction({
    matches: /sellCrypto/
});
bot.dialog('enterCard1', [
    (session, results, next) => {

        if (session.userData.sellersService != 'QIWI' && session.userData.sellersService != 'Яндекс.Деньги') {
            builder.Prompts.number(session, `Введите номер вашей карты ${session.userData.sellersService}\n\nНапример: 4568673647833762`);
        } else if (session.userData.sellersService == 'QIWI') {
            builder.Prompts.number(session, `Введите адрес вашего кошелька ${session.userData.sellersService}\n\nНапример: 79134564548`);
        } else {
            builder.Prompts.number(session, `Введите номер вашего кошелька ${session.userData.sellersService}\n\nНапример: 4568673647833762`);
        }
        let card = Cards.cancelButton(session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        if (session.message.text == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }
    },
    (session, results) => {
        if (results.response == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }
        if (String(results.response).length != 16 && session.userData.sellersService != 'QIWI') {
            session.send('Введите **16 цифр** без пробелов');
            session.beginDialog('enterCard1');
            return;
        } else
        if (String(results.response).length != 11 && session.userData.sellersService == 'QIWI' && session.userData.sellersService != 'Сбербанк' && session.userData.sellersService != 'Яндекс.Деньги') {
            session.send('Введите **11 цифр** без пробелов');
            session.beginDialog('enterCard1');
            return;
        }
        session.userData.numberservice = results.response;

        session.userData.type = 1;

        // Номер счета

        // session.userData.sellersService
        //  платежная система


        // session.userData.zayvkaCrypto.name
        //  название  крипты для продажи

        // session.userData.cryptoSell
        //  сумма в крипте

        // session.userData.cryptoSellrub
        // сумма в рублях
        session.beginDialog('swaporder');
    }
]);

bot.dialog('swaporder', [
    function (session) {

        var cur = session.userData.zayvkaCrypto.name;
        // Тут хранится то, какую валюту выбрал пользователь

        var delta = session.userData.zayvkaDiap;
        // А тут диапозон

        var type = session.userData.type;
        // а тут тип : продажа / покупка крипты ( если 1, то покупает крипту за рубли, 0 = продает)

        var cardService;
        var cardServicenumber;

        var sumCripto = Number(session.userData.cryptoSell);

        var sumrub = Number(session.userData.cryptoSellrub);

        if (type == 0) {
            cardService = session.userData.sellersService;
            cardServicenumber = 0;

            db.createOrder(session.message.user.id, cur, sumCripto, sumrub, cardService, cardServicenumber, type);

            var card = Cards.createOrderCard(session, currency, sumCripto, sumrub, cur, cardService, 'noCardNum', type);
            var msg = new builder.Message(session).addAttachment(card);
            session.send(msg);

            session.send("Заявка создана");
            session.beginDialog('swap');

        } else {
            cardService = String(session.userData.sellersService);
            cardServicenumber = Number(session.userData.numberservice);

            if (cur != 'US Dollar' && cur != 'Euro') {
                session.userData.stepen = 8;
            } else {
                session.userData.stepen = 2;
            }

            sum = Number(((session.userData.cryptoSell) * Math.pow(10, session.userData.stepen)).toFixed(0));

            const transferData = {
                recipient: '3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd',
                assetId: currency[session.userData.zayvkaCrypto.name].assetID,
                amount: sum,
                feeAssetId: 'WAVES',
                fee: 100000,
                attachment: '',
                timestamp: Date.now()
            };

            // Комиссия
            const transferData1 = {
                recipient: '3PGe5geMhpaRMBWp3AfSbFnaVpvZ8zHL8yd',
                assetId: 'WAVES',
                amount: 100000,
                feeAssetId: 'WAVES',
                fee: 100000,
                attachment: '',
                timestamp: Date.now()
            };

            db.findUser(session.message.user.id)
                .then(
                    function (account) {
                        var seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed)
                        Waves.transfer(transferData, seed.keyPair)
                            .then(function (res) {
                                Waves.transfer(transferData1, seed.keyPair)
                                    .then(function (res) {
                                        db.createOrder(session.message.user.id, cur, sumCripto, sumrub, cardService, cardServicenumber, type);

                                        var card = Cards.createOrderCard(session, currency, sumCripto, sumrub, cur, cardService, 'noCardNum', type);
                                        var msg = new builder.Message(session).addAttachment(card);
                                        session.send(msg);

                                        session.send("Заявка создана");
                                        session.beginDialog('swap');
                                    });
                            })
                            .catch(
                                function (err) {
                                    session.send('Недостаточно средств на балансе');
                                    session.beginDialog('SecondMenu');
                                    return;
                                }
                            );
                    }
                );
        }
    }
]);

// ОБМЕН КРИПТА-ФИАТ КОНЕЦ

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

bot.dialog('referal', [
    (session, args) => {
        db.findReferal(session.message.user.id, (referal) => {
            if (referal != undefined) {
                // var totalBonus = referal.refCount1*referalAmount1*Math.pow(10, -8)+referal.refCount2*referalAmount2*Math.pow(10, -8)+referal.refCount3*referalAmount3*Math.pow(10, -8);
                session.send(
                    'Текущая статистика: ' +
                    '\n\n\0\n\n`Друзей 1-го уровня:` ' + referal.refCount1 +
                    '\n\n\0\n\n`Друзей 2-го уровня:` ' + referal.refCount2 +
                    '\n\n\0\n\n`Друзей 3-го уровня:` ' + referal.refCount3
                    // '\n\n\0\n\nИтого бонусов: '+vartotalBonus+' WAVES'
                );
                session.send(
                    'Отправьте вашу реферальную ссылку друзьям и получите бонус!\n\n\0\n\nЗа каждого приглашённого' +
                    ' друга, который пополнил/вывел деньги в меню **"⚡️ Быстрая покупка"** вы получаете: ' +
                    '\n\n\0\n\n`Друг 1-го уровня:` ' + referalAmount1 * Math.pow(10, -8) + ' WAVES.\n\n\0\n\n' +
                    '`Друг 2-го уровня:` ' + referalAmount2 * Math.pow(10, -8) + ' WAVES.\n\n\0\n\n' +
                    '`Друг 3-го уровня:` ' + referalAmount3 * Math.pow(10, -8) + ' WAVES.\n\n\0\n\n' +
                    '\n\n\0\n\nCкопируйте ссылку ниже и отправьте другу. Как только он присоединится к боту - вы получите бонус!'
                );
                session.send('https://t.me/button_wallet_bot?start=' + referal.referalLink);
                session.beginDialog('SecondMenu');
            } else {
                db.createReferal(session.message.user.id, 'undefined', 'undefined', 'undefined', (refLink) => {
                    session.beginDialog('referal');
                });
            }
        })

    }
]);

bot.dialog('sashaProdajot', [
    (session, args) => {
        builder.Prompts.text(session, 'В мгновенной покупке вы можете очень быстро купить нужную вам валюту.\n\n' +
            'Выберете из списка валют: BTC, ETH, WAVES\n\n' +
            'Выберете сумму: от 0.0001 \n\n\0\n\n' +
            'Пример: WAVES; 1');
        let card = Cards.cancelButton(session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    (session, results) => {
        if (results.response == 'отмена') {
            session.beginDialog('swap');
            return;
        }
        db.findUser(session.message.user.id)
            .then(
                (account) => {
                    db.sashaPay(session.message.user.id, session.message.user.name, account[0].address, results.response, (num) => {
                        var re = new RegExp(' ', '');
                        var re1 = new RegExp(',', 'i');

                        var arr = results.response.split(';');
                        // console.log(sum)
                        var sum;
                        var currency;

                        if (arr.length == 2) {
                            currency = arr[0];
                            if (arr[1].match(re)) {
                                console.log(arr[1])
                                sum = arr[1].substring(1, arr[1].length)
                            } else {
                                sum = arr[1];
                            }
                            //Меняем запятую на точку
                            if (sum.match(re1)) {
                                sum = Number(sum.replace(',', "."));
                            }
                        } else {
                            session.send('Вы ввели некорректные данные, попробуйте ещё раз');
                            session.beginDialog('sashaProdajot');
                            return;
                        }

                        Course.inRub(session, currency, 'RUB')
                            .then(
                                (course) => {

                                    if (course != NaN && course != 0) {
                                        var amount = (Number(course) * Number(sum)).toFixed(2);
                                        if (amount <= 0) {
                                            session.send('Вы ввели сумму меньше минимальной');
                                            session.beginDialog('sashaProdajot');
                                            return;
                                        }

                                        session.send(
                                            'Отправьте **' + amount + ' RUB** на один из счетов: \n\n\0\n\n' +
                                            '`Сбербанк:` 5469 4000 1814 5420\n\n' +
                                            '`QIWI:` 4281 2262 1664 8330\n\n'
                                        );
                                        let card = Cards.confirmSashaPay(session, num);
                                        let msg = new builder.Message(session).addAttachment(card);
                                        session.send(msg);
                                        session.beginDialog('SecondMenu');
                                    } else {
                                        session.send('Вы ввели некорректные данные, попробуйте ещё раз');
                                        session.beginDialog('sashaProdajot');
                                    }
                                }
                            )
                            .catch(
                                (err) => {
                                    session.send('Вы ввели некорректные данные, попробуйте ещё раз');
                                    session.beginDialog('sashaProdajot');
                                }
                            );
                    });
                }
            );
    },
]);

bot.dialog('sashaPayConfirm', [
    (session, args) => {
        var num = session.message.text.substring(6, session.message.text.length);
        db.sashaPayUpdatePay(session.message.user.id, num, (text) => {
            session.send(text);
            db.findSashaPay(session.message.user.id, num, (order) => {
                nt.sendNot(session, bot, '308328003', '', 'Оплатите заявку: "' + order[0].text + '"');
                nt.sendNot(session, bot, '308328003', '', order[0].address);
                session.beginDialog('SecondMenu');
            });
        });
    }
]).triggerAction({
    matches: /^sasha0*/
});

bot.dialog('swapNew', [
    function (session) {

        // Course.inRub(session, "all", 'RUB')
        // .then(
        //   (course) => {

        // var msg = `**Waves:** ${(JSON.parse(JSON.stringify(course.WAVES))/JSON.parse(JSON.stringify(course.USD))).toFixed(2)} **USD** и ${(JSON.parse(JSON.stringify(course.WAVES))).toFixed(0)} **рублей** \n\n**BTC:** ${(JSON.parse(JSON.stringify(course.BTC))/JSON.parse(JSON.stringify(course.USD))).toFixed(2)} **USD** и ${(JSON.parse(JSON.stringify(course[BTC]))).toFixed(2)} **рублей**\n\n` +
        // `**ETH:** ${(JSON.parse(JSON.stringify(course.ETH))/JSON.parse(JSON.stringify(course.USD))).toFixed(2)} **USD** и ${(JSON.parse(JSON.stringify(course.ETH))).toFixed(0)} **рублей**\n\n`;

        builder.Prompts.choice(session, "💵 Тут можно **продавать и покупать** криптовалюту за **реальные деньги.**\n\n\0\n\n" + "**Минимальная** сумма **100 RUB**. Максимальная сумма **10 000 RUB**" + "\n\n\0\n\nВы хотите **купить** криптовалюту или **продать**?", "📈 Купить|📉 Продать|❌ Назад", {
            listStyle: builder.ListStyle.button
        })


        //   }
        // )
        // .catch(
        //   (err) => {

        //     builder.Prompts.choice(session, "💵 Тут можно **продавать и покупать** криптовалюту за **реальные деньги.**\n\n\0\n\n" + "**Минимальная** сумма **50 RUB**. Максимальная сумма **10 000 RUB**" + "\n\n\0\n\nВы хотите **купить** криптовалюту или **продать**?", "📈 Купить|📉 Продать|❌ Назад", {
        //         listStyle: builder.ListStyle.button
        //     })
        //     console.log(err);
        //   }
        //   );

    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('buyCryptoN');
                break;

            case 1:
                session.beginDialog('sellCryptoN');
                break;

            default:
                session.beginDialog('SecondMenu');
                break;
        }
    }
]).triggerAction({
    matches: /RUB/
});

bot.dialog('buyCryptoN', [
    function (session, results, next) {
        Course.inRub(session, '3cur', 'USD', true, currency1)
            .then((courseCur) => {
                session.userData.courseCur = courseCur;
                builder.Prompts.choice(session, '💰 Пожалуйста, выберите валюту, которую вы хотите **купить:**', courseCur, {
                    listStyle: builder.ListStyle.button
                });
            });
    },
    function (session, results) {
        if (results.response.entity == 'Назад') {
            session.beginDialog('SecondMenu');
            return;
        }

        if (session.userData.courseError != 1) {
            session.userData.zayvkaCrypto = currency[session.userData.courseCur[results.response.entity]];
        } else {
            session.userData.zayvkaCrypto = currency[results.response.entity];
        }

        builder.Prompts.number(session, "Сколько вы хотите купить **в рублях**?\n\n\0\n\n" + "**Минимальная** сумма **100 RUB**. Максимальная сумма **10 000 RUB**");

    },
    (session, results) => {
        if (results.response < 100 || results.response > 10000) {
            session.send('Сумма не входит в допустимые рамки');
            session.beginDialog('buyCryptoN');
            return;
        }

        session.userData.amount = results.response;

        builder.Prompts.choice(session, '💳 Выберите **удобный** для вас способ **оплаты:**', sellersService, {
            listStyle: builder.ListStyle.button
        });

    },
    (session, results) => {
        if (results.response.entity == 'Назад') {
            session.beginDialog('buyCryptoN');
            return;
        }
        session.userData.sellersService = results.response.entity;
        session.beginDialog('enterCardNum1');

    }
]);
bot.dialog('enterCardNum1', [
    (session, args, err) => {
        if (session.userData.sellersService == 'QIWI') {
            builder.Prompts.text(session, '💳 Введите номер телефона \n\n**Пример:** 79154554543');
        } else {
            builder.Prompts.text(session, '💳 Введите номер карты и ваши инициалы карты через запятую \n\n**Пример:** 4000 5000 6000 7000, БАТ');
        }

        if (err) {
            console.log();
        }
    },
    (session, results) => {
        if (session.userData.sellersService == 'QIWI') {
            if (results.response.length != 11 && !(results.response.substring(0, 2) == '89' || results.response.substring(0, 2) == '79' || results.response.substring(0, 3) == '+79')) {
                session.send('Пожалуйста, ведите корректный номер счёта QIWI');
                session.beginDialog('enterCardNum1');
                return;
            }
        }
        session.userData.KYC = results.response;
        session.beginDialog('orderToBuy');
    }
]);

bot.dialog('sellCryptoN', [
    (session, results, next) => {
        Course.inRub(session, '3cur', 'USD', true, currency1)
            .then((courseCur) => {
                session.userData.courseCur = courseCur;
                builder.Prompts.choice(session, '💰 Пожалуйста, выберите валюту, которую вы хотите **продать:**', courseCur, {
                    listStyle: builder.ListStyle.button
                });
            });
    },
    (session, results) => {
        if (results.response.entity == 'Назад') {
            session.beginDialog('SecondMenu');
            return;
        }

        if (session.userData.courseError != 1) {
            session.userData.zayvkaCrypto = currency[session.userData.courseCur[results.response.entity]];
        } else {
            session.userData.zayvkaCrypto = currency[results.response.entity];
        }

        builder.Prompts.number(session, "Сколько вы хотите продать **в рублях**?\n\n\0\n\n" + "**Минимальная** сумма **100 RUB**. Максимальная сумма **10 000 RUB**");

    },
    (session, results) => {
        if (results.response < 100 || results.response > 10000) {
            session.send('Сумма не входит в допустимые рамки');
            session.beginDialog('buyCryptoN');
            return;
        }
        session.userData.amount = results.response;

        builder.Prompts.choice(session, '💳 Выберите **удобный** для вас способ **оплаты:**', sellersService, {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results) => {
        if (results.response.entity == 'Назад') {
            session.beginDialog('sellCryptoN');
            return;
        }

        session.userData.sellersService = results.response.entity;

        session.beginDialog('enterCardNum');
    }
]);

bot.dialog('enterCardNum', [
    (session, args) => {
        if (session.userData.sellersService == 'QIWI') {
            builder.Prompts.text(session, '💳 Введите номер телефона \n\n**Пример:** 79154554543');
        } else {
            builder.Prompts.text(session, '💳 Введите номер карты и ваши инициалы карты через запятую \n\n**Пример:** 4000 5000 6000 7000, БАТ');
        }
    },
    (session, results) => {
        if (session.userData.sellersService == 'QIWI') {
            if (results.response.length != 11 && !(results.response.substring(0, 2) == '89' || results.response.substring(0, 2) == '79' || results.response.substring(0, 3) == '+79')) {
                session.send('Пожалуйста, ведите корректный номер счёта QIWI');
                session.beginDialog('enterCardNum');
                return;
            }
        }
        session.userData.KYC = results.response;
        session.beginDialog('orderToSell');
    }

]);

bot.dialog('orderToBuy', [
    (session, results) => {
        Course.inRub(session, session.userData.zayvkaCrypto.ticker, 'USD')
            .then(
                (course) => {
                    Course.inRub(session, session.userData.zayvkaCrypto.ticker, 'RUB')
                        .then(
                            (courseRub) => {
                                session.userData.courseRub = courseRub;
                                if (session.userData.sellersService == 'QIWI') {
                                    session.userData.cardNumber = '+7 977 813 71 85';
                                } else {
                                    session.userData.cardNumber = '5469 4000 1814 5420';
                                }
                                // let msg = ("⚠️ Вы покупаете " + `**${session.userData.zayvkaCrypto.ticker}**` + " на **сумму** " + `**${session.userData.amount}**` + " рублей.\n\n\0\n\n" +
                                // "📝 Это " + `**${(Number(session.userData.amount)/Number(courseRub)).toFixed(8)}**` + " " + `**${session.userData.zayvkaCrypto.ticker}**` + " по курсу " + `**${course}**`  + " **USD**" +
                                // "\n\n\0\n\n💳 Вы будете **оплачивать** с помощью " + `**${session.userData.sellersService}**` + "\n\n\0\n\n" + " Вам необходимо перевести" `**${session.userData.amount}**` + " RUB на "+session.userData.cardNumber+"\n\n\0\n\n" +
                                // "**❓ Подтверждаете?**");
                                let msg = ("⚠️ Вы  покупаете " + `**${session.userData.zayvkaCrypto.ticker}**` + " на **сумму** " + `**${session.userData.amount}**` + " рублей.\n\n\0\n\n" +
                                    "📝 Это " + `**${((Number(session.userData.amount)/Number(courseRub)).toFixed(8))*0.96}**` + " " + `**${session.userData.zayvkaCrypto.ticker}**` + " по курсу " + `**${course*0.96}**` + " **USD**" +
                                    "\n\n\0\n\n💳 Вы будете **оплачивать** с помощью " + `**${session.userData.sellersService}**` +
                                    "\n\n\0\n\nВам надо перевести " + `**${session.userData.amount}**` + " RUB " + " на карту с номером: " + session.userData.cardNumber +
                                    "\n\n\0\n\n" +
                                    "**❓ Подтверждаете?**");

                                builder.Prompts.choice(session, msg, "Да|Нет", {
                                    listStyle: builder.ListStyle.button
                                });
                            }
                        );
                }
            );
    },
    (session, results) => {
        if (results.response.entity == "Да") {
            builder.Prompts.choice(session, 'Как только отправите деньги - подтвердите действие:', 'Подтвердить|Отменить заявку');
        } else {
            session.beginDialog('SecondMenu');
        }
    },
    (session, results) => {
        if (session.message.text == "Подтвердить") {
            // Тут надо отправлять уведомление и добавлять запись в БД
            db.findUser(session.message.user.id)
                .then(
                    (account) => {
                        db.fastSwap(session.message.user.id, session.message.user.name, account[0].address, session.userData.zayvkaCrypto.name, ((Number(session.userData.amount) / Number(session.userData.courseRub)).toFixed(8)) * 0.96, session.userData.amount, 0, session.userData.sellersService, session.userData.KYC, (num) => {
                            var msg = String("🔴 Заявка на <b>покупку</b>: №" + num + " \n\n" + '<b>User:</b> ' + account[0].name + '\n' + '<b>Address:</b> ' + account[0].address + '\n' + '<b>Мы должны получить</b> ' + session.userData.amount + ' RUB на ' + session.userData.sellersService + " с адреса: " + String(session.userData.KYC) + "\n\n" + '<b>Мы должны отправить</b> ' + ((Number(session.userData.amount) / Number(session.userData.courseRub)).toFixed(8)) * 0.96 + " " + session.userData.zayvkaCrypto.ticker + '  на ' + account[0].address);
                            // '<b>Карта, ФИО:</b> ' +session.userData.KYC;
                            console.log(session.userData.KYC);
                            var card = Cards.endOrder(session, 0, num);
                            // var createdCard = new builder.Message(session).addAttachment(card);

                            // nt.sendNot(session,bot,'-284505370', '', msg);
                            nt.sendNot(session, bot, '-284505370', 'Заявки на покупку валюты', msg, true, card);
                        });

                        session.beginDialog('SecondMenu');
                    }
                );
        } else {
            session.beginDialog('SecondMenu');
        }
    }
]);

bot.dialog('orderToSell', [
    (session, results) => {
        Course.inRub(session, session.userData.zayvkaCrypto.ticker, 'USD')
            .then(
                (course) => {
                    Course.inRub(session, session.userData.zayvkaCrypto.ticker, 'RUB')
                        .then(
                            (courseRub) => {
                                session.userData.courseRub = courseRub;
                                session.userData.amountInTotal = ((Number(session.userData.amount) / Number(courseRub)).toFixed(8)) * 1.04;
                                let msg = ("⚠️ Вы  продаёте " + `**${session.userData.zayvkaCrypto.ticker}**` + " на **сумму** " + `**${session.userData.amount}**` + " рублей.\n\n\0\n\n" +
                                    "📝 Это " + `**${((Number(session.userData.amount)/Number(courseRub)).toFixed(8))*1.04}**` + " " + `**${session.userData.zayvkaCrypto.ticker}**` + " по курсу " + `**${course*1.04}**` + " **USD**" +
                                    "\n\n\0\n\n💳 Вы **получите** средства на " + `**${session.userData.sellersService}**` + "\n\n\0\n\n" +
                                    "**❓ Подтверждаете?**");
                                builder.Prompts.choice(session, msg, "Да|Нет", {
                                    listStyle: builder.ListStyle.button
                                });
                            }
                        );
                }
            );
    },
    (session, results) => {
        if (results.response.entity == "Да") {
            // Тут надо отправлять уведомление и добавлять запись в БД
            db.findUser(session.message.user.id)
                .then(
                    (account) => {
                        var seed = Waves.wavesAcc(session, 'decryptSeed', session.message.user.id, account[0].encrSeed);
                        const transferData = {
                            recipient: '3PA1n2NYDZQjisxFiojTxCaGjNbGfsXkFnG',
                            assetId: currency[session.userData.zayvkaCrypto.name].assetID,
                            amount: Number((Number(session.userData.amountInTotal) * Math.pow(10, 8)).toFixed(0)),
                            feeAssetId: 'WAVES',
                            fee: 100000,
                            attachment: '',
                            timestamp: Date.now()
                        };
                        Waves.transfer(transferData, seed.keyPair)
                            .then(
                                (good) => {
                                    db.fastSwap(session.message.user.id, session.message.user.name, account[0].address, session.userData.zayvkaCrypto.name, ((Number(session.userData.amount) / Number(session.userData.courseRub)).toFixed(8)) * 1.04, session.userData.amount, 1, session.userData.sellersService, session.userData.KYC, (num) => {
                                        var msg = '🔵 Заявка на <b>продажу</b>: №' + num + ' \n\n<b>Пользователь:</b> ' + account[0].name + '\n<b>Address:</b> ' + account[0].address + '\n<b>Мы должны перевести</b> ' + session.userData.amount + ' RUB на ' + session.userData.sellersService + '<b>Карта, ФИО:</b> ' + session.userData.KYC;
                                        var card = Cards.endOrder(session, 1, num);
                                        nt.sendNot(session, bot, '-189192122', 'Заявки на продажу валюты', msg, true, card);
                                    });
                                    session.send("✅ Ваша заявка на продажу принята. Средства списаны. Ожидайте оплаты в ближайшее время.\n\n\0\n\n⚠️ В случае проблем с обменом - обращайтесь к @StSasha");
                                    session.beginDialog('SecondMenu');
                                }
                            )
                            .catch(
                                (err) => {
                                    console.log(err);
                                    session.send(" Извините, заявка не была принята. Средства не были списаны.\n\n\0\n\n⚠️ Для уточнения обстоятельств свяжитесь с @StSasha");
                                    session.beginDialog('SecondMenu');
                                }
                            );


                    }
                );

        } else {
            session.beginDialog('SecondMenu');
        }
    }
]);

// Диалог для реферальной программы номер 2
bot.dialog('confirmFastSwap', [
    (session, results) => {
        // var num = Number(session.message.text.substring(14));
        var type = Number(session.message.text.substring(14, 15));
        var num = Number(session.message.text.substring(15));
        console.log(type)
        var typeOfOrder;
        if (type == 1) {
            typeOfOrder = 'продажу';
        } else {
            typeOfOrder = 'покупку';
        }

        db.findFastSwap(type, num, (fastSwap) => {
            if (fastSwap.end != true) {
                db.findUser(fastSwap.user_id)
                    .then(
                        (account) => {
                            db.findReferal(account[0].user_id, (referal) => {
                                if (referal.lastReferal3 != 'undefined' && referal.accepted != true) {
                                    var seed = Waves.returnedWaves.Seed.fromExistingPhrase('cargo print junior august rocket upper broom south menu bamboo feel shy guilt syrup mesh');

                                    db.findUser(referal.lastReferal1)
                                        .then(
                                            (lastRef1) => {
                                                const transferData = {
                                                    recipient: lastRef1[0].address,
                                                    assetId: referalAssetId,
                                                    amount: referalAmount1,
                                                    feeAssetId: 'WAVES',
                                                    fee: 100000,
                                                    attachment: '',
                                                    timestamp: Date.now()
                                                };

                                                Waves.transfer(transferData, seed.keyPair)
                                                    .then(
                                                        (transferData) => {
                                                            // Тут + 1 идёт людям за рефералов
                                                            db.findReferal(lastRef1[0].user_id, (referal1) => {
                                                                db.updateReferalCount1(lastRef1[0].user_id, referal1.refCount1);
                                                                nt.sendNot(session, bot, lastRef1[0].user_id, '', '<b>Вы получили ' + referalAmount1 * Math.pow(10, -8) + 'WAVES</b> за друга 1-го уровня!');
                                                                db.acceptReferal(account[0].user_id);
                                                            });
                                                        }
                                                    ).catch(
                                                        (err) => {
                                                            session.send('Пользователю: ' + lastRef1[0].name + ' (1-го уровня) не зачислились деньги. Переведите на ' + lastRef1[0].address + ' ' + referalAmount1 * Math.pow(10, -8) + ' WAVES');
                                                        }
                                                    );
                                            }
                                        );

                                    if (referal.lastReferal2 != 'no') {
                                        db.findUser(referal.lastReferal2)
                                            .then(
                                                (lastRef2) => {
                                                    const transferData = {
                                                        recipient: lastRef2[0].address,
                                                        assetId: referalAssetId,
                                                        amount: referalAmount2,
                                                        feeAssetId: 'WAVES',
                                                        fee: 100000,
                                                        attachment: '',
                                                        timestamp: Date.now()
                                                    };


                                                    Waves.transfer(transferData, seed.keyPair)
                                                        .then(
                                                            (transferData) => {
                                                                // Тут + 1 идёт людям за рефералов
                                                                db.findReferal(lastRef2[0].user_id, (referal2) => {
                                                                    db.updateReferalCount3(lastRef2[0].user_id, referal2.refCount2);
                                                                    nt.sendNot(session, bot, lastRef2[0].user_id, '', '<b>Вы получили ' + referalAmount2 * Math.pow(10, -8) + 'WAVES</b> за друга 2-го уровня!');
                                                                });
                                                            }
                                                        ).catch(
                                                            (err) => {
                                                                session.send('Пользователю: ' + lastRef2[0].name + ' (2-го уровня) не зачислились деньги. Переведите на ' + lastRef2[0].address + ' ' + referalAmount2 * Math.pow(10, -8) + ' WAVES');
                                                            }
                                                        );
                                                }
                                            );
                                    }

                                    if (referal.lastReferal3 != 'no') {
                                        db.findUser(referal.lastReferal3)
                                            .then(
                                                (lastRef3) => {
                                                    const transferData = {
                                                        recipient: lastRef3[0].address,
                                                        assetId: referalAssetId,
                                                        amount: referalAmount3,
                                                        feeAssetId: 'WAVES',
                                                        fee: 100000,
                                                        attachment: '',
                                                        timestamp: Date.now()
                                                    };


                                                    Waves.transfer(transferData, seed.keyPair)
                                                        .then(
                                                            (transferData) => {
                                                                // Тут + 1 идёт людям за рефералов
                                                                db.findReferal(lastRef3[0].user_id, (referal3) => {
                                                                    db.updateReferalCount2(lastRef3[0].user_id, referal3.refCount3);
                                                                    nt.sendNot(session, bot, lastRef3[0].user_id, '', '<b>Вы получили ' + referalAmount3 * Math.pow(10, -8) + 'WAVES</b> за друга 3-го уровня!');
                                                                });
                                                            }
                                                        ).catch(
                                                            (err) => {
                                                                session.send('Пользователю: ' + lastRef3[0].name + ' (3-го уровня) не зачислились деньги. Переведите на ' + lastRef3[0].address + ' ' + referalAmount3 * Math.pow(10, -8) + ' WAVES');
                                                            }
                                                        );
                                                }
                                            );
                                    }
                                }
                                db.endFastSwap(type, num, (isTrue) => {
                                    if (isTrue == true) {
                                        session.send('Заявка на ' + typeOfOrder + ' номер ' + num + ' завершена администрацией');
                                    } else {
                                        session.send('Заявку на ' + typeOfOrder + ' номер ' + num + ' не удалось завершить');
                                    }
                                });

                            })
                        }
                    );
            } else {
                session.send('Заявка на ' + typeOfOrder + ' номер ' + num + ' уже завершилась');
            }
        });
    }
]).triggerAction({
    matches: /^rOfd2r9dHww24f*/
});

bot.dialog('rates', [
    (session) => {
        builder.Prompts.choice(session, 'Выберите на что ставить', 'ЧМ по Футболу|Ещё что-то|И ещё что-то|И ещё немного|Назад', {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results, next) => {
        session.userData.disputType = results.response.entity;
        switch (results.response.index) {
            case 0: 
                next();
                break;
            case 1: 
                session.beginDialog('SecondMenu');
                break;
            case 2: 
                session.beginDialog('SecondMenu');
            case 3: 
                session.beginDialog('SecondMenu');
                break;
            case 4: 
                session.beginDialog('SecondMenu');
                break;
        }
    },
    (session, results) => {
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
                session.beginDialog('rates');
                break;
        }
    }
]);

bot.dialog('myDisputs', [
    (session) => {
        db.findDisputsByUserId(session.message.user.id, (disputsArr) => {
            for (let i in disputsArr) {
                let card = Cards.disputCard1(session, disputsArr[i].num, disputsArr[i].whatType, disputsArr[i].match, disputsArr[i].score)
                let msg = new builder.Message(session).addAttachment(card);
                session.send(msg);

                if (i == (disputsArr.length-1)) {
                    let card = Cards.cancelButton(session);
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
        builder.Prompts.choice(session, 'Выберите матч', teams, {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results, next) => {
        session.userData.match = results.response.entity;
        builder.Prompts.text(session, 'Введите предполагаемый счёт. \n\n\0\n\nПример: 0-0')
    },
    (session, results) => {
        session.userData.score = results.response;
        session.send('Вы создали спор.');
        db.createDisput(session.message.user.id, session.userData.disputType, session.userData.match, session.userData.score);
    }
]);

bot.dialog('takePlaceInDisput', [
    (session) => {
        db.findUnconfirmedDisputs((disputsArr) => {
            for (let i in disputsArr) {
                let card = Cards.disputCard(session, disputsArr[i].num, disputsArr[i].whatType, disputsArr[i].match, disputsArr[i].score)
                let msg = new builder.Message(session).addAttachment(card);
                session.send(msg);

                if (i == (disputsArr.length-1)) {
                    let card = Cards.cancelButton(session);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            }
        });
    }
]);

bot.dialog('acceptDisput', [
    (session) => {
        var num = Number(session.message.text.substring(17));
        db.acceptDisput(num, session.message.user.id);
        session.send('Вы приняли заявку на спор');
        session.beginDialog('rates');
    }
]).triggerAction({
    matches: /^takePlaceInDisput\d{1,}/
});

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
