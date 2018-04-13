const rp = require('request-promise'),
    safeMath = require('./safeMath.js');

const TOKEN_ID = "597931763:AAFOGZ7zBhCtse-6FPRyp9-WH5BkusSapzo";
//const TOKEN_ID = "564415681:AAGukCm3RiY_clEKy_SJmR48dbjmif6__GQ";

function sendNot(_userid, _text) {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot'+TOKEN_ID+'/sendMessage',
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

function sendNtWhenCreateProposal(approvedUsers, name, sum, address, why) {
    console.log(safeMath.weiToCurrency(sum))
    console.log(sum)
	var arr = approvedUsers.split(',');
	for (let i in arr) {
		sendNot(arr[i], "Организация <b>"+name+"</b> хочет вывести "+ safeMath.weiToCurrency(sum) +" ETH на адрес "+address+".\n\n<b>Причина:</b> "+why+".\n\nДля одобрения перейдите в личный кабинет.");
	}
}

module.exports.sendNot = sendNot;
module.exports.sendNtWhenCreateProposal = sendNtWhenCreateProposal;