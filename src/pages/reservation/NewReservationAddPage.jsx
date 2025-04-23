import React, { useState, useEffect } from 'react';
import {
    Card,
    Col,
    Form, // Form 컴포넌트 import 유지
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
    Radio,
} from "antd";
import supabase from "../../SupabaseClient_evpro.js";
import bcrypt from 'bcryptjs';
import { useNavigate } from "react-router-dom";

import '../../css/NewReservationAdd.css';

const { Content } = Layout;

const Counter = ({ initialCount = 0, onCountChange }) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        onCountChange(count);
    }, [count]);

    const increment = () => setCount((c) => c + 1);
    const decrement = () => setCount((c) => Math.max(0, c - 1));

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

function NewReservationAddPage() {
    const [form] = Form.useForm(); // useForm 훅 올바르게 사용
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serviceType, setServiceType] = useState('delivery');
    const [isReturnTrip, setIsReturnTrip] = useState(false);
    const [largeCount, setLargeCount] = useState(0);
    const [middleCount, setMiddleCount] = useState(0);
    const [smallCount, setSmallCount] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [storageDates, setStorageDates] = useState(null);  // 보관 기간 상태 선언 (추가)

    const locationOptions = [
        {
            label: 'location',
            title: 'manager',
            options: [
                { label: '동대구역', value: 'eastDaeguStation' },
                { label: '대구역', value: 'DaeguStation' },
                { label: '경주역', value: 'GyeongjuStation' },
            ],
        },
    ];

    const [storageLocation, setStorageLocation] = useState(locationOptions?.[0]?.options?.[0]?.value || '');
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
        const { name, email, phone} = values;
        setLoading(true);
        try {
            const reservationData = {
                name: name,
                mail: email, // 'mail'로 수정
                phone: phone,
                small: smallCount,
                medium: middleCount,
                large: largeCount,
                price: totalPayment,
                // service_type: serviceType,
                location: serviceType === 'storage' ? storageLocation : null,
                // location_options: serviceType === 'storage' ? JSON.stringify(locationOptions) : null,
                reservation_country: 'Korea',
                storage_start_date: serviceType === 'storage' && storageDates ? storageDates[0]?.format('YYYY-MM-DD') : null,
                storage_end_date: serviceType === 'storage' && storageDates ? storageDates[1]?.format('YYYY-MM-DD') : null,
            };

            // if (serviceType === 'storage' && storageDates && locationOptions) {
            //     reservationData.storage_start_date = storageDates[0]?.toISOString().split('T')[0];
            //     reservationData.storage_end_date = storageDates[1]?.toISOString().split('T')[0];
            //     reservationData.location = locationOptions; // 보관 장소 추가
            // }

            const { error } = await supabase.from('storage')
                .insert([reservationData]);
            if (error) {
                message.error("회원 추가 실패하였습니다.");
                console.error("회원 추가 에러:", error);
            } else {
                // message.success('성공적으로 회원 추가 하였습니다.');
                notification.success({ message: '회원 등록 완료', description: '성공적으로 등록되었습니다.' });
                // Modal.success({ title: '성공!', content: '작업이 완료되었습니다.', onOk: () => navigate('/ApplicationList') });
            }
        } catch (err) {
            message.error(`오류 발생: ${err.message}`);
            console.error("회원 추가 중 오류:", err);
        } finally {
            setLoading(false);
        }
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
        setStorageLocation(value)
        // 선택된 위치에 따른 상태 업데이트 또는 로직 처리
    };



    const PaymentDisplay = ({ amount }) => {
        const formattedAmount = amount.toLocaleString();
        return <span style={{ fontSize: '30px', fontWeight: "bold", color: '#1e83f1' }}>{formattedAmount} 원</span>;
    };

    const handleGoToList = () => {
        navigate('/ApplicationList');
    };

    const ReservationDatePicker = () => (
        <Space direction="vertical" size={12} style={{ marginTop: '5px' }}>
            {serviceType === 'delivery' && (
                <Checkbox onChange={handleReturnTripChange}>왕복
                    <span className="speech-bubble">왕복 배송시 체크 해주세요</span>
                </Checkbox>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
                <RangePicker
                    renderExtraFooter={() => 'extra footer'}
                    showTime
                    value={storageDates}
                    placeholder={[serviceType === 'delivery' ? 'PICK UP' : '보관 시작',
                        serviceType === 'delivery' ? 'DROP OFF' : '보관 종료'
                    ]}
                    style={{ width: '350px', marginTop: '5px', marginBottom: '5px' }}
                    onChange={(dates) => setStorageDates(dates)}
                    // onOk={(dates) => setStorageDates(dates)}
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
                                label="짐갯수"
                                colon={false}
                                className="separated-form-item"
                            >
                                <div id="large" style={{display: "flex", alignItems: "center"}}>대(30인치 이상)<Counter
                                    onCountChange={handleLargeCountChange}/></div>
                                <div id="middle" style={{display: "flex", alignItems: "center"}}>중(21 ~ 29인치)<Counter
                                    onCountChange={handleMiddleCountChange}/></div>
                                <div id="small" style={{display: "flex", alignItems: "center"}}>소(20인치 이하)<Counter
                                    onCountChange={handleSmallCountChange}/></div>
                            </Form.Item>
                            <Form.Item
                                label="결제금액"
                                colon={false}
                                className="separated-form-item"
                            >
                                <PaymentDisplay amount={totalPayment}/>
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
                              height: '220px',
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
            <Form.Item style={{textAlign: 'center', marginTop: 70}}>
                <Button type="primary" htmlType="submit" loading={loading} style={{width: '100px', height: '35px'}}>
                    등록
                </Button>
            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <div style={{ textAlign: 'center' }}>
            </div>
        </Content>
    );
}

export default NewReservationAddPage;