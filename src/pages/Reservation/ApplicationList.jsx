import React, { useEffect, useState } from "react";
import { Button, Layout, Tabs, DatePicker, Select, Input, message } from "antd";
import ExcelTable from "../../components/ExcelTable.jsx";
import supabase from "../../lib/supabase.js";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Content } = Layout;
const res = supabase.get

function ApplicationList() {
  const [currentTab, setCurrentTab] = useState("all");
  const [combinedData, setCombinedData] = useState([]);
  const [searchField, setSearchField] = useState("예약자명");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  // ✅ 데이터 가공 함수
  const formatStorageData = (item, index) => ({
    division: "보관",
    reservationTime: item.storage_start_date,
    reservationPeriod: `${item.storage_start_date} ~ ${item.storage_end_date}`,
    section: item.location,
    luggageNumber: `소 ${item.small || 0} / 중 ${item.medium || 0} / 대 ${
      item.large || 0
    }`,
    reservationName: item.name,
    reservationPhone: item.phone,
    date: item.reservation_time.slice(0, 10),
    driver: "-",
    processingStatus: item.situation,
    key: `storage-${item.reservation_number}`,
    id: item.reservation_number,
    number: index + 1,
  });

  const formatDeliveryData = (item, index) => ({
    division: "배송",
    reservationTime: item.delivery_date,
    section: `${item.delivery_start} → ${item.delivery_arrive}`,
    luggageNumber: `under ${item.under} / over ${item.over}`,
    reservationName: item.name,
    reservationPhone: item.phone,
    date: item.reserve_time.slice(0, 10),
    driver: item.driver || "-",
    processingStatus: item.situation,
    key: `delivery-${item.re_num}`,
    id: item.re_num,
    number: index + 1,
  });

  // ✅ Supabase에서 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      const [storageRes, deliveryRes, deliveryListRes] = await Promise.all([
        supabase.from("storage").select("*"),
        supabase.from("delivery").select("*"),
        supabase.from("deliveryList").select("re_num,driver_name"),
      ]);

      // deliveryList를 re_num으로 빠르게 찾을 수 있게 변환
      const driverMap = {};
      (deliveryListRes.data || []).forEach((dl) => {
        driverMap[dl.re_num] = dl.driver_name;
      });

      // storage
      const storageData = (storageRes.data || []).map((item, i) =>
        formatStorageData(item, i)
      );

      // delivery + driver name mapping
      const deliveryData = (deliveryRes.data || []).map((item, i) => {
        const driverName = driverMap[item.re_num] || "-";
        return formatDeliveryData({ ...item, driver: driverName }, i);
      });

      const allData = [...storageData, ...deliveryData]
        .sort(
          (a, b) => new Date(b.reservationTime) - new Date(a.reservationTime)
        )
        .map((d, i) => ({ ...d, number: i + 1 }));

      setCombinedData(allData);
    };

    fetchData();
  }, []);

  function isDateRangeOverlap(aStart, aEnd, bStart, bEnd) {
    return (
      aStart.isSameOrBefore(bEnd, "day") && aEnd.isSameOrAfter(bStart, "day")
    );
  }

  // ✅ 검색 필터링
  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase();
    let filtered = combinedData.filter((item) => {
      let inDateRange = true;
      if (Array.isArray(dateRange) && dateRange.length === 2) {
        const searchStart = dayjs(dateRange[0]).startOf("day");
        const searchEnd = dayjs(dateRange[1]).endOf("day");
        if (item.division === "보관" && item.reservationPeriod.includes("~")) {
          const [storageStart, storageEnd] = item.reservationPeriod
            .split("~")
            .map((s) => dayjs(s.trim(), "YYYY-MM-DD"));
          inDateRange = isDateRangeOverlap(
            storageStart,
            storageEnd,
            searchStart,
            searchEnd
          );
        } else {
          const targetDate = dayjs(item.reservationTime, "YYYY-MM-DD");
          inDateRange =
            targetDate.isSameOrAfter(searchStart, "day") &&
            targetDate.isSameOrBefore(searchEnd, "day");
        }
      }

      const inKeyword =
        !keyword ||
        (() => {
          if (searchField === "예약자명")
            return item.reservationName.toLowerCase().includes(keyword);
          if (searchField === "연락처")
            return item.reservationPhone.includes(keyword);
          if (searchField === "배정기사명")
            return item.driver.toLowerCase().includes(keyword);
          return false;
        })();

      return inDateRange && inKeyword;
    });

    if (
      Array.isArray(dateRange) &&
      dateRange.length === 2 &&
      dateRange[0] &&
      dateRange[1]
    ) {
      // 날짜 입력 시 오래된순 정렬
      filtered.sort((a, b) => {
        const aStart = a.reservationTime.includes("~")
          ? a.reservationTime.split("~")[0].trim()
          : a.reservationTime;
        const bStart = b.reservationTime.includes("~")
          ? b.reservationTime.split("~")[0].trim()
          : b.reservationTime;
        return new Date(aStart) - new Date(bStart); // 오래된순
      });
    }

    if (filtered.length === 0) {
      message.warning("검색 결과가 없습니다.");
    }

    setSearchResults(filtered);
    setIsSearched(true);
    setSearchKeyword("");
    setDateRange([]);
  };

  // ✅ 탭 필터링
  const getFilteredResults = (tabKey) => {
    const baseData = searchResults.length > 0 ? searchResults : combinedData;

    if (tabKey === "delivery")
      return baseData.filter(
        (d) => d.division === "배송" && d.processingStatus !== "취소"
      );
    if (tabKey === "storage")
      return baseData.filter(
        (d) => d.division === "보관" && d.processingStatus !== "취소"
      );
    if (tabKey === "cancel")
      return baseData.filter((d) => d.processingStatus === "취소");
    return baseData.filter((d) => d.processingStatus !== "취소"); // all
  };

  // ✅ counts: 전체 or 검색결과 기준
  const tabSource = isSearched ? searchResults : combinedData;

  const counts = {
    all: tabSource.filter((d) => d.processingStatus !== "취소").length,
    delivery: tabSource.filter(
      (d) => d.division === "배송" && d.processingStatus !== "취소"
    ).length,
    storage: tabSource.filter(
      (d) => d.division === "보관" && d.processingStatus !== "취소"
    ).length,
    cancel: tabSource.filter((d) => d.processingStatus === "취소").length,
  };

  return (
    <Content>
      <div className="main">
        <div className="header">
          <div>예약관리</div>
        </div>
        <div className="card">
          <div
            className="title"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>예약신청목록</h4>
            {/*<Button type="primary" href="/NewReservationAddPage">신규예약등록</Button>*/}
          </div>

          <div className="content_middle">
            <div className="content_middle_two" style={{ marginTop: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: 20,
                }}
              >
                <RangePicker
                  value={
                    Array.isArray(dateRange) && dateRange.length === 2
                      ? dateRange
                      : []
                  }
                  onChange={(dates) => setDateRange(dates || [])}
                  style={{ width: 240 }}
                />
                <Select
                  value={searchField}
                  onChange={setSearchField}
                  style={{ width: 140 }}
                >
                  <Option value="예약자명">예약자명</Option>
                  <Option value="연락처">연락처</Option>
                  <Option value="배정기사명">배정기사명</Option>
                </Select>
                <Input
                  placeholder="검색어 입력"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onPressEnter={handleSearch}
                  style={{ width: 200 }}
                />
                <Button type="primary" onClick={handleSearch}>
                  검색
                </Button>
              </div>

              <Tabs
                activeKey={currentTab}
                onChange={setCurrentTab}
                items={[
                  {
                    label: `전체 (${counts.all})`,
                    key: "all",
                    children:
                      isSearched && searchResults.length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: 40,
                            color: "#888",
                          }}
                        >
                          검색 결과가 없습니다.
                        </div>
                      ) : (
                        <ExcelTable
                          showCheckbox={false}
                          combinedSearchData={(searchKeyword &&
                          searchResults.length > 0
                            ? getFilteredResults("all")
                            : getFilteredResults("all")
                          ).map((item, idx) => ({
                            ...item,
                            number: idx + 1,
                          }))}
                        />
                      ),
                  },
                  {
                    label: `배송 (${counts.delivery})`,
                    key: "delivery",
                    children:
                      isSearched &&
                      searchResults.filter((item) => item.division === "배송")
                        .length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: 40,
                            color: "#888",
                          }}
                        >
                          검색 결과가 없습니다.
                        </div>
                      ) : (
                        <ExcelTable
                          showCheckbox={false}
                          combinedSearchData={(searchKeyword &&
                          searchResults.length > 0
                            ? searchResults.filter(
                                (item) => item.division === "배송"
                              )
                            : getFilteredResults("delivery")
                          ).map((item, idx) => ({
                            ...item,
                            number: idx + 1,
                          }))}
                        />
                      ),
                  },
                  {
                    label: `보관 (${counts.storage})`,
                    key: "storage",
                    children:
                      isSearched &&
                      searchResults.filter((item) => item.division === "보관")
                        .length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: 40,
                            color: "#888",
                          }}
                        >
                          검색 결과가 없습니다.
                        </div>
                      ) : (
                        <ExcelTable
                          showCheckbox={false}
                          combinedSearchData={(searchKeyword &&
                          searchResults.length > 0
                            ? searchResults.filter(
                                (item) => item.division === "보관"
                              )
                            : getFilteredResults("storage")
                          ).map((item, idx) => ({
                            ...item,
                            number: idx + 1,
                          }))}
                        />
                      ),
                  },
                  {
                    label: `취소 (${counts.cancel})`,
                    key: "cancel",
                    children:
                      isSearched &&
                      searchResults.filter(
                        (item) => item.processingStatus === "취소"
                      ).length === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            padding: 40,
                            color: "#888",
                          }}
                        >
                          검색 결과가 없습니다.
                        </div>
                      ) : (
                        <ExcelTable
                          showCheckbox={false}
                          combinedSearchData={(searchKeyword &&
                          searchResults.length > 0
                            ? searchResults.filter(
                                (item) => item.processingStatus === "취소"
                              )
                            : getFilteredResults("cancel")
                          ).map((item, idx) => ({
                            ...item,
                            number: idx + 1,
                          }))}
                        />
                      ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}

export default ApplicationList;
