import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";
import Select from "../../Component/Select.jsx";
import luggage2 from "../../images/luggage_02.png"
import luggage1 from "../../images/luggage_01.png"
import Select_1 from "../../Component/Select_1.jsx";
import FloatingBtn from "../../Component/ExcelDownload.jsx";
import ExcelTable from "../../Component/ExcelTable.jsx";
import {Button} from "antd";

import('../../css/Reservation.css')

function Reservation() {
    const [date, setDate] = useState(new Date().toLocaleDateString());
    const [showCheckbox, setShowCheckbox] = useState(false);

    const handlePrevDate = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        });
    };

    const handleNextDate = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        });
    };

    async function getDate() {
        try {
            const res = await fetch("/api/date");
            if (res.ok) {
                const data = await res.json();
                setDate(new Date(data.date).toLocaleDateString());
            } else {
                console.error("Failed to fetch date:", res.status);
            }
        } catch (error) {
            console.error("Error fetching date:", error);
        }
    }

    useEffect(() => {
        getDate();
    }, [date]);

    const handleShowCheckbox = () => {
        setShowCheckbox(!showCheckbox);
    };

    return (
        <div className="main_R">
            <div className="submain_R">
                <div className="header_R">
                    <h3>예약관리</h3>
                </div>
            </div>
            <div className="subheader_R">
                <p style={{fontSize: "17px", fontWeight: "bold", color: "#434343"}}>금일배송 / 보관 관리</p>
            </div>
            <div className="content_R">
                <div className="content_first"
                     style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <button onClick={handlePrevDate} style={{marginRight: "10px"}}><FontAwesomeIcon
                        icon={faChevronLeft}/></button>
                    <h2>{date}</h2>
                    <button onClick={handleNextDate} style={{marginLeft: "10px"}}><FontAwesomeIcon
                        icon={faChevronRight}/></button>
                    <div>
                    </div>
                </div>
            </div>
            <div className="content_R">
                <div className="content_second">
                    <h3>전체 예약건수</h3>
                    <h1>17 건</h1>
                </div>
                <div className="content_second_one">
                    <img src={luggage2} alt="배송캐리어" style={{marginLeft: "30px"}}/>
                    <div>
                        <h3>배송예약</h3>
                        <h1>20건</h1>
                    </div>
                    <img src={luggage1} alt="보관캐리어"/>
                    <div>
                        <h3>보관예약</h3>
                        <h1>42건</h1>
                    </div>
                    <div className="border-right"></div>
                    <div className="border-left">
                        <div className="complete">
                            <h3>처리완료</h3>
                            <h1>12건</h1>
                        </div>
                        <div className="cancel">
                            <h3>취소</h3>
                            <h1>6건</h1>
                        </div>
                        <div className="not-yet">
                            <h3 style={{border: "3px solid red"}}>미배정</h3>
                            <h1>2건</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div className="content_R">
                <div className="content_third">
                    <Select/>
                    <input type="text"/>
                    <button>검색</button>
                </div>
            </div>
            <div className="content_middle">
                <div className="content_middle_one">
                    <Button className="button-more" onClick={handleShowCheckbox}>다중관리</Button>
                    <div className="downmenu">
                    </div>
                    <Select_1/>
                    <FloatingBtn/>
                </div>
                <div className="content_middle_two">
                    <ExcelTable showCheckbox={showCheckbox}/>
                </div>
            </div>
        </div>
    );
}

export default Reservation;