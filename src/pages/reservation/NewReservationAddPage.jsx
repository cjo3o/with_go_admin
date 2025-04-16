import React, {useState} from 'react';
import {Card, Col, Form, Input, Layout, Row, Button, message, notification, Modal} from "antd";
import supabase from "../../SupabaseClient_evpro.js";
import bcrypt from 'bcryptjs';
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";

import('../../css/Reservation.css')


const {Content} = Layout;

function NewReservationAddPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        const {name, email, age, phone, password} = values;
        // 등록 못하게 막기
        setLoading(true);
        try {
            // 암호화 하는것은 시간이 걸리기 때문에 await
            // 더 정확하게 설명하게 promise로 반환 되기 때문에 await 걸어줘야 합니다.
            const hashedPassword = await bcrypt.hash(password, 12);

            const {error} = await supabase.from('add-reservation')
                .insert([{name, email, age, phone, password: hashedPassword}]);
            if (error) {
                message.error("회원 추가 실패하였습니다.");
            } else {
                message.success('성공적으로 회원 추가 하였습니다.')
                notification.success({
                    message: '회원 등록 완료', description: '성공적으로 등록되었습니다.',
                });
                Modal.success({
                    title: '성공!', content: '작업이 완료되었습니다.',
                });
            }

        } catch (err) {
            message.error(err);
            console.log(err);
        }
        // 등록 할수 있게 풀기
        setLoading(false);
    }
    return (<Content>
        <div className="main">
            <div className="submain">
                <div className="header">
                    <h3>예약관리</h3>
                </div>
            </div>
            <div className="subheader">
                <p style={{fontSize: "17px", fontWeight: "bold", color: "#434343"}}>금일배송 / 보관 관리</p>
            </div>
        </div>
        <h1 style={{fontSize: '1.5rem', marginLeft:'40px'}}>신규예약등록</h1>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card hoverable style={{
                    width: '100%',
                    margin: '10px 2rem',
                    // padding: '1rem',
                    // display: 'inline-flex',
                    // alignItems: 'center'
                }}>
                    <Form layout="vertical" onFinish={onFinish} initialValues={{
                        name: '홍길동', email: 'test@example.com', age: 25, phone: '010-1234-5678', password: '1234'
                    }}>
                        <Form.Item label="예약자명" name="name" rules={[{required: true, message: '이름을 입력해주세요'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item label="이메일" name="email"
                                   rules={[{required: true, type: 'email', message: '올바른 이메일을 입력해주세요'}]}>
                            <Input/>
                        </Form.Item>
                        {/*<Form.Item label="나이" name="age" rules={[{required: true, message: '나이를 입력해주세요'}]}>*/}
                        {/*    <Input type="number"/>*/}
                        {/*</Form.Item>*/}
                        <Form.Item
                            label="연락처"
                            name="phone"
                            rules={[{required: true, message: '전화번호를 입력해주세요 예시 010-1234-1234'}, {
                                pattern: /^01[016789]-\d{3,4}-\d{4}$/, // 하이픈 없는 형태: 010-1234-5678
                                message: '유효한 전화번호 형식이 아닙니다'
                            }]}
                        >
                            <Input placeholder="010-1234-5678"/>
                        </Form.Item>
                        <Form.Item label="비밀번호" name="password" rules={[{required: false, message: '비밀번호를 입력해주세요'}
                            // {pattern: //, message: '비밀번호를 입력해주세요'}
                        ]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item>
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
        </Row>
        <div style={{textAlign: 'center'}}>
            <Button type="primary"
                    htmlType="submit"
                    loading={loading} block
                    style={{width: '100px', height: '35px'}}
            >
                등록
            </Button>
        </div>
    </Content>);
}

export default NewReservationAddPage;