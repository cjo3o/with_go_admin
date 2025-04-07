import React, { useState } from 'react';
import { Link } from "react-router-dom";

import logoWithgo from '../assets/Icon/logo_withgo.png';
import homeIcon from '../assets/Icon/home.png';
import backIcon from '../assets/Icon/back.png';

function Sidebar(props) {
    const [openMenu, setOpenMenu] = useState(null); // 열려있는 메뉴 상태

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src={logoWithgo} alt="WITHGO 로고" className="logo-img"/>
            </div>
            <div className="sidebar-title">
                <h2 className="menu-title">관리자 메뉴</h2>
                <div className="menu-icons">
                    <Link to="/" className="icon-link">
                        <img src={homeIcon} alt="홈으로" className="menu-icon"/>
                    </Link>
                    <a href="https://cjo3o.github.io/with_go/index.html" className="icon-link">
                        <img src={backIcon} alt="뒤로가기" className="menu-icon"/>
                    </a>

                </div>
            </div>
            <ul>
                <li className="no-underline"><Link to="/admin">관리자 메인</Link></li>

                <li>
                    <div onClick={() => toggleMenu('reservation')} className="menu-toggle">예약관리</div>
                    {openMenu === 'reservation' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="">배송/보관관리</Link></li>
                                <li><Link to="">예약신청목록</Link></li>
                                <li><Link to="">신규예약등록</Link></li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <div onClick={() => toggleMenu('user')} className="menu-toggle">회원관리</div>
                    {openMenu === 'user' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="">회원목록</Link></li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <div onClick={() => toggleMenu('driver')} className="menu-toggle">기사관리</div>
                    {openMenu === 'driver' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="">기사목록</Link></li>
                                <li><Link to="">기사등록</Link></li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <div onClick={() => toggleMenu('partner')} className="menu-toggle">제휴숙소관리</div>
                    {openMenu === 'partner' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="/partner/list">제휴숙소목록</Link></li>
                                <li><Link to="/partner/create">제휴숙소등록</Link></li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <div onClick={() => toggleMenu('storage')} className="menu-toggle">보관장소관리</div>
                    {openMenu === 'storage' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="/storage/list">보관장소목록</Link></li>
                                <li><Link to="/storage/create">보관장소등록</Link></li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <div onClick={() => toggleMenu('feature')} className="menu-toggle">부가기능</div>
                    {openMenu === 'feature' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="/Event-promotion">이벤트/프로모션관리</Link></li>
                                <li><Link to="">공지사항관리</Link></li>
                                <li><Link to="">이용후기관리</Link></li>
                                <li><Link to="">FAQ관리</Link></li>
                                <li><Link to="">1:1문의관리</Link></li>
                            </ul>
                        </div>
                    )}
                </li>

                <li>
                    <div onClick={() => toggleMenu('role')} className="menu-toggle">권한설정</div>
                    {openMenu === 'role' && (
                        <div className="sub-menu">
                            <ul>
                                <li><Link to="">직원목록</Link></li>
                            </ul>
                        </div>
                    )}
                </li>
                
            </ul>
        </div>
    );
}

export default Sidebar;
