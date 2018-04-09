const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
const Link = require('./schemes/linkScheme.js');
const Products = require('./schemes/addProductScheme.js');

mongoose.Promise = global.Promise;

var uri = 'mongodb://erage:doBH8993nnjdoBH8993nnj@51.144.89.99:27017/ImCupFood?authSource=admin';

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 1000, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
const db = mongoose.connect(uri, options).then(console.log('Mongo DB works fine'));

// Создание пользователя
function createAndUpdateUser(_userid, _address, _encrypted, _name, callback) {
    Link.create({
        user_id: _userid,
        address: _address,
        encrSeed: _encrypted,
        name: _name
    }, (err, res) => {
        if (err) {
            callback(false);
        }
        console.log('Создан новый пользователь');
        callback(true);
    });
}

// Поиск пользователя
function findUser(_userid, callback) {
    Link.find({
        user_id: _userid
    }, (err, res) => {
        if (err) {
            callback(false);
        }
        console.log("Токен найден", res);
        callback(res[0]);
    });
}

function findUserByName(_name, callback) {
    Link.find({
        address: _name
    }, (err, doc) => {
        if (doc.length != 0)
            callback(doc[0]);
        else
            callback(false);
    });
}

function findUserByAddress(_address, callback) {
    Link.find({
        address: _address
    }, (err, doc) => {
        if (doc.length != 0)
            callback(doc[0]);
        else
            callback(false);
    });
}

function removeUser(_userid, callback) {
    Link.remove({
        user_id: _userid
    }, (err, doc) => {
        callback(true);
    });
}

function findProducts(callback) {
    Products.find({

    }, (err, doc) => {
        if (err) {
            callback(false);
            return;
        }
        callback(doc)
    });
}

function addProduct(_userid, _name, _shortDescription, _description, _price, _image, emotions, callback) {
    findProducts(
        (products) => {
            if (products[0] != undefined) {
                Products.create({
                    num: Number(products.length),
                    user_id: _userid,
                    name: _name,
                    shortDescription: _shortDescription,
                    description: _description,
                    price: _price,
                    image: _image,
                    emotions: emotions
                }, (err, doc) => {
                    if (err) {
                        callback(false);
                        return;
                    }
                    callback(true)
                });
            } else {
                Products.create({
                    num: 0,
                    user_id: _userid,
                    name: _name,
                    shortDescription: _shortDescription,
                    description: _description,
                    price: _price,
                    image: _image,
                    emotions: emotions
                }, (err, doc) => {
                    if (err) {
                        callback(false);
                        return;
                    }
                    callback(true)
                });
            }
        }
    );
}

function findProducts(callback) {
    Products.find({

    }, (err, doc) => {
        if (err) {
            callback(false);
            return;
        }
        callback(doc)
    });
}

function findProductByNum(_num, callback) {
    Products.find({
        num: Number(_num)
    }, (err, doc) => {
        if (err) {
            callback(false);
            return;
        }
        callback(doc[0]);
    });
}

module.exports.createAndUpdateUser = createAndUpdateUser;
module.exports.findUser = findUser;
module.exports.findUserByName = findUserByName;
module.exports.findUserByAddress = findUserByAddress;
module.exports.removeUser = removeUser;
module.exports.addProduct = addProduct;
module.exports.findProducts = findProducts;
module.exports.findProductByNum = findProductByNum;
