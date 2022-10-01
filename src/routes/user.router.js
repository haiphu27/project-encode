const router = require('express').Router()
const userController = require('../controller/user.controller')
const verify_token=require('../middaware/verify_token')
const cache=require('../middaware/cache')

router.post('/login',userController.login)
router.post('/register',userController.register)
router.get('/list-country',verify_token,cache,userController.list_country)

module.exports = router