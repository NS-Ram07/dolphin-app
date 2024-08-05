var express = require('express');
var router = express.Router();

const productController = require('../controller/product.controller')

router.post('/create',productController.create)
router.get('/view',productController.view)
router.get('/view/:id',productController.viewById)

module.exports = router;
