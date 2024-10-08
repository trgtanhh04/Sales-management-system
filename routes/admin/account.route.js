const express = require('express')
const router = express.Router()

const multer  = require('multer'); //Thư viện để upload ảnh
const upload = multer()

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require("../../validate/admin/account.validate.js")

const controller = require("../../controllers/admin/account.controller")

router.get('/', controller.index) 

router.get('/create', controller.create) 
router.post('/create',
    upload.single('avatar'), 
    uploadCloud.upload,
    validate.createPost,
    controller.createPost) 

module.exports = router
