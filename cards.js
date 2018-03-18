var builder = require('botbuilder');

module.exports.createFinalCard = function createFinalCard(session, crypto, course, commision, toSumCrypto, toSumRub, toAddress1, toAddress2, toName1, toName2, time) {
    return new builder.ReceiptCard(session)
        .title('Данные по переводу')
        .facts([
            builder.Fact.create(session, toAddress1, 'Адрес отправителя'),

            builder.Fact.create(session, toName1, 'Имя отправителя'),

            builder.Fact.create(session, toAddress2, 'Адрес получателя'),

            builder.Fact.create(session, toName2, 'Имя получателя'),

            builder.Fact.create(session, crypto, 'Валюта'),

            builder.Fact.create(session, toSumCrypto, 'Сумма перевода в криптовалюте'),

            builder.Fact.create(session, course, 'Текущий курс ' + crypto + ' к рублю'),

            builder.Fact.create(session, toSumRub, 'Сумма перевода в рублях'),

            builder.Fact.create(session, time, 'Время перевода')
        ])
        .items([])
        .buttons([]);
};

module.exports.createHeroCard = function createHeroCard(session) {
    return new builder.HeroCard(session)
        .images([
            builder.CardImage.create(session, 'https://disruptordaily.com/wp-content/uploads/2017/03/crypto-currency-wallet.jpg')
        ])
        .title('BUTTON - кошелек в твоём телеграмме. С помощью BUTTON можно хранить и переводить своим друзьям не только фиатные деньги, но и криптовалюту.\n\n')
        .subtitle('Waves Light Client. Официальный веб-клиент платформы waves. https://beta.wavesplatform.com\nC помощью вашего SEED вы можете зайти в ваш кошелек.\n\n')
        .text('Наши контакты. Будем рады Вашим отзывам и предложениям.\n@stsasha\n@dictum_sapienti_sat_est')

    // .buttons([
    //     builder.CardAction.openUrl(session, 'https://www.google.ru/', 'Подробнее')
    // ]);
};

module.exports.createReceiptCard = function createReceiptCard(session, telegramName, myAd) {
    return new builder.ReceiptCard(session)
        .title('Аккаунт: ' + telegramName + ". Тут можно перейти в другой аккаунт по вашему seed")
        // .title('Мой адрес: ')
        .facts([

        ])
        .items([])
        .buttons([
            builder.CardAction.imBack(session, 'сменить_аккаунт', 'Перейти')
        ]);
};

module.exports.createCancelCard = function createCancelCard(session) {
    builder.Prompts.text(session, " ")
    return new builder.HeroCard(session)
        .title('Введите сумму перевода на телефон:')
        .buttons([
            builder.CardAction.imBack(session, "отмена", "Отмена")
        ]);
}

module.exports.createPhoneCard = function createPhoneCard(session) {
    return new builder.HeroCard(session)
        .title("Введите номер телефона: ")
        .subtitle('Пример: 89161773789')
        .buttons([builder.CardAction.imBack(session, 'отмена', 'Отмена')]);
}

module.exports.createSumCard = function createSumCard(session) {
    builder.Prompts.text(session, " ")
    return new builder.HeroCard(session)
        .title('Введите сумму перевода')
        .buttons([
            builder.CardAction.imBack(session, "отмена", "Отмена")
        ]);
}

module.exports.createNickCard = function createNickCard(session, recomendation) {
    return new builder.HeroCard(session)
        .title("Введите **блокчейн Waves адрес** или nickname получателя")
        .buttons(recomendation);
}

