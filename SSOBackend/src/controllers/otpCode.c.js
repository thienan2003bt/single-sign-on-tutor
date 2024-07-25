

const handleSendCode = (req, res, next) => {
    // TODO: Validate email with type === 'LOCAL'

    // TODO: Send code via email

    return res.status(200).json({
        errCode: '0',
        errMsg: 'Send code successfully',
        data: req.body?.email,
    })
}

const OTPCodeController = {
    handleSendCode
}


module.exports = OTPCodeController;
