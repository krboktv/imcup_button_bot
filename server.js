// Setup Restify Server
var restify = require('restify');
var builder = require('botbuilder');
// const LuisModelUrl = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/bf1028ad-4afd-4a6d-9e3a-565d49111da4?subscription-key=c387a1314b264fc7a6946958617eeb52&verbose=true&timezoneOffset=180&q=";

// var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var inMemoryStorage = new builder.MemoryBotStorage();


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "fcd64a9f-6944-47d1-ae86-4ee700dc5e7d",
    appPassword: "gfZMYQ21*!lphlwHQH132;-"
}); 

server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;
module.exports.recognizer = recognizer;