import React, { useEffect, useState } from "react";
import custody from "../assets/Icon/custody.svg";
import delivery from "../assets/Icon/delivery.svg";
import "../css/Admin.css";
import { supabase } from "../lib/supabase.js";

function Admin() {
  const [deliveryt, setdelivery] = useState([]);
  const [storage, setstorage] = useState([]);
  const [twoData, settwoData] = useState([]);

  useEffect(() => {
    const supaData = async () => {
      const { data: deliveryData, error: deliveryError } = await supabase
        .from("delivery")
        .select("*")
        .order("reserve_time", { ascending: false });

      if (deliveryError) {
        console.error("delivery Error", deliveryError);
      } else {
        setdelivery(deliveryData);
      }

      const { data: storageData, error: storageerror } = await supabase
        .from("storage")
        .select("*")
        .order("reservation_time", { ascending: false });

      if (storageerror) {
        console.error("storage error", storageerror);
      } else {
        setstorage(storageData);
      }
      const deliveryType = deliveryData.map((item) => ({
        ...item,
        type: "배송",
      }));

      const storageType = storageData.map((item) => ({
        ...item,
        type: "보관",
      }));

      const AllData = [...deliveryType, ...storageType];

      AllData.sort((a, b) =>
        (b.reservation_time || b.reserve_time)?.localeCompare(
          a.reservation_time || a.reserve_time
        )
      );
      settwoData(AllData);
    };
    supaData();
  }, []);

  const eChange = async (e, item) => {
    const status = e.target.value;
    const tableName = item.type === "배송" ? "delivery" : "storage";

    const keyColumn = item.type === "배송" ? "re_num" : "reservation_number";

    const { error } = await supabase
      .from(tableName)
      .update({ situation: status })
      .eq(keyColumn, item[keyColumn]);

    if (error) {
      console.error("Supabase 오류 메시지:", error.message);
      console.error("상세 정보:", error.details);
      alert("업데이트 중 오류 발생: " + error.message);
    }
    if (error) {
      console.error(`${tableName} 업데이트 실패`, error);
      alert("업데이트 중 오류가 발생했습니다.");
    } else {
      settwoData((prevData) =>
        prevData.map((i) =>
          i[keyColumn] === item[keyColumn] ? { ...i, situation: status } : i
        )
      );
    }
  };

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
          <div className="list_up card">
            <h3>실시간 예약현황</h3>
            <table>
              <thead>
                <tr>
                  <th style={{ width: "130px" }}>신청일</th>
                  <th style={{ width: "95px" }}>구분</th>
                  <th style={{ width: "130px" }}>예약자명</th>
                  <th style={{ width: "175px" }}>연락처</th>
                  <th style={{ width: "272px" }}>예약기간</th>
                  <th style={{ width: "303px" }}>짐갯수</th>
                  <th style={{ width: "129px" }}>결제금액</th>
                  <th style={{ width: "196px" }}>완료일</th>
                  <th style={{ width: "115px" }}>진행상태</th>
                </tr>
              </thead>
              <tbody>
                {twoData.map((item, index) => {
                  const sizes = [
                    Number(item.small) > 0 ? `S ${item.small}개` : null,
                    Number(item.medium) > 0 ? `M ${item.medium}개` : null,
                    Number(item.large) > 0 ? `L ${item.large}개` : null,
                  ].filter(Boolean);

                  const inches = [
                    Number(item.under) > 0 ? `26"이하 : ${item.under}개` : null,
                    Number(item.over) > 0 ? `26"이상 : ${item.over}개` : null,
                  ].filter(Boolean);

                  const luggageInfo =
                    sizes.length > 0
                      ? sizes.join(", ")
                      : inches.length > 0
                      ? inches.join(", ")
                      : "입력된 수량이 없습니다.";

                  return (
                    <tr key={index}>
                      <td>
                        {item.reservation_time || item.reserve_time
                          ? (item.reservation_time || item.reserve_time)
                              .slice(0, 10)
                              .replaceAll("-", ".")
                          : "-"}
                      </td>
                      <td>{item.type}</td>
                      <td>{item.name}</td>
                      <td>{item.phone}</td>
                      <td>
                        {item.storage_start_date && item.storage_end_date
                          ? `${item.storage_start_date.replaceAll(
                              "-",
                              "."
                            )} ~ ${item.storage_end_date.replaceAll("-", ".")}`
                          : item.delivery_date.replaceAll("-", ".") || "-"}
                      </td>
                      <td>{luggageInfo}</td>
                      <td>{`${item.price.toLocaleString()}원`}</td>
                      <td>
                        {item.success_time
                          ? item.success_time
                              .slice(0, 16)
                              .replace("T", " ")
                              .replaceAll("-", ".")
                          : "-"}
                      </td>
                      <td>
                        <select
                          className="select"
                          value={item.situation || "보관/배송중"}
                          onChange={(e) => eChange(e, item)}
                        >
                          <option value="보관/배송중">보관/배송중</option>
                          <option value="완료">완료</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
