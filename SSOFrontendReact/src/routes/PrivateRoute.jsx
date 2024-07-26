import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

function PrivateRoute(props) {
    const user = useSelector(state => state.account.userInfo);

    useEffect(() => {
        if (user && !user?.access_token) {
            window.location.replace(`${process.env.REACT_APP_SSO_BACKEND_LOGIN}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`);
        }
    }, [user]);


    if (user && user?.access_token) {
        return (
            <div>
                {props?.children}
            </div>
        )
    }

    return (
        <div>
        </div>
    );
}



export default PrivateRoute;