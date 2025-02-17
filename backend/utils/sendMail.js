const nodemailer = require('nodemailer');

const sendMail = async (email, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'lera56@ethereal.email',
            pass: 'vDPp5WETjx9nfdD3ND'
        }
    });

    const mailOptions = {
        from: 'lera56@ethereal.email',
        to: email,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('sendMail error:', error);
        return false;
    }
}

module.exports = { sendMail };