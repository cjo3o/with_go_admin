import React, {useEffect, useState} from 'react';
import supabase from "../lib/supabase.js";
import {Button, Select, Input, Modal, message} from "antd";
import {EditOutlined, DeleteOutlined, EditFilled, DeleteFilled} from '@ant-design/icons';

const {TextArea} = Input;


function EmployeeList(props) {
    const [rowdata, setRowdata] = useState([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: '저장성공',
        });
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        success();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 2000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function fetchEmployees() {
            const res = await supabase.from('employees').select();
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
                                <td><Button color="default" variant="filled" onClick={showModal}>
                                    메모
                                </Button></td>
                                <td>
                                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                        <Button icon={<EditOutlined />} shape="square" size="medium" />
                                        <Button icon={<DeleteOutlined />} shape="square" size="medium" />
                                    </div>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <Modal
                    title="메모"
                    open={open}
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
                    <TextArea rows={4}/>
                </Modal>
            </div>
        </>
    );
}

export default EmployeeList;