import React from "react";
import { Checkbox } from "antd";
import DlStyle from "../css/DriverList.module.css";
import { useNavigate } from "react-router-dom";

function DriverListRow({
  driver,
  index,
  isChecked,
  onDriverCheck,
  onDriverClick,
}) {
  const navigate = useNavigate();

  const handleEditClick2 = (e) => {
    e.stopPropagation(); // 행의 클릭 이벤트 막기
    navigate("/DriverRegistration", { state: { driver } });
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onDriverCheck(e);
  };

  const handleFileClick = (e) => {
    e.stopPropagation();
  };

  const handleRowClick = (e) => {
    const ignoredTds = ["tdCenter", "noPointer"];
    const targetTd = e.target.closest("td");

    // 클릭된 <td>의 className이 무시 대상이라면 return
    if (
      targetTd &&
      ignoredTds.some((className) =>
        targetTd.classList.contains(DlStyle[className])
      )
    ) {
      return;
    }

    // 체크박스와 링크는 기존대로 무시
    if (e.target.closest('input[type="checkbox"]') || e.target.closest("a") || e.target.closest("button")) {
      return;
    }

    onDriverClick(); // 모달 열기
  };

  return (
    <tr key={driver.id} onClick={handleRowClick} className={DlStyle.rowtr}>
      <td className={DlStyle.noPointer}>
        <Checkbox checked={isChecked} onChange={handleCheckboxClick} />
      </td>
      <td>{driver.orderNum}</td>
      <td className={DlStyle.tdCenter}>
        {driver.photo_url ? (
          <img src={driver.photo_url} alt="기사사진" width="100" />
        ) : (
          "없음"
        )}
      </td>
      <td>{driver.driver_id}</td>
      <td>{driver.name}</td>
      <td>
        {driver.phone
          ? driver.phone.length === 11
            ? driver.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
            : driver.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
          : "없음"}
      </td>
      <td>{driver.email}</td>
      <td>{driver.address}</td>
      <td className={DlStyle.noPointer}>
        {driver.file_url ? (
          <a
            href="#"
            onClick={async (e) => {
              e.preventDefault();

              const response = await fetch(driver.file_url);
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);

              const link = document.createElement("a");
              link.href = url;
              link.download = driver.file_url.split("/").pop();
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              window.URL.revokeObjectURL(url);
            }}
          >
            <span className={DlStyle.tdfile}>💾</span>
          </a>
        ) : (
          "없음"
        )}
      </td>
      <td className={DlStyle.noPointer}>
        <button className="btn btn-edit" onClick={handleEditClick2}>
          수정
        </button>
      </td>
    </tr>
  );
}

export default DriverListRow;
