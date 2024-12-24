const express = require('express')
const Principal = require('../models/Principal')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

//principal create
const createPrincipal = async (req, res) => {
  try {
    const { username, pwd, Role, email } = req.body

    if (!username || !pwd || !email)
      return res.status(400).send({ message: 'password or username required' })
    //duplicated email
    const duplicate = await Principal.findOne({ email: email }).exec()
    if (duplicate)
      return res.status(401).send({ message: 'already existing..' })

    //password hashing
    const hashpwd = await bcrypt.hash(pwd, 10)
    const result = await Principal.create({
      email: email,
      name: username,
      password: hashpwd,
      role: Role,
    })
    //generated token
    const token = jwt.sign(
      { id: result._id, role: result.role },
      "3130f5a9fc6d59f62cd0abd2b610fe86",
    )

    res.send({ message: `Principal created ` })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  createPrincipal
}
