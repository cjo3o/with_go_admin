import React, { useState, useEffect } from 'react'
import DlStyle from "../css/DriverList.module.css";
import LookupSearch from './LookupSearch2';
import { Checkbox } from 'antd';
import { supabase } from "../lib/supabase";
import DriverListRow from './DriverListRow';
import DriverListModal from './DriverListModal';
import Pagination from "./Pagination.jsx";

function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [searchTerm3, setSearchTerm3] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [currentPage3, setCurrentPage3] = useState(1);
  const usersPerPage3 = 10;

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("DriverList")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("데이터 불러오기 실패:", error.message);
    } else {
      setDrivers(data);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAllCheck = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);
    if (checked) {
      setSelectedDrivers(filteredDrivers.map(driver => driver.id));
    } else {
      setSelectedDrivers([]);
    }

  };

  const handleDriverCheck = (e, driverId) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedDrivers([...selectedDrivers, driverId]);
    } else {
      setSelectedDrivers(selectedDrivers.filter(id => id !== driverId));
    }
  };

  const filteredDrivers = drivers.filter(driver => {
    if (!searchTerm3) return true;
    return (
      driver.name.toLowerCase().includes(searchTerm3.toLowerCase()) ||
      driver.driver_id.toLowerCase().includes(searchTerm3.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm3.toLowerCase()) ||
      driver.phone.toLowerCase().includes(searchTerm3.toLowerCase()) ||
      driver.address.toLowerCase().includes(searchTerm3.toLowerCase())
    );
  });

  const handleSearch3 = (value) => {
    setSearchTerm3(value);
    setCurrentPage3(1);
    setSelectedDrivers([]);
  };

  const DeleteSelected = async () => {
    if (!window.confirm('선택한 기사를 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('DriverList')
        .delete()
        .in('id', selectedDrivers);

      if (error) {
        console.error(error);
        alert('삭제 중 오류가 발생했습니다.');
        return;
      }

      setDrivers(drivers.filter(driver => !selectedDrivers.includes(driver.id)));
      setSelectedDrivers([]);
      alert('삭제 완료되었습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    setIsAllChecked(
      filteredDrivers.length > 0 &&
      filteredDrivers.every(driver => selectedDrivers.includes(driver.id))
    );
  }, [filteredDrivers, selectedDrivers]);

  const openModal = (driver) => {
    setSelectedDriver(driver);
  };

  const closeModal = () => {
    setSelectedDriver(null);
  };

  // 현재 페이지에 맞는 데이터를 필터링
  const currentDrivers = filteredDrivers.slice((currentPage3 - 1) * usersPerPage3, currentPage3 * usersPerPage3);

  const totalPages3 = Math.ceil(filteredDrivers.length / usersPerPage3);

  return (
    <>
      <div className={DlStyle.content}>
        <div className={DlStyle.DL_top}>기사 관리</div>
        <div className={`${DlStyle.DL_main} card`}>
          <div className={DlStyle.MainTop}>
            <h3>기사 목록</h3>
            <LookupSearch
              onSearch={handleSearch3}
            />
          </div>
          <table>
            <colgroup>
              <col style={{ width: "1%" }} />
              <col style={{ width: "2%" }} />
              <col style={{ width: "3%" }} />
              <col style={{ width: "2%" }} />
              <col style={{ width: "2%" }} />
              <col style={{ width: "3%" }} />
              <col style={{ width: "3%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "2%" }} />
              <col style={{ width: "2%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className={DlStyle.th_first}>
                  <Checkbox
                    onChange={handleAllCheck}
                    checked={isAllChecked}
                  />
                </th>
                <th>순번</th>
                <th>사진</th>
                <th>아이디</th>
                <th>이름</th>
                <th>연락처</th>
                <th>이메일</th>
                <th>주소</th>
                <th>첨부파일</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {currentDrivers.length > 0 ? (
                currentDrivers.map((driver) => {
                  const orderNum = drivers.length - drivers.findIndex(d => d.id === driver.id);

                  return (
                    <DriverListRow
                      key={driver.id}
                      driver={{ ...driver, orderNum }}
                      isChecked={selectedDrivers.includes(driver.id)}
                      onDriverCheck={(e) => handleDriverCheck(e, driver.id)}
                      onDriverClick={() => openModal(driver)}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9">등록된 기사가 없습니다.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="9">
                  <div className={DlStyle.foot_btn}>
                    {selectedDrivers.length > 0 && (
                      <button
                        className={DlStyle.btn_delete}
                        onClick={DeleteSelected}
                      >
                        선택 삭제 ({selectedDrivers.length})
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
          <Pagination
            currentPage2={currentPage3}
            totalPages2={totalPages3}
            setCurrentPage2={setCurrentPage3}
          />
        </div>
      </div>
      <DriverListModal
        visible={!!selectedDriver}
        driver={selectedDriver}
        onCancel={closeModal}
      />
    </>
  )
}

export default DriverList;