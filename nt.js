const rp = require('request-promise');
const db = require('./db.js');
const Course = require('./course.js');

// Удаление одинаковых объектов
function unique(arr) {
    var obj = {};

    for (let i = 0; i < arr.length; i++) {
        let str = arr[i];
        obj[str] = true;
    }

    return Object.keys(obj);
}

function notUnique(arr) {
    var sorted_arr = arr.slice().sort();
    var results = [];
    for (var i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
            results.push(sorted_arr[i]);
        }
    }

    return results;
}

function menu(_userid, _text, _markup) {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot528275882:AAEmuHwmb1GCVqFpCk7oyD69jMo7VzgL8rw/sendMessage',
        body: {
            'chat_id': _userid,
            'text': _text,
            'reply_markup': JSON.stringify({
                "keyboard": _markup,
                "resize_keyboard": true
            })
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options, (err, res, req) => {
        console.log(req);
    });
}

function markup(session, _userid) {
    Course.course('USD', (course) => {
        var _markup = [
            [],
            [],
            [],
            [],
            [],
            [{
                text: 'Готово'
            }]
        ];
        var tickers = [];
        var g = 0;
        var p = 0;
        db.findUser(session.message.user.id, (account) => {
            if (session.userData.whatAction == 'add') {
                if (account != undefined) {
                    var allCur = [];
                    for (let j in course) {
                        allCur.push(course[j].symbol)
                    }

                    var concatArr = allCur.concat(account.currency);
                    var notUniqueCur = notUnique(concatArr);

                    for (let i in notUniqueCur) {
                        let index = allCur.indexOf(notUniqueCur[i]);
                        allCur.splice(index, 1);
                    }

                    for (let k in allCur) {
                        if (p % 6 == 0 & p != 0)
                            g++;
                        _markup[g].push({
                            text: allCur[k]
                        });
                        tickers.push(allCur[k]);
                        p += 1;
                    }
                } else {
                    for (let j in course) {

                        if (p % 6 == 0 & p != 0)
                            g++;
                        _markup[g].push({
                            text: course[j].symbol
                        });
                        tickers.push(course[j].symbol);
                        p += 1;
                    }
                }
            } else if (session.userData.whatAction == 'del') {
                if (account != undefined) {
                    for (let i in account.currency) {
                        if (i % 6 == 0 & i != 0)
                            g++;
                        _markup[g].push({
                            text: account.currency[i]
                        });
                        tickers.push(account.currency[i]);
                    }
                } else {
                    session.send('😏 Сперва добавьте валюту');
                    return;
                }
            }
            session.userData.tickers = tickers;

            var _text;

            if (session.userData.whatAction == 'del')
                _text = 'Выберите валюты, которые хотите удалить';
            else
                _text = 'Выберите валюты, которые хотите добавить';

            var options = {
                method: 'POST',
                uri: 'https://api.telegram.org/bot528275882:AAEmuHwmb1GCVqFpCk7oyD69jMo7VzgL8rw/sendMessage',
                body: {
                    'chat_id': _userid,
                    'text': _text,
                    'reply_markup': JSON.stringify({
                        "keyboard": _markup,
                        "resize_keyboard": true
                    })
                },
                json: true // Automatically stringifies the body to JSON
            };

            rp(options, (err, res, req) => {
                console.log(req);
            });
        });

    });

}

function editMarkup(session, _userid, _usedCurrencies) {
    var _markup = [
        [],
        [],
        [],
        [],
        [],
        [{
            text: 'Готово'
        }]
    ];

    var t = 0;
    var p = 0;
    var tickers = session.userData.tickers;

    for (let g in tickers) {
        if (tickers[g] != _usedCurrencies) {
            if (p % 6 == 0 & p != 0)
                t++;
            _markup[t].push({
                text: tickers[g]
            });
            p += 1;
        }
    }

    for (let g in tickers) {
        if (tickers[g] == _usedCurrencies) {
            tickers.splice(g, 1);
        }
    }

    session.userData.tickers = tickers;

    var _text = 'Чтобы применить изменения нажмите "Готово"';

    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot528275882:AAEmuHwmb1GCVqFpCk7oyD69jMo7VzgL8rw/sendMessage',
        body: {
            'chat_id': _userid,
            'text': _text,
            'reply_markup': JSON.stringify({
                "keyboard": _markup,
                "resize_keyboard": true
            })
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options, (err, res, req) => {
        console.log(req);

        session.userData.msg_id = req.result.message_id;
        console.log(session.userData.msg_id);
    });
}

function deleteMarkup(session, _userid, callback) {
    console.log('MSG_ID: ' + session.userData.msg_id);
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot528275882:AAEmuHwmb1GCVqFpCk7oyD69jMo7VzgL8rw/deleteMessage',
        body: {
            'chat_id': _userid,
            'message_id': String(session.userData.msg_id)
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options, (err, res, req) => {
        console.log(req);
        callback(true)
    });
}


module.exports.menu = menu;
module.exports.markup = markup;
module.exports.editMarkup = editMarkup;
module.exports.deleteMarkup = deleteMarkup;


// var accountCur = ['BTC', 'ETH', 'WAVES'];
// var allCur = ['BTC', 'LTC', 'KOL', 'ETH', 'WAVES']
// var tkrs = accountCur.concat(allCur);
// var notUniqueCur = notUnique(tkrs);

// for (let i in notUniqueCur) {
//     var index = allCur.indexOf(notUniqueCur[i]);
//     allCur.splice(index, 1);
// }
// console.log(notUniqueCur)
// var _markup = [
//     [],
//     [],
//     [],
//     [],
//     [],
//     [{
//         text: 'Готово'
//     }]
// ];
// var tickers = [];
// var g = 0;
// var p = 0;
// for (let j in allCur) {
//     if (p % 6 == 0 & p != 0)
//         g++;
//     _markup[g].push({
//         text: allCur[j]
//     });
//     tickers.push(allCur[j]);
//     p += 1;
// }
// console.log(tickers)