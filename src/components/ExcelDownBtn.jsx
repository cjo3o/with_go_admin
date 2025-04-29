import React from "react";
import * as XLSX from "xlsx";
import { Button } from "antd";
import excelIcon from "../assets/Icon/excelicon.svg";
import AdminStyle from "../css/Admin.module.css";

const ExcelDownBtn = ({ data, filename = "일일결산.xlsx" }) => {
  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const exportData = data.map((item) => ({
      신청일: (item.reservation_time || item.reserve_time || "").slice(0, 10),
      구분: item.type,
      예약자명: item.name,
      연락처: item.phone,
      예약기간: item.storage_start_date
        ? `${item.storage_start_date} ~ ${item.storage_end_date}`
        : item.delivery_date || "-",
      짐갯수: `S:${item.small} / M:${item.medium} / L:${item.large}`,
      결제금액: item.price,
      완료일:
        item.situation === "완료" && item.success_time
          ? item.success_time.slice(0, 16).replace("T", " ")
          : "-",
      처리현황: item.situation || "접수",
    }));

    // 시트 데이터는 A4부터 넣기 위해 dummy rows 3개 추가
    const blankRows = [[], [], []];
    const sheetData = [
      ["일일결산", "", "", "", "", "", "담당자", "", "부서장", ""], // 병합 셀에 들어갈 값들 (0행)
      [], // 병합 연속 행
      [], // 병합 연속 행
      Object.keys(exportData[0]),
      ...exportData.map((row) => Object.values(row)),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    // 열 너비 자동 설정
    worksheet["!cols"] = Object.keys(exportData[0]).map((key) => {
      const max = Math.max(
        key.length,
        ...exportData.map((row) => (row[key] ? String(row[key]).length : 0))
      );
      return { wch: max + 2 };
    });

    // 병합 설정 (셀 값 설정 전에 해야 함)
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 2, c: 5 } }, // A1:F3
      { s: { r: 0, c: 6 }, e: { r: 0, c: 7 } }, // G1:H1
      { s: { r: 0, c: 8 }, e: { r: 0, c: 9 } }, // I1:J1
      { s: { r: 1, c: 6 }, e: { r: 2, c: 7 } }, // G2:H3
      { s: { r: 1, c: 8 }, e: { r: 2, c: 9 } }, // I2:J3
    ];

    const centerAlignStyle = {
        t: "s",
        v: "일일결산",
        s: {
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
        },
      };

      worksheet["A1"] = centerAlignStyle;
      worksheet["G1"] = {
        t: "s",
        v: "담당자",
        s: centerAlignStyle.s,
      };
      worksheet["I1"] = {
        t: "s",
        v: "부서장",
        s: centerAlignStyle.s,
      };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "결산");
    XLSX.writeFile(workbook, filename);
  };

  return (
    <Button className={AdminStyle.excelbtn} onClick={handleExport}>
      <img className={AdminStyle.excelimg} src={excelIcon} alt="excel" />
    </Button>
  );
};

export default ExcelDownBtn;
