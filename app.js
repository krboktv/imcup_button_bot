const Server = require("./server.js");
const builder = require('botbuilder');
const db = require("./db.js");
const ObjectID = require("mongodb").ObjectID;
const Waves = require("./waves.js");
const Course = require('./course.js');
const Objects = require('./objects.js');
const DateTime = require('./date.js');
const Cards = require('./cards.js');
const Link = require('./schemes/linkScheme.js');
const rp = require('request-promise');
const LuisModelUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/a75a45b7-c84d-4567-8eb6-fc637c9744d0?subscription-key=fa895b902ea44a41a1f1d347e0ff6600&verbose=true&timezoneOffset=0&q=";

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
// const Ajax = require('ajax-request');

var bot = new builder.UniversalBot(Server.connector, [
    (session) => {
        session.beginDialog('SecondMenu');
    }
]).set('storage', Server.memory.inMemoryStorage);
bot.recognizer(recognizer);

bot.dialog('SecondMenu', [
    (session) => {
        db.findUser(session.message.user.id, (account) => {
            if (account != undefined) {
                builder.Prompts.choice(session, "## Главное меню", '🛒 Marketplace|🤔 Что мне поесть?|💳 Кошелёк|💼 Партнёрам', {
                    listStyle: builder.ListStyle.button
                });
            } else {
                session.beginDialog('createWallet');
                return;
            }
        })

    },
    (session, results) => {
        switch (results.response.index) {
            case 0:
                session.beginDialog('marketplace');
                break;
            case 1:
                session.beginDialog('getAtach');
                break;
            case 2:
                session.beginDialog('wallet');
                break;
            case 3:
                session.beginDialog('addProduct');
                break;
            default:
                session.endDialog();
                break;
        }
    }
], intents).reloadAction('showMenu', null, {
    matches: /^(menu|back)/i
}).triggerAction({
    matches: /отмена|Eat/i
}).triggerAction({
    matches: /^(start|Eat)/i
}).beginDialogAction('Eat', 'getAtach');;

bot.dialog('wallet', [
    (session) => {
        getBal(session, (message) => {
            session.send(message);
            builder.Prompts.choice(session, 'Выберете:', '💳 Перевести|💹 Криптобиржа|🔐 Аккаунт|❌ Отмена', {
                listStyle: builder.ListStyle.button
            });
        });
    },
    (session, results) => {
        switch (results.response.index) {
            case 0:
                session.beginDialog('makeAtransaction');
                break;
            case 1:
                session.beginDialog('exchange');
                break;
            case 2:
                session.beginDialog('myAccountInfo');
                break;
            case 3:
                session.beginDialog('SecondMenu');
                break;
            default:
                session.endDialog();
                break;
        }
    }
]);

// Информация об аккаунте
bot.dialog('myAccountInfo', [
    (session, results) => {
        db.findUser(session.message.user.id,
            (account) => {
                const seed = Waves.wavesAccount(session.message.user.id, 'decryptSeed', account.encrSeed);

                var card = Cards.createReceiptCard(session, session.message.user.name);
                var msg = new builder.Message(session).addAttachment(card);

                session.send(msg);
                session.send('📬 Мой адрес:');
                session.send(seed.address);
                session.send('🛑 Мой SEED (никому не пересылайте!): ');
                session.send(seed.phrase);
                session.beginDialog('SecondMenu');
            }
        );
    }
]);

// Создать кошелёк
bot.dialog('createWallet', [
    (session) => {
        // Создаём новый адрес Waves
        // seed[0] - зашифрованный seed
        // seed[1] - seed

        const seed = Waves.wavesAccount(session.message.user.id, 'createNewAcc');

        db.createAndUpdateUser(session.message.user.id, seed[1].address, seed[0], session.message.user.name, (done) => {
            if (done == true) {
                session.send('🛑 **Обязательно запишите Seed!** \n\nВаш Seed: ');
                session.send(seed[1].phrase);
                session.send('📬 Ваш Address: ');
                session.send(seed[1].address);
                session.replaceDialog('SecondMenu');
            } else {
                session.send('Новый аккаунт не создался');
                session.beginDialog('SecondMenu');
            }
        });
    },
]);

