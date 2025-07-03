import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import excelIcon from "../assets/Icon/excelicon.svg";
import AdminStyle from "../css/Admin.module.css";

const ExcelDownBtn = ({ data, filename = "제목없음.xlsx" }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    // [1] 전체, 배송, 보관 데이터 분리
    const getRow = (item) => ({
      신청일: (item.reservation_time || item.reserve_time || "").slice(0, 10),
      구분: item.type,
      예약자명: item.name,
      연락처: item.phone,
      예약기간: item.storage_start_date
        ? `${item.storage_start_date} ~ ${item.storage_end_date}`
        : item.delivery_date || "-",
      짐갯수:
        item.type === "배송"
          ? [
              Number(item.under) > 0 ? `26인치이하 : ${item.under}개` : null,
              Number(item.over) > 0 ? `26인치이상 : ${item.over}개` : null,
            ]
              .filter(Boolean)
              .join(" / ") || "-"
          : [
              Number(item.small) > 0 ? `소 ${item.small}` : null,
              Number(item.medium) > 0 ? `중 ${item.medium}` : null,
              Number(item.large) > 0 ? `대 ${item.large}` : null,
            ]
              .filter(Boolean)
              .join(" / ") || "-",
      결제금액: item.price,
      완료일:
        (item.situation === "완료" ||
          item.situation === "배송완료" ||
          item.situation === "보관완료") &&
        item.success_time
          ? item.success_time.slice(0, 16).replace("T", " ")
          : "-",
      처리현황: item.situation || "접수",
    });

    const 전체 = data.map(getRow);
    const 배송 = data.filter((i) => i.type === "배송").map(getRow);
    const 보관 = data.filter((i) => i.type === "보관").map(getRow);

    // [2] 각 데이터 시트화 (헤더 + 데이터)
    function toSheet(dataArr) {
      if (!dataArr.length) return XLSX.utils.aoa_to_sheet([["데이터 없음"]]);
      const sheetData = [
        Object.keys(dataArr[0]),
        ...dataArr.map((row) => Object.values(row)),
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      ws["!cols"] = Object.keys(dataArr[0]).map((key) => {
        const max = Math.max(
          key.length,
          ...dataArr.map((row) => (row[key] ? String(row[key]).length : 0))
        );
        return { wch: max + 2 };
      });
      return ws;
    }

    // [3] workbook에 시트 추가
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, toSheet(전체), "전체");
    XLSX.utils.book_append_sheet(wb, toSheet(배송), "배송");
    XLSX.utils.book_append_sheet(wb, toSheet(보관), "보관");

    XLSX.writeFile(wb, filename);
  };

  return (
    <Button className={AdminStyle.excelbtn} onClick={handleExport}>
      <img className={AdminStyle.excelimg} src={excelIcon} alt="excel" />
    </Button>
  );
};

export default ExcelDownBtn;
