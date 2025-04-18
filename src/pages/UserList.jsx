// src/components/UserRow.jsx
import { Checkbox } from "antd";
import React, { useState } from "react";

function UserList({ user, index, indexOfFirstUser2 }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const displayName =
    user.user_metadata && user.user_metadata.name === "-"
      ? "설정 안함"
      : user.user_metadata?.name || "-";

  const provider =
    Array.isArray(user.app_metadata?.providers) &&
    user.app_metadata?.providers.length > 0
      ? user.app_metadata?.providers.join(", ") // 배열을 콤마로 구분된 문자열로 합침
      : "로그인 방식 없음";

  const lasttime = user.last_sign_in_at
    ? user.last_sign_in_at.slice(0, 16).replace("T", " ").replaceAll("-", ".")
    : "-";

  const firsttime = user.created_at
    .slice(0, 16)
    .replace("T", " ")
    .replaceAll("-", ".");

  const checkbox = (checked) => {
    if (checked) {
      // 현재 페이지에 있는 유저 id만 모아서 선택
      setSelectedIds(currentUsers2.map((user) => user.id));
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <tr key={user.id}>
      <td className="col-select">
        <Checkbox
          onChange={(e) =>
            checkbox(e.target.checked, indexOfFirstUser2 + index)
          }
          checked={selectedIds.includes(indexOfFirstUser2 + index)}
        />
      </td>
      <td>{indexOfFirstUser2 + index + 1}</td>
      <td>{displayName}</td>
      <td>{user.email}</td>
      <td>{provider}</td>
      <td>{firsttime}</td>
      <td>{lasttime}</td>
    </tr>
  );
}

export default UserList;
