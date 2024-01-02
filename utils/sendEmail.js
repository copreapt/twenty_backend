const nodemailer = require('nodemailer');
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nodemailerConfig = require('./nodemailerConfig');

// SEND EMAIL USING NODEMAILER

// const sendEmail = async ({to, subject, html}) => {
//     let testAccount = await nodemailer.createTestAccount();

//     const transporter = nodemailer.createTransport(nodemailerConfig);

//     return transporter.sendMail({
//         // set up values in .env when in production
//         from: '"Catalin" <copreapt@gmail.com>',
//         to,
//         subject,
//         html,
//     });

// };

// SEND EMAIL USING SENDGRID

    const sendEmail = async({to,subject,html}) => {
        const msg = {
          to,
          from: "twentymedia1@gmail.com", // Change to your verified sender
          subject,
          html,
        };
        sgMail
          .send(msg)
          .then(() => {
          })
          .catch((error) => {
            console.error(error);
          });
    }

module.exports = sendEmail;