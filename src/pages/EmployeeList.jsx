import React, {useEffect} from 'react';
import {supabase} from "../lib/supabase.js";

function EmployeeList(props) {

    useEffect(() => {
        async function fetchEmployees() {
            const res = await supabase.from('employees').select();
            console.log(res.data);
        }
        fetchEmployees();
    })


    return (
        <>
            <div className='main'>
                <div className='header'>
                    직원목록
                </div>
                <div className='card'>
                    <table>
                        <thead>
                        <tr>
                            <th>번호</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>부서</th>
                            <th>직위</th>
                            <th>권한</th>
                            <th>상태</th>
                            <th>가입일</th>
                            <th>메모</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {res.map(item => (
                            <tr key={item.id}>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default EmployeeList;