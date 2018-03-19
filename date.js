function getTransactionData() {
    var myDate = new Date(Date.now());
    var dd = myDate.getDate();
    if (dd < 10) dd = '0' + dd;
    var mm = myDate.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
    var hh = myDate.getHours() + 3;
    if (hh > 23) hh = 0;
    if (hh < 10) hh = '0' + hh;
    var ss = myDate.getMinutes();
    if (ss < 10) ss = '0' + ss;
    var dataTr = dd + '/' + mm + '/' + myDate.getFullYear() + ' в ' + hh + ':' +
        ss;

    return dataTr;
};

module.exports.getTransactionData = getTransactionData;