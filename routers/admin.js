const express = require('express')
const router = express.Router()
const {
  createPrincipal,
} = require('../controllers/admin')
const {
  createDocument,
  getAllDoc
} = require('../controllers/Document')
const { verifyAdmin, verifyPrivate } = require('../utils/verifyToken')

router.post('/createPrincipal', verifyAdmin, createPrincipal)
router.post('/createDoc', verifyAdmin, createDocument)
router.post('/createDoc', verifyAdmin, createDocument)
router.get('/docList', verifyAdmin, getAllDoc)
module.exports = router
