var rp = require('request-promise');

// Функция которая получает Рубли
// function inRub(session, course) {
//     return new Promise((resolve, reject) => {
//         rp('https://api.cryptonator.com/api/ticker/' + course)
//             .then(function (htmlString) {
//                 if (JSON.parse(htmlString).success == true) {
//                     balancesRus = Number(JSON.parse(htmlString).ticker.price).toFixed(2);
//                     resolve(balancesRus);
//                 } else {
//                     resolve(0);
//                     // reject(0);
//                 }
//             })
//             .catch(function (err) {
//                 reject(0);
//                 console.log('курс недоступен...');
//                 return;
//                 // console.log(err);
//             });
//     });
// }

function inRub(session, ticker, rubOrUsd,...isObject) {
    return new Promise((resolve, reject) => {
        session.userData.successCourse = 1;
        var options = {
            uri: 'https://min-api.cryptocompare.com/data/price?fsym='+rubOrUsd+'&tsyms=WAVES,BTC,ETH,ZEC,LTC,USD,EUR',
            json: true // Automatically parses the JSON string in the response
        };
        
        rp(options)
            .then(function (response) {
                var course;
                tickers = ['WAVES','BTC','ETH','ZEC', 'LTC', 'USD', 'EUR'];
                // tickers1 = ['WAVES','BTC','ETH'];
                names = ['Waves', 'Bitcoin', 'Ethereum', 'ZCash', 'Litecoin', 'US Dollar', 'Euro'];
                // names1 = ['Waves', 'Bitcoin', 'Ethereum'];
                if (ticker == 'all' || ticker == '3cur') { 
                    course = {};

                    if (isObject[0] != true) {
                        for (let i = 0; i<7; i++) {
                            course[tickers[i]] = (1/response[tickers[i]]).toFixed(2);
                        }
                    } else {
                        var g;

                        if (isObject[1]['Назад'] != undefined) 
                            g = Object.keys(isObject[1]).length-2;
                        else {
                            g = Object.keys(isObject[1]).length-1;
                        }
                            

                        for (let i = 0; i<=g; i++) {
                                if (rubOrUsd == 'RUB') {
                                    course[isObject[1][names[i]].name+' (Курс: '+(1/response[tickers[i]]).toFixed(0)+' '+rubOrUsd+')'] = isObject[1][names[i]].name;
                                } else {
                                    course[isObject[1][names[i]].name+' (Курс: '+(1/response[tickers[i]]).toFixed(2)+' '+rubOrUsd+')'] = isObject[1][names[i]].name;
                                }
                                if (i == g) { 
                                        course['Назад'] = 'отмена';
                                }                      
                        }
                    }
                } else {
                    course = (1/response[ticker]).toFixed(2);
                }
                
                resolve(course);
            })
            .catch(function (err) {
                var course = {};
                if (ticker == 'all') {
                    if (isObject[0] != true) {
                        for (let i = 0; i<7; i++) {
                            course[tickers[i]] = 0;
                        }
                    } else {
                        course = isObject[1];
                    }
                } else {
                    course[ticker] = 0;
                }
                session.userData.successCourse = 0;
                console.log('курс недоступен...');
                reject(course);
            });
    });
}

module.exports.inRub = inRub;

// Функция, которая возвращает курсы всех валют в рублях с названием вылюты
// module.exports.allCurrInRub = (session,currency, callback) => {
//     var courseCur = {};
//     var arr = ['Waves','Bitcoin','Ethereum','ZCash','Litecoin','US Dollar','Euro','Назад']
//     for (let i in currency) {
//         if (currency[i] == 'отмена') {
//             courseCur['Назад'] = 'отмена';
//         } else {
//             inRub(session,currency[i].course)
//                 .then(
//                     (course) => {
//                         if (currency[i].name != 'US Dollar' && currency[i].name != 'Euro') {
//                             course = Number(course).toFixed(0);
//                         } else {
//                             course = Number(course).toFixed(2);
//                         }
//                         courseCur[i+' (Курс: '+course+' RUB)'] = currency[i].name;
                        
//                         if (Object.keys(courseCur).length == Object.keys(currency).length) {

//                             // Сортировка отработанных асинхронных вызовов по массиву сверху
//                             var index;
//                             for(let i = 0; i < arr.length; i++) {
//                                 for (let h in courseCur) {
//                                     if ((courseCur[h] == arr[i]) || ((courseCur[h] == 'отмена') && (arr[i] == 'Назад'))) {
//                                         index = courseCur[h];
//                                         delete courseCur[h];
//                                         courseCur[h] = index;
//                                     }
//                                 }
//                             }
//                             session.userData.courseError = 0;
//                             callback(courseCur);
//                         }
//                     }
//                 )
//                 .catch(
//                     (err) => {
//                         session.userData.courseError = 1;
//                         callback(currency);
//                         return;
//                     }
//                 );
//             }
//             if (session.userData.courseError == 1) {
//                 return;
//             }
//     }
// }