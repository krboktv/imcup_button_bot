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
    appId: "fcd64a9f-6944-47d1-ae86-4ee700dc5e7d",
    appPassword: "gfZMYQ21*!lphlwHQH132;-"
}); 

server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;