//Добавить новый кошелёк
bot.dialog('addWallet', [
    (session) => {
        builder.Prompts.text(session, "Введите Seed");
        let card = Cards.cancelButton(session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    (session, results) => {
        if (results.response.length < 50) {
            session.send('Seed не может быть меньше 50-ти символов');
            session.beginDialog('addWallet');
            return;
        }
        if (results.response == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        }

        if (results.response != "") {
            const seed = Waves.wavesAccount(session.message.user.id, 'addNewAcc', results.response);
            db.removeUser(session.message.user.id, (done) => {
                if (done == true) {
                    db.createAndUpdateUser(session.message.user.id, seed[1].address, seed[0], session.message.user.name, (done) => {
                        if (done == true) {
                            session.send('📬 Мой адрес:');
                            session.send(seed[1].address);
                            session.send('🛑 Мой SEED (никому не пересылайте!): ');
                            session.send(seed[1].phrase);
                            session.beginDialog('SecondMenu');
                        } else {
                            session.send('Не удалось создать нового пользователя');
                            session.beginDialog('SecondMenu');
                        }
                    })
                } else {
                    session.send('Не удалось удалить старый аккаунт');
                    session.beginDialog('SecondMenu');
                }
            })
        }
    }
]).triggerAction({
    matches: /сменить_аккаунт/
});

bot.dialog('makeAtransaction', [
    (session) => {
        builder.Prompts.choice(session, "💳 Выберите валюту для перевода", Objects.currency, {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results) => {

        var crypto = Objects.currency[results.response.entity];

        if (crypto == 'отмена') {
            session.beginDialog('SecondMenu');
            return;
        } else {

            session.userData.currency = Objects.currency[results.response.entity];

            db.findUser(session.message.user.id, (account) => {
                Waves.getBalance(session, account.address, session.userData.currency.assetID, session.userData.currency.ticker, (balance, rub) => {
                    // Проверяем на наличие средств на балансе
                    if (balance <= 0) {
                        session.send('Недостаточно средств для перевода');
                        session.beginDialog('SecondMenu');
                        return;
                    }

                    function syncCheck(callback) {
                        var balanceSubComission;
                        if (session.userData.currency.assetID == 'WAVES') {
                            balanceSubComission = balance - 0.001;
                            callback(balanceSubComission);
                        } else {
                            Waves.checkWavesBalance(account.address, (wavesBalance) => {
                                balanceSubComission = wavesBalance - 0.001;
                                callback(balanceSubComission);
                            });
                        }
                    }


                    syncCheck((balanceSubComission) => {
                        // Проверям на наличие средств на комиссию
                        if (balanceSubComission < 0) {
                            session.send('На вашем счету недостаточно WAVES для комиссии.');
                            session.beginDialog('SecondMenu');
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
                    });
                })
            });
        }
    },
    (session, results) => {
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

        session.userData.whatCurrency = x;

        // Создаём карточку для ввода суммы
        let card = Cards.createSumCard(session);
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
    },
    (session, results) => {
        var re = new RegExp('.', '');

        var sum;

        //Меняем точку на запятую
        if (results.response.search(re) == 0) {
            sum = Number(results.response.replace(',', "."));
        }

        if (results.response == 0) {
            session.send('Сумма перевода меньше минимальной.');
            session.beginDialog('SecondMenu');
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

        db.findUser(session.message.user.id, (account) => {
            session.userData.address1 = account.address;
            session.userData.encrSeed = account.encrSeed;

            Waves.getBalance(session, account.address, session.userData.currency.assetID, 'noCourse', function (balance) {
                // Если на балансе хватает денег
                if (Number(balance) >= Number(session.userData.sum)) {
                    // Если не хватает на комиссию, когда выбираем WAVES
                    if ((session.userData.currency.assetID == 'WAVES') && (Number(Number(balance) - 0.001) < Number(session.userData.sum))) {
                        session.endDialog('Недостаточно средств на комиссию для перевода');
                        return;
                    }

                    // Запрашиваем имя или адрес человека, которому хоти перевести
                    builder.Prompts.text(session, "Введите **блокчейн Waves адрес** или nickname получателя");
                } else {
                    session.endDialog('Недостаточно средств для перевода. \n\n Ваш баланс: ' + `${balance} ${session.userData.currency.name}`);
                    return;
                }
            });
        })
    },
    (session, results) => {
        // Если мы вводим адрес WAVES
        if (results.response.length == 35) {
            session.userData.address2 = results.response;

            // Получаем текущую дату
            var currentData = DateTime.getTransactionData();
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

            db.findUserByName(re, (account) => {
                if (account != false) {

                } else {
                    session.send('Такого пользователя не существует');
                    session.beginDialog('SecondMenu');
                    return;
                }
            });
            if (account.name != session.message.user.name) {
                session.userData.name2 = account.name;
                session.userData.address2 = account.address;

                var currentData = DateTime.getTransactionData();
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
                session.send('Нельзя совершать перевод себе.');
                session.beginDialog('SecondMenu');
                return;
            }
        }
    },
    (session, results) => {
        session.userData.name1 = session.message.user.name;
        switch (results.response.index) {
            case 0:
                session.send("Ваш перевод выполняется, подождите около 30 секунд");

                db.findUser(session.message.user.id, (account) => {
                    var address1 = account.address;

                    // Расшифровываем Seed
                    const seed = Waves.wavesAccount(session.message.user.id, 'decryptSeed', account.encrSeed);

                    var sumPeresilka = Number((session.userData.sum) * Math.pow(10, session.userData.stepen)).toFixed(0);

                    Waves.transfer(session.userData.address2, session.userData.currency.assetID, sumPeresilka, seed.keyPair)
                        .then(
                            (responseData) => {
                                console.log(responseData);
                                db.findUserByAddress(session.userData.address2, (account) => {

                                });
                                session.beginDialog('SecondMenu');
                            }
                        )
                        .catch(
                            (err) => {
                                console.log(err);
                                session.send('Извините, по каким-то причинам перевод не был совершён.');
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

// Функция, которая возвращает балансы
function getBal(session, callback) {
    db.findUser(session.message.user.id, (account) => {
        Waves.getBalance(session, account.address, 'all', 'all', (balances, course) => {
            if (course) {
                session.userData.course = course;
            }

            callback("## Food Hack кошелек \n\n\0\n\n" +
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

// Биржа
bot.dialog('exchange', [
    (session, args, next) => {
        getBal(session, (res) => {
            session.send(res);
            db.findUser(session.message.user.id, (account) => {
                Waves.checkWavesBalance(account.address, (balance) => {
                    if (balance < 0.003) {
                        session.endDialog('На вашем счету недостаточно WAVES для комиссии.');
                    } else {
                        Course.inRub(session, 'all', 'RUB', true, Objects.currency)
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
    (session, results, next) => {
        if (results.response.entity == 'Назад') {
            session.beginDialog('SecondMenu');
            return;
        }
        var gegus = {};
        var afterChange;
        if (session.userData.successCourse != 0) {
            session.userData.currency1 = session.userData.courseCur[results.response.entity];

            afterChange = Object.assign(gegus, Objects.exchange);
            delete afterChange[session.userData.courseCur[results.response.entity]];
        } else {
            session.userData.currency1 = currency[results.response.entity].name;
            console.log(results);

            afterChange = Object.assign(gegus, Objects.exchange);
            delete afterChange[currency[results.response.entity].name];
        }


        builder.Prompts.choice(session, `💰 Выберите валюту, которую **продаете:** `, afterChange, {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results, next) => {
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
]);

bot.dialog('enterSumExchange', [
    (session, args, next) => {
        rp.get(`https://nodes.wavesnodes.com/matcher/orderbook/${Objects.exchange[session.userData.currency1][session.userData.currency2].assetID1}/${Objects.exchange[session.userData.currency1][session.userData.currency2].assetID2}`, (err, res, body) => {

            })
            .then((res) => {
                var orderBook = JSON.parse(res);
                session.userData.orderBook = orderBook;
                var type = Objects.exchange[session.userData.currency1][session.userData.currency2].type;

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
                db.findUser(session.message.user.id, (account) => {
                    Waves.getBalance(session, account.address, Objects.currency[session.userData.currency2].assetID, 'noCourse', (balance) => {
                        if (balance != 0) {
                            session.userData.balanceCur2 = balance;
                            var balanceToCheck = Number(balance);
                            if (session.userData.currency2 == 'Waves') {
                                balanceToCheck = Number(balanceToCheck - 0.003);
                            }

                            // Сколько максимум сможет купить юзер
                            var amount;
                            if (Objects.exchange[session.userData.currency1][session.userData.currency2].type == 'sell') {
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

                            session.send('💰 Максимальная сумма покупки: ' + amount + ' ' + Objects.currency[session.userData.currency1].ticker);

                            builder.Prompts.text(session, ' ');
                            let card = Cards.endExButton(session, session.userData.currency1);
                            let msg = new builder.Message(session).addAttachment(card);
                            session.send(msg);
                        } else {
                            session.send('Вам нечего менять');
                            session.beginDialog('SecondMenu');
                        }
                    });
                });
            })
            .catch(
                (err) => {
                    console.log(err);
                    session.send('В данный момент обмен недоступен');
                    session.beginDialog('SecondMenu');
                    return;
                }
            );
    },
    (session, results, next) => {
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
            session.send('Минимальная сумма - 0.0001 ' + Objects.currency[session.userData.currency1].ticker);
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
        if (Objects.exchange[session.userData.currency1][session.userData.currency2].type == 'sell') {
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
            session.send('⛔️ Недостаточно средств.\n\nДля покупки ' + session.userData.orderSum + ' ' + Objects.currency[session.userData.currency1].ticker + ' необходимо ' + amount + ' ' + currency[session.userData.currency2].ticker + '.\n\nВам доступно: ' + session.userData.balanceCur2 + ' ' + currency[session.userData.currency2].ticker);
            session.beginDialog('enterSumExchange', {
                reload: 'yes'
            })
            return;
        }

        Course.inRub(session, Objects.currency[session.userData.currency1].ticker, 'RUB')
            .then(
                (course) => {
                    let card = Cards.createConfirmOrderCard(session, Objects.currency, session.userData.currency1, session.userData.currency2, session.userData.orderPrice, session.userData.orderSum, Objects.exchange[session.userData.currency1][session.userData.currency2].type, course);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            )
            .catch(
                (err) => {
                    let card = Cards.createConfirmOrderCard(session, Objects.currency, session.userData.currency1, session.userData.currency2, session.userData.orderPrice, session.userData.orderSum, Objects.exchange[session.userData.currency1][session.userData.currency2].type);
                    let msg = new builder.Message(session).addAttachment(card);
                    session.send(msg);
                }
            );
    }
]).beginDialogAction('createDexOrder', 'createDexOrder', {
    matches: /1да/i
});

bot.dialog('createDexOrder', [
    (session, args) => {
        db.findUser(session.message.user.id, (account) => {

            var seed = Waves.wavesAccount(session.message.user.id, 'decryptSeed', account.encrSeed);

            rp.get('https://nodes.wavesnodes.com/matcher/', (err, res, body) => {

                })
                .then((publicKey) => {
                    var amount;
                    if (Objects.exchange[session.userData.currency1][session.userData.currency2].type == 'sell')
                        amount = Number(((session.userData.orderSum * Math.pow(10, session.userData.decimals) / session.userData.orderPrice) * Math.pow(10, session.userData.price)).toFixed(0))
                    else
                        amount = Number(((session.userData.orderSum) * Math.pow(10, session.userData.decimals)).toFixed(0))

                    const transferData = {
                        senderPublicKey: seed.keyPair.publicKey,
                        matcherPublicKey: JSON.parse(publicKey),
                        amountAsset: Objects.exchange[session.userData.currency1][session.userData.currency2].assetID1,
                        priceAsset: Objects.exchange[session.userData.currency1][session.userData.currency2].assetID2,
                        orderType: Objects.exchange[session.userData.currency1][session.userData.currency2].type,
                        amount: amount,
                        price: Number(session.userData.orderPrice),
                        timestamp: Number(Date.now()),
                        expiration: Number(Date.now() + 420000),
                        matcherFee: 300000
                    };
                    console.log(transferData);
                    Waves.returnedWaves.API.Matcher.v1.createOrder(transferData, seed.keyPair).then((responseData) => {
                        console.log(responseData);
                    });
                    session.send('Средства зачислятся в течении 7 минут. В ином случае - вернутся');
                    session.beginDialog('SecondMenu');
                })
                .catch(
                    (err) => {
                        session.send('В данный момент обмен недоступен');
                        session.beginDialog('SecondMenu');
                        return;
                    }
                );
        });
    }
]);


// Распознование лица
bot.dialog('getAtach', [
    (session, err) => {
        session.send(
            '😊 Здесь вы можете подобрать себе еду **под ваше настроение.**\n\n\0\n\n' +
            '**Просто сделайте селфи и бот сам предложит вам то, что вы хотите** 🍕🍕🍕'
        );
        builder.Prompts.attachment(session, "📷 Пришли мне вашу **фотографию**");
    },
    (session, results) => {
        console.log(results.response[0].contentUrl);
        var options = {
            method: 'POST',
            uri: 'https://westus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=emotion,age,gender',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': 'dad667b4ce8945a68818b171cb0988cb'
            },
            body: {
                'url': String(results.response[0].contentUrl)
            },
            json: true
        };

        rp(options, (err, res, req) => {
            if (err) {
                session.send('Сфотографируйте ещё раз');
                session.beginDialog('getAtach');
                return;
            }
            console.log(req[0].faceAttributes.emotion);


            // session.send('**Эмоции:** ' + "\n\n" +
            //     "**Гнев** " + JSON.stringify(req[0].faceAttributes.emotion.anger) + "\n\n" +
            //     "**Презрение** " + " " + JSON.stringify(req[0].faceAttributes.emotion.contempt) + "\n\n" +
            //     "**Отвращение** " + " " + JSON.stringify(req[0].faceAttributes.emotion.disgust) + "\n\n" +
            //     "**Страх** " + " " + JSON.stringify(req[0].faceAttributes.emotion.fear) + "\n\n" +
            //     "**Счастье** " + " " + JSON.stringify(req[0].faceAttributes.emotion.happiness) + "\n\n" +
            //     "**Нейтральный** " + " " + JSON.stringify(req[0].faceAttributes.emotion.neutral) + "\n\n" +
            //     "**Грусть** " + " " + JSON.stringify(req[0].faceAttributes.emotion.sadness) + "\n\n" +
            //     "**Cюрприз** " + " " + JSON.stringify(req[0].faceAttributes.emotion.surprise) + "\n\n" +
            //     "Пол: " + " " + JSON.stringify(req[0].faceAttributes.gender) + "\n\n" +
            //     "Возраст: " + " " + JSON.stringify(req[0].faceAttributes.age));

            var emotions = {
                "anger": {
                    name: "😡 гнев",
                    znach: "0"
                },
                "contempt": {
                    name: "😒 презрение",
                    znach: "0"
                },
                "disgust": {
                    name: "🤢 отвращение",
                    znach: "0"
                },
                "fear": {
                    name: "😓 страх",
                    znach: "0"
                },
                "happiness": {
                    name: "😊 счастье",
                    znach: "0"
                },
                "neutral": {
                    name: "😐 нейтральность",
                    znach: "0"
                },
                "sadness": {
                    name: "😔 грусть",
                    znach: "0"
                },
                "surprise": {
                    name: "😱 удивление",
                    znach: "0"
                }

            }

            var msg1 = "Вы сейчас исптываете: \n\n";
            for (let i in req[0].faceAttributes.emotion) {
                if (req[0].faceAttributes.emotion[i] > 0.1) {
                    msg1 = msg1 + '   ' + emotions[i].name + '\n\n';
                }
            }
            session.send(msg1);

            var count = 1;
            var findProducts = false;

            db.findProducts(
                (products) => {
                    for (let g in products) {
                        count = count + 1;
                        var p = 0;
                        if (products[g].emotions) {
                            console.log(products[g])
                            for (let b in products[g].emotions) {
                                if ((((req[0].faceAttributes.emotion.anger > 0.3 && req[0].faceAttributes.emotion.anger < 0.9) || (req[0].faceAttributes.emotion.sadness < 0.9 && req[0].faceAttributes.emotion.sadness > 0.4)) && (req[0].faceAttributes.gender == "female")) && (products[g].emotions[b] == 'sadness' || products[g].emotions[b] == 'anger') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;
                                } else if ((((req[0].faceAttributes.emotion.anger > 0.3 && req[0].faceAttributes.emotion.anger < 0.9) || (req[0].faceAttributes.emotion.sadness < 0.9 && req[0].faceAttributes.emotion.sadness > 0.4)) && (req[0].faceAttributes.gender == "male")) && (products[g].emotions[b] == 'sadness' || products[g].emotions[b] == 'anger') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if ((req[0].faceAttributes.emotion.anger > 0.7) && (products[g].emotions[b] == 'anger') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if ((req[0].faceAttributes.emotion.sadness > 0.7) && (products[g].emotions[b] == 'sadness') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                }
                                if ((req[0].faceAttributes.emotion.happiness > 0.65) && (products[g].emotions[b] == 'happiness') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if ((req[0].faceAttributes.emotion.neutral > 0.666) && (products[g].emotions[b] == 'neutral') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    let msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if (((req[0].faceAttributes.emotion.fear > 0 || req[0].faceAttributes.emotion.sadness > 0)) && (products[g].emotions[b] == 'sadness' || products[g].emotions[b] == 'fear') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if ((req[0].faceAttributes.emotion.surprise > 0) && (products[g].emotions[b] == 'surprise') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if (((req[0].faceAttributes.emotion.contempt > 0)) && (products[g].emotions[b] == 'contempt') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if ((req[0].faceAttributes.emotion.disgust > 0) && (products[g].emotions[b] == 'disgust') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if (((req[0].faceAttributes.emotion.anger > 0.3 || req[0].faceAttributes.emotion.contempt > 0.3)) && (products[g].emotions[b] == 'anger' || products[g].emotions[b] == 'contempt') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if (((req[0].faceAttributes.emotion.contempt > 0.006)) && (products[g].emotions[b] == 'contempt') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;

                                } else if (((req[0].faceAttributes.emotion.sadness > 0.2) && (req[0].faceAttributes.gender == "female")) && (products[g].emotions[b] == 'sadness') && p == 0) {
                                    p = p + 1;
                                    var card = Cards.createPizzaCard(session, products[g].name, products[g].shortDescription, products[g].description, products[g].price, products[g].image, true, products[g].num);
                                    var msg = new builder.Message(session).addAttachment(card);
                                    session.send(msg);
                                    findProducts = true;
                                    continue;
                                }
                            }
                        }
                    }
                    if (findProducts == false) {
                        session.send('Ваше лицо плохо видно, попробуйте ещё раз');
                        session.beginDialog('getAtach');
                        return;
                    } else {
                        // ВОРОНКА ПРОДАЖ
                        builder.Prompts.choice(session, '❓ Вы выбрали что-нибудь **вкусное**?', '😋 Да|🤔 Ещё подумаю', {
                            listStyle: builder.ListStyle.button
                        });
                    }
                }
            );

        })
    },
    (session, results, next) => {
        switch (results.response.index) {
            case 0:
                session.send('🎉 Замечательно! **Нажмите** кнопку **"Купить"**😊');
                builder.Prompts.text(session, ' ');
                break;
            case 1:
                session.send('😉 **Приходите** снова, как проголодаетесь!');
                session.beginDialog('SecondMenu');
                break;
        }
    },
    (session, results) => {
        if (results.response != 'купить' && results.response != 'Купить' && results.response != 'КУПИТЬ') {
            session.userData.nextStep = 'next';
            builder.Prompts.choice(session, '🤔 Вы **выбрали** что-нибудь?', 'Да!|Пока что нет', {
                listStyle: builder.ListStyle.button
            });
        } else {
            session.userData.nextStep = 'end';
            session.send('💡 Чтобы **выбрать** товар - **нажмите** кнопку **"Купить"** под продуктом');
            builder.Prompts.text(session, ' ');
        }
    },
    (session, results) => {
        if (session.userData.nextStep == 'next') {
            switch (results.response.index) {
                case 0:
                    session.userData.nextStep = 'end';
                    session.send('💡 Чтобы **выбрать** товар - **нажмите** кнопку **"Купить"** под продуктом');
                    builder.Prompts.text(session, ' ');
                    break;
                case 1:
                    session.send('😉 **Приходите** снова, как проголодаетесь!');
                    session.beginDialog('SecondMenu');
                    break;
            }
        } else {
            session.send('😉 **Приходите** снова, как проголодаетесь!');
            session.beginDialog('SecondMenu');
        }
    },
    (session) => {
        session.send('😉 **Приходите** снова, как проголодаетесь!');
        session.beginDialog('SecondMenu');
    }
])

bot.dialog('buyWithCrypto', [
    (session) => {
        console.log(session.message.text.substring(3, session.message.text.length));
        var orderNum = session.message.text.substring(3, session.message.text.length);
        session.userData.orderNum = orderNum;
        getBal(session, (balances) => {
            session.send(balances);
            db.findProductByNum(session.userData.orderNum, (product) => {
                session.userData.price = product.price;
                let msg = 'Сумма к оплате - **' + product.price + '** RUB\n\n\0\n\n' +
                    '**Выберите** валюту для оплаты'
                builder.Prompts.choice(session, msg, Objects.currency);
            });
        });
    },
    (session, results, next) => {
        if (results.response.entity == 'Отмена') {
            session.userData.cancelOrder = true;
            session.Prompts.choice(session, 'Вы отменили покупку.\n\n\0\n\n↩️ **Вернуться** в меню товаров?', 'Да|Нет', {
                listStyle: builder.ListStyle.button
            });
        } else {
            session.userData.currency = Objects.currency[results.response.entity];
            next();
        }
    },
    (session, results, next) => {
        if (session.userData.cancelOrder == true) {
            switch (results.response.index) {
                case 0:
                    session.beginDialog('marketplace');
                    break;
                case 1:
                    session.beginDialog('SecondMenu');
                    break;
            }
        } else {
            next();
        }
    },
    (session, results) => {

        db.findProductByNum(session.userData.orderNum, (product) => {
            session.userData.rubPrice = product.price;

            db.findUser(session.message.user.id, (account) => {
                console.log(account);
                Waves.getBalance(session, account.address, session.userData.currency.assetID, session.userData.currency.ticker, (balance, rub) => {
                    // Проверяем на наличие средств на балансе
                    if (balance <= 0) {
                        session.send('Недостаточно средств для перевода');
                        session.beginDialog('SecondMenu');
                        return;
                    }

                    function syncCheck(callback) {
                        var balanceSubComission;
                        if (session.userData.currency.assetID == 'WAVES') {
                            balanceSubComission = balance - 0.001;
                            callback(balanceSubComission);
                        } else {
                            Waves.checkWavesBalance(account.address, (wavesBalance) => {
                                balanceSubComission = wavesBalance - 0.001;
                                callback(balanceSubComission);
                            });
                        }
                    }


                    syncCheck((balanceSubComission) => {
                        // Проверям на наличие средств на комиссию
                        if (balanceSubComission < 0) {
                            session.send('На вашем счету недостаточно WAVES для комиссии.');
                            session.beginDialog('SecondMenu');
                            return;
                        }

                        // Курс
                        session.userData.price = rub;
                        // Стоимость в рублях по курсу
                        session.userData.priceInRub = balance * rub;
                        if (session.userData.rubPrice > session.userData.priceInRub) {
                            session.userData.isError = true;
                            session.send('Недостаточно средств для совершения перевода');
                            builder.Prompts.choice(session, 'Вы желаете **продолжить покупку** за Рубли?', 'Да|Нет', {
                                listStyle: builder.ListStyle.button
                            });

                        } else {
                            let sumToPay = Number(session.userData.rubPrice / rub).toFixed(8);
                            session.userData.sumToPay = sumToPay;
                            session.send('С вашего счёт спишется ' + sumToPay + ' ' + session.userData.currency.ticker);
                            builder.Prompts.text(session, 'Для подтвержения перевода введите данную сумму');
                            session.userData.isError = false;
                        }
                    });
                });
            });
        });
    },
    (session, results) => {
        // Тут либо человек покупает, либо попадает в воронку
        if (session.userData.isError != true) {
            var re = new RegExp('.', '');

            var sum;

            //Меняем точку на запятую
            if (results.response.search(re) == 0) {
                sum = Number(results.response.replace(',', "."));
            }

            if (sum != session.userData.sumToPay) {
                session.send('Вы ввели неверную сумму, попробуйте ещё раз');
                session.userData.isError == true;
            } else {
                db.findUser(session.message.user.id, (account) => {
                    var address1 = account.address;

                    // Расшифровываем Seed
                    const seed = Waves.wavesAccount(session.message.user.id, 'decryptSeed', account.encrSeed);

                    var sumPeresilka = Number((session.userData.sumToPay) * Math.pow(10, session.userData.stepen)).toFixed(0);

                    Waves.transfer('3PBnAFVV8AWyXMw4pSq4EQHibnVZMFHtcGw', session.userData.currency.assetID, sumPeresilka, seed.keyPair)
                        .then(
                            (responseData) => {
                                console.log(responseData);
                                session.send('Перевод прошёл успешно! Ожидайте, вам напишут в Telegram ☑️')
                                session.beginDialog('SecondMenu');
                            }
                        )
                        .catch(
                            (err) => {
                                console.log(err);
                                session.send('Извините, по каким-то причинам перевод не был совершён.');
                                session.beginDialog('SecondMenu');
                            }
                        )
                });
            }
        } else {
            session.beginDialog('SecondMenu');
        }
    }
]).triggerAction({
    matches: /^num/
});

// Маркетплейс
bot.dialog('addProduct', [
    (session) => {
        session.send(
            '✅ Здесь вы можете **добавить свой продукт в Marketplace.**\n\n' +
            'После его добавления пользователи смогут **увидеть ваш товар и купить его за предложенную цену.**'
        );
        builder.Prompts.text(session, '1️⃣ Для начала введите **название товара.**');
    },
    (session, results) => {
        session.userData.pizzaName = results.response;
        builder.Prompts.text(session, '2️⃣ Теперь добавьте **краткое описание**');
    },
    (session, results) => {
        session.userData.pizzaShortDescription = results.response;
        builder.Prompts.text(session, '3️⃣ И **подробное**');
    },
    (session, results) => {
        session.userData.pizzaDescription = results.response;
        builder.Prompts.number(session, '4️⃣ Введите **цену**');
    },
    (session, results) => {
        session.userData.pizzaPrice = results.response;
        builder.Prompts.choice(session, '5️⃣ Выберите **эмоции**, вместе с которыми будет показываться продукт\n\n❗️ Примечание: не более 3-х эмоций', Objects.emotionPack);
    },
    (session, results, next) => {
        console.log(results.response.entity)
        if (results.response.entity == 'Добавить продукт') {
            session.userData.toAdd = true;
            next();
            return;
        }
        session.userData.emotions = [Objects.emotionPack[results.response.entity]];
        let gegus = {};
        let nextEmotion = Object.assign(gegus, Objects.emotionPack);
        delete nextEmotion[results.response.entity];
        session.userData.noDelEmotions = nextEmotion;
        builder.Prompts.choice(session, 'Выберите ещё эмоцию или перейдите к добавлению продукта\n\n❗️ Примечание: не более 3-х эмоций', nextEmotion);
    },
    (session, results, next) => {
        if (session.userData.toAdd != undefined || results.response.entity == 'Добавить продукт') {
            session.userData.toAdd = true;
            next();
            return;
        }
        session.userData.emotions.push(Objects.emotionPack[results.response.entity]);
        let gegus = {};
        let nextEmotion = Object.assign(gegus, Objects.emotionPack);
        delete nextEmotion[results.response.entity];
        session.userData.noDelEmotions = nextEmotion;
        builder.Prompts.choice(session, 'Выберите ещё эмоцию или перейдите к добавлению продукта\n\n❗️ Примечание: не более 3-х эмоций', nextEmotion);
    },
    (session, results, next) => {
        if (session.userData.toAdd != undefined || results.response.entity == 'Добавить продукт') {

        } else {
            session.userData.emotions.push(Objects.emotionPack[results.response.entity]);
        }

        builder.Prompts.attachment(session, '6️⃣ Отправьте **изображение вашего продукта**');
    },
    (session, results) => {
        session.userData.pizzaImage = results.response[0].contentUrl;
        session.send('⏩ Итак, ваш товар **будет выглядеть следующим образом** ');
        let card = Cards.createPizzaCard(
            session,
            session.userData.pizzaName,
            session.userData.pizzaShortDescription,
            session.userData.pizzaDescription,
            session.userData.pizzaPrice,
            session.userData.pizzaImage,
            false
        );
        let msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
        builder.Prompts.choice(session, '**⏩ Добавить товар в 🛒 Marketplace?**', 'Да|Нет', {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results) => {
        switch (results.response.index) {
            case 0:
                db.addProduct(
                    session.message.user.id,
                    session.userData.pizzaName,
                    session.userData.pizzaShortDescription,
                    session.userData.pizzaDescription,
                    session.userData.pizzaPrice,
                    session.userData.pizzaImage,
                    session.userData.emotions,
                    (done) => {
                        if (done == true) {
                            session.send('Ваш продукт добавлен в Marketplace!');
                            session.beginDialog('SecondMenu');
                        }
                    }
                )
                break;
            case 1:
                session.send('Вы не добавили товар в Marketplace');
                session.beginDialog('SecondMenu');
                break;
        }
    }
]);

bot.dialog('marketplace', [
    (session) => {
        db.findProducts(
            (products) => {
                session.send(
                    '🍒 Добро пожаловать в **Marketplace**!'
                );
                for (let i in products) {
                    if (products.length != 0) {
                        let card = Cards.createPizzaCard(
                            session,
                            products[i].name,
                            products[i].shortDescription,
                            products[i].description,
                            products[i].price,
                            products[i].image,
                            true,
                            products[i].num
                        );
                        let msg = new builder.Message(session).addAttachment(card);
                        session.send(msg);
                    } else {
                        session.send('⚡️ Станьте **первым**, кто добавит продукт в Marketplace!\n\nДля этого **перейдите** в меню **"💼 Партнёрам"**');
                    }
                }
                // ВОРОНКА ПРОДАЖ
                builder.Prompts.choice(session, '❓ Вы выбрали что-нибудь **вкусное**?', '😋 Да|🤔 Ещё подумаю', {
                    listStyle: builder.ListStyle.button
                });
            }
        )
    },
    (session, results, next) => {
        switch (results.response.index) {
            case 0:
                session.send('🎉 Замечательно! **Нажмите** кнопку **"Купить"**😊');
                builder.Prompts.text(session, ' ');
                break;
            case 1:
                session.send('😉 **Приходите** снова, как проголодаетесь!');
                session.beginDialog('SecondMenu');
                break;
        }
    },
    (session, results) => {
        if (results.response != 'купить' && results.response != 'Купить' && results.response != 'КУПИТЬ') {
            session.userData.nextStep = 'next';
            builder.Prompts.choice(session, '🤔 Вы **выбрали** что-нибудь?', 'Да!|Пока что нет', {
                listStyle: builder.ListStyle.button
            });
        } else {
            session.userData.nextStep = 'end';
            session.send('💡 Чтобы **выбрать** товар - **нажмите** кнопку **"Купить"** под продуктом');
            builder.Prompts.text(session, ' ');
        }
    },
    (session, results) => {
        if (session.userData.nextStep == 'next') {
            switch (results.response.index) {
                case 0:
                    session.userData.nextStep = 'end';
                    session.send('💡 Чтобы **выбрать** товар - **нажмите** кнопку **"Купить"** под продуктом');
                    builder.Prompts.text(session, ' ');
                    break;
                case 1:
                    session.send('😉 **Приходите** снова, как проголодаетесь!');
                    session.beginDialog('SecondMenu');
                    break;
            }
        } else {
            session.send('😉 **Приходите** снова, как проголодаетесь!');
            session.beginDialog('SecondMenu');
        }
    },
    (session) => {
        session.send('😉 **Приходите** снова, как проголодаетесь!');
        session.beginDialog('SecondMenu');
    }
]);

var intents = new builder.IntentDialog({
        recognizers: [recognizer]
    })
    .matches('Greeting', (session) => {
        // session.send('You reached Greeting intent, you said \'%s\'.', session.message.text);
    })
    .matches('Help', (session) => {
        // session.send('You reached Help intent, you said \'%s\'.', session.message.text);
    })
    .matches('Cancel', (session) => {
        // session.send('You reached Cancel intent, you said \'%s\'.', session.message.text); 
    })
    .matches('Eat', (session) => {
        // session.send('You reached Eat intent, you said \'%s\'.', session.message.text);
        session.beginDialog('getAtach');
    })
    .onDefault((session) => {
        // session.send('Sorry, I did not understand \'%s\'.', session.message.text);
    });

bot.beginDialogAction('getAtach', 'Eat');