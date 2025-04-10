import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons/faChevronLeft";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons/faChevronRight";

import('../css/Reservation.css')


function Reservation() {

    const [date, setDate] = React.useState(new Date().toLocaleDateString());

    const handlePrevDate = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 1);
            return newDate;
        })
    }

    const handleNextDate = () => {
        setDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 1);
            return newDate;
        })
    }

    async function getDate() {
        const res = await fetch("/api/date");
        console.log(res);

        // if (result.data.status == 200) {
        //     // setDate([res.data.date]);
        //     setDate(new Date(data.date).toLocaleDateString());
        // }
    }

    useEffect(() => {
        getDate();
    }, [date])

    return (
        <div className="main">
            <div className="submain">
                <div className="header">
                    <h3>예약관리</h3>
                </div>
            </div>
            <div className="subheader">
                <p style={{fontSize: "17px", fontWeight: "bold", color: "#434343"}}>금일배송 / 보관 관리</p>
            </div>
            <div className="content">
                <div className="content_first">
                    <button onClick={handlePrevDate} style={{marginRight: "10px"}}><FontAwesomeIcon
                        icon={faChevronLeft}/></button>
                    <h2>{date}</h2>
                    <button onClick={handleNextDate} style={{marginLeft: "10px"}}><FontAwesomeIcon
                        icon={faChevronRight}/></button>
                    <div>

                    </div>
                </div>
            </div>
            <div className="content">
                <div className="content_second">
                    <h3>전체 예약건수</h3>
                    <h1>17 건</h1>
                </div>
                <div className="content_second_one">
                    <img src="" alt="배송캐리어" style={{marginLeft: "30px"}} />
                    <div>
                        <h3>배송예약</h3>
                        <h1>20건</h1>
                    </div>
                    <img src="" alt="보관캐리어"/>
                    <div>
                        <h3>보관예약</h3>
                        <h1>42건</h1>
                    </div>
                    <div className="border-right"></div>
                </div>
            </div>
            <div className="content">
                <div className="content_third">

                </div>
            </div>
        </div>
    );
}

export default Reservation;