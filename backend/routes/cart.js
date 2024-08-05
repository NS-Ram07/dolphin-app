var express = require('express');
var router = express.Router();

const cartController = require('../controller/cart.controller')

/* GET users listing. */
router.post('/create',cartController.createCart)
router.get('/view/:userId',cartController.viewCart)
router.put('/checkOut/:userId',cartController.checkOut)
router.get('/viewCheckList',cartController.viewCheckout)

module.exports = router;
