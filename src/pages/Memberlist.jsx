import React, { useState, useEffect } from "react";
import { MemberlistUser } from "../pages/MemberlistUser";
import "../css/Memberlist.css";
import Pagination from "./pagination.jsx";
import LookupSearch from "./LookupSearch.jsx";
import UserList from "./UserList.jsx";

function Memberlist() {
  const [users, setUsers] = useState([]);
  const [searchTerm2, setSearchTerm2] = useState("");
  const [currentPage2, setCurrentPage2] = useState(1);
  const usersPerPage2 = 10; // 페이지당 보여줄 유저 수

  const indexOfLastUser2 = currentPage2 * usersPerPage2;
  const indexOfFirstUser2 = indexOfLastUser2 - usersPerPage2;
  const currentUsers2 = users
    .filter((user) => {
      if (!searchTerm2) return true;
      const displayName =
        user.user_metadata && user.user_metadata.name === "-"
          ? "설정 안함"
          : user.user_metadata?.name || "-";
      return (
        displayName.toLowerCase().includes(searchTerm2.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm2.toLowerCase())
      );
    })
    .slice(indexOfFirstUser2, indexOfLastUser2);

  const totalPages2 = Math.ceil(users.length / usersPerPage2);

  const handleSearch2 = (value) => {
    setSearchTerm2(value);
    setCurrentPage2(1);
  };

  useEffect(() => {
    const getUsers = async () => {
      const { data, error } = await MemberlistUser();
      if (error) return;
      setUsers(data);
    };

    getUsers();
  }, []);

  const noResultsMessage =
    currentUsers2.length === 0 && searchTerm2 !== "" ? (
      <tr>
        <td colSpan="6" style={{ textAlign: "center" }}>
          일치하는 회원이 없습니다.
        </td>
      </tr>
    ) : null;

  return (
    <>
      <div className="content2">
        <div className="Memberlist_top">
          <h1>회원 목록</h1>
        </div>
        <div className="Memberlist_content card">
          <div className="Memberlist_search">
            <LookupSearch 
              onSearch={handleSearch2}
              placeholder="검색어를 입력하세요"
            />
          </div>
          <table>
            <colgroup>
              <col style={{ width: "3%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "8%" }} />
              <col style={{ width: "5%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>성함</th>
                <th>Email</th>
                <th>회원 구분</th>
                <th>최초 가입일</th>
                <th>마지막 로그인</th>
              </tr>
            </thead>
            <tbody>
            {currentUsers2.map((user, index) => (
                <UserList
                  key={user.id}
                  user={user}
                  index={index}
                  indexOfFirstUser2={indexOfFirstUser2}
                />
              ))}
              {noResultsMessage}
            </tbody>
          </table>
          <Pagination
            currentPage2={currentPage2}
            totalPages2={totalPages2}
            setCurrentPage2={setCurrentPage2}
          />
        </div>
      </div>
    </>
  );
}

export default Memberlist;
