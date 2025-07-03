import React, { useState, useEffect } from "react";
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
  DatePicker,
  Space,
  Select,
  Radio,
  Divider,
  Checkbox,
} from "antd";
import dayjs from "dayjs";

import supabase from "../../lib/supabase.js";
import { useNavigate } from "react-router-dom";
// import LocationCascader from '../../components/Cascader';

import "../../css/NewReservationAdd.css";

import swap from "../../assets/Images/swap.svg";
import PaymentSuccessPage from "../../components/PaymentSuccessPage.jsx";

const { Content } = Layout;

const Counter = ({ value = 0, onChange, checkLocation }) => {
  const increment = () => {
    if (checkLocation && !checkLocation()) return;
    onChange(value + 1);
  };
  const decrement = () => {
    if (checkLocation && !checkLocation()) return;
    onChange(Math.max(0, value - 1));
  };

  return (
    <div
      style={{
        padding: "5px",
        display: "flex",
        alignItems: "center",
        width: "100px",
      }}
    >
      <button
        onClick={decrement}
        style={{
          fontSize: "20px",
          padding: "0 10px",
          backgroundColor: "#f0f0f0",
          color: "#333",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        -
      </button>
      <div
        style={{
          fontSize: "20px",
          width: "40px",
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        {value}
      </div>
      <button
        onClick={increment}
        style={{
          fontSize: "20px",
          padding: "0 10px",
          backgroundColor: "#f0f0f0",
          color: "#333",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
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
  const [serviceType, setServiceType] = useState("delivery");
  const [largeCount, setLargeCount] = useState(0);
  const [middleCount, setMiddleCount] = useState(0);
  const [smallCount, setSmallCount] = useState(0);
  const [underCount, setunderCount] = useState(0);
  const [overCount, setoverCount] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [storageDates, setStorageDates] = useState(null); // 보관 기간 상태 선언 (추가)
  // const [deliveryDates, setDeliveryDates] = useState(null);
  const [detailAddress, setDetailAddress] = useState("");
  const [cascaderValue, setCascaderValue] = useState([]);
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);

  const [isComposing, setIsComposing] = useState(false);

  const checkLocation = () => {
    if (serviceType === "delivery" && (!storageLocation || !arriveLocation)) {
      message.warning("출발지와 도착지를 모두 선택해주세요.");
      return false;
    }
    return true;
  };

  const handleCascaderChange = (value) => {
    setCascaderValue(value); // 선택한 지역구 값 저장
  };

  const handleDetailAddressChange = (e) => {
    const val = e.target.value;
    setDetailAddress(val);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e) => {
    setIsComposing(false);
    setDetailAddress(e.target.value);
  };
  const [storageLocation, setStorageLocation] = useState("");
  const [arriveLocation, setArriveLocation] = useState(""); // 도착지 선택값
  const [arriveOptions, setArriveOptions] = useState([]); // 도착지 옵션
  const [allLocationOptions, setAllLocationOptions] = useState([]);
  const [partnerPlaceList, setPartnerPlaceList] = useState([]);
  const [storagePlaceList, setStoragePlaceList] = useState([]);

  function getAddressByName(name) {
    const found =
      partnerPlaceList.find((p) => p.name === name) ||
      storagePlaceList.find((p) => p.name === name);
    return found ? found.address : "";
  }

  function getRegion(address) {
    if (!address) return "";
    if (address.includes("대구")) return "daegu";
    if (address.includes("경주")) return "gyeongju";
    return "";
  }

  const { RangePicker } = DatePicker;

  const largePrice = 5000;
  const middlePrice = 3000;
  const smallPrice = 1000;
  const deliveryPrices = {
    same: {
      under: 10000,
      over: 20000,
    },
    different: {
      under: 15000,
      over: 25000,
    },
  };

  const undercountchange = (count) => {
    setunderCount(count);
  };

  const overcountchange = (count) => {
    setoverCount(count);
  };

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
    async function fetchPlaces() {
      const [partnerRes, storageRes] = await Promise.all([
        supabase.from("partner_place").select("name,address"),
        supabase.from("storage_place").select("name,address"),
      ]);
      // 둘 다 정상적으로 받아왔을 때만 처리
      if (!partnerRes.error && !storageRes.error) {
        setPartnerPlaceList(partnerRes.data);
        setStoragePlaceList(storageRes.data);

        const merged = [
          ...partnerRes.data.map((place) => ({
            label: place.name,
            value: place.name,
          })),
          ...storageRes.data.map((place) => ({
            label: place.name,
            value: place.name,
          })),
        ];
        setAllLocationOptions(
          [
            ...partnerRes.data.map((place) => ({
              label: place.name,
              value: place.name,
            })),
            ...storageRes.data.map((place) => ({
              label: place.name,
              value: place.name,
            })),
          ].sort((a, b) => a.label.localeCompare(b.label, "ko"))
        );
        setLocationOptions(
          partnerRes.data
            .map((place) => ({
              label: place.name,
              value: place.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, "ko"))
        );
        setArriveOptions(
          storageRes.data
            .map((place) => ({
              label: place.name,
              value: place.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label, "ko"))
        );
      } else {
        message.error("장소 목록 불러오기 실패");
      }
    }
    fetchPlaces();
  }, []);

  const placeOptions = [
    { label: "출발지", value: "", className: "hide-option" },
    ...locationOptions,
  ];

  const displayArriveOptions =
    arriveLocation === ""
      ? [{ label: "도착지", value: "" }, ...arriveOptions]
      : arriveOptions;

  useEffect(() => {
    let total;
    if (serviceType === "delivery") {
      // 실제 출발지/도착지 주소 추출
      const startAddress = getAddressByName(storageLocation);
      const arriveAddress = getAddressByName(arriveLocation);

      const startRegion = getRegion(startAddress);
      const arriveRegion = getRegion(arriveAddress);

      // 둘 다 대구/경주일 때만 정상 요금, 아니면 0원
      let priceSet = deliveryPrices.same;
      if (startRegion && arriveRegion) {
        priceSet =
          startRegion === arriveRegion
            ? deliveryPrices.same
            : deliveryPrices.different;
        total = underCount * priceSet.under + overCount * priceSet.over;
      } else {
        total = 0; // 입력이 덜 됐을 때(주소 없음)
      }
    } else {
      // 🏢 보관 계산 (기존)
      total =
        largeCount * largePrice +
        middleCount * middlePrice +
        smallCount * smallPrice;
    }
    setTotalPayment(total);
  }, [
    largeCount,
    middleCount,
    smallCount,
    overCount,
    underCount,
    largePrice,
    middlePrice,
    smallPrice,
    serviceType,
    storageLocation,
    arriveLocation, // <--- **cascaderValue 말고 arriveLocation!!**
    partnerPlaceList,
    storagePlaceList,
  ]);

  const handleTossPayment = (values) => {
    if (!window.TossPayments) {
      message.error("결제 모듈이 로드되지 않았습니다.");
      return;
    }

    const orderName =
      serviceType === "delivery" ? "배송 예약 결제" : "보관 예약 결제";
    const amount = totalPayment;
    const orderId = "order_" + new Date().getTime();

    window
      .TossPayments("test_ck_24xLea5zVAEGe4ONABL7VQAMYNwW")
      .requestPayment("카드", {
        amount,
        orderId,
        orderName,
        customerName: values.name,
        successUrl: `${window.location.origin}/payment-success?type=${serviceType}&orderId=${orderId}`,
        failUrl: `${window.location.origin}/payment-fail`,
      });
  };

  const onFinish = async (values) => {
    if (serviceType === "storage") {
      if (!storageDates || !storageDates[0] || !storageDates[1]) {
        message.warning("보관 시작/종료 날짜를 선택해주세요");
        return;
      }
    } else if (serviceType === "delivery") {
      if (!storageDates || !storageDates[0]) {
        message.warning("배송 날짜를 선택해주세요");
        return;
      }
    }

    let reservationData = {};
    if (serviceType === "storage") {
      reservationData = {
        name: values.name,
        phone: values.phone,
        small: smallCount,
        medium: middleCount,
        large: largeCount,
        price: totalPayment,
        situation: "접수",
        location: storageLocation,
        storage_start_date: storageDates[0].format("YYYY-MM-DD"),
        storage_end_date: storageDates[1].format("YYYY-MM-DD"),
      };
    } else {
      reservationData = {
        name: values.name,
        phone: values.phone,
        price: totalPayment,
        delivery_date: storageDates[0].format("YYYY-MM-DD"),
        delivery_start: storageLocation,
        delivery_arrive:
          arriveLocation + (detailAddress ? " " + detailAddress : ""),
        under: underCount,
        over: overCount,
      };
    }
    // 결제 성공 후 DB 저장용
    localStorage.setItem("reservation_data", JSON.stringify(reservationData));

    handleTossPayment(values);
  };

  const resetAllInputs = () => {
    form.resetFields(); // 폼 모든 값 초기화 (예약자명, 이메일, 연락처 등)
    setStorageDates(null); // 날짜 초기화
    setStorageLocation(""); // 출발지 초기화
    setArriveLocation(""); // 도착지 초기화
    setLargeCount(0);
    setMiddleCount(0);
    setSmallCount(0);
    setTotalPayment(0);
    setCascaderValue([]);
    setDetailAddress("");
    setLargeCount(0);
    setMiddleCount(0);
    setSmallCount(0);
    setoverCount(0);
    setunderCount(0);
    // 필요한 입력값 모두 여기서 초기화
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
    setIsReturnTrip(false); // 서비스 타입 변경 시 왕복 체크 해제
    resetAllInputs();
  };

  const handleLocationChange = (value) => {
    setStorageLocation(value);
    // 선택된 위치에 따른 상태 업데이트 또는 로직 처리
  };

  const PaymentDisplay = ({ amount }) => {
    const formattedAmount = amount.toLocaleString();
    return (
      <span style={{ fontSize: "30px", fontWeight: "bold", color: "#1e83f1" }}>
        {formattedAmount} 원
      </span>
    );
  };

  const handleGoToList = () => {
    Modal.confirm({
      title: "목록으로 이동하시겠습니까?",
      content: "작성 중인 내용이 사라질 수 있습니다.",
      onOk: () => navigate("/ApplicationList"),
    });
  };

  const handleSwap = () => {
    // 선택값 교환
    setStorageLocation(arriveLocation);
    setArriveLocation(storageLocation);

    // 옵션배열 교환
    setLocationOptions(arriveOptions);
    setArriveOptions(locationOptions);
  };

  const ReservationDatePicker = () => (
    <Space direction="vertical" size={12} style={{ marginTop: "5px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          width: "100%",
        }}
      >
        {serviceType === "delivery" ? (
          <DatePicker
            value={storageDates ? storageDates[0] : null}
            placeholder="배송일"
            style={{ width: "180px", marginTop: "5px", marginBottom: "5px" }}
            onChange={(date) => setStorageDates(date ? [date] : null)}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        ) : (
          <RangePicker
            value={storageDates}
            placeholder={["보관 시작", "보관 종료"]}
            style={{ width: "350px", marginTop: "5px", marginBottom: "5px" }}
            onChange={(dates) => setStorageDates(dates)}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        )}
      </div>
    </Space>
  );

  return (
    <Content>
      <div className="main">
        <div className="header">
          <div>예약관리</div>
        </div>
        <div className="card">
          <div
            className="title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            신규예약등록
            <Button className="customerList" onClick={handleGoToList}>
              목록
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                styles={{
                  body: { padding: 0, paddingTop: 20 },
                }}
                style={{
                  marginBottom: "2rem",
                  height: "auto",
                  backgroundColor: "#F9F9F9",
                }}
              >
                <Form layout="horizontal">
                  <Form.Item
                    label="구분"
                    colon={false}
                    className="separated-form-item"
                  >
                    <Radio.Group
                      defaultValue={serviceType}
                      size="middle"
                      onChange={handleServiceTypeChange}
                    >
                      <Radio.Button value="delivery">배송</Radio.Button>
                      <Radio.Button value="storage">보관</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Divider
                    style={{
                      margin: "12px 0",
                      borderColor: "rgba(217,217,217,0.5)",
                    }}
                  />
                  <Form.Item
                    label={serviceType === "delivery" ? "예약일자" : "보관기간"}
                    colon={false}
                    className="separated-form-item"
                  >
                    <ReservationDatePicker />
                    {serviceType === "delivery" ? (
                      <>
                        {/* 배송: 출발지, swap, 도착지 */}
                        <Select
                          className="select"
                          value={storageLocation || undefined}
                          style={{ width: 180 }}
                          onChange={handleLocationChange}
                          options={locationOptions}
                          placeholder="출발지"
                        />
                        <button className="btn_swap" onClick={handleSwap}>
                          <img src={swap} alt="swap" className="swap" />
                        </button>
                        <Select
                          className="select"
                          value={arriveLocation || undefined}
                          style={{ width: 180 }}
                          onChange={setArriveLocation}
                          options={arriveOptions}
                          placeholder="도착지"
                        />
                      </>
                    ) : (
                      // 보관: 장소 선택 Select 한 개, 옵션은 합쳐진 allLocationOptions
                      <Select
                        className="select"
                        value={storageLocation || undefined}
                        style={{ width: 180 }}
                        onChange={handleLocationChange}
                        options={allLocationOptions}
                        placeholder="보관장소 선택"
                      />
                    )}
                  </Form.Item>
                  <Divider
                    style={{
                      margin: "12px 0",
                      borderColor: "rgba(217,217,217,0.5)",
                    }}
                  />
                  <Form.Item
                    label="짐갯수"
                    colon={false}
                    className="separated-form-item"
                  >
                    {serviceType === "delivery"
                      ? // 🚚 배송일 때 (over, under만)
                        [
                          {
                            label: "26인치 이상",
                            value: overCount,
                            onChange: setoverCount,
                          },
                          {
                            label: "26인치 미만",
                            value: underCount,
                            onChange: setunderCount,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ width: "120px" }}>{item.label}</span>
                            <Counter
                              value={item.value}
                              onChange={item.onChange}
                              checkLocation={checkLocation}
                            />
                          </div>
                        ))
                      : // 🏢 보관일 때 (대, 중, 소)
                        [
                          {
                            label: "대(30인치 이상)",
                            value: largeCount,
                            onChange: setLargeCount,
                          },
                          {
                            label: "중(21~29인치)",
                            value: middleCount,
                            onChange: setMiddleCount,
                          },
                          {
                            label: "소(20인치 이하)",
                            value: smallCount,
                            onChange: setSmallCount,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ width: "120px" }}>{item.label}</span>
                            <Counter
                              value={item.value}
                              onChange={item.onChange}
                            />
                          </div>
                        ))}
                  </Form.Item>
                  <Divider
                    style={{
                      margin: "12px 0",
                      borderColor: "rgba(217,217,217,0.5)",
                    }}
                  />
                  <Form.Item
                    label="결제금액"
                    colon={false}
                    className="separated-form-item"
                  >
                    <PaymentDisplay amount={totalPayment} />
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                styles={{
                  body: { padding: 0, paddingTop: 20 },
                }}
                style={{
                  marginBottom: "1rem",
                  height: "auto",
                  backgroundColor: "#F9F9F9",
                }}
              >
                <Form
                  form={form}
                  layout="horizontal"
                  onFinish={onFinish}
                  initialValues={{
                    name: "",
                    email: "",
                    phone: "",
                  }}
                  style={{ width: "100%" }}
                >
                  <Form.Item
                    label="예약자명"
                    name="name"
                    rules={[
                      { required: true, message: "예약자명을 입력해주세요" },
                    ]}
                    className="separated-form-item"
                  >
                    <Input placeholder="ex) 홍길동" style={{ width: "100%" }} />
                  </Form.Item>
                  <Divider
                    style={{
                      margin: "16px 0",
                      borderTop: "1px solid #d9d9d9",
                      width: "100%",
                      borderColor: "rgba(217,217,217,0.5)",
                    }}
                  />
                  <Form.Item
                    label="연락처"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "전화번호를 입력해주세요 예시 010-1234-1234",
                      },
                      {
                        pattern: /^01[016789]-\d{3,4}-\d{4}$/,
                        message: "유효한 전화번호 형식이 아닙니다",
                      },
                    ]}
                    className="separated-form-item"
                  >
                    <Input
                      placeholder="010-1234-5678"
                      style={{ width: "100%" }}
                      onChange={e => {
                        let num = e.target.value.replace(/[^0-9]/g, "");
                        if (num.length < 4) {
                          form.setFieldsValue({ phone: num });
                        } else if (num.length < 8) {
                          form.setFieldsValue({ phone: `${num.slice(0, 3)}-${num.slice(3)}` });
                        } else {
                          form.setFieldsValue({
                            phone: `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`
                          });
                        }
                      }}
                      maxLength={13}
                    />
                  </Form.Item>
                  <Form.Item
                    label="필수안내"
                    name="essential"
                    valuePropName="checked"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject("필수 안내에 동의하셔야 합니다."),
                      },
                    ]}
                    className="separated-form-item"
                  >
                    <Checkbox>
                      {serviceType === "delivery"
                        ? "배송이 시작되면 취소/환불 불가함을 안내하셨습니까?"
                        : "물건을 보관장소에 맡긴 후에는 취소/환불 불가함을 안내하셨습니까?"}
                    </Checkbox>
                  </Form.Item>
                </Form>
              </Card>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={loading}
                  style={{
                    width: "100px",
                    height: "40px",
                  }}
                >
                  결제진행
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Content>
  );
}

export default NewReservationAddPage;
