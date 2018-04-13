const mongoose = require("mongoose");
const Hex = require("./hex.js");
const nt = require("./nt.js");
const ObjectID = require("mongodb").ObjectID;
const Link = require('./schemes/linkScheme.js');
const Transaction = require('./schemes/transactionScheme.js');
const Recomendations = require('./schemes/recomendationScheme.js');
const Out = require('./schemes/outScheme.js');
const Exchange = require('./schemes/exchangeScheme.js');
const Swap = require('./schemes/swapScheme.js');
const Disput = require('./schemes/disputSchema.js');
const Waves = require("./waves.js");
const Course = require('./course.js');

mongoose.Promise = global.Promise;

var uri = 'mongodb://erage:doBH8993nnjdoBH8993nnj@51.144.89.99:27017/ImCupMain?authSource=admin';

const options = { 
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 1000, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
const db = mongoose.connect(uri, options).then(console.log('Mongo DB works fine'));

module.exports.createUser = function createUser(user_id) {
  return new Promise((resolve, reject) => {
    Link.create({
      user_id: user_id
    }, function (err, res) {
      if (err) return console.log(err);
      console.log("Пользователь создан", res);
      resolve(res);
    });
  });
}

module.exports.createAndUpdateUser = function createAndUpdateUser(user_id, address, encrypted, name) {
  return new Promise((resolve, reject) => {
    Link.create({
      user_id: user_id,
      address: address,
      encrSeed: encrypted,
      name: name
    }, function (err, res) {
      if (err) return console.log(err);
      console.log("Пользователь создан", res);
      resolve(res);
    });
  });
}

function findUser(user_id) {
  return new Promise((resolve, reject) => {
    Link.find({
      user_id: user_id
    }, function (err, res) {
      if (err) return console.log(err);
      console.log("Токен найден", res);
      resolve(res);
    });
  });
}

module.exports.findUser = findUser;

module.exports.updateUser = function updateUser(user_id, address, encrypted, name) {
  return new Promise((resolve, reject) => {
    Link.update({
      user_id: user_id
    }, {
      address: address,
      encrSeed: encrypted,
      name: name
    }, function (err, doc) {
      if (err) return console.log(err);
      console.log("Адрес добавлен:", doc);
      resolve(doc);
    });
  });
}

module.exports.findRecomendattions = function findRecomendattions(user_id, callback) {
  Recomendations.find({
      user_id: user_id,
    }, {

    }, {
      sort: {
        count_to_use: -1
      }
    }, function (err, doc) {
      if (err) return console.log(err);
    })
    .limit(5)
    .then(
      function (recomendations) {
        callback(recomendations);
      }
    );
}

module.exports.updateRecomendattions = function updateRecomendattions(user_id, nickname) {
  Recomendations.find({
      user_id: user_id,
      transfer_name: nickname
    }, {

    }, {
      sort: {
        count_to_use: -1
      }
    }, function (err, doc) {
      if (err) return console.log(err);
    })
    .then(
      function (recomendations) {
        // Если этому пользователю делали перевод, то обновляем
        if (recomendations.length != 0) {
          Recomendations.update({
            user_id: user_id,
            transfer_name: nickname
          }, {
            count_to_use: recomendations[0].count_to_use + 1
          }, function (err, doc) {
            if (err) return console.log(err);
          });
        } else {
          // Если этому пользователю ещё не переводили валюту, то создаём новую запись
          Recomendations.create({
            user_id: user_id,
            transfer_name: nickname,
            count_to_use: 1
          }, function (err, doc) {
            if (err) return console.log(err);
          });
        }
      }
    );
}

module.exports.createOrder = function createOrder(user_id1, currency, sumCripto, sumRub, cardService, cardServiceNum, type) {
  Swap.find({
    type: type
  }, {
    num: 1
  }, {
    sort: {
      num: -1
    }
  }).limit(1).then(function (lastOrder) {
    var num;
    if (lastOrder[0]) {
      num = lastOrder[0].num + 1;
    } else {
      num = 1;
    }

    Swap.create({
      num: num,
      user_id1: user_id1,
      currency: currency,
      type: Number(type),
      sumCripto: Number(sumCripto),
      sumRub: Number(sumRub),
      cardService: cardService,
      cardServiceNum: cardServiceNum
    }, function (err, doc) {
      if (err) return console.log(err);
      console.log('Создан ордер: ' + doc);
    });
  });
}

module.exports.findOrders = function findOrders(cur, typeOrders, skip, cardService, callback) {
  if (cur != 'all') {
    Swap.find({
          type: typeOrders,
          currency: cur,
          cardService: cardService
        }, {

        }, {
          sort: {
            num: -1
          }
        },
        function (err, doc) {

        }
      )
      .skip(skip)
      .limit(5)
      .then(
        function (swaps) {
          callback(swaps);
        }
      );
  } else {
    Swap.find({
          type: typeOrders,
        }, {

        }, {
          sort: {
            num: -1
          }
        },
        function (err, doc) {

        }
      )
      .skip(skip)
      .limit(5)
      .then(
        function (swaps) {
          callback(swaps);
        }
      );
  }
}

module.exports.findOrUpdateOrder = (whatAction, num, type, user_id2) => {
  return new Promise((resolve, reject) => {
    if (whatAction == 'find') {
      Swap.find({
          num: Number(num),
          type: type
        })
        .then(function (swap) {
          resolve(swap)
        });
    } else {
      Swap.update({
        num: Number(num),
        type: type
      }, {
        user_id2: user_id2,
      }, function (err, doc) {
        resolve(doc);
      });
    }
  });
}

module.exports.swapPay = (type, currency, sellersService, callback) => {
  Swap.find({
      type: type,
      currency: currency,
    }, (err, doc) => {

    })
    .then(
      (obj) => {
        var cardObj = {};
        var index;
        for (var j in sellersService) {
          cardObj[j] = 0;
          for (var i in obj) {
            if (j == obj[i].cardService && obj[i].user_id2 == 'no') {
              index = cardObj[j];
              delete cardObj[j];
              cardObj[j] = index + 1;
            }
          }
        }
        callback(cardObj);
      }
    );
}


// Трекеринг вывода на другие блокчейны НАЧАЛО
module.exports.outCurrency = (user_id, _currency, _sum, _address) => {
  Out.create({
    user_id: user_id,
    currency: _currency,
    sum: _sum,
    address: _address
  }, (err, doc) => {})
}
// Трекеринг вывода на другие блокчейны КОНЕЦ

module.exports.exchangeTx = (_userid, _type, _currency1, _currency2, _amount, _price) => {
  Exchange.create({
    user_id: _userid,
    type: Number(_type),
    currency1: _currency1,
    currency2: _currency2,
    amount: Number(_amount),
    price: Number(_price)
  }, (err, res) => {});
}

module.exports.createDisput = (_userid, _type, _matchOrCurrency, _val1, _currency, _price, _endTime) => {
  Disput.find({}, (err, doc) => {
    if (doc.length != 0) {
      var _num = Number(doc[doc.length - 1].num) + 1
      Disput.create({
        user_id1: _userid,
        num: Number(_num),
        type: Number(_type),
        matchOrCurrency: _matchOrCurrency,
        val1: _val1,
        currency: _currency,
        price: Number(_price),
        endTime: _endTime
      }, (err, res) => {

      });
    } else {
      Disput.create({
        user_id1: _userid,
        num: 1,
        type: Number(_type),
        matchOrCurrency: _matchOrCurrency,
        val1: _val1,
        currency: _currency,
        price: Number(_price),
        endTime: _endTime
      }, (err, res) => {

      });
    }
  });
}

module.exports.findDisputsByUserId = (_userid, callback) => {
  var disputs;
  Disput.find({
    user_id1: _userid
  }, (err, res) => {
    Disput.find({
      user_id2: _userid
    }, (err, doc) => {
      callback(res.concat(doc));
    });
  });
}

function findDisputsByNum(_num, callback) {
  Disput.find({
    num: Number(_num)
  }, (err, res) => {
    callback(res[0]);
  });
}

module.exports.findDisputsByNum = findDisputsByNum;

module.exports.removeDisputsByNum = (_num, callback) => {
  Disput.remove({
    num: Number(_num)
  }, (err, res) => {
    callback(true);
  });
}

module.exports.acceptDisput = (_num, _userid) => {
  Disput.update({
    num: Number(_num)
  }, {
    user_id2: _userid
  }, (err, res) => {

  });
}

module.exports.updateDisput = (session, _type, _currency, _num, _val2) => {
  Disput.update({
    num: Number(_num)
  }, {
    val2: _val2
  }, (err, doc) => {
   
  })
}

module.exports.findUnconfirmedDisputs = (callback) => {
  Disput.find({}, (err, res) => {
    var disputsObj = [];
    for (let i in res) {
      if (res[i].user_id2 == '') {
        disputsObj.push(res[i]);
      }
    }
    callback(disputsObj);
  });
}
