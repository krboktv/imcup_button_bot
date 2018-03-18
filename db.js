const mongoose = require("mongoose");
const Hex = require("./hex.js");
const nt = require("./nt.js");
const ObjectID = require("mongodb").ObjectID;
const Link = require('./schemes/linkScheme.js');
const Transaction = require('./schemes/transactionScheme.js');
const Recomendations = require('./schemes/recomendationScheme.js');
const Swap = require('./schemes/swapScheme.js');
const Swap1 = require('./schemes/swapSashaScheme.js');
const FastSwap = require('./schemes/fastSwapScheme.js');
const Place = require('./schemes/placeScheme.js');
const Referal = require('./schemes/referalScheme.js');
const RefAddUsers = require('./schemes/refUserScheme.js');
const Phone = require('./schemes/phoneScheme.js');
const Out = require('./schemes/outScheme.js');
const BadTransfer = require('./schemes/badTransferScheme.js');
const Exchange = require('./schemes/exchangeScheme.js');
const Disput = require('./schemes/disputSchema.js');
const Waves = require("./waves.js");


mongoose.Promise = global.Promise;

var uri = 'mongodb://52.174.19.192:27017/db';

const options = {
  autoIndex: false,
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 1000, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
const db = mongoose.connect(uri, options).then(console.log('Mongo DB works fine'));

// Swap.remove({}, function(err, row) {
//   if (err) {
//       console.log("Collection couldn't be removed" + err);
//       return;
//   }

//   console.log("collection removed");
// }) 
//user_id: '347025571'

// Заявки на бирже
// Exchange.find({}, (err,doc) => {
//   console.log(doc)
// })

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

module.exports.findUser = function findUser(user_id) {
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
      
      },
    {
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
      
      },
    {
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

module.exports.createOrder = function createOrder(user_id1, currency, sumCripto, sumRub, cardService, cardServiceNum,type) {
  Swap.find({type: type}, {
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
  if (cur!='all') {
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

module.exports.findOrUpdateOrder = (whatAction,num,type,user_id2) => {
    return new Promise((resolve, reject) => {
      if (whatAction == 'find') {
        Swap.find({
          num: Number(num),
          type: type
        })
          .then(function(swap){resolve(swap)}); 
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
    }, (err,doc) => {
      
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
              cardObj[j] = index+1;
            }
          }
        }
        callback(cardObj);
      }
    );
}

// Пополнения для САШИ НАЧАЛО
module.exports.sashaPay = (_userid, _name,_address, _text, callback) => {
  Swap1.find({}, {
    num: 1
  }, {
    sort: {
      num: -1
    }
  }).limit(1).then((lastOrder) => {
    
    if (lastOrder.length != 0) {
      Swap1.create({num: Number(lastOrder[0].num)+1, user_id: _userid, name: _name, address: _address, text: _text}, (err, doc) => {callback(lastOrder[0].num+1)})
    } else {
      Swap1.create({num: 1, user_id: _userid, name: _name, address: _address, text: _text}, (err, doc) => {callback('1')})
    }
  });
}

module.exports.sashaPayUpdatePay = (_userid, _num, callback) => {
  Swap1.find({num: Number(_num), user_id: _userid}, (err,doc) => {
    if (doc.length != 0) {
      Swap1.update({num: Number(_num), user_id: _userid}, {pay: 'yes'}, (err, done) => {
        callback('Ожидайте пополнения счёта. Как только Ваш счёт пополнится - вам придёт уведомление');
      });
    } else {
      callback('Такой заявки не существует');
    }
  });
}

module.exports.findSashaPay = (_userid, _num, callback) => {
  Swap1.find({num: Number(_num), user_id: _userid}, (err,doc) => {
    callback(doc);
  })
}
// Пополнения для САШИ КОНЕЦ

module.exports.whatPlace = (user_id, place, name, date, callback) => { 
    Place.create({user_id: user_id, name: name, place: place, date: date}, (err,doc) => {
      callback('done');
    });
}
// Place.find({}, (err,doc) => {
//   console.log(doc);
  
// })

// Реферальная программа начало
// Поиск реферала
module.exports.findReferal = (_userid, callback) => {
    Referal.find({user_id: _userid}, (err,doc) => {
      // Если не найдено, то doc[0] == undefind
      callback(doc[0]);
    })
}

module.exports.acceptReferal = (_userid) => {
  Referal.update({user_id: _userid}, {accepted: true}, (err,res) => {

  })
} 

// Обновить рефералку (кол-во)
module.exports.updateReferalCount1 = (user_id,refCount1) => {
  Referal.update({user_id: user_id}, {refCount1: refCount1+1}, (err,doc) => {

  })
}

module.exports.updateReferalCount2 = (user_id,refCount2) => {
  Referal.update({user_id: user_id}, {refCount2: refCount2+1}, (err,doc) => {

  })
}

module.exports.updateReferalCount3 = (user_id,refCount3) => {
  Referal.update({user_id: user_id}, {refCount3: refCount3+1}, (err,doc) => {

  })
}



// Поиск реферальной ссылки
module.exports.findRefLink = (referalLink, callback) => {
  Referal.find({referalLink: referalLink}, (err,doc) => {
    // Если не найдено, то doc[0] == undefind
    callback(doc[0]);
  })
}

// Поиск человека, который активирует ссылку для проверки на активируемую ссылку и для взятия реферала предыдущего (не по русски, ибо спать хочу)
module.exports.findRefUser = (user_id, callback) => {
  RefAddUsers.find({user_id: user_id}, (err,doc) => {
    // Если не найдено, то doc[0] == undefind
    callback(doc[0]);
  })
}

module.exports.createRefUser = (user_id, ref_user_id, callback) => {
  RefAddUsers.create({user_id: user_id, ref_user_id: ref_user_id}, (err,doc) => {
    // Если не найдено, то doc[0] == undefind
    callback('Готово');
  })
}

// Создание реферала
module.exports.createReferal = (user_id, lastReferal1, lastReferal2, lastReferal3, callback) => {
  // Создание реферальной ссылки
  var refLink = 'bonus'+Hex.convertToHex((user_id/2)+'link');

  Referal.create({user_id: user_id, referalLink: refLink, lastReferal1: lastReferal1, lastReferal2: lastReferal2, lastReferal3: lastReferal3}, (err,doc) => {
    callback(refLink);
  })
}

// Добавление предыдущих рефералов в реферала
module.exports.updateReferal2 = (user_id, lastReferal2) => {
  Referal.update({user_id: user_id}, {lastReferal2: lastReferal2}, (err,doc) => {

  })
}

module.exports.updateReferal3 = (user_id, lastReferal3) => {
    Referal.update({user_id: user_id}, {lastReferal3: lastReferal3}, (err,doc) => {

    })
  }
// Реферальная программа конец

// бд для телефона начало
module.exports.addPhoneTx = (user_id, _number, _currency, _sum) => {
  Phone.create({user_id: user_id, number: _number, currency: _currency, sum: _sum}, (err, doc) => {})
}
// бд для телефона конец

// Трекеринг вывода на другие блокчейны НАЧАЛО
module.exports.outCurrency = (user_id, _currency, _sum, _address) => {
  Out.create({user_id: user_id, currency: _currency, sum: _sum, address: _address}, (err,doc) => {})
}
// Трекеринг вывода на другие блокчейны КОНЕЦ

// Если закончатся деньги на аккаунте и перестанут раздаваться вейвсы НАЧАЛО
module.exports.badTransfer = (_userid, _name, _address) => {
  BadTransfer.create({user_id: _userid, name: _name, address: _address}, (err,doc) => {});
}
// Если закончатся деньги на аккаунте и перестанут раздаваться вейвсы КОНЕЦ

module.exports.exchangeTx = (_userid, _type, _currency1, _currency2, _amount, _price) => {
  Exchange.create({user_id: _userid, type: Number(_type), currency1: _currency1, currency2: _currency2, amount: Number(_amount), price: Number(_price)}, (err, res) => {});
}

// Быстрый вввод/вывод НАЧАЛО
module.exports.fastSwap = (_userid, _name, _address, _currency, _sumCrypto, _sumRub, _type, _cardService, _KYC, callback) => {
  FastSwap.find({type: Number(_type)},{num: 1},{sort: {num: -1}}, (err, res) => {
    if (res.length != 0) {
      var _num = res[0].num;
      FastSwap.create({num: Number(_num)+1, user_id: _userid, name: _name, address: _address, currency: _currency,  sumCrypto: Number(_sumCrypto), sumRub: Number(_sumRub), type: Number(_type), cardService: _cardService, KYC: _KYC}, (err,doc) => {
        callback(_num+1);
      });
    } else {
      FastSwap.create({num: 1, user_id: _userid, name: _name, address: _address, currency: _currency,  sumCrypto: Number(_sumCrypto), sumRub: Number(_sumRub), type: Number(_type), cardService: _cardService, KYC: _KYC}, (err,doc) => {
        callback(1);
      });
    }
  }).limit(1);
  
}

module.exports.findFastSwap = (_type, _num, callback) => {
  FastSwap.find({type: Number(_type), num: Number(_num) }, (err,res) => {
    if (err) callback('error');
    callback(res[0]);
  })
}

module.exports.endFastSwap = (_type,_num, callback) => {
  FastSwap.update({type: Number(_type), num: Number(_num) },{endTime: Number(Date.now()), end: true}, (err,res) => {
    if (err) callback('error');
    callback(true);
  })
}

module.exports.createDisput = (_userid, _whatType, _match, _score) => {
  Disput.find({}, (err,doc) => {
    if(doc.length != 0) {
      var _num = Number(doc[doc.length-1].num)+1;
      Disput.create({user_id1: _userid, num: Number(_num), whatType: _whatType, match: _match, score: _score}, (err,res) => {
    
      });
    } else {
      Disput.create({user_id1: _userid, num: 1, whatType: _whatType, match: _match, score: _score}, (err,res) => {
    
      });
    }
  });
}

module.exports.findDisputsByUserId = (_userid, callback) => {
  Disput.find({user_id1: _userid}, (err,res) => {
    callback(res);
  });
}

module.exports.findDisputsByNum = (_num, callback) => {
  Disput.find({num: Number(_num)}, (err,res) => {
    callback(res[0]);
  });
}

module.exports.acceptDisput = (_num, _userid) => {
  Disput.update({num: Number(_num)}, {user_id2: _userid}, (err,res) => {
    
  });
}

module.exports.findUnconfirmedDisputs = (callback) => {
  Disput.find({}, (err,res) => {
      var disputsObj = [];
      for (let i in res) {
        if (res[i].user_id2 == '') {
          disputsObj.push(res[i]);
        }
      }
      callback(disputsObj);
  });
}