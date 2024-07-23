import React, { useEffect, useState } from 'react';

import './ConfirmPage.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogin } from '../../redux/action/accountAction';

function ConfirmPage(props) {
    const [searchParams] = useSearchParams();
    const [SSOToken, setSSOToken] = useState(searchParams.get('ssoToken'));

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const message = useSelector(state => state.account.message);
    const user = useSelector(state => state.account.userInfo);


    const handleConfirm = async () => {
        if (!SSOToken) {
            return;
        }

        dispatch(handleLogin(SSOToken));
    }

    useEffect(() => {
        const newSSOToken = searchParams.get('ssoToken');
        if (newSSOToken !== SSOToken) {
            setSSOToken(newSSOToken);
        }
    }, [searchParams]);

    useEffect(() => {
        if (user && user?.access_token) {
            navigate('/');
        }
    }, [user])


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