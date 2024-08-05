var express = require('express');
var router = express.Router();

/* GET users listing. */
const userController = require('../controller/user.controller')


router.post('/create',userController.createUser)
router.get('/view',userController.viewAll)
router.post('/login',userController.login)
router.put('/forgetPass',userController.forgetPass)
module.exports = router;
