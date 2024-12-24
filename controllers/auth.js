const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Student = require('../models/student')
const Principal = require('../models/Principal')
const nodemailer = require('nodemailer')
const sendEmail = require('../utils/email')

const login = async (req, res) => {
  try {
    //check the user
    const user =
      (await Student.findOne({ email: req.body.username }).exec()) ||
      (await Principal.findOne({ email: req.body.username }).exec())

    //if user is not
    if (!user) return res.status(404).json({ message: 'user not found' })

    //comparing the password
   
      const isPassword = await bcrypt.compare(req.body.pwd, user.password)
      if (!isPassword)
        return res.status(404).json({ message: 'password not match' })
  
    const token = jwt.sign({ id: user._id, role: user.role }, "3130f5a9fc6d59f62cd0abd2b610fe86")

    const { password, role, ...otherDetails } = user._doc
    return res
      .cookie('token', token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, token, role })
  } catch (err) {
    return res.sendStatus(400)
  }
}

//forgetpassword
const forgetpassword = async (req, res) => {
  try {
    //check the user
    const olduser =
      (await Principal.findOne({ email: req.body.username })) ||
      (await Student.findOne({ email: req.body.username }))
    //check already user in bd if not create err
    if (!olduser) {
      return res.send({ message: 'email doesnot Exists....' })
    }
    //generate hashing
    const secret = "3130f5a9fc6d59f62cd0abd2b610fe86" + olduser.password

    //create token
    const token = jwt.sign({ email: olduser.email, id: olduser._id }, secret)
    //create email link frontend url pluse userid and token we used here
    const link = `${process.env.frontend}/resetpassword/${olduser._id}/${token}`

    //send mail
    sendEmail({
      email: olduser.email,
      subject: 'testing',
      link: link,
    })
    res.send(' please check your email')
  } catch (err) {
    console.log(err)
  }
}

const resetpassword = async (req, res) => {
  const { id, token } = req.params
  const { pwd, conpwd } = req.body
  //check the user in bd
  const olduser =
    (await Principal.findOne({ _id: id })) ||
    (await Student.findOne({ _id: id }))
  //user not there create err
  if (!olduser) {
    return res.json('not valid user')
  }
  //get secret key using jwt and old password
  const secret = "3130f5a9fc6d59f62cd0abd2b610fe86" + olduser.password

  try {
    //here verify token
    const verify = jwt.verify(token, secret)
    //if user role examiner check examiner db and update password
     if (olduser.role == 'Editor' || olduser.role == 'approver' || olduser.role == 'Viewer') {
      if (pwd == conpwd) {
        console.log(olduser)
        const hashpwd = await bcrypt.hash(pwd, 10)
        await Student.updateOne({ _id: id }, { password: hashpwd })
      }
    } else {
      if (pwd == conpwd) {
        const hashpwd = await bcrypt.hash(pwd, 10)
        await Principal.updateOne({ _id: id }, { password: hashpwd })
      }
    }

    res.json({ message: 'success', olduser })
  } catch (err) {
    console.log(err)
  }
}
module.exports = { login, forgetpassword, resetpassword }
