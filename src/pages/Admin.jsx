import React from "react";
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
          <div className="up_left">
            <div className="left1">
              <h3>금일 신규예약</h3>
              <p>2025-04-08</p>
            </div>
            <div className="left2">
              <span className="left2-1">8</span>
              <span className="left2-2">건</span>
            </div>
            <div className="left3">
              <div className="left3-1">배송</div>
              <div className="left3-2">보관</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
