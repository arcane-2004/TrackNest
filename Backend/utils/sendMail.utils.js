const nodemailer = require('nodemailer')

const sendMail = async (data) => {

    try {
        const transpoter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.APP_PASSWORD
            }

        })

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: data.email,
            subject: data.subject,
            text: data.text,
        }
       const result = await transpoter.sendMail(mailOptions)
        return result;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = sendMail;