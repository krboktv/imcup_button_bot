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
// Быстрый вввод/вывод КОНЕЦ

// FastSwap.find({}, (err,doc) => {
//   console.log(doc)
// } )

// Exchange.find({}, (err,res) => {
//   console.log(res);
// })

// Link.remove({user_id: '218510420'}, function (err,doc) {console.log(doc)})
// Link.remove({user_id: '308328003'}, function (err,doc) {console.log(doc)})
// Link.remove({user_id: '302115726'}, function (err,doc) {console.log(doc)})


// Referal.find({}, (err,doc) => {
//   var d = 0;
//   var c = 0;
//   var t = 0;
//   for (i in doc) {
//     if (doc[i].lastReferal1 != 'undefined') {
//       d = d + 1;
//     }
//     if (doc[i].lastReferal2 != 'undefined' && doc[i].lastReferal2 != 'no') {
      
//       c = c + 1;
//     }
//     if (doc[i].lastReferal3 != 'undefined' && doc[i].lastReferal3 != 'no') {
//       t = t + 1;
//     }
//   }
//   console.log('Рефералов первого уровня: '+d+' человек');
//   console.log('Рефералов второго уровня: '+c+' человек');
//   console.log('Рефералов третьего уровня: '+t+' человек\n');
// })
// Place.distinct('user_id', (err, doc) => {
//   console.log('Всего людей, перешедших по ссылкам: '+ (doc.length)+ ' человек\n')
// })

// Place.find({place: 'MarketOverview_12800_5000'}, (err, doc) => {
//   console.log('Всего кликов по MarketOverview_12800_5000: '+ (doc.length)+ ' \n')
// })

// Place.find({place: 'true_crypto_signals_2700_2500'}, (err, doc) => {
//   console.log('Всего кликов по true_crypto_signals_2700_2500: '+ (doc.length)+ ' \n')
// })

// Place.find({place: 'cryptomoney_4900_4000'}, (err, doc) => {
//   console.log('Всего кликов по cryptomoney_4900_4000: '+ (doc.length)+ ' \n')
// })
  

// Place.find({place: 'cryptolamer_834_1000'}, (err, doc) => {
//   console.log('Всего кликов по cryptolamer_834_1000: '+ (doc.length)+ ' \n')
// })


// Place.find({place: 'cryptocurrency_1500_399'}, (err, doc) => {
//   console.log('Всего пользователей от cryptocurrency_1500_399: '+ (doc.length)+ ' \n')
// })

// Link.find({}, (err,doc) => {console.log('По факту пользователей в боте: '+doc.length+' человек\n')})
// Referal.find({refCount1: {$gte: 147}}, (err,doc) => {
    
//     console.log(doc);
// })
// Link.find({name: 'vasilill'}, (err,res) => {
//   console.log(res);
// })

// RefAddUsers.find({date: {$gte: 1519753383}}, {ref_user_id: 1}, (res,doc) => {
//   var obj = [];
//     for (let in doc) {
//       var p = 0;
//       for (let i in obj) {
//         if (obj[i] == )
//       }
//     }
// })

// Link.find({},{address: 1}, (err,doc) => {

//     Waves.checkWavesBalance(doc[i].address, )
// })

// RefAddUsers.find({},{},{sort: {date: -1}}, (err,doc) => {
//   console.log(doc)
// }).limit(40)

// Exchange.find({}, (err,doc) => {
//   console.log(doc)
// })

// Referal.find({refCount1: {$gte: 33}}, (err,doc) => {
//   console.log(doc)
//   for (let i in doc) {
//     console.log(doc[i].user_id + ': '+doc[i].refCount1)
//   }
  // var names = [];
  // for (let i in doc) {
  //   Link.find({user_id: doc[i].user_id}, (err,res) => {
  //     names.push(res[0].name);
  //     if (i == 19) {
  //         console.log(names)
  //     }
  //   });
  // }
  
  // 309917277: 394: albertfinn
  // 210179264: 334: shokis
  // 347025571: 299: OIV1980
  // 264859933: 107: BIT444
  // 424996861: 136: Sasho4ek
  // 418289750: 538: kolotibit
  // 365529802: 36: dalno88
  // 504006047: 49: witwl
  // 452299020: 81: tanii4ka
  // 75168775: 74: Mafia_uz
  // 502250171: 33: Leo_163
  // 353264408: 75: DENARO_IO_SUPPORTER
  // 510152192: 36: alexdll
  // 294116027: 108: tamcik
  // 321848959: 42: strannik29
  // 284384203: 36: Dmitr161
  // 462036479: 35: IGNATrus161
  // 522045932: 45: Natali_Vas
  // 397963003: 103: tonymoney
  // 525729616: 33: Legioner213
  // 482897587: 123: fazadis
  // console.log(doc.length);
  // var g = [];1
  // console.log(doc)
  // for (var i in doc) {
   
  //   g.push(doc[i].user_id);
  //   if (i == doc.length-1) {
        // Place.find({user_id: '309917277'}, (err, res) => {console.log(res)})
  //   }
  // }
  // console.log(g);
// })

// Out.find({}, (err,doc) => {console.log('Количество выводов на другие блокчейны: '+doc.length+'\n')});

// Transaction.find({}, (err,doc) => {console.log('Количество переводов: '+doc.length+'\n')});

// Phone.find({}, (err,doc) => {console.log('Количество пополнений телефона: '+doc.length+'\n')});
// Phone.find({number: '98936171125'}, (err,doc) => {console.log(doc)});

// Не раскоменчивать
// Link.find({}, (err, doc)=> {
//   for (le i in doc) {
//     setTimeout(() => {
//      nt.sendNot(doc[i].user_id, '', '🔥 Теперь вы можете купить Bitcoin, Ethereum или Waves за РУБЛИ в главном меню!')
// }, 2000)
//   }
// })

// Exchange.find({}, (err,doc) => {
//   console.log(doc)
// })

// FastSwap.find({type: 0}, (err,res) => {console.log(res)})

// Referal.find({user_id: '302115726'}, (err,res) => {
//   console.log(res)
// })

// FastSwap.find({sumRub: 100}, (err,doc) => {console.log(doc)})