module.exports.createConfirmOrderCard = function createConfirmOrderCard(session, currency ,cur1, cur2, price1, amount, type, course) {
    var price;

    var amountSell;
    if ((session.userData.currency1 != 'US Dollar' && session.userData.currency1 != 'Euro') && (session.userData.currency2 == 'US Dollar' || session.userData.currency2 == 'Euro')) {
        price = Number(price1*Math.pow(10, -2)).toFixed(2);
    } else if ((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
        price = Number(price1*Math.pow(10, -2)).toFixed(8);
    } else {
        price = Number(price1*Math.pow(10, -session.userData.price)).toFixed(session.userData.decimals);
    }
    

    if (type == 'sell') {
        if(!((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro'))) {
            amountSell = Number((amount/price).toFixed(session.userData.decimals));
            price = (1/price).toFixed(session.userData.decimals);
        } else {
            amountSell = Number((amount/price).toFixed(8));
            price = (1/price).toFixed(8);
        }
    }
    else {
        if(!((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro'))) {
            amountSell = Number((amount*price).toFixed(session.userData.decimals));
        } else {
            amountSell = Number((amount*price).toFixed(8));
        }
    }

    var stringCourse;
    if (course) {
        stringCourse = ' ('+Number(course).toFixed(2)+' RUB)';
    } else {
        stringCourse = '';
    }

    return new builder.ReceiptCard(session)
        .title('Подтвердить действие:')
        .facts([
            builder.Fact.create(session, String(amount.toFixed(session.userData.decimals) + ' ' + currency[cur1].ticker), 'Покупка'),
            builder.Fact.create(session, String(amountSell + ' ' + currency[cur2].ticker), 'Продажа'),
            builder.Fact.create(session, String(price + ' ' + currency[cur2].ticker + stringCourse), 'Один '+cur1)
        ])
        .items([])
        .buttons([
            builder.CardAction.imBack(session, '1да', 'Да'),
            builder.CardAction.imBack(session, 'отмена', 'Нет')
        ]);
};

module.exports.createButtonCard = function createButtonCard(session, type,isNextFind) {
    var buttons = [];

    if (isNextFind != false) {
        buttons.push(builder.CardAction.imBack(session, "other", 'ещё 5 заявок'));
    }
    
    if (type == 1) {
        buttons.push(builder.CardAction.imBack(session, "buyCrypto", 'Создать заявку'));
    } else {
        buttons.push(builder.CardAction.imBack(session, "sellCrypto", 'Создать заявку'));
    }

    buttons.push(builder.CardAction.imBack(session, 'отмена', 'Главное меню'));

    return new builder.HeroCard(session)
        .text('📒 Вы также можете **создать свою заявку**')
        .buttons(buttons)
}

module.exports.cancelButton = function cancelButton(session) {
    return new builder.HeroCard(session)
        .text('Чтобы перейти в главное меню - нажмите кнопку:')
        .buttons([
            builder.CardAction.imBack(session, 'отмена', 'Отмена')
        ])
}

// СВОП КРИПТА ФИАТ
module.exports.createOrderCard = (session,currency,sumCripto, sumRub, cur, cardService, cardServiceNum, type, isFind, num) => {
    var btn;
    var title;
    var facts = [
        builder.Fact.create(session, String(sumCripto)+' '+currency[cur].ticker, '**Cумма**'),
        builder.Fact.create(session, String(Number(sumRub).toFixed(2))+' '+'RUB', '**Примерно**')
    ];

    if (type == 1) {
        title = "**Заявка на продажу**"+cur;
    } else {
        title = "**Заявка на покупку**"+cur;
    }

    if (cardServiceNum != 'noCardNum') {
        facts.push(builder.Fact.create(session, String(cardService), 'Тип сервиса'));
        facts.push(builder.Fact.create(session, String(cardServiceNum), 'Номер счёта'));
    }

    if (isFind == 'yes' && type == 1) {
        facts.push(builder.Fact.create(session, String(cardService), 'Тип сервиса'));
        btn = [builder.CardAction.imBack(session, 'pls'+num.toString(), 'Принять ордер #'+num)];
    }
    else if (isFind == 'yes') {
        btn = [builder.CardAction.imBack(session, 'pls'+num.toString(), 'Принять ордер #'+num)];
    } else {
        btn = [];
    }
    
    return new builder.ReceiptCard(session)
        .title(title)
        .facts(facts)
        .items([])
        .buttons(btn); 
}

module.exports.endExButton = (session, cur) => {
    return new builder.HeroCard(session)
    .text(`Введите количество ${cur}, которое хотите купить`)
    .buttons([
        builder.CardAction.imBack(session, 'отмена', 'Отмена')
    ])
}


// swap crypto fiat 

module.exports.createNtCard = function createNtCard(session, type, num, buyOrSell) {
    // duyOrSell - это параметр, который отображает Тип: ПОКУПАЕТ ПОЛЬЗОВАТЕЛЬ, КОТОРОМУ ПРИДЁТ КНОПКА или ПРОДАЁТ
    var apl = 'agtyu'+buyOrSell+type+num;
    console.log(String(apl));
    var whatConfirm;
    if (buyOrSell == '0') {
        whatConfirm = 'Вам необходимо **перевести деньги по адресу**\n\n\ Как только вы переведёте деньги на адрес продавца нажмите:';
    } else {
        whatConfirm = 'Подтвердить получение средств';
    }
    return new builder.HeroCard(session)
    .text(
        whatConfirm
    )
    .buttons([
        builder.CardAction.imBack(session, String(apl), 'Подтвердить')
    ])
};

module.exports.createNtCard3 = function createNtCard(session, cardService, cardServiceNum, sum, sumRub, currency, type, num) {
    var apl = 'а0'+type+num;
    return new builder.HeroCard(session)
    .text(`Извините, заявка на продажу ${sum} ${currency} была удалена.`+ "\n\n\0\n\n" + 
    `Чтобы продать криптовалюту - перейдите в меню RUB 🔄 Crypto.`)
    .buttons([
        builder.CardAction.imBack(session, apl, 'RUB 🔄 Crypto')
    ])
};

// swap crypto fiat 

module.exports.confirmSashaPay = (session, num) => {
    var apl = 'sasha0'+num;
    return new builder.HeroCard(session)
    .title('Как только отправите средства - нажмите кнопку')
    .buttons([
        builder.CardAction.imBack(session, apl, 'Подтвердить отправку средств')
    ])
}

module.exports.endOrder = (session, type, num) => {
    var value = 'rOfd2r9dHww24f'+type+num;
    return new builder.HeroCard(session)
    .text(`Подтвердите:`)
    .buttons([
        builder.CardAction.imBack(session, value, 'Подтвердить')
    ])
}

module.exports.confirmSendFunds = (session) => {
    return new builder.HeroCard(session)
    .text(`Как только отправите деньги - подтвердите действие:`)
    .buttons([
        builder.CardAction.imBack(session, 'ok', 'Подтвердить'),
        builder.CardAction.imBack(session, 'отмена', 'Отменить заявку')
    ])
}


module.exports.disputCard = (session, _num, type, _match, _score) => {
    var disput = '**Спор номер** '+_num+': \n\n'+type+'\n\n**Матч**: '+_match+'\n\n**Счёт**: '+_score;
    return new builder.HeroCard(session)
    .text(disput)
    .buttons([
        builder.CardAction.imBack(session, String('takePlaceInDisput'+_num), 'Принять участие в споре'),
    ])
}

module.exports.myDisputCard = (session, _num, type, _match, _score, isAccept) => {
    var buttons = [];
    var secondPerson;
    if (isAccept == true) {
        secondPerson = 'Да';
    } else {
        secondPerson = 'Нет';
        buttons.push(builder.CardAction.imBack(session, String('deleteDisput'+_num), 'Удалить'));
    } 

    var disput = '**Спор номер** '+_num+': \n\n'+type+'\n\n**Матч**: '+_match+'\n\n**Счёт**: '+_score+'\n\n<b>Второй участник</b>: '+secondPerson;
    return new builder.HeroCard(session)
    .text(disput)
    .buttons(buttons)
}