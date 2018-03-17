const builder = require('botbuilder');
const Server = require("./server.js");
const rp = require('request-promise');

function sendNot(session, bot, _userid, _userName, _text, isButton, card) {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot535222297:AAFqSAMFAoO2w29rIONofk5GxKkcPXg8HXw/sendMessage',
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

    // Это костыль, который нужно переписать на нативном методе
    if (isButton == true) {
        savedAddress = {
            channelId: 'telegram',

            conversation: {
                isGroup: true,
                id: _userid,
            },
            bot: {
                id: 'button_wallet_bot',
                name: 'button_bot'
                // id: 'brostobot',
                // name: 'Prvt'
            },
            serviceUrl: 'https://telegram.botframework.com'
        };
        
            Server.server.get('/api/messages', (req, res) => {
        
            console.log("---");
        
            console.log(savedAddress);
        
            console.log("---");
        
            res.send('triggered');
        
            });
        
            Server.server.post('/api/messages', Server.connector.listen());   
            // Уведомление о переводе адресату
        
            setTimeout(() => {
                    var msg = new builder.Message().address(savedAddress).addAttachment(card);
                    bot.send(msg);
            }, 500)
        }
};

module.exports.sendNot = sendNot;

