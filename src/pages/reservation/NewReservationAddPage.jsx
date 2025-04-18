import React, {useState} from 'react';
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
    Space, Select, Cascader
} from "antd";
import supabase from "../../SupabaseClient_evpro.js";
import bcrypt from 'bcryptjs';
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {Flex, Radio} from 'antd';

import('../../css/NewReservationAdd.css')

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

    const App = () => (
        <Flex vertical gap="middle">
            <Radio.Group defaultValue="a" size="middle">
                <Radio.Button value="a">배송</Radio.Button>
                <Radio.Button value="d">보관</Radio.Button>
            </Radio.Group>
        </Flex>
    );

    // const onChange = e => {
    //     console.log(`checked = ${e.target.checked}`);
    // };
    // const Check = () => <Checkbox onChange={onChange}>왕복</Checkbox>;
    //
    // const {RangePicker} = DatePicker;
    // const DatePick = () => (
    //     <Space direction="vertical" size={12} style={{marginTop: '20px'}}>
    //         <RangePicker renderExtraFooter={() => 'extra footer'}
    //                      showTime
    //                      placeholder={['PICK UP', 'DROP OFF']}
    //         />
    //         <RangePicker renderExtraFooter={() => 'extra footer'}
    //                      showTime
    //                      placeholder={['PICK UP', 'DROP OFF']}
    //         />
    //     </Space>
    // );

    const DatePick = () => {
        const [isReturnTrip, setIsReturnTrip] = useState(false);

        const {RangePicker} = DatePicker;

        const handleChange = value => {
            console.log(`selected ${value}`);
        };
        const App = () => (
            <Select
                className="select"
                defaultValue="배송지"
                style={{width: 125}}
                onChange={handleChange}
                options={[
                    {
                        label: <span>location</span>,
                        title: 'manager',
                        options: [
                            {label: <span>동대구역</span>, value: 'eastDaeguStation'},
                            {label: <span>대구역</span>, value: 'DaeguStation'},
                            {label: <span>경주역</span>, value: 'GyeongjuStation'},
                        ],
                    },
                ]}
            />
        );

        const onCheckboxChange = e => {
            setIsReturnTrip(e.target.checked);
            console.log(`checked = ${e.target.checked}`);
        };

        return (
            <Space direction="vertical" size={12} style={{marginTop: '5px'}}>
                <Checkbox onChange={onCheckboxChange}>왕복
                    <span className="speech-bubble">왕복 배송시 체크 해주세요</span>
                </Checkbox>
                <div style={{display: "flex", alignItems: "center"}}>
                    <RangePicker
                        renderExtraFooter={() => 'extra footer'}
                        showTime
                        placeholder={['PICK UP', 'DROP OFF']}
                        style={{marginTop: '5px', marginBottom: '5px'}}
                    /><App/><Cascader/>
                </div>
                {isReturnTrip && (
                    <RangePicker
                        renderExtraFooter={() => '※'}
                        showTime
                        placeholder={['PICK UP', 'DROP OFF']}
                    />
                )}
            </Space>
        );
    };

    const Counter = ({initialCount = 0, onCountChange}) => {
        const [count, setCount] = useState(initialCount);

        const increment = () => {
            setCount(prevCount => {
                const newCount = prevCount + 1;
                onCountChange(newCount); // 값이 변경될 때 부모에게 알림
                return newCount;
            });
        };

        const decrement = () => {
            setCount(prevCount => {
                const newCount = Math.max(0, prevCount - 1);
                onCountChange(newCount); // 값이 변경될 때 부모에게 알림
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

    const PaymentDisplay = ({amount}) => {
        const formattedAmount = amount.toLocaleString();
        return <span style={{
            fontSize: '30px',
            fontWeight: "bold",
            color: '#1e83f1'
        }}>{formattedAmount} 원</span>;
    };

    const LuggageForm = () => {
        const [largeCount, setLargeCount] = useState(0);
        const [middleCount, setMiddleCount] = useState(0);
        const [smallCount, setSmallCount] = useState(0);
        const [totalPayment, setTotalPayment] = useState(0);

        const largePrice = 5000; // 예시 가격
        const middlePrice = 3000;  // 예시 가격
        const smallPrice = 1000;   // 예시 가격

        const handleLargeCountChange = (count) => {
            setLargeCount(count);
        };

        const handleMiddleCountChange = (count) => {
            setMiddleCount(count);
        };

        const handleSmallCountChange = (count) => {
            setSmallCount(count);
        };

        // 짐 갯수가 변경될 때마다 총 결제 금액 업데이트
        React.useEffect(() => {
            const total = (largeCount * largePrice) + (middleCount * middlePrice) + (smallCount * smallPrice);
            setTotalPayment(total);
        }, [largeCount, middleCount, smallCount, largePrice, middlePrice, smallPrice]);
        return (
            <Form layout="horizontal">
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
        );
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
        <div className="aa">
            <h1 style={{fontSize: '1.5rem'}}>신규예약등록</h1>
            <button className="customerList">목록</button>
        </div>

        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card hoverable
                      style={{
                          // width: '500px',
                          margin: '10px 2rem',
                          height: '500px',
                          backgroundColor: '#F9F9F9',
                          // padding: '1rem',
                          // display: 'inline-flex',
                          // alignItems: 'center'
                      }}>
                    <Form.Item
                        label="구분"
                        colon={false}
                        className="separated-form-item"
                    >
                        <App/>
                    </Form.Item>
                    <Form.Item
                        label="예약일자"
                        colon={false}
                        className="separated-form-item"
                    >
                        <DatePick/>
                    </Form.Item>
                    <Form.Item
                        className="separated-form-item"
                    >
                        <LuggageForm/>
                    </Form.Item>
                </Card>
            </Col>
        </Row>

        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card hoverable
                      style={{
                          // width: '500px',
                          margin: '10px 2rem',
                          height: '250px',
                          backgroundColor: '#F9F9F9',
                          // padding: '1rem',
                          // display: 'inline-flex',
                          // alignItems: 'center'
                      }}>
                    <Form
                        // layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            name: '홍길동',
                            email: 'test@example.com',
                            age: 25,
                            phone: '010-1234-5678',
                            password: '1234'
                        }}
                        style={{width: '450px'}}>

                        <Form.Item label="예약자명"
                                   name="name"
                                   rules={[{required: true, message: '이름을 입력해주세요'}]}
                            // labelCol={{style: {width: '120px'}}} // label 너비 고정
                            // wrapperCol={{span: 16}}
                                   className="separated-form-item"
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label="이메일" name="email"
                                   rules={[{required: true, type: 'email', message: '올바른 이메일을 입력해주세요'}]}
                            // labelCol={{style: {width: '120px'}}} // label 너비 고정
                            // wrapperCol={{span: 16}}
                                   className="separated-form-item"
                        >
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
                            // labelCol={{style: {width: '120px'}}} // label 너비 고정
                            // wrapperCol={{span: 16}}
                            className="separated-form-item"
                        >
                            <Input placeholder="010-1234-5678"/>
                        </Form.Item>
                        <Form.Item label="비밀번호"
                                   name="password"
                                   rules={[{required: false, message: '비밀번호를 입력해주세요'}
                                       // {pattern: //, message: '비밀번호를 입력해주세요'}
                                   ]}
                            // labelCol={{style: {width: '120px'}}} // label 너비 고정
                            // wrapperCol={{span: 16}}
                                   className="separated-form-item"
                        >
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
                    style={{
                        width: '100px',
                        height: '35px',
                        margin: '20px 0',
                    }}
            >
                등록
            </Button>
        </div>
    </Content>);
}

export default NewReservationAddPage;