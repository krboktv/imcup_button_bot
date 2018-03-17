// Setup Restify Server
var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var inMemoryStorage = new builder.MemoryBotStorage();

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "e921e42b-7a9f-4d5f-8b13-7f86b2c4d912",
    appPassword: "gqgasNYGD146_+~ynQHV86}"
}); 


// var connector = new builder.ChatConnector({
//     appId: "383f2e76-a6fb-46db-8330-71d4a2fc5734",
//     appPassword: "xhryTXAKK202^]jdbFA73@$"
// })


server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;