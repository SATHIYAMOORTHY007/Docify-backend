const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
  const transport = {
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'f358e1ba99e566',
      pass: '6a05a62ac1ba92',
    },
  }

  const transporter = nodemailer.createTransport(transport)

  const message = {
    from: `${"abc"} <${"noreplay@abccollegeofengineering.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.link,
  }

  await transporter.sendMail(message)
}

module.exports = sendEmail
