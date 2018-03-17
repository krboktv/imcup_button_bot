// transaction data
module.exports.getTransactionData = function getTransactionData(current, unix_time) {
    if (current == 'yes' || current == 'unixTime') {
        var time1 = new Date();
        var time = Date.parse(time1).toString();
        unix_time = time.substring(0, time.length - 3).toString();
        if (current == 'unixTime')
            return unix_time;
    }
    var myDate = new Date(Number(unix_time + '000'));
    var dd = myDate.getDate();
    if (dd < 10) dd = '0' + dd;
    var mm = myDate.getMonth() + 1; // месяц 1-12
    if (mm < 10) mm = '0' + mm;
    var hh = myDate.getHours() + 3; // месяц 1-12
    if (hh > 23) hh = 0;
    if (hh < 10) hh = '0' + hh;
    var ss = myDate.getMinutes();
    if (ss < 10) ss = '0' + ss;
    var dataTr = dd + '/' + mm + '/' + myDate.getFullYear() + ' в ' + hh + ':' +
        ss;

    return dataTr;
};