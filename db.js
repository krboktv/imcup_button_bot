const mongoose = require("mongoose"),
    Foundations = require('./schemas/foundation.js');

mongoose.Promise = global.Promise;

const uri = 'mongodb://erage:doBH8993nnjdoBH8993nnj@51.144.89.99:27017/ImCup?authSource=admin'; // Мейн нет ПОМЕНЯТЬ

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    poolSize: 1000,
    bufferMaxEntries: 0
};
const db = mongoose.connect(uri).then(console.log('Mongo DB works fine'));

// Foundations.find({}, (err, doc) => {
//     console.log(doc);
// });
