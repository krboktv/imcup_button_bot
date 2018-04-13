// Setup Restify Server
var restify = require('restify');
var builder = require('botbuilder');
const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/bf1028ad-4afd-4a6d-9e3a-565d49111da4?subscription-key=ea18dbfcbf1e4d189c8b7fb24effd359&verbose=true&timezoneOffset=0&q=';

var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var inMemoryStorage = new builder.MemoryBotStorage();


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "5810b07b-377c-4eb4-8c1a-8b896c86b827",
    appPassword: "mmvrPEMAY6*?(mxkUM1731^"
}); 

server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;
module.exports.recognizer = recognizer;
