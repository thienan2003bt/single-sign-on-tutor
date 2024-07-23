import React, { useEffect, useState } from 'react';

import './ConfirmPage.scss';
import { useSearchParams } from 'react-router-dom';
import UserService from '../../services/user.s';

function ConfirmPage(props) {
    const [searchParams] = useSearchParams();
    const [SSOToken, setSSOToken] = useState(searchParams.get('ssoToken'));

    const handleConfirm = async () => {
        if (!SSOToken) {
            return;
        }

        try {
            const response = await UserService.handleVerifyToken(SSOToken);
            if (response) {
                alert("Your token is: " + response?.data?.access_token);
            } else {
                console.log("Error handling confirm process, error: " + response?.errMsg);
            }
        } catch (error) {
            console.log("Error handling confirm process, error: " + error?.message);
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
        <div>
            Hello Code !
        </div>
    );
}

export default ConfirmPage;