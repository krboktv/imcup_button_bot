const builder = require('botbuilder');
const Server = require("./server.js");
const rp = require('request-promise');

function sendNot(session, bot, _userid, _userName, _text, isButton, card) {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot575105748:AAEMtYFCC_ea8_OP4R6gMz40xVrPogu8LIc/sendMessage',
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
    
    if (isButton == true) {
        savedAddress = {
            channelId: 'telegram',

            conversation: {
                isGroup: true,
                id: _userid,
            },
            bot: {
                id: 'imcup_button_bot',
                name: 'imcup_button_bot'
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

