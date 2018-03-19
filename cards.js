const builder = require('botbuilder');
const obj = require('./objects');

function createReceiptCard(session, telegramName) {
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

function cancelButton(session) {
    return new builder.HeroCard(session)
        .text('Чтобы перейти в главное меню - нажмите кнопку:')
        .buttons([
            builder.CardAction.imBack(session, 'отмена', 'Отмена')
        ])
}

function createSumCard(session) {
    builder.Prompts.text(session, " ")
    return new builder.HeroCard(session)
        .title('Введите сумму перевода')
        .buttons([
            builder.CardAction.imBack(session, "отмена", "Отмена")
        ]);
}


function endExButton(session, _cur) {
    return new builder.HeroCard(session)
        .text(`Введите количество ${_cur}, которое хотите купить`)
        .buttons([
            builder.CardAction.imBack(session, 'отмена', 'Отмена')
        ])
}

function createConfirmOrderCard(session, currency, cur1, cur2, price1, amount, type, course) {
    var price;

    var amountSell;
    if ((session.userData.currency1 != 'US Dollar' && session.userData.currency1 != 'Euro') && (session.userData.currency2 == 'US Dollar' || session.userData.currency2 == 'Euro')) {
        price = Number(price1 * Math.pow(10, -2)).toFixed(2);
    } else if ((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro')) {
        price = Number(price1 * Math.pow(10, -2)).toFixed(8);
    } else {
        price = Number(price1 * Math.pow(10, -session.userData.price)).toFixed(session.userData.decimals);
    }


    if (type == 'sell') {
        if (!((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro'))) {
            amountSell = Number((amount / price).toFixed(session.userData.decimals));
            price = (1 / price).toFixed(session.userData.decimals);
        } else {
            amountSell = Number((amount / price).toFixed(8));
            price = (1 / price).toFixed(8);
        }
    } else {
        if (!((session.userData.currency1 == 'US Dollar' || session.userData.currency1 == 'Euro') && (session.userData.currency2 != 'US Dollar' && session.userData.currency2 != 'Euro'))) {
            amountSell = Number((amount * price).toFixed(session.userData.decimals));
        } else {
            amountSell = Number((amount * price).toFixed(8));
        }
    }

    var stringCourse;
    if (course) {
        stringCourse = ' (' + Number(course).toFixed(2) + ' RUB)';
    } else {
        stringCourse = '';
    }

    return new builder.ReceiptCard(session)
        .title('Подтвердить действие:')
        .facts([
            builder.Fact.create(session, String(amount.toFixed(session.userData.decimals) + ' ' + currency[cur1].ticker), 'Покупка'),
            builder.Fact.create(session, String(amountSell + ' ' + currency[cur2].ticker), 'Продажа'),
            builder.Fact.create(session, String(price + ' ' + currency[cur2].ticker + stringCourse), 'Один ' + cur1)
        ])
        .items([])
        .buttons([
            builder.CardAction.imBack(session, '1да', 'Да'),
            builder.CardAction.imBack(session, 'отмена', 'Нет')
        ]);
};

function createPizzaCard(session, _pizzaName, _pizzaShortText, _pizzaText, _price, _pizzaImg, isMarketplace, isCrypto) {
    var buttons = [];
    if (isMarketplace == true) {
        buttons.push(
            builder.CardAction.openUrl(session, 'https://partiyaedi.ru/', String('Купить за '+_price+' RUB'))
        );
        if (isCrypto != false) {
            buttons.push(
                builder.CardAction.imBack(session, String('num'+isCrypto), 'CryptoPay')
            );
        }
    }

    return new builder.HeroCard(session)
        .title(String('Вам подойдет: ' + _pizzaName))
        .subtitle(String(_pizzaShortText))
        .text(String(_pizzaText))
        .images([
            builder.CardImage.create(session, _pizzaImg)
        ])
        .buttons(buttons);
}

module.exports.createSumCard = createSumCard;
module.exports.createReceiptCard = createReceiptCard;
module.exports.cancelButton = cancelButton;
module.exports.endExButton = endExButton;
module.exports.createConfirmOrderCard = createConfirmOrderCard;
module.exports.createPizzaCard = createPizzaCard;