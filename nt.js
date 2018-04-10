const rp = require('request-promise');

function sendNot(_userid, _text) {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot539909670:AAFk7Lxz73lTbtfjf8xIReCwSoEZZpjAlqI/sendMessage',
        body: {
            'chat_id': _userid,
            'text': _text,
            'parse_mode': 'HTML',
            'disable_web_page_preview': true
        },
        json: true // Automatically stringifies the body to JSON
    };

    rp(options, (err,res,req) => {
        console.log(req);
    });
}

module.exports.sendNot = sendNot;