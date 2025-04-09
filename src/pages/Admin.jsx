import React from "react";
import custody from "../assets/Icon/custody.svg";
import delivery from "../assets/Icon/delivery.svg";
import "../css/Admin.css";
import { supabase } from "../lib/supabase.js";

function Admin() {
  return (
    <>
      <div className="content">
        <div className="Admin_top">
          <h1>관리자 메인</h1>
        </div>
        <div className="Admin_content">
          <div className="top">
            <div className="left">
              <div className="left1">
                <h3>금일 신규예약</h3>
                <p>2025-04-08</p>
              </div>
              <div className="left2">
                <span className="left2-1">8</span>
                <span className="left2-2">건</span>
              </div>
              <div className="left3">
                <div className="left3-1">
                  <img src={delivery} alt="" />
                  <h4>배송</h4>
                  <p>DELIVERY</p>
                  <span>5건</span>
                </div>
                <div className="left3-2">
                  <img src={custody} alt="" />
                  <h4>보관</h4>
                  <p>STORAGE</p>
                  <span>3건</span>
                </div>
              </div>
            </div>
          </div>
          <div className="top2">
            <div className="center1">
              <h3>금일배송/보관관리</h3>
              <span>78건</span>
            </div>
            <div className="center2-3">
              <div className="center2">
                <h3>처리완료</h3>
                <span>12건</span>
              </div>
              <div className="center3">
                <h3>취소</h3>
                <span>6건</span>
              </div>
            </div>
          </div>
          <div className="top3">
            <div className="right1">
              <h3>금일 결제액</h3>
              <p>126,000원</p>
              <span>결제취소 1건 16,000원</span>
            </div>
          </div>
        </div>
        <div className="Admin_list">
          <div className="list_up">
            <h3>실시간 예약현황</h3>
            <table>
              <thead>
                <tr>
                  <th>신청일</th>
                  <th>구분</th>
                  <th>예약자명</th>
                  <th>연락처</th>
                  <th>예약기간</th>
                  <th>짐갯수</th>
                  <th>결제금액</th>
                  <th>신청일자</th>
                </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
