const router = require('express').Router()
const userController = require('../controller/user.controller')

router.get('/login',userController.login)
// router.get('/register',userController.register)
// router.get('/list',userController.login)


module.exports = router