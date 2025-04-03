import React from 'react';
import {Link} from "react-router-dom";

function Sidebar(props) {
    return (
        <div className="sidebar">
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
            </ul>
        </div>
    );
}

export default Sidebar;