import React from 'react';
import {Link} from "react-router-dom";


import logoWithgo from '../assets/Icon/logo_withgo.png'
import homeIcon from '../assets/Icon/home.png'
import backIcon from '../assets/Icon/back.png'


function Sidebar(props) {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logoWithgo} alt="WITHGO 로고" className="logo-img"/>
            </div>
            <div className="sidebar-title">
                <h2 className="menu-title">관리자 메뉴</h2>
                <div className="menu-icons">
                    <Link to="/admin" className="icon-link">
                        <img src={backIcon} alt="뒤로가기" className="menu-icon"/>
                    </Link>
                    <Link to="/" className="icon-link">
                        <img src={homeIcon} alt="홈으로" className="menu-icon"/>
                    </Link>
                </div>
            </div>
            <ul>
                <li><Link to="/admin">관리자 메인</Link></li>
                <li><Link to="/admin/reservations">예약관리</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">배송/보관관리</Link></li>
                            <li><Link to="">예약신청목록</Link></li>
                            <li><Link to="">신규예약등록</Link></li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/admin/users">회원관리</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">회원목록</Link></li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/admin/drivers">기사관리</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">기사목록</Link></li>
                            <li><Link to="">기사등록</Link></li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/admin/partners">제휴숙소관리</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">제휴숙소목록</Link></li>
                            <li><Link to="">제휴숙소등록</Link></li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/admin/locations">보관장소관리</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">보관장소목록</Link></li>
                            <li><Link to="">보관장소등록</Link></li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/admin/features">부가기능</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">이벤트/프로모션관리</Link></li>
                            <li><Link to="">공지사항관리</Link></li>
                            <li><Link to="">이용후기관리</Link></li>
                            <li><Link to="">FAQ관리</Link></li>
                            <li><Link to="">1:1문의관리</Link></li>
                        </ul>
                    </div>
                </li>
                <li><Link to="/admin/roles">권한설정</Link>
                    <div className="sub-menu">
                        <ul>
                            <li><Link to="">직원목록</Link></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;