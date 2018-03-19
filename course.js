var rp = require('request-promise');

// isObject[0] - используется ли объект
// isObject[1] - объект с валютами
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
                names = ['Waves', 'Bitcoin', 'Ethereum', 'ZCash', 'Litecoin', 'US Dollar', 'Euro'];

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