import nodemailer from 'nodemailer';
import UserClientService from '../services/userClientService';
import 'dotenv/config';

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const handleSendCode = async (req, res, next) => {
    const userEmail = req.body?.email;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GOOGLE_APP_EMAIL,
            pass: process.env.GOOGLE_APP_PASSWORD,
        }
    });

    //Validate email with type === 'LOCAL'
    const OTPCode = generateOTP();
    try {
        const response = await UserClientService.updateUserOTPCode(userEmail, OTPCode);
        if (!response || (response?.status ?? false) === false) {
            return res.status(401).json({
                errCode: '-1',
                errMsg: `User not found`,
                data: null,
            })
        }

        // TODO: Send code via email
        const info = await transporter.sendMail({
            from: `"An Trieu" <${process.env.GOOGLE_APP_EMAIL}>`,
            to: `<${userEmail}>`,
            subject: "[Single Sign On Tutorial] Verify your reset password",
            text: "Hello there!",
            html: `
                <b>Dear ${userEmail},</b>
                <div>
                    <span>Your OTP for reset password is: <strong>${OTPCode}</strong>.</span>
                    <span>Do not share it with anyone for your security.</span>
                </div>
    
                <b>Sincerely,</b>
                <strong>An Trieu.</strong>
            `,
        });

        if (info && info.accepted && info.accepted?.length > 0) {
            return res.status(200).json({
                errCode: '0',
                errMsg: 'Send code successfully',
                data: userEmail,
            })
        } else {
            return res.status(500).json({
                errCode: '-1',
                errMsg: 'Service error sending email!',
                data: null,
            })
        }
    } catch (error) {
        console.log("Error sending email for user, error: " + error?.message);
        return res.status(500).json({
            errCode: '-1',
            errMsg: 'Service error sending email!',
            data: null,
        })
    }
}

const OTPCodeController = {
    handleSendCode
}


module.exports = OTPCodeController;
