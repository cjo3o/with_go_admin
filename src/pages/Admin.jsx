import React, { useEffect, useState } from "react";
import custody from "../assets/Icon/custody.svg";
import delivery from "../assets/Icon/delivery.svg";
import AdminStyle from "../css/Admin.module.css";
import supabase from "../lib/supabase.js";
import { SearchOutlined } from "@ant-design/icons";
import ExcelDownBtn from "../components/ExcelDownBtn.jsx";

import { Radio, Input, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faChevronLeft,
  faChevronRight,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { DatePicker } from "antd";
import dayjs from "dayjs";

function AsyncLocation({ reservation_number, fetchLocation }) {
  const [location, setLocation] = useState("");
  useEffect(() => {
    let isMounted = true;
    fetchLocation(reservation_number).then((loc) => {
      if (isMounted) setLocation(loc || "-");
    });
    return () => { isMounted = false; };
  }, [reservation_number, fetchLocation]);
  return <span>{location}</span>;
}


function Admin() {
  const selectOptions = {
    배송: ["접수", "배송대기", "배송중", "배송완료", "취소"],
    보관: ["접수", "보관중", "보관완료", "취소"],
  };

  const [deliveryt, setdelivery] = useState([]);
  const [storage, setstorage] = useState([]);
  const [twoData, settwoData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusLogs, setStatusLogs] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [canceledPrice, setCanceledPrice] = useState(0);
  const actualPayment = totalPrice - canceledPrice;
  const [filterType, setFilterType] = useState("");
  const [completeCount, setCompleteCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [todayDeliveryCount, setTodayDeliveryCount] = useState(0);
  const [todayStorageCount, setTodayStorageCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [locationCache, setLocationCache] = useState({});
  const [deliveryList, setDeliveryList] = useState([]);
  const [disabledSelects, setDisabledSelects] = useState({});

  const navigate = useNavigate();

  const selectedDateStr = selectedDate.format("YYYY-MM-DD");

  const today = new Date();
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(today);
  const todayStr = `${parts.find((p) => p.type === "year").value}-${parts.find((p) => p.type === "month").value
    }-${parts.find((p) => p.type === "day").value}`;

  const [openRow, setOpenRow] = useState(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    // deliveryList를 불러옴
    const fetchDeliveryList = async () => {
      const { data, error } = await supabase
        .from("deliveryList")
        .select("re_num, status, f_time, driver_name"); // 필요한 컬럼만 지정해도 됨

      if (!error && data) setDeliveryList(data);
    };
    fetchDeliveryList();
  }, []);

  // deliveryList에서 re_num으로 driver_name 찾는 함수
  function getDriverNameByReNum(re_num) {
    const row = deliveryList.find(d => d.re_num === re_num);
    return row ? row.driver_name : "";
  }

  const completedDeliveryTimes = deliveryList
    .filter(row => row.status === "배송완료")
    .reduce((acc, row) => {
      acc[row.re_num] = row.f_time;
      return acc;
    }, {});

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
        .order("updated_at", { ascending: true });

      if (error) {
        console.error("로그 가져오기 실패", error);
        return;
      }
      if (data.length === 0) {

        await supabase.from("status_logs").insert([
          {
            table_name: tableName,
            key_value: keyValue,
            prev_status: "접수",
            new_status: "접수",
            updated_at: new Date().toISOString(),
            received_at: new Date().toISOString(),
            operator: "",
          },
        ]);

        const { data: newData, error: newError } = await supabase
          .from("status_logs")
          .select("*")
          .eq("key_value", keyValue)
          .order("updated_at", { ascending: true });

        if (newError) {
          console.error("로그 가져오기 실패", newError);
          return;
        }

        setStatusLogs((prev) => ({ ...prev, [keyValue]: newData }));
      } else {
        setStatusLogs((prev) => ({ ...prev, [keyValue]: data }));
      }
    }
  };

  const fetchLocation = async (reservation_number) => {
    if (locationCache[reservation_number])
      return locationCache[reservation_number];

    const { data, error } = await supabase
      .from("storage")
      .select("location")
      .eq("reservation_number", reservation_number)
      .single();
    if (error) return "";
    setLocationCache((prev) => ({
      ...prev,
      [reservation_number]: data.location,
    }));
    return data.location;
  };

  useEffect(() => {
    const res = sessionStorage.getItem("name");
    if (res === null) {
      navigate("/login");
      window.location.reload();
    }
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
        (item) => item.reserve_time?.slice(0, 10) === selectedDateStr
      ).length;

      const todayStorageCount = storageData.filter(
        (item) => item.reservation_time?.slice(0, 10) === selectedDateStr
      ).length;

      const completeCount = AllData.filter(
        (item) =>
          (item.reservation_time || item.reserve_time)?.slice(0, 10) ===
          selectedDateStr &&
          (item.situation === "배송완료" || item.situation === "보관완료")
      ).length;

      const cancelCount = AllData.filter(
        (item) =>
          (item.reservation_time || item.reserve_time)?.slice(0, 10) ===
          selectedDateStr && item.situation === "취소"
      ).length;

      const totalPrice = AllData.filter(
        (item) =>
          (item.reservation_time || item.reserve_time)?.slice(0, 10) ===
          selectedDateStr
      ).reduce((sum, item) => sum + (item.price || 0), 0);

      const canceledPrice = AllData.filter(
        (item) =>
          (item.reservation_time || item.reserve_time)?.slice(0, 10) ===
          selectedDateStr && item.situation === "취소"
      ).reduce((sum, item) => sum + (item.price || 0), 0);

      setTotalPrice(totalPrice);
      setCanceledPrice(canceledPrice);

      setCompleteCount(completeCount);
      setCancelCount(cancelCount);

      setTodayCount(todayDeliveryCount + todayStorageCount);
      setTodayDeliveryCount(todayDeliveryCount);
      setTodayStorageCount(todayStorageCount);
    };
    supaData();
  }, [selectedDateStr, todayStr, twoData]);

  const eChange = async (e, item, index) => {
    const status = e.target.value;
    const tableName = item.type === "배송" ? "delivery" : "storage";

    const keyColumn = item.type === "배송" ? "re_num" : "reservation_number";
    const keyValue = item[keyColumn];
    const prevStatus = item.situation || "접수";

    if (status === "보관완료") {
      const ok = window.confirm("완료처리하시겠습니까?");
      if (!ok) {
        settwoData((prevData) =>
          prevData.map((i, idx) =>
            idx === index ? { ...i, situation: prevStatus } : i
          )
        );
        return;  // 아니오 눌렀으면 롤백만 하고 함수 종료
      }
      // 네가 원하는 "상태 바꾸고, select 비활성화"는 아래 update 반영 후에 할 것임
    }

    const updates = {
      situation: status,
      status_updated_at: new Date().toISOString(),
    };

    if (status === "배송완료" || status === "보관완료") {
      updates.success_time = new Date().toISOString();
    } else {
      updates.success_time = null;
    }

    const userName = sessionStorage.getItem("name") || "알 수 없음";

    const { error } = await supabase
      .from(tableName)
      .update(updates)
      .eq(keyColumn, keyValue);

    if (error) {
      console.error(`${tableName} 업데이트 실패`, error);
      alert("업데이트 중 오류가 발생했습니다.");
      return;
    }

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
            prev_status: "접수",
            new_status: "접수",
            updated_at: new Date().toISOString(),
            received_at: reserveTime,
            operator: userName,
          },
        ]);

      if (logInsertError) {
        console.error("최초 접수 로그 저장 실패", logInsertError);
      }
    }

    const { error: logStatusError } = await supabase
      .from("status_logs")
      .insert([
        {
          table_name: tableName,
          key_value: keyValue,
          prev_status: prevStatus,
          new_status: status,
          updated_at: new Date().toISOString(),
          operator: userName,
        },
      ]);

    if (logStatusError) {
      console.error("상태 변경 로그 저장 실패", logStatusError);
    }

    const { data: updatedLogs, error: updatedLogsError } = await supabase
      .from("status_logs")
      .select("*")
      .eq("key_value", keyValue)
      .order("updated_at", { ascending: true });

    if (updatedLogsError) {
      console.error("업데이트된 로그 가져오기 실패", updatedLogsError);
    } else {
      setStatusLogs((prev) => ({ ...prev, [keyValue]: updatedLogs }));
    }

    settwoData((prevData) => {
      const newData = prevData.map((i) =>
        i[keyColumn] === keyValue
          ? {
            ...i,
            situation: status,
            status_updated_at: new Date().toISOString(),
            success_time: (status === "배송완료" || status === "보관완료")
              ? new Date().toISOString()
              : null,
          }
          : i
      );
      recalcTodayStats(newData);
      return newData;
    });

    if (status === "보관완료") {
      setTimeout(() => {
        setDisabledSelects((prev) => ({ ...prev, [index]: true }));
      }, 0);
    }
  };

  const filteredData = twoData.filter(
    (item) => {
      const dateStr = (item.reservation_time || item.reserve_time)?.slice(
        0,
        10
      );
      const isSelectedDate = dateStr === selectedDateStr;

      const phoneClean = item.phone?.replace(/-/g, "");
      const isTypeMatch = filterType === "" || item.type === filterType;
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower);
      const phoneMatch = phoneClean?.includes(searchLower);

      if (!searchTerm) {
        return isSelectedDate && isTypeMatch;
      } else {
        return isSelectedDate && isTypeMatch && (nameMatch || phoneMatch);
      }
    },
    [twoData, searchTerm, filterType, todayStr]
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const goToFirstGroup = () => setCurrentPage(1);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const goToLastGroup = () => {
    setCurrentPage(totalPages);
  };

  const pageNumbers =
    totalPages > 0 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [1];

  function recalcTodayStats(data) {
    const selectedDateStr = selectedDate.format("YYYY-MM-DD");
    const todayDeliveryCount = data.filter(
      (item) => item.type === "배송" && item.reserve_time?.slice(0, 10) === selectedDateStr
    ).length;
    const todayStorageCount = data.filter(
      (item) => item.type === "보관" && item.reservation_time?.slice(0, 10) === selectedDateStr
    ).length;

    const completeCount = data.filter(
      (item) =>
        (item.reservation_time || item.reserve_time)?.slice(0, 10) === selectedDateStr &&
        (item.situation === "배송완료" || item.situation === "보관완료")
    ).length;

    const cancelCount = data.filter(
      (item) =>
        (item.reservation_time || item.reserve_time)?.slice(0, 10) === selectedDateStr &&
        item.situation === "취소"
    ).length;

    const totalPrice = data.filter(
      (item) =>
        (item.reservation_time || item.reserve_time)?.slice(0, 10) === selectedDateStr
    ).reduce((sum, item) => sum + (item.price || 0), 0);

    const canceledPrice = data.filter(
      (item) =>
        (item.reservation_time || item.reserve_time)?.slice(0, 10) === selectedDateStr &&
        item.situation === "취소"
    ).reduce((sum, item) => sum + (item.price || 0), 0);

    setTotalPrice(totalPrice);
    setCanceledPrice(canceledPrice);
    setCompleteCount(completeCount);
    setCancelCount(cancelCount);
    setTodayCount(todayDeliveryCount + todayStorageCount);
    setTodayDeliveryCount(todayDeliveryCount);
    setTodayStorageCount(todayStorageCount);
  }


  return (
    <>
      <div className="main">
        <div className={AdminStyle.Admin_top}>실시간 모니터링</div>
        <div className={AdminStyle.Admin_content}>
          <div className={AdminStyle.top}>
            <div className={AdminStyle.left}>
              <div className={AdminStyle.left1}>
                <h3>금일 신규예약</h3>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  format="YYYY-MM-DD"
                  allowClear={false}
                  getPopupContainer={(trigger) => document.body}
                  className={AdminStyle.picker}
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </div>
              <div className={AdminStyle.left2}>
                <span className={AdminStyle.left2_1}>{todayCount}</span>
                <span className={AdminStyle.left2_2}>건</span>
              </div>
              <div className={AdminStyle.left3}>
                <div className={AdminStyle.left3_1}>
                  <img src={delivery} alt="" />
                  <h4>배송</h4>
                  <p>DELIVERY</p>
                  <span>{todayDeliveryCount}건</span>
                </div>
                <div className={AdminStyle.left3_2}>
                  <img src={custody} alt="" />
                  <h4>보관</h4>
                  <p>STORAGE</p>
                  <span>{todayStorageCount}건</span>
                </div>
              </div>
            </div>
          </div>
          <div className={AdminStyle.top2}>
            <div className={AdminStyle.center1}>
              <h3>금일배송/보관관리</h3>
              <span>{todayCount}건</span>
            </div>
            <div className={AdminStyle.center2_3}>
              <div className={AdminStyle.center2}>
                <h3>처리완료</h3>
                <span>{completeCount}건</span>
              </div>
              <div className={AdminStyle.center3}>
                <h3>취소</h3>
                <span>{cancelCount}건</span>
              </div>
            </div>
          </div>
          <div className={AdminStyle.top3}>
            <div className={AdminStyle.right1}>
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
        <div className={AdminStyle.Admin_list}>
          <div className={`${AdminStyle.list} card`}>
            <div className={AdminStyle.list_up}>
              <div className={AdminStyle.list_title}>
                <h3>실시간 예약현황</h3>
              </div>
              <div className={AdminStyle.admin_search}>
                <div className={AdminStyle.excel}>
                  <ExcelDownBtn data={currentItems} />
                </div>
                <div className={AdminStyle.radio}>
                  <Radio.Group
                    value={filterType}
                    buttonStyle="solid"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <Radio.Button
                      value=""
                      className={AdminStyle.custom_radio_button}
                    >
                      전체
                    </Radio.Button>
                    <Radio.Button
                      value="보관"
                      className={AdminStyle.custom_radio_button}
                    >
                      보관
                    </Radio.Button>
                    <Radio.Button
                      value="배송"
                      className={AdminStyle.custom_radio_button}
                    >
                      배송
                    </Radio.Button>
                  </Radio.Group>
                </div>
                <div className={AdminStyle.search}>
                  <Input.Search
                    placeholder="검색"
                    allowClear
                    enterButton={
                      <span>
                        <SearchOutlined style={{ marginRight: 4 }} />
                        검색
                      </span>
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onSearch={handleSearch}
                    className={`${AdminStyle.searchin} search-input default-style`}
                  />
                </div>
              </div>
            </div>
            <div className={AdminStyle.table_over}>
              <table>
                <thead>
                  <tr className={AdminStyle.noPointer}>
                    <th>신청일</th>
                    <th>구분</th>
                    <th>예약자명</th>
                    <th>연락처</th>
                    <th>이용구간(장소)</th>
                    <th>예약기간</th>
                    <th>짐갯수</th>
                    <th>결제금액</th>
                    <th>완료일</th>
                    <th>처리현황</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item, index) => {
                      const sizes = [
                        Number(item.small) > 0 ? `소 ${item.small}` : null,
                        Number(item.medium) > 0 ? `중 ${item.medium}` : null,
                        Number(item.large) > 0 ? `대 ${item.large}` : null,
                      ].filter(Boolean);

                      const inches = [
                        Number(item.under) > 0
                          ? `26"이하 : ${item.under}개`
                          : null,
                        Number(item.over) > 0
                          ? `26"이상 : ${item.over}개`
                          : null,
                      ].filter(Boolean);

                      const luggageInfo =
                        sizes.length > 0
                          ? sizes.join(" / ")
                          : inches.length > 0
                            ? inches.join(" / ")
                            : "입력된 수량이 없습니다.";

                      return (
                        <React.Fragment key={index}>
                          <tr
                            className={AdminStyle.trpointer}
                            onClick={() => toggleRow(index, item)}
                          >
                            <td>
                              {item.reservation_time || item.reserve_time
                                ? (
                                  item.reservation_time || item.reserve_time
                                ).slice(0, 10)
                                : "-"}
                            </td>
                            <td>{item.type}</td>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>
                              {item.type === "배송"
                                ? `${item.delivery_start} → ${item.delivery_arrive}`
                                : item.location}
                            </td>
                            <td>
                              {item.storage_start_date && item.storage_end_date
                                ? `${item.storage_start_date} ~ ${item.storage_end_date}`
                                : item.delivery_date
                                  ? item.delivery_date
                                  : "-"}
                            </td>
                            <td>{luggageInfo}</td>
                            <td>{`${item.price.toLocaleString()}원`}</td>
                            <td>
                              {item.type === "배송" && item.situation === "배송완료"
                                ? (completedDeliveryTimes[item.re_num]?.slice(0, 16)?.replace("T", " ") || "-")
                                : (item.situation === "보관완료" && item.success_time
                                  ? new Date(new Date(item.success_time).getTime() + 9 * 60 * 60 * 1000)
                                    .toISOString()
                                    .slice(0, 16)
                                    .replace("T", " ")
                                  : "-")}
                            </td>
                            <td>
                              <select
                                className={AdminStyle.select}
                                value={item.situation || "접수"}
                                onChange={(e) => eChange(e, item, index)}
                                onClick={(e) => e.stopPropagation()}
                                disabled={
                                  disabledSelects[index] ||
                                  (item.type === "배송" && ["배송대기", "배송중", "배송완료"].includes(item.situation)) ||
                                  (item.type === "보관" && ["보관완료"].includes(item.situation))
                                }
                              >
                                {selectOptions[item.type].map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                    disabled={
                                      item.type === "배송" &&
                                      ["배송대기", "배송중", "배송완료"].includes(status)
                                    }
                                  >
                                    {status}
                                  </option>
                                ))}
                              </select>

                            </td>
                          </tr>

                          {openRow === index && (
                            <tr>
                              <td colSpan="10">
                                <div className={AdminStyle.status_details}>
                                  <div className={AdminStyle.status_log_list}>
                                    {(() => {
                                      const keyColumn = item.type === "배송" ? "re_num" : "reservation_number";
                                      const keyValue = item[keyColumn];
                                      if (statusLogs[keyValue]?.length > 0) {
                                        return (
                                          <table className={AdminStyle.log_table}>
                                            <colgroup>
                                              <col style={{ width: "3%" }} />
                                              <col style={{ width: "4%" }} />
                                              <col style={{ width: "4%" }} />
                                              <col style={{ width: "4%" }} />
                                            </colgroup>
                                            <thead>
                                              <tr>
                                                <th>변경시간</th>
                                                <th>진행상태</th>
                                                <th>
                                                  {item.type === "배송"
                                                    ? "배송기사"
                                                    : item.type === "보관"
                                                      ? "보관장소"
                                                      : "배송기사/보관장소"}
                                                </th>
                                                <th>처리자</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {statusLogs[keyValue].map(
                                                (log, logIndex) => (
                                                  <tr key={logIndex}>
                                                    <td>
                                                      {(() => {
                                                        const date = new Date(log.updated_at);
                                                        const year = date.getFullYear();
                                                        const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                                        const day = date.getDate().toString().padStart(2, "0");
                                                        const hour = date.getHours();
                                                        const minute = date.getMinutes();
                                                        const second = date.getSeconds();
                                                        const ampm = hour < 12 ? "오전" : "오후";
                                                        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                                                        return `${year}-${month}-${day} ${ampm} ${displayHour}:${minute
                                                          .toString()
                                                          .padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
                                                      })()}
                                                    </td>
                                                    <td>{log.new_status}</td>
                                                    <td>
                                                      {log.table_name === "delivery" &&
                                                        ["배송대기", "배송중", "배송완료"].includes(log.new_status)
                                                        ? (getDriverNameByReNum(log.key_value) || "미배정")
                                                        : log.table_name === "delivery"
                                                          ? "미배정"
                                                          : log.table_name === "storage"
                                                            ? <AsyncLocation reservation_number={log.key_value} fetchLocation={fetchLocation} />
                                                            : "-"}
                                                    </td>
                                                    <td>{log.operator}</td>
                                                  </tr>
                                                )
                                              )}
                                            </tbody>
                                          </table>
                                        );
                                      } else {
                                        <p>변경 이력이 없습니다.</p>
                                      }
                                    })()}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td className={AdminStyle.falsetext} colSpan="10">
                        {searchTerm
                          ? "일치하는 접수건이 없습니다."
                          : "접수된 이력이 없습니다."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={AdminStyle.pagination}>
              <button
                className={AdminStyle.arrow_btn}
                onClick={goToFirstGroup}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
              <button
                className={AdminStyle.arrow_btn}
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>

              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`${AdminStyle.page_btn} ${currentPage === page ? AdminStyle.page_btn_active : ""
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                className={AdminStyle.arrow_btn}
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
              <button
                className={AdminStyle.arrow_btn}
                onClick={goToLastGroup}
                disabled={totalPages === 0 || currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
