const rp = require('request-promise');

function course(rubOrUsd, callback) {
    var options = {
        uri: 'https://api.coinmarketcap.com/v1/ticker/?limit=30',
        // uri: 'https://min-api.cryptocompare.com/data/price?fsym=' + rubOrUsd + '&tsyms=WAVES,BTC,ETH,ZEC,LTC,USD,EUR',
        json: true // Automatically parses the JSON string in the response
    };

    rp(options)
        .then(
            (response) => {
                callback(response);
            }
        )
        .catch(
            (err) => {
                callback(false);
            }
        );
}

module.exports.course = course;