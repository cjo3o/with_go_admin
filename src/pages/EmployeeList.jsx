import React, {useEffect, useState} from 'react';
import supabase from "../lib/supabase.js";
import {Button, Select, Input, Modal, message} from "antd";
import {EditOutlined, DeleteOutlined, EditFilled, DeleteFilled} from '@ant-design/icons';

const {TextArea} = Input;


function EmployeeList(props) {
    const [rowdata, setRowdata] = useState([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [openMemo, setOpenMemo] = useState(false);
    const [memoValue, setMemoValue] = useState('');
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: '저장성공',
        });
    };

    const showMemo = (employee) => {
        setSelectedEmployee(employee);
        setMemoValue(employee.memo || '');
        setOpenMemo(true);
    };

    const showEdit = (employee) => {
        setSelectedEmployee(employee)
        setOpenEdit(true);
    };

    const handleOk = async () => {
        setLoading(true);

        if (openMemo && selectedEmployee) {
            await supabase.from('employees')
                .update({memo: memoValue})
                .eq('no', selectedEmployee.no);

            const {data} = await supabase.from('employees').select().order('no', {ascending: true});
            setRowdata(data);
        }
        if (openEdit && selectedEmployee) {
            await supabase.from('employees')
                .update({
                    name: selectedEmployee.name,
                    email: selectedEmployee.email,
                    department: selectedEmployee.department,
                    position: selectedEmployee.position,
                    role: selectedEmployee.role,
                    status: selectedEmployee.status,
                })
                .eq('no', selectedEmployee.no);

            const {data} = await supabase.from('employees').select().order('no', {ascending: true});
            setRowdata(data);
        }
        success();
        setTimeout(() => {
            setLoading(false);
            setOpenMemo(false);
            setOpenEdit(false);
        }, 2000);
    };

    const handleCancel = () => {
        setOpenMemo(false);
        setOpenEdit(false);
    };

    useEffect(() => {
        async function fetchEmployees() {
            const res = await supabase.from('employees').select().order('no', {ascending: true});
            setRowdata(res.data);
            console.log(res.data);
        }

        fetchEmployees();
    }, [])


    return (
        <>
            {contextHolder}
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
                            <th>가입일</th>
                            <th>상태</th>
                            <th>메모</th>
                            <th>관리</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rowdata.map(item => (
                            <tr key={item.no}>
                                <td>{item.no}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.department}</td>
                                <td>{item.position}</td>
                                <td>{item.role}</td>
                                <td>{item.created_at.split('T').shift()}</td>
                                <td><Select defaultValue={item.status}
                                            style={{'width': '90px'}}
                                            options={[
                                                {value: '인증중', label: <span>인증중</span>},
                                                {value: '사용중', label: <span>사용중</span>},
                                                {value: '차단', label: <span>차단</span>}
                                            ]}/>
                                </td>
                                <td><Button color="default" variant="filled" onClick={() => showMemo(item)}>
                                    메모
                                </Button></td>
                                <td>
                                    <div style={{display: "flex", gap: "10px", justifyContent: "center"}}>
                                        <Button icon={<EditOutlined/>} shape="square" size="medium"
                                                onClick={() => showEdit(item)}/>
                                        <Button icon={<DeleteOutlined/>} shape="square" size="medium"/>
                                    </div>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <Modal
                    title="메모"
                    open={openMemo}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            닫기
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                            저장
                        </Button>
                    ]}>
                    <TextArea
                        rows={4}
                        value={memoValue}
                        onChange={(e) => setMemoValue(e.target.value)}
                    />
                </Modal>
                <Modal
                    title="수정"
                    open={openEdit}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            닫기
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                            저장
                        </Button>
                    ]}>
                    <div className="editContent" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
                        <Input
                            placeholder="이름"
                            value={selectedEmployee?.name}
                            onChange={(e) => setSelectedEmployee({...selectedEmployee, name: e.target.value})}
                        />
                        <Input
                            placeholder="이메일"
                            value={selectedEmployee?.email}
                            onChange={(e) => setSelectedEmployee({...selectedEmployee, email: e.target.value})}
                        />
                        <Input
                            placeholder="부서"
                            value={selectedEmployee?.department}
                            onChange={(e) => setSelectedEmployee({...selectedEmployee, department: e.target.value})}
                        />
                        <Input
                            placeholder="직위"
                            value={selectedEmployee?.position}
                            onChange={(e) => setSelectedEmployee({...selectedEmployee, position: e.target.value})}
                        />
                        <div style={{display: "flex", gap: "20px"}}>
                            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                                <span>권한</span>
                                <Select value={selectedEmployee?.role}
                                        style={{'width': '100px'}}
                                        onChange={(value) => setSelectedEmployee({...selectedEmployee, role: value})}
                                        options={[
                                            {value: '읽기전용', label: <span>읽기전용</span>},
                                            {value: '수정가능', label: <span>수정가능</span>},
                                            {value: '관리자', label: <span>관리자</span>}
                                        ]}
                                />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                                <span>상태</span>
                                <Select value={selectedEmployee?.status}
                                        style={{'width': '90px'}}
                                        onChange={(value) => setSelectedEmployee({...selectedEmployee, status: value})}
                                        options={[
                                            {value: '인증중', label: <span>인증중</span>},
                                            {value: '사용중', label: <span>사용중</span>},
                                            {value: '차단', label: <span>차단</span>}
                                        ]}
                                />
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default EmployeeList;