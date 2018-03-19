"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = require("./v1/info");
var orderbooks_1 = require("./v1/orderbooks");
exports.v1 = {
    getMatcherKey: info_1.default.getMatcherKey,
    getOrderbooks: orderbooks_1.default.getOrderbooks,
    getOrderbook: orderbooks_1.default.getOrderbook,
    getOrders: orderbooks_1.default.getOrders,
    getAllOrders: orderbooks_1.default.getAllOrders,
    createOrder: orderbooks_1.default.createOrder,
    cancelOrder: orderbooks_1.default.cancelOrder,
    deleteOrder: orderbooks_1.default.deleteOrder
};
//# sourceMappingURL=index.js.map