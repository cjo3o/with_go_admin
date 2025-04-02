import { useState } from 'react'
import './index.css'

function Index() {
  const [count, setCount] = useState(0)

  return (
      <>
        <div className="wrapper">
          <div className="sidebar">
            <h2>관리자 메뉴</h2>
            <a href="#">관리자 메인</a>
            <a href="#">회원관리</a>
            <a href="#">게시판관리</a>
            <a href="#">이벤트관리</a>
            <a href="#">예약관리</a>
            <div>
              <ul>
                <li>금일 보관/배송관리</li>
                <li>예약신청목록</li>
              </ul>
            </div>
            <a href="#">배송기사관리</a>
            <a href="#">FAQ관리</a>
            <a href="#">1:1문의관리</a>
            <a href="#">공지사항관리</a>
            <a href="#">설정</a>
          </div>

          <div className="main">
            <div className="header">관리자 대시보드</div>

            <div className="card">
              <h3>신규 가입회원</h3>
              <table>
                <thead>
                <tr>
                  <th>회원아이디</th>
                  <th>이름</th>
                  <th>가입일</th>
                  <th>상태</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>admin</td>
                  <td>최고관리자</td>
                  <td>2025-04-01</td>
                  <td>활성</td>
                </tr>
                </tbody>
              </table>
              <div className="btn-container">
                <button className="btn">회원 전체보기</button>
              </div>
            </div>

            <div className="card">
              <h3>최근 공지사항</h3>
              <table>
                <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>서비스 점검 안내</td>
                  <td>운영팀</td>
                  <td>2025-03-31</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
  )
}

export default Index
