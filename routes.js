const router = require('express').Router()
const userController = require('./userController')


router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/refresh_token', userController.refreshToken)


module.exports = router
