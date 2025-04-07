import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import('../css/Reservation.css')
// import { fa-solid fa-chevron-left, fa-solid fa-chevron-right } from '@fortawesome/free-solid-svg-icons';

function Reservation() {
    return (
        <div className="main">
            <div className="submain">
                <div className="header">
                    <h3>예약관리</h3>
                </div>
            </div>
                <div className="subheader">
                    <p style={{fontSize:"17px", fontWeight:"bold", color:"#434343"}}>금일배송 / 보관 관리</p>
                </div>
                <div className="content">
                    <button></button>

                    <button></button>
                </div>
        </div>
    );
}

export default Reservation;