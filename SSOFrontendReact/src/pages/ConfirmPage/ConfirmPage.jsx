import React, { useEffect, useState } from 'react';

import './ConfirmPage.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserService from '../../services/user.s';

function ConfirmPage(props) {
    const [searchParams] = useSearchParams();
    const [SSOToken, setSSOToken] = useState(searchParams.get('ssoToken'));
    const [message, setMessage] = useState('Hello world');

    const navigate = useNavigate();
    const handleConfirm = async () => {
        if (!SSOToken) {
            return;
        }

        try {
            const response = await UserService.handleVerifyToken(SSOToken);
            if (response && +response?.statusCode === 200) {
                navigate('/');
            } else {
                console.log("Error handling confirm process, error: " + response?.errMsg);
                setMessage(response?.errMsg ?? '');
            }
        } catch (error) {
            console.log("Error handling confirm process, error: " + error?.message);
            setMessage(error.message);
        }
    }

    useEffect(() => {
        const newSSOToken = searchParams.get('ssoToken');
        if (newSSOToken !== SSOToken) {
            setSSOToken(newSSOToken);
        }
    }, [searchParams]);


    useEffect(() => {
        handleConfirm();
    }, []);


    return (
        <div className='container'>
            <div className="row">
                <h1>{message}</h1>
            </div>
        </div>
    );
}

export default ConfirmPage;