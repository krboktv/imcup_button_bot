const db = require('./db.js');

var currency = {
    "Bitcoin": {
        course: 'btc-rub',
        name: "Bitcoin",
        ticker: "BTC",
        assetID: "8LQW8f7P5d5PZM7GtZEBgaqRPGSzS3DfPuiXrURJ4AJS"
    },
    "Ethereum": {
        course: 'eth-rub',
        name: "Ethereum",
        ticker: "ETH",
        assetID: "474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu"
    },
    "Waves": {
        course: 'waves-rub',
        name: "Waves",
        ticker: "WAVES",
        assetID: "WAVES"
    },
    // ZCash
    "ZCash": {
        course: 'zec-rub',
        name: "ZCash",
        ticker: "ZEC",
        assetID: "BrjUWjndUanm5VsJkbUip8VRYy6LWJePtxya3FNv4TQa"
    },
    "Litecoin": {
        course: 'ltc-rub',
        name: "Litecoin",
        ticker: "LTC",
        assetID: "HZk1mbfuJpmxU1Fs4AX5MWLVYtctsNcg6e2C6VKqK8zk"
    },
    "US Dollar": {
        course: 'usd-rub',
        name: "US Dollar",
        name1: 'US_Dollar',
        ticker: "USD",
        assetID: "Ft8X1v1LTa1ABafufpaCWyVj8KkaxUWE6xBhW6sNFJck"
    },
    "Euro": {
        course: 'eur-rub',
        name: "Euro",
        ticker: "EUR",
        assetID: "Gtb1WRznfchDnTh37ezoDTJ4wcoKaRsKqKjJjy7nm2zU"
    },
    'Назад': 'отмена'
};

