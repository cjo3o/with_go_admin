import React from 'react';
import {Link} from "react-router-dom";
<<<<<<< HEAD
=======
import '../App.css'

import logoWithgo from '../assets/Icon/logo_withgo.png'
import homeIcon from '../assets/Icon/home.png'
import backIcon from '../assets/Icon/back.png'
>>>>>>> hem

function Sidebar(props) {
    return (
        <div className="sidebar">
<<<<<<< HEAD
            <h2>관리자 메뉴</h2>
            <ul>
                <li><Link to="">관리자 메인</Link></li>
                <li><Link to="">예약관리</Link></li>
                <li><Link to="">회원관리</Link></li>
                <li><Link to="">기사관리</Link></li>
                <li><Link to="">제휴숙소관리</Link></li>
                <li><Link to="">보관장소관리</Link></li>
                <li><Link to="">부가기능</Link></li>
                <li><Link to="">권한설정</Link></li>
=======
            <div className="sidebar-logo">
                <img src={logoWithgo} alt="WITHGO 로고" className="logo-img" />
                </div>
            <div className="sidebar-title">
                <h2 className="menu-title">관리자 메뉴</h2>
                <div className="menu-icons">
                    <Link to="/admin" className="icon-link">
                        <img src={backIcon} alt="뒤로가기" className="menu-icon" />
                    </Link>
                    <Link to="/" className="icon-link">
                        <img src={homeIcon} alt="홈으로" className="menu-icon" />
                    </Link>
                </div>
            </div>
            <ul>
                <li><Link to="/admin">관리자 메인</Link></li>
                <li><Link to="/admin/reservations">예약관리</Link></li>
                <li><Link to="/admin/users">회원관리</Link></li>
                <li><Link to="/admin/drivers">기사관리</Link></li>
                <li><Link to="/admin/partners">제휴숙소관리</Link></li>
                <li><Link to="/admin/locations">보관장소관리</Link></li>
                <li><Link to="/admin/features">부가기능</Link></li>
                <li><Link to="/admin/roles">권한설정</Link></li>
>>>>>>> hem
            </ul>
        </div>
    );
}

export default Sidebar;