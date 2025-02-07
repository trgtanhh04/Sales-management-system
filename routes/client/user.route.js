const express = require('express')
const router = express.Router()

const controller = require("../../controllers/client/user.controller.js")
const validate = require("../../validate/client/user.validate.js") 

router.get('/register', controller.register)

router.post('/register',validate.registerPost, controller.registerPost)


router.get('/login', controller.login)
router.post('/login',validate.loginPost, controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)
router.post('/password/forgot',validate.forgotPasswordPost, controller.forgotPasswordPost)

module.exports = router