import React, { useEffect, useState } from "react";
import custody from "../assets/Icon/custody.svg";
import delivery from "../assets/Icon/delivery.svg";
import "../css/Admin.css";
import { supabase } from "../lib/supabase.js";
import Lookup from "../../src/layouts/Lookup.jsx";

function Admin() {
  const selectOptions = {
    배송: ["접수", "배송중", "완료", "취소"],
    보관: ["접수", "보관중", "완료", "취소"],
  };

  const [deliveryt, setdelivery] = useState([]);
  const [storage, setstorage] = useState([]);
  const [twoData, settwoData] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [statusLogs, setStatusLogs] = useState({});
  const [completeCount, setCompleteCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [canceledPrice, setCanceledPrice] = useState(0);
  const actualPayment = totalPrice - canceledPrice;

  const [todayCount, setTodayCount] = useState(0);
  const [todayDeliveryCount, setTodayDeliveryCount] = useState(0);
  const [todayStorageCount, setTodayStorageCount] = useState(0);

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const [openRow, setOpenRow] = useState(null); // 열려있는 행 관리

  // 검색어 처리 함수
  const handleSearch = (value) => {
    setSearchTerm(value); // 검색어 상태 업데이트
  };

  const toggleRow = async (index, item) => {
    const newOpenRow = openRow === index ? null : index;
    setOpenRow(newOpenRow);

    if (newOpenRow !== null) {
      const tableName = item.type === "배송" ? "delivery" : "storage";
      const keyValue =
        item[tableName === "delivery" ? "re_num" : "reservation_number"];

      const { data, error } = await supabase
        .from("status_logs")
        .select("*")
        .eq("key_value", keyValue)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("로그 가져오기 실패", error);
        return;
      }
      // 최초 접수 시 로그를 추가할 때, 최초 접수 상태 로그를 삽입
      if (data.length === 0) {
        const { error: logError } = await supabase.from("status_logs").insert([
          {
            table_name: tableName,
            key_value: keyValue,
            prev_status: "접수", // 최초 접수 상태
            new_status: "접수", // 최초 접수 상태
            updated_at: new Date().toISOString(),
            received_at: new Date().toISOString(), // 최초 접수 시간 기록
          },
        ]);

        if (logError) {
          console.error("최초 접수 로그 저장 실패", logError);
        }
      }

      setStatusLogs((prev) => ({ ...prev, [index]: data }));
    }
  };

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

      const todayDeliveryCount = deliveryData.filter(
        (item) => item.reserve_time?.slice(0, 10) === todayStr
      ).length;

      const todayStorageCount = storageData.filter(
        (item) => item.reservation_time?.slice(0, 10) === todayStr
      ).length;

      const completeCount = AllData.filter(
        (item) => item.situation === "완료"
      ).length;
      const cancelCount = AllData.filter(
        (item) => item.situation === "취소"
      ).length;

      const totalPrice = AllData.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );

      const canceledPrice = AllData.filter(
        (item) => item.situation === "취소"
      ).reduce((sum, item) => sum + (item.price || 0), 0);

      setTotalPrice(totalPrice);
      setCanceledPrice(canceledPrice);

      setCompleteCount(completeCount);
      setCancelCount(cancelCount);

      setTodayCount(todayDeliveryCount + todayStorageCount);
      setTodayDeliveryCount(todayDeliveryCount); // 배송 건수
      setTodayStorageCount(todayStorageCount); // 보관 건수
    };
    supaData();
  }, []);

  // 검색어로 두 데이터 필터링
  const filteredData = twoData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const phoneMatch = item.phone.toLowerCase().includes(searchLower);
    const dateMatch = (item.reservation_time || item.reserve_time)
      ?.slice(0, 10)
      .includes(searchLower);
    return nameMatch || phoneMatch || dateMatch;
  });

  const eChange = async (e, item) => {
    const status = e.target.value;
    const tableName = item.type === "배송" ? "delivery" : "storage";

    const keyColumn = item.type === "배송" ? "re_num" : "reservation_number";
    const keyValue = item[keyColumn];
    const prevStatus = item.situation || "접수";

    const updates = {
      situation: status,
      status_updated_at: new Date().toISOString(),
    };

    // 상태가 '완료'일 때 success_time 기록
    if (status === "완료") {
      updates.success_time = new Date().toISOString();
    } else {
      updates.success_time = null; // 완료 아니면 비우기
    }

    const { error } = await supabase
      .from(tableName)
      .update(updates)
      .eq(keyColumn, keyValue);

    if (error) {
      console.error(`${tableName} 업데이트 실패`, error);
      alert("업데이트 중 오류가 발생했습니다.");
      return;
    }

    // 최초 접수 상태 기록 추가 (eChange 함수 내부에서도 추가 가능)
    const { data: existingLogs, error: logError } = await supabase
      .from("status_logs")
      .select("*")
      .eq("key_value", keyValue)
      .order("updated_at", { ascending: false });

    if (existingLogs.length === 0) {
      const { error: logInsertError } = await supabase
        .from("status_logs")
        .insert([
          {
            table_name: tableName,
            key_value: keyValue,
            prev_status: "접수", // 최초 접수 상태
            new_status: "접수", // 최초 접수 상태
            updated_at: new Date().toISOString(),
            received_at: new Date().toISOString(), // 최초 접수 시간 기록
          },
        ]);

      if (logInsertError) {
        console.error("최초 접수 로그 저장 실패", logInsertError);
      }
    }

    // 상태 업데이트 로그 추가
    const { error: logStatusError } = await supabase
      .from("status_logs")
      .insert([
        {
          table_name: tableName,
          key_value: keyValue,
          prev_status: prevStatus,
          new_status: status,
          updated_at: new Date().toISOString(),
        },
      ]);

    if (logStatusError) {
      console.error("상태 변경 로그 저장 실패", logStatusError);
    }

    // 프론트 상태값 업데이트
    settwoData((prevData) =>
      prevData.map((i) =>
        i[keyColumn] === keyValue
          ? {
              ...i,
              situation: status,
              status_updated_at: new Date().toISOString(),
              success_time: status === "완료" ? new Date().toISOString() : null,
            }
          : i
      )
    );
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
                <p>{today.toLocaleDateString()}</p>
              </div>
              <div className="left2">
                <span className="left2-1">{todayCount}</span>
                <span className="left2-2">건</span>
              </div>
              <div className="left3">
                <div className="left3-1">
                  <img src={delivery} alt="" />
                  <h4>배송</h4>
                  <p>DELIVERY</p>
                  <span>{todayDeliveryCount}건</span>
                </div>
                <div className="left3-2">
                  <img src={custody} alt="" />
                  <h4>보관</h4>
                  <p>STORAGE</p>
                  <span>{todayStorageCount}건</span>
                </div>
              </div>
            </div>
          </div>
          <div className="top2">
            <div className="center1">
              <h3>금일배송/보관관리</h3>
              <span>{todayCount}건</span>
            </div>
            <div className="center2-3">
              <div className="center2">
                <h3>처리완료</h3>
                <span>{completeCount}건</span>
              </div>
              <div className="center3">
                <h3>취소</h3>
                <span>{cancelCount}건</span>
              </div>
            </div>
          </div>
          <div className="top3">
            <div className="right1">
              <h3>금일 실결제액</h3>
              <p>{actualPayment.toLocaleString()}원</p>
              <span>
                결제금액 {todayCount}건 {totalPrice.toLocaleString()}원
              </span>
              <span>
                결제취소 {cancelCount}건 {canceledPrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
        <div className="Admin_list">
          <div className="list card">
            <div className="list_up">
              <h3>실시간 예약현황</h3>
              <div className="admin_search">
                <div className="" style={{marginRight: "30px"}}>
                  <button className="">전체</button>
                  <button>배송</button>
                  <button>보관</button>
                </div>
                <select className="search_sel">
                  <option>예약자명</option>
                  <option>연락처</option>
                </select>
                <Lookup
                  onSearch={handleSearch}
                  placeholder="검색어를 입력하세요" // 검색어 입력 필드 제공
                />
              </div>
            </div>
            <table>
              <colgroup>
                <col style={{ width: "3%" }} />
                <col style={{ width: "3%" }} />
                <col style={{ width: "4%" }} />
                <col style={{ width: "6%" }} />
                <col style={{ width: "9%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "4%" }} />
                <col style={{ width: "7%" }} />
                <col style={{ width: "6%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>신청일</th>
                  <th>구분</th>
                  <th>예약자명</th>
                  <th>연락처</th>
                  <th>예약기간</th>
                  <th>짐갯수</th>
                  <th>결제금액</th>
                  <th>완료일</th>
                  <th>진행상태</th>
                </tr>
              </thead>
              <tbody>
                {twoData
                  .filter((item) => {
                    const dateStr = (
                      item.reservation_time || item.reserve_time
                    )?.slice(0, 10);
                    return dateStr === todayStr;
                  })
                  .map((item, index) => {
                    const sizes = [
                      Number(item.small) > 0 ? `S ${item.small}개` : null,
                      Number(item.medium) > 0 ? `M ${item.medium}개` : null,
                      Number(item.large) > 0 ? `L ${item.large}개` : null,
                    ].filter(Boolean);

                    const inches = [
                      Number(item.under) > 0
                        ? `26"이하 : ${item.under}개`
                        : null,
                      Number(item.over) > 0 ? `26"이상 : ${item.over}개` : null,
                    ].filter(Boolean);

                    const luggageInfo =
                      sizes.length > 0
                        ? sizes.join(", ")
                        : inches.length > 0
                        ? inches.join(", ")
                        : "입력된 수량이 없습니다.";

                    return (
                      <React.Fragment key={index}>
                        <tr onClick={() => toggleRow(index, item)}>
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
                                )} ~ ${item.storage_end_date.replaceAll(
                                  "-",
                                  "."
                                )}`
                              : item.delivery_date
                              ? item.delivery_date.replaceAll("-", ".")
                              : "-"}
                          </td>
                          <td>{luggageInfo}</td>
                          <td>{`${item.price.toLocaleString()}원`}</td>
                          <td>
                            {item.situation === "완료" && item.success_time
                              ? item.success_time
                                  .slice(0, 16)
                                  .replace("T", " ")
                                  .replaceAll("-", ".")
                              : "-"}
                          </td>
                          <td>
                            <select
                              className="select"
                              value={item.situation || "접수"}
                              onChange={(e) => eChange(e, item)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {selectOptions[item.type].map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>

                        {openRow === index && (
                          <tr>
                            <td colSpan="9">
                              <div className="status-details">
                                <div className="status-log-list">
                                  {statusLogs[index]?.length > 0 ? (
                                    <table className="log-table">
                                      <colgroup>
                                        <col style={{ width: "3%" }} />
                                        <col style={{ width: "3%" }} />
                                        <col style={{ width: "4%" }} />
                                      </colgroup>
                                      <thead>
                                        <tr>
                                          <th>변경시간</th>
                                          <th>이전상태</th>
                                          <th>변경상태</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {statusLogs[index].map(
                                          (log, logIndex) => (
                                            <tr key={logIndex}>
                                              <td>
                                                {new Date(
                                                  log.updated_at
                                                ).toLocaleString()}
                                              </td>
                                              <td>{log.prev_status}</td>
                                              <td>{log.new_status}</td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  ) : (
                                    <p>변경 이력이 없습니다.</p>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
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
