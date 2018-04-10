function satoshiToCurrency(balance) {
    return (Number((balance*Math.pow(10, -8)).toFixed(8)));
}

function currencyToSatoshi(balance) {
    return (Number((balance*Math.pow(10, 8)).toFixed(0)));
}

function weiToCurrency(balance) {
    return (Number((balance*Math.pow(10, -18)).toFixed(8)));
}

function currencyToWei(balance) {
    return (Number((balance*Math.pow(10, 18)).toFixed(0)));
}

module.exports.satoshiToCurrency = satoshiToCurrency;
module.exports.currencyToSatoshi = currencyToSatoshi;
module.exports.weiToCurrency = weiToCurrency;
module.exports.currencyToWei = currencyToWei;