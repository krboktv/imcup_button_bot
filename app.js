const Server = require("./server.js");
const builder = require('botbuilder');
const Course = require('./course.js');
const nt = require('./nt.js');
const db = require('./db.js');
const Objects = require('./objects.js');

var bot = new builder.UniversalBot(Server.connector, [
    (session) => {
        nt.menu(session.message.user.id, Objects.mainMenuText, Objects.mainMenu);
    }
]).set('storage', Server.memory.inMemoryStorage); // Register in memory storage 

bot.dialog('top30', [
    (session) => {
        var toCurrency = 'USD';
        Course.course(toCurrency, (course) => {
            var msg = '';
            for (let i in course) {
                let percent_change_24h;
                let upOrDown;

                if (Number(course[i].percent_change_24h) < 0) {
                    upOrDown = '🔻 ';
                    percent_change_24h = course[i].percent_change_24h;
                } else {
                    upOrDown = '✅ ';
                    percent_change_24h = '+' + course[i].percent_change_24h;
                }

                msg += ('**'+upOrDown+course[i].name+ '**' + '\n\n> ' + Number(course[i].price_usd).toFixed(3) + ' ' + toCurrency + ' (' + percent_change_24h + '% 24h)' + '\n\n\0\n\n');
            }
            session.send(msg);
        });
    }
]).triggerAction({
    matches: /👀 Топ 30/
});

bot.dialog('portfolio', [
    (session) => {
        db.findUser(session.message.user.id, (account) => {
            if (account != undefined) {
                Course.course('USD', (course) => {
                    var msg = '';
                    for (var i in course) {
                        for (var g in account.currency) {
                            if (course[i].symbol == account.currency[g]) {
                                let percent_change_24h;
                                let upOrDown;

                                if (Number(course[i].percent_change_24h) < 0) {
                                    upOrDown = '🔻 ';
                                    percent_change_24h = course[i].percent_change_24h;
                                } else {
                                    upOrDown = '✅ ';
                                    percent_change_24h = '+' + course[i].percent_change_24h;
                                }

                                msg += ('**'+upOrDown+course[i].name+ '**' + '\n\n> ' + Number(course[i].price_usd).toFixed(3) + ' ' + 'USD' + ' (' + percent_change_24h + '% 24h)' + '\n\n\0\n\n');
                            }
                        }
                    }
                    session.send(msg);
                    nt.menu(session.message.user.id, Objects.portfolioText, Objects.portfolio);
                });
            } else {
                nt.menu(session.message.user.id, Objects.portfolioText, Objects.portfolio);
            }
        });
    }
]).triggerAction({
    matches: /🗒 Мой список/
});

bot.dialog('addCurrencies', [
    (session) => {
        console.log('Добавляется');
        session.userData.whatAction = 'add';
        nt.markup(session, session.message.user.id);
        session.beginDialog('choose');
    }
]).triggerAction({
    matches: /➕ Добавить валюту/
});


bot.dialog('delCurrencies', [
    (session) => {
        session.userData.whatAction = 'del';
        nt.markup(session, session.message.user.id);
        session.beginDialog('choose');
    }
]).triggerAction({
    matches: /➖ Удалить валюту/
});

bot.dialog('mainMenu', [
    (session) => {
        nt.menu(session.message.user.id, Objects.mainMenuText, Objects.mainMenu);
    }
]).triggerAction({
    matches: /✈️ Главное Меню/
});

bot.dialog('choose', [
    (session, args) => {
        if (session.userData.choose == 1) {
            if (session.userData.tickers) {
                for (let i in session.userData.tickers) {
                    if (session.userData.tickers[i] == session.message.text) {

                        console.log(session.userData.currs)
                        if (session.userData.whatAction == 'add') {
                            if (session.userData.currs) {
                                (session.userData.currs).push(session.message.text);
                            } else {
                                session.userData.currs = [session.message.text];
                            }
                        } else {
                            if (session.userData.delCurrs) {
                                (session.userData.delCurrs).push(session.message.text);
                            } else {
                                session.userData.delCurrs = [session.message.text];
                            }
                        }
                        nt.editMarkup(session, session.message.user.id, session.message.text);
                        session.beginDialog('choose1');
                    }
                }
            }
        } else {
            session.userData.choose = 1;
        }
    }
]);

bot.dialog('choose1', [
    (session, args) => {
        if (session.userData.choose == 1) {
            session.userData.choose = 0;
            session.beginDialog('choose');
        }
    }
]);

bot.dialog('done', [
    (session) => {
        if (session.userData.whatAction == 'add') {
            if (session.userData.currs == undefined) {
                session.send('Вы ничего не выбрали. Валюты не были добавлены.');
                session.beginDialog('portfolio');
                return;
            }
            session.send('Валюты добавлены в ваш список');
            db.findUser(session.message.user.id, (account) => {
                if (account != undefined) {
                    db.updateUser(session.message.user.id, session.userData.currs, (done) => {
                        console.log('Обновлено');
                        session.beginDialog('portfolio');
                    });
                } else {
                    db.createUser(session.message.user.id, session.userData.currs, (done) => {
                        console.log('Добавлено');
                        session.beginDialog('portfolio');
                    });
                }
                session.userData.currs = undefined;
            });
        } else if (session.userData.whatAction == 'del') {
            if (session.userData.delCurrs == undefined) {
                session.send('Вы ничего не выбрали. Валюты не были удалены.');
                session.beginDialog('portfolio');
                return;
            }
            session.send('Валюты удалены из вашего списка');
            db.deleteCurrencies(session.message.user.id, session.userData.delCurrs, (done) => {
                db.findUser(session.message.user.id, (account) => {
                    if (account.currency.length == 0) {
                        db.deleteUser(session.message.user.id);
                    }
                    session.userData.delCurrs = undefined;
                    session.beginDialog('portfolio');
                });
            });
        }
        session.userData.tickers = undefined;
    }
]).triggerAction({
    matches: /^Готово/
});