const express = require('express');
const Router = express.Router()

const otpController = require('../controller/otp.controller')
Router.post('/create',otpController.createOtp)
Router.post('/verify',otpController.authenticateOtp)


module.exports = Router