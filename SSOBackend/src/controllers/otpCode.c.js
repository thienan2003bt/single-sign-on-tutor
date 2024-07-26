import nodemailer from 'nodemailer';
import UserClientService from '../services/userClientService';
import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';

const buildEmailHTML = (pathToTemplate, userInfo, OTPCode) => {
    const filepath = path.join(__dirname, pathToTemplate);
    const source = fs.readFileSync(filepath, 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
        username: userInfo?.username ?? '',
        email: userInfo?.email ?? '',
        OTPCode: OTPCode ?? '',
    }

    const htmlToSend = template(replacements);
    return htmlToSend;
}

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const handleSendCode = async (req, res, next) => {
    const userEmail = req.body?.email;
    const OTPCode = generateOTP();
    const pathToTemplate = '../views/templates/resetPassword.html';
    try {
        //Validate email with type === 'LOCAL'
        const response = await UserClientService.updateUserOTPCode(userEmail, OTPCode);
        if (!response || (response?.status ?? false) === false) {
            return res.status(401).json({
                errCode: '-1',
                errMsg: `User not found`,
                data: null,
            })
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GOOGLE_APP_EMAIL,
                pass: process.env.GOOGLE_APP_PASSWORD,
            }
        });

        // Respond to frontend without waiting for sending email
        res.status(200).json({
            errCode: '0',
            errMsg: 'Send code successfully',
            data: true,
        })

        const userInDB = response?.data;
        // TODO: Send code via email
        const info = await transporter.sendMail({
            from: `"An Trieu" <${process.env.GOOGLE_APP_EMAIL}>`,
            to: `<${userEmail}>`,
            subject: "[Single Sign On Tutorial] Verify your reset password",
            text: "Hello there!",
            html: buildEmailHTML(pathToTemplate, userInDB, OTPCode),
        });

        if (info && info.accepted && info.accepted?.length > 0) {
            console.log("!! Sending OTP email successfully");
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
