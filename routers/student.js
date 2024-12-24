const express = require('express')
const router = express.Router()
const {
  createStudent,
  getAllStudent,
  getParticularStudent,
  deleteStudent,
  updateStudent,
} = require('../controllers/student')
const {
  particularUserDocsList,
  approveDocument
} = require('../controllers/Document')
const { verifyToken, verifyPrivate } = require('../utils/verifyToken')


router.post('/create', verifyPrivate, createStudent)
router.get('/getAllStudent', verifyPrivate, getAllStudent)
router.delete('/deleteStudent/:id', verifyPrivate, deleteStudent)
router.put('/updateStudent/:student_id', verifyPrivate, updateStudent)
router.get(
  '/getParticularStudent/:student_id',
  verifyToken,
  getParticularStudent,
)

router.get(
  '/documentList/:email',
  verifyToken,
  particularUserDocsList,
)

router.patch('/approve-document', verifyToken, approveDocument);
module.exports = router
