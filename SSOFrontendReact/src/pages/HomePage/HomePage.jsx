import React from 'react';
import './HomePage.scss';

function HomePage(props) {
    return (
        <div className='container home-container'>
            <div className='row'>
                <div className="col-12 mt-3">
                    <div className="title"><strong>Single Sign On - Hệ thống đăng nhập tập trung</strong></div>
                    <div className="feature">Các chức năng nổi bật trong khóa học: </div>

                    <ul className='list-group list-group-flush'>
                        <li className='list-group-item'>1. Đăng nhập sử dụng Session với PassportJS.</li>
                        <li className='list-group-item'>2. Sử dụng Access Token, Refresh Token và Cookies để xác thực người dùng.</li>
                        <li className='list-group-item'>3. Đăng nhập với tài khoản Google, Facebook.</li>
                        <li className='list-group-item'>4. Sử dụng hệ cơ sở dữ liệu MySQL, PostgreSQL.</li>
                        <li className='list-group-item'>5. Xây dựng Service sử dụng.</li>
                    </ul>
                </div>
            </div>

        </div>
    );
}

export default HomePage;