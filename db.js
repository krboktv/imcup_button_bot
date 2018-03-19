const mongoose = require("mongoose");
const UserAccount = require('./schemes/currencyScheme.js');

mongoose.Promise = global.Promise;

// const uri = 'mongodb://52.232.68.160:27017/db';
const user = 'admin';
const password = 'kiRbejmcSpiliVili228';
const uri = 'mongodb://'+user+':'+password+'@40.68.244.86:27017/db'; // Мейн нет ПОМЕНЯТЬ

const options = {
    autoIndex: false,
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 1000, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
const db = mongoose.connect(uri, options).then(console.log('Mongo DB works fine'));

// Удаление одинаковых объектов
function unique(arr) {
    var obj = {};
  
    for (let i = 0; i < arr.length; i++) {
      let str = arr[i];
      obj[str] = true;
    }
  
    return Object.keys(obj);
  }

function findUser(_userid, callback) {
    UserAccount.find({
        user_id: _userid
    }, (err, doc) => {
        if (doc.length != 0) {
            callback(doc[0]);
        } else {
            callback(undefined);
        }
    });
}

function deleteUser(_userid) {
    UserAccount.remove({user_id: _userid}, (err, doc) => {});
}

function createUser(_userid, _currencies, callback) {
    if (_currencies != undefined) {
        var currToAdd = unique(_currencies);
        UserAccount.create({
            user_id: _userid,
            currency: currToAdd
        }, (err, doc) => {
            callback(true);
        });
    }
}

function updateUser(_userid, _currencies, callback) {
    if (_currencies != undefined) {
        findUser(_userid, (account) => {
            var newCurrencies = account.currency;
            for (let i in _currencies) {
                newCurrencies.push(_currencies[i]);
            }

            var currToAdd = unique(newCurrencies);

            UserAccount.update({
                user_id: _userid
            }, {
                currency: currToAdd
            }, (err, doc) => {
                callback(true);
            });
        });
    }
}

function deleteCurrencies(_userid, _currencies, callback) {
    if (_currencies != undefined) {
        findUser(_userid, (account) => {
            var newCurrencies = account.currency;
            for (let i in _currencies) {
                for (let j in account.currency) {
                    if (account.currency[j] == _currencies[i]) {
                        delete newCurrencies[j];
                    }
                }
            }

            var currToAdd = unique(newCurrencies);

            var index = currToAdd.indexOf('undefined');
            currToAdd.splice(index, 1);

            UserAccount.update({
                user_id: _userid
            }, {
                currency: currToAdd
            }, (err, doc) => {
                callback(true);
            });
        });
    }
}

module.exports.findUser = findUser;
module.exports.deleteUser = deleteUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteCurrencies = deleteCurrencies;

// UserAccount.find({}, (err,res) => {console.log(res)})