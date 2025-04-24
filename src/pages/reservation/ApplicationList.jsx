import React from 'react';
import App from "../../Components/Tab.jsx";
import {Button, Layout} from "antd";

const {Content} = Layout;

function ApplicationList(props) {
    return (
        <Content>
            <div className="main_R">
                <div className="submain_R">
                    <div className="header_R">
                        <h3>예약관리</h3>
                    </div>
                </div>
                <div className="subheader_R">
                    <p style={{fontSize: "17px", fontWeight: "bold", color: "#434343"}}>금일배송 / 보관 관리</p>
                </div>
            </div>
            <div className="aa">
                <h1 style={{fontSize: '1.5rem'}}>예약신청목록</h1>
                <button className="Newreservation">신규예약등록</button>
            </div>
            <div className="bb">
                <App/>
            </div>


        </Content>
    );
}

export default ApplicationList;