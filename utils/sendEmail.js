const nodemailer = require('nodemailer');

const sendEmail = async () => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: "aletha19@ethereal.email",
            pass: "zQUuWnQ4Z3djuYG9Rj",
        },
});

    let info = await transporter.sendMail({
        from: '"Catalin" <copreapt@gmail.com>',
        to:'user@user.com',
        subject: 'Hello',
        text: 'Hello world',
        html: '<b>Hello world?</b>',
    });

};

module.exports = sendEmail;