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

module.exports.cancelButton = function cancelButton(session) {
    return new builder.HeroCard(session)
        .text('Чтобы перейти в главное меню - нажмите кнопку:')
        .buttons([
            builder.CardAction.imBack(session, 'отмена', 'Отмена')
        ])
}

module.exports.cancelButtonToRate = function cancelButton(session) {
    return new builder.HeroCard(session)
        .text('Нажмите кнопку, чтобы вернуться в меню споров')
        .buttons([
            builder.CardAction.imBack(session, 'rates', 'Назад')
        ])
}

module.exports.disputCard = (session, _num, type, _match, _score, _currency, _price) => {
    var disput = '**Спор №** '+_num+': \n\n'+type+'\n\n**Матч**: '+_match+'\n\n**Счёт**: '+_score+'\n\nВалюта: '+_currency+'\n\nСумма спора: '+_price;
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

    var disput = '**Спор №** '+_num+': \n\n'+type+'\n\n**Матч**: '+_match+'\n\n**Счёт**: '+_score+'\n\n**Второй участник**: '+secondPerson;
    return new builder.HeroCard(session)
    .text(disput)
    .buttons(buttons)
}