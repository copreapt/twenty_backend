const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({fullName, email, token, origin}) => {
    const resetPasswordUrl = `${origin}/reset-password?token=${token}&email=${email}`;
    const message = `<p>Please reset password by clicking on the following link: <a href="${resetPasswordUrl}">Reset Password</a></p>`;

    return sendEmail({
        to:email,
        subject:'Reset Password',
        html:`<h4>Hello, ${fullName}</h4>.
        ${message}
        `
    });

};


module.exports = sendResetPasswordEmail;