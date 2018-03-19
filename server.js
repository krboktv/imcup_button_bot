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
    appId: "13fb48e8-1652-4d5e-9163-fbbe18f90979",
    appPassword: "bripZ644@($-vqsJIIENH23"
});

server.post('/api/messages', connector.listen());

module.exports.server = server;
module.exports.connector = connector;
module.exports.memory = inMemoryStorage;