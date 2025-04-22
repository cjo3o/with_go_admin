import React, { useState, useEffect } from 'react';
import {
    Card,
    Col,
    Form,
    Input,
    Layout,
    Row,
    Button,
    message,
    notification,
    Modal,
    Checkbox,
    DatePicker,
    Space,
    Select,
    Cascader,
    Flex,
    Radio
} from "antd";
import supabase from "../../SupabaseClient_evpro.js";
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom";

import '../../css/NewReservationAdd.css';

const { Content } = Layout;

const Counter = ({ initialCount = 0, onCountChange }) => {
    const [count, setCount] = useState(initialCount);

    const increment = () => {
        setCount(prevCount => {
            const newCount = prevCount + 1;
            onCountChange(newCount);
            return newCount;
        });
    };

    const decrement = () => {
        setCount(prevCount => {
            const newCount = Math.max(0, prevCount - 1);
            onCountChange(newCount);
            return newCount;
        });
    };

    return (
        <div style={{
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '150px'
        }}>
            <button
                onClick={decrement}
                style={{
                    fontSize: '20px',
                    padding: '5px 15px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                }}
            >
                -
            </button>
            <div style={{
                fontSize: '24px',
                backgroundColor: 'white',
                width: "100%",
                height: "100%",
                textAlign: 'center'
            }}> {count} </div>
            <button
                onClick={increment}
                style={{
                    fontSize: '20px',
                    padding: '5px 15px',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                }}
            >
                +
            </button>
        </div>
    );
};

const PaymentDisplay = ({ amount }) => {
    const formattedAmount = amount.toLocaleString();
    return <span style={{ fontSize: '30px', fontWeight: "bold", color: '#1e83f1' }}>{formattedAmount} 원</span>;
};

// // const LuggageForm = () => {
// //     const [largeCount, setLargeCount] = useState(0);
// //     const [middleCount, setMiddleCount] = useState(0);
// //     const [smallCount, setSmallCount] = useState(0);
// //     const [totalPayment, setTotalPayment] = useState(0);
// //
// //     const largePrice = 5000;
// //     const middlePrice = 3000;
// //     const smallPrice = 1000;
// //
// //     const handleLargeCountChange = (count) => {
// //         setLargeCount(count);
// //     };
// //
// //     const handleMiddleCountChange = (count) => {
// //         setMiddleCount(count);
// //     };
// //
// //     const handleSmallCountChange = (count) => {
// //         setSmallCount(count);
// //     };
// //
// //     useEffect(() => {
// //         const total = (largeCount * largePrice) + (middleCount * middlePrice) + (smallCount * smallPrice);
// //         setTotalPayment(total);
// //     }, [largeCount, middleCount, smallCount, largePrice, middlePrice, smallPrice]);
//
//     return (
//         <Form layout="horizontal">
//             <Form.Item
//                 label="짐갯수"
//                 colon={false}
//                 className="separated-form-item"
//             >
//                 <div id="large" style={{ display: "flex", alignItems: "center" }}>대(30인치 이상)<Counter onCountChange={handleLargeCountChange} /></div>
//                 <div id="middle" style={{ display: "flex", alignItems: "center" }}>중(21 ~ 29인치)<Counter onCountChange={handleMiddleCountChange} /></div>
//                 <div id="small" style={{ display: "flex", alignItems: "center" }}>소(20인치 이하)<Counter onCountChange={handleSmallCountChange} /></div>
//             </Form.Item>
//             <Form.Item
//                 label="결제금액"
//                 colon={false}
//                 className="separated-form-item"
//             >
//                 <PaymentDisplay amount={totalPayment} />
//             </Form.Item>
//         </Form>
//     );
// }

function NewReservationAddPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serviceType, setServiceType] = useState('delivery');
    const [isReturnTrip, setIsReturnTrip] = useState(false);
    const [largeCount, setLargeCount] = useState(0);
    const [middleCount, setMiddleCount] = useState(0);
    const [smallCount, setSmallCount] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const { RangePicker } = DatePicker;

    const largePrice = 5000;
    const middlePrice = 3000;
    const smallPrice = 1000;

    const handleLargeCountChange = (count) => {
        setLargeCount(count);
    };

    const handleMiddleCountChange = (count) => {
        setMiddleCount(count);
    };

    const handleSmallCountChange = (count) => {
        setSmallCount(count);
    };

    useEffect(() => {
        const total = (largeCount * largePrice) + (middleCount * middlePrice) + (smallCount * smallPrice);
        setTotalPayment(total);
    }, [largeCount, middleCount, smallCount, largePrice, middlePrice, smallPrice]);


    const onFinish = async (values) => {
        // ... (기존 onFinish 함수 - 필요에 따라 보관 관련 데이터 처리 추가)
    }

    const handleServiceTypeChange = (e) => {
        setServiceType(e.target.value);
        setIsReturnTrip(false); // 서비스 타입 변경 시 왕복 체크 해제
    };

    const handleReturnTripChange = (e) => {
        setIsReturnTrip(e.target.checked);
    };

    const handleLocationChange = value => {
        console.log(`selected ${value}`);
        // 선택된 위치에 따른 상태 업데이트 또는 로직 처리
    };

    const locationOptions = [
        {
            label: <span>location</span>,
            title: 'manager',
            options: [
                { label: <span>동대구역</span>, value: 'eastDaeguStation' },
                { label: <span>대구역</span>, value: 'DaeguStation' },
                { label: <span>경주역</span>, value: 'GyeongjuStation' },
            ],
        },
    ];

    const PaymentDisplay = ({ amount }) => {
        const formattedAmount = amount.toLocaleString();
        return <span style={{ fontSize: '30px', fontWeight: "bold", color: '#1e83f1' }}>{formattedAmount} 원</span>;
    };

    const handleGoToList = () => {
        navigate('/ApplicationList');
    };

    const ReservationDatePicker = () => (
        <Space direction="horizontal" size={12} style={{ marginTop: '5px' }}>
            {serviceType === 'delivery' && (
                <Checkbox onChange={handleReturnTripChange}>왕복
                    <span className="speech-bubble">왕복 배송시 체크 해주세요</span>
                </Checkbox>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
                <RangePicker
                    renderExtraFooter={() => 'extra footer'}
                    showTime
                    placeholder={[serviceType === 'delivery' ? 'PICK UP' : '보관 시작', serviceType === 'delivery' ? 'DROP OFF' : '보관 종료']}
                    style={{ width: '350px', marginTop: '5px', marginBottom: '5px' }}
                />
                <Select
                    className="select"
                    defaultValue={locationOptions[0]?.options[0]?.value} // 기본 배송지 설정
                    style={{ width: 120 }}
                    onChange={handleLocationChange}
                    options={locationOptions}
                />
                <Cascader style={{ width: '200px' }}></Cascader>
            </div>
            {serviceType === 'delivery' && isReturnTrip && (
                <RangePicker
                    renderExtraFooter={() => '※'}
                    showTime
                    placeholder={['PICK UP', 'DROP OFF']}
                />
            )}
        </Space>
    );

    return (
        <Content>
            <div className="main_R">
                <div className="submain_R">
                    <div className="header_R">
                        <h3>예약관리</h3>
                    </div>
                </div>
                <div className="subheader_R">
                    <p style={{ fontSize: "17px", fontWeight: "bold", color: "#434343" }}>금일배송 / 보관 관리</p>
                </div>
            </div>
            <div className="aa">
                <h1 style={{ fontSize: '1.5rem' }}>신규예약등록</h1>
                <Button className="customerList" onClick={handleGoToList}>목록</Button>
            </div>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card hoverable
                          style={{
                              margin: '10px 2rem',
                              height: 'auto',
                              backgroundColor: '#F9F9F9',
                          }}>
                        <Form layout="horizontal">
                            <Form.Item
                                label="구분"
                                colon={false}
                                className="separated-form-item"
                            >
                                <Radio.Group defaultValue={serviceType} size="middle" onChange={handleServiceTypeChange}>
                                    <Radio.Button value="delivery">배송</Radio.Button>
                                    <Radio.Button value="storage">보관</Radio.Button>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                label={serviceType === 'delivery' ? '예약일자' : '보관기간'}
                                colon={false}
                                className="separated-form-item"
                            >
                                <ReservationDatePicker />
                            </Form.Item>
                            <Form.Item
                                className="separated-form-item"
                            >
                                <LuggageForm />
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card hoverable
                          style={{
                              margin: '10px 2rem',
                              height: 'auto',
                              backgroundColor: '#F9F9F9',
                          }}>
                        <Form
                            layout="horizontal"
                            onFinish={onFinish}
                            initialValues={{
                                name: '',
                                email: '',
                                phone: '',
                                password: '',
                            }}
                            style={{ width: '100%', maxWidth: '450px' }}>

                            <Form.Item
                                label="예약자명"
                                name="name"
                                rules={[{ required: true, message: '예약자명을 입력해주세요' }]}
                                className="separated-form-item"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="이메일"
                                name="email"
                                rules={[{ required: true, type: 'email', message: '올바른 이메일을 입력해주세요' }]}
                                className="separated-form-item"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="연락처"
                                name="phone"
                                rules={[
                                    { required: true, message: '전화번호를 입력해주세요 예시 010-1234-1234' },
                                    { pattern: /^01[016789]-\d{3,4}-\d{4}$/, message: '유효한 전화번호 형식이 아닙니다' },
                                ]}
                                className="separated-form-item"
                            >
                                <Input placeholder="010-1234-5678" />
                            </Form.Item>
                            <Form.Item
                                label="비밀번호"
                                name="password"
                                rules={[{ required: true, message: '비밀번호를 입력해주세요' }, { min: 6, message: '비밀번호는 최소 6자 이상이어야 합니다.' }]}
                                className="separated-form-item"
                            >
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <div style={{ textAlign: 'center' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{
                        width: '100px',
                        height: '35px',
                        margin: '20px 0',
                    }}
                >
                    등록
                </Button>
            </div>
        </Content>
    );
}

export default NewReservationAddPage;