var exchange = {
    'Bitcoin': {
        'Waves': {
            'type': 'sell',
            'assetID1': 'WAVES',
            'assetID2': currency['Bitcoin'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    'Ethereum': {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Waves': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': 'WAVES'
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    'Waves': {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': 'WAVES',
            'assetID2': currency['Bitcoin'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': 'WAVES'
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': 'WAVES'
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': 'WAVES'
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': 'WAVES',
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': 'WAVES',
            'assetID2': currency['Euro'].assetID
        }
    },
    "ZCash": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Waves': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': 'WAVES'
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['ZCash'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    "Litecoin": {
        'Bitcoin': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Bitcoin'].assetID
        },
        'Waves': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': 'WAVES'
        },
        'Ethereum': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Ethereum'].assetID
        },
        'ZCash': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['ZCash'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'buy',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Euro'].assetID
        }
    },
    "US Dollar": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Waves': {
            'type': 'sell',
            'assetID1': 'WAVES',
            'assetID2': currency['US Dollar'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['US Dollar'].assetID
        },
        'Euro': {
            'type': 'sell',
            'assetID1': currency['Euro'].assetID,
            'assetID2': currency['US Dollar'].assetID
        }
    },
    "Euro": {
        'Bitcoin': {
            'type': 'sell',
            'assetID1': currency['Bitcoin'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'Waves': {
            'type': 'sell',
            'assetID1': 'WAVES',
            'assetID2': currency['Euro'].assetID
        },
        'Ethereum': {
            'type': 'sell',
            'assetID1': currency['Ethereum'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'ZCash': {
            'type': 'sell',
            'assetID1': currency['ZCash'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'Litecoin': {
            'type': 'sell',
            'assetID1': currency['Litecoin'].assetID,
            'assetID2': currency['Euro'].assetID
        },
        'US Dollar': {
            'type': 'buy',
            'assetID1': currency['Euro'].assetID,
            'assetID2': currency['US Dollar'].assetID
        }
    },
    'Назад': 'отмена'
}

var pizza = {
    "PepWithLove": {
        name: "Пепперони с любовью",
        shortText: "Оригинальная пицца в форме сердца",
        text: "Томатный соус, моцарелла и пикантная пепперони",
        price: "595",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/e7ad6ba0-254b-44ec-a0fd-e110eae821f6.jpg",
        emotions: ['anger', 'sadness']
    },
    "SuperMyaso": {
        name: "Супермясная",
        shortText: "Крутая мясная пицца",
        text: "Томатный соус, цыпленок, говядина (фарш), пикантная пепперони, моцарелла, пикантная чоризо и бекон",
        price: "835",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/73c0a34d-9fd9-4059-afd5-b115f6d78b9e.jpg",
        emotions: ['anger','sadness', 'neutral']
    },
    "Gavayskaya": {
        name: "Гавайская",
        shortText: "Крутая пицца с ананасами",
        text: "Томатный соус, ананасы, моцарелла и цыпленок",
        price: "615",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/2a20dafd-5b7d-4052-8ae0-542b56483f35.jpg",
        emotions: ['happiness']
    },
    "PiccaPirog": {
        name: "Пицца-пирог",
        shortText: "Необычная пицца-пирог",
        text: "Молоко сгущенное, брусника и ананасы",
        price: "615",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/d52c8052-8ec5-4410-aeb2-e9a9987df085.jpg",
        emotions: ['surprise']
    },
    "Dodo": {
        name: "Додо",
        shortText: "Неповторимая пицца Додо",
        text: "Томатный соус, говядина (фарш), ветчина, пикантная пепперони, лук красный, маслины, сладкий перец, шампиньоны и моцарелла",
        price: "735",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/e0b6df44-91b7-4250-82c9-ab4442503ab3.jpg",
        emotions: ['fear', 'sadness']
    },
    "CHetyreSyra": {
        name: "Четыре сыра",
        shortText: "Для любителей сыра",
        text: "Томатный соус, моцарелла, сыр блючиз и смесь сыров чеддер и пармезан",
        price: "735",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/80eafb31-d80c-4dfc-b870-b81ca1afa014.jpg",
        emotions: ['contempt']
    },
    "CHetyreSezona": {
        name: "Четыре сезона",
        shortText: "Оригинальная пицца, напоминающая времена года",
        text: "Томатный соус, орегано, кубики брынзы, шампиньоны, томаты, ветчина, пикантная пепперони и моцарелла",
        price: "695",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/c15ae983-8088-43c5-a050-529b8ac89a44.jpg"
    },
    "CyplyonokBarbekyu": {
        name: "Цыплёнок барбекю",
        shortText: "Прекрасное сочетание соуса барбекю с цыплёнком",
        text: "Томатный соус, цыпленок, лук красный, моцарелла, соус барбекю и бекон",
        price: "695",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Pizza/ru-RU/299e542e-79de-4b8b-86c0-7ef634f4b878.jpg",
        emotions: ['disgust']
    },
    "Krulashki": {
        name: "Крылья «Барбекю» 10 шт",
        shortText: "Куриные крылья в маринаде с дымным вкусом",
        text: "Отлично подойдет вашей эмоциональной натуре",
        price: "350",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Snacks/ru-RU/eda2b47f-c0a2-41d2-857c-f1b9e4f27aca.jpg",
        emotions: ['anger']
    },
    "Bezplozn": {
        name: "Рулетики с сыром 8 шт",
        shortText: "Рулетики сытные с моцареллой",
        text: "Сойдет",
        price: "145",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Snacks/ru-RU/fdff2af3-5852-4cae-93e4-84b4c3d692b0.jpg",
        emotions: ['contempt']
    }, 
    "SalatCezar": {
        name: "Салат Цезарь",
        shortText: "Запеченая куриная грудка, томаты черри, салат Айсберг, гренки, пармезан, сушеный базилик и соус Цезарь",
        text: "Вкусно, полезно для фигуры",
        price: "190",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Snacks/ru-RU/4dbcd4fa-f7b8-4f2a-9313-494e8b8ee489.jpg",
        emotions: ['sadness']
    },
    "SalatGrechesky": {
        name: "Салат Греческий",
        shortText: "Томаты черри, салат Айсберг, брынза, огурец, маслины, сладкий перец, сушеный орегано и оливковое масло",
        text: "Вкусно, очень полезно для фигуры",
        price: "170",
        imageUrl: "https://dodopizzaru-a.akamaihd.net/Img/Products/Snacks/ru-RU/a01f5f97-e144-4de8-8aae-b7b7f14db349.jpg",
        emotions: ['sadness']
    },
}

var emotionPack = {
    'Счастье': 'happiness',
    'Нейтральный': 'neutral',
    'Грусть': 'sadness',
    'Cюрприз': 'surprise',
    'Страх': 'fear',
    'Гнев': 'anger',
    'Презрение': 'contempt',
    'Отвращение': 'disgust',
    'Добавить продукт': 'добавить'
}

module.exports.currency = currency;
module.exports.exchange = exchange;
module.exports.pizza = pizza;
module.exports.emotionPack = emotionPack;