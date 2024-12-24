const express = require('express')
const router = express.Router()
const { login, forgetpassword, resetpassword } = require('../controllers/auth')

router.post('/login', login)
router.post('/forgetpassword', forgetpassword)
router.post('/resetpassword/:id/:token', resetpassword)
module.exports = router
