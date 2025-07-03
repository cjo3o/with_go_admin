import React, {useEffect, useState} from "react";
import {
    Form,
    Input,
    InputNumber,
    Popconfirm,
    Table,
    Typography,
    Checkbox,
    Button,
    Select,
    Pagination,
    message,
    Modal,
    DatePicker,
} from "antd";
import {DeleteOutlined, EditOutlined} from "@mui/icons-material";
import {createClient} from "@supabase/supabase-js"; // ✅ Supabase 클라이언트 추가
import dayjs from "dayjs";
import {
    faAnglesLeft,
    faAnglesRight,
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import swap from "../assets/Images/swap.svg";

// import('src/lib/supabase.js')
const {Option} = Select;

// ✅ Supabase 설정
const supabase = createClient(
    "https://zgrjjnifqoactpuqolao.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0"
);

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = inputType === "number" ? <InputNumber/> : <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[{required: true, message: `Please Input ${title}!`}]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const ExcelTable = ({
                        showCheckbox,
                        combinedSearchData,
                        fetchDataByDate,
                        selectedDate,
                        refreshAll,
                    }) => {
    const [form] = Form.useForm();
    const [combinedData, setCombinedData] = useState([]);
    const [checkedRows, setCheckedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [storageLocation, setStorageLocation] = useState("");   // 보관 장소 or 출발지
    const [arriveLocation, setArriveLocation] = useState("");     // 도착지(배송)
    const [serviceType, setServiceType] = useState("");           // division 저장용

    const [partnerOptions, setPartnerOptions] = useState([]);
    const [storageOptions, setStorageOptions] = useState([]);
    const [allLocationOptions, setAllLocationOptions] = useState([]);
    const [startOptions, setStartOptions] = useState([]);
    const [endOptions, setEndOptions] = useState([]);

    // 컴포넌트 마운트 시 옵션 불러오기
    useEffect(() => {
        const fetchOptions = async () => {
            // 출발지 (partner_place)
            const {data: partnerData} = await supabase
                .from("partner_place")
                .select("name");
            // 도착지 (storage_place)
            const {data: storageData} = await supabase
                .from("storage_place")
                .select("name");

            // 출발지 옵션
            const partnerOpts = (partnerData || [])
                .map((v) => ({value: v.name, label: v.name}))
                .sort((a, b) => a.label.localeCompare(b.label, "ko-KR"));

            // 도착지 옵션
            const storageOpts = (storageData || [])
                .map((v) => ({value: v.name, label: v.name}))
                .sort((a, b) => a.label.localeCompare(b.label, "ko-KR"));

            setPartnerOptions(partnerOpts);
            setStorageOptions(storageOpts);

            // 합친 옵션(중복 제거)
            const merged = [
                ...partnerOpts.map((o) => o.label),
                ...storageOpts.map((o) => o.label),
            ];
            const unique = Array.from(new Set(merged)).sort((a, b) =>
                a.localeCompare(b, "ko-KR")
            );
            setAllLocationOptions(
                unique.map((name) => ({value: name, label: name}))
            );
        };
        fetchOptions();
    }, []);


    const totalPages = Math.ceil(combinedData.length / pageSize);

    const groupSize = 7;
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const goToFirstGroup = () => setCurrentPage(1);
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToNextGroup = () => {
        const nextGroupPage = Math.min(endPage + 1, totalPages);
        if (nextGroupPage > currentPage) setCurrentPage(nextGroupPage);
    };

    useEffect(() => {
        const sorted = [...(combinedSearchData || [])].sort(
            (a, b) =>
                new Date(b.reservationTime || b.date) -
                new Date(a.reservationTime || a.date)
        );
        setCombinedData(sorted);
        setCombinedData(combinedSearchData || []);
        setCurrentPage(1);
    }, [combinedSearchData]);

    const updateToSupabase = async (record) => {
        const table = record.division === "보관" ? "storage" : "delivery";

        const updateFields = {
            name: record.reservationName,
            phone: record.reservationPhone,
            // location: record.section,
            // reservation_time: record.reservationTime,
            situation: record.processingStatus,
        };

        // ✅ 구분에 따라 필드 다르게 설정
        if (table === "storage") {
            // 예약기간 정보가 있으면 그것을 저장
            if (record.reservationPeriod && record.reservationPeriod.includes("~")) {
                const [start, end] = record.reservationPeriod
                    .split("~")
                    .map((s) => s.trim());
                updateFields.storage_start_date = start;
                updateFields.storage_end_date = end;
            }
            // 혹은 reservationTime과 reservationEndTime이 있으면 그것을 저장
            else if (record.reservationTime && record.reservationEndTime) {
                updateFields.storage_start_date = record.reservationTime;
                updateFields.storage_end_date = record.reservationEndTime;
            }
            // 아니면 둘 다 reservationTime으로(예외 방지)
            else {
                updateFields.storage_start_date = record.reservationTime;
                updateFields.storage_end_date = record.reservationTime;
            }
        } else {
            // 배송: 단일 날짜
            updateFields.delivery_date = record.reservationTime;
            updateFields.delivery_start = record.section?.split(" → ")[0] || "";
            updateFields.delivery_arrive = record.section?.split(" → ")[1] || "";
        }

        const {error} = await supabase
            .from(table)
            .update(updateFields)
            .eq(table === "storage" ? "reservation_number" : "re_num", record.id);

        if (error) {
            console.error("Supabase 업데이트 실패:", error);
            message.error("수정 실패");
        } else {
            console.log("Supabase 업데이트 성공");
            message.success("수정 완료");
        }
    };

    const deleteFromSupabase = async (record) => {
        const table = record.division === "보관" ? "storage" : "delivery";

        let keyField;
        if (table === "storage") {
            keyField = "reservation_number";
        } else {
            keyField = "re_num";
        }

        const {error} = await supabase
            .from(table)
            .delete()
            .eq(keyField, record.id);

        if (error) {
            console.error("Supabase 삭제 실패:", error);
            message.error("삭제 실패");
        } else {
            console.log("Supabase 삭제 성공");
            message.success("삭제 성공");
        }
    };

    const fetchData = async () => {
        const {data: storage} = await supabase.from("storage").select("*");

        const formattedStorage = (storage || []).map((item, idx) => ({
            ...item,
            id: item.reservation_number,
            division: "보관",
            reservationTime: item.storage_start_date,
            section: item.location || "-",
            luggageNumber: `소 ${item.small} / 중 ${item.medium} / 대 ${item.large}`, // ✅ 보관은 소/중/대
            reservationName: item.name,
            reservationPhone: item.phone,
            date: item.storage_start_date,
            driver: "-",
            processingStatus: item.situation || "미배정",
            key: `storage-${item.id || idx}`,
            number: idx + 1,
        }));

        const {data: delivery} = await supabase.from("delivery").select("*");

        const formattedDelivery = (delivery || []).map((item, idx) => ({
            ...item,
            id: item.re_num,
            division: "배송",
            reservationTime: item.delivery_date,
            section: `${item.delivery_start} → ${item.delivery_arrive}`,
            luggageNumber: `under ${item.under ?? item.small ?? 0} / over ${item.over ?? item.large ?? 0
            }`, // ✅ 배송은 under/over (중간 없음)
            reservationName: item.name,
            reservationPhone: item.phone,
            date: item.delivery_date,
            driver: item.driver || "-",
            processingStatus: item.situation || "미배정",
            key: `delivery-${item.id || idx}`,
            number: formattedStorage.length + idx + 1,
        }));

        setCombinedData([...formattedStorage, ...formattedDelivery]);
    };

    useEffect(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const sliced = combinedData.slice(startIndex, endIndex);

        setCurrentData(sliced);
        setSelectAllChecked(sliced.every((item) => checkedRows.includes(item.key)));
    }, [combinedData, currentPage, pageSize, checkedRows, showCheckbox]);

    const handleDelete = (key) => {
        const newData = combinedData.filter((item) => item.key !== key);
        setCombinedData(newData);
    };
    const handleDeleteSelected = () => {
        if (checkedRows.length > 0) {
            setCombinedData((prevData) =>
                prevData.filter((item) => !checkedRows.includes(item.key))
            );
            setCheckedRows([]);
            setSelectAllChecked(false);
        }
    };

    const columns = [
        {
            title: showCheckbox ? (
                <Checkbox
                    checked={selectAllChecked}
                    indeterminate={
                        checkedRows.length > 0 && checkedRows.length < currentData.length
                    }
                    onChange={(e) => {
                        if (e.target.checked) {
                            const keys = currentData.map((item) => item.key);
                            setCheckedRows((prev) => [...new Set([...prev, ...keys])]);
                        } else {
                            const keys = currentData.map((item) => item.key);
                            setCheckedRows((prev) => prev.filter((k) => !keys.includes(k)));
                        }
                        setSelectAllChecked(e.target.checked);
                    }}
                />
            ) : (
                "번호"
            ),
            dataIndex: "number",
            align: "center",
            width: 60,
            fixed: "left",
            render: (_, record) =>
                showCheckbox ? (
                    <Checkbox
                        checked={checkedRows.includes(record.key)}
                        onChange={(e) => {
                            setCheckedRows((prev) =>
                                e.target.checked
                                    ? [...prev, record.key]
                                    : prev.filter((k) => k !== record.key)
                            );
                        }}
                    />
                ) : (
                    record.number
                ),
        },
        {title: "구분", dataIndex: "division", align: "center"},
        {
            title: "예약일자",
            dataIndex: "reservationTime",
            align: "center",
            render: (_, record) =>
                record.division === "보관"
                    ? record.reservationPeriod
                    : record.reservationTime,
        },
        {title: "이용구간", dataIndex: "section", align: "center", width: 200},
        {
            title: "짐갯수",
            dataIndex: "luggageNumber",
            align: "center",
            width: 200,
            responsive: ["md"],
        },
        {
            title: "예약자명",
            dataIndex: "reservationName",
            align: "center",
            width: 100,
        },
        {
            title: "연락처",
            dataIndex: "reservationPhone",
            align: "center",
            width: 140,
        },
        {title: "신청일자", dataIndex: "date", align: "center"},
        {
            title: "배정기사",
            dataIndex: "driver",
            align: "center",
            width: 100,
            responsive: ["md"],
        },
        {
            title: "처리현황",
            dataIndex: "processingStatus",
            align: "center",
            width: 100,
            render: (text, record) => <span>{record.processingStatus}</span>,
        },
        {
            title: "관리",
            dataIndex: "operation",
            align: "center",
            render: (_, record) => (
                <span>
          <Typography.Link
              onClick={() => {
                  const res = sessionStorage.getItem("role");
                  console.log(res);

                  if (res !== "관리자" && res !== "수정가능") {
                      message.error("권한이 없습니다!");
                      return
                  }
                  setEditingRecord(record);
                  setIsModalOpen(true);
                  setServiceType(record.division === "배송" ? "delivery" : "storage");

                  if (record.division === "배송") {
                      const [start, arrive] = record.section?.split("→").map(s => s.trim()) || ["", ""];
                      setStorageLocation(start);
                      setArriveLocation(arrive);
                      setStartOptions(partnerOptions);    // 이때 최신 partnerOptions 할당
                      setEndOptions(storageOptions);      // 이때 최신 storageOptions 할당
                  } else {
                      setStorageLocation(record.section || "");
                      setArriveLocation("");
                      setStartOptions(allLocationOptions); // 보관일 땐 allLocationOptions
                      setEndOptions([]);
                  }
              }}
          >
            <EditOutlined/>
          </Typography.Link>

          <Popconfirm
              title="정말 삭제하시겠습니까?"
              onConfirm={async () => {
                  const res = sessionStorage.getItem("role");
                  if (res !== "관리자" && res !== "수정가능") {
                      message.error("권한이 없습니다!");
                      return;
                  }
                  await deleteFromSupabase(record);
                  handleDelete(record.key);
              }}
          >
            <a style={{marginLeft: 8}}>
              <DeleteOutlined/>
            </a>
          </Popconfirm>
        </span>
            ),
        },
    ];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        // setSortOrder(sorter.order);
        // setSortField(sorter.field);
    };

    const handleLocationChange = (value) => {
        setStorageLocation(value);
        if (serviceType === "delivery") {
            setEditingRecord({
                ...editingRecord,
                section: `${value} → ${arriveLocation}`
            });
        } else {
            setEditingRecord({
                ...editingRecord,
                section: value
            });
        }
    };
    const handleArriveLocationChange = (value) => {
        setArriveLocation(value);
        setEditingRecord({
            ...editingRecord,
            section: `${storageLocation} → ${value}`
        });
    };
    const handleSwap = () => {
        setStorageLocation(arriveLocation);
        setArriveLocation(storageLocation);

        // 옵션도 같이 swap
        setStartOptions((prev) => endOptions);
        setEndOptions((prev) => startOptions);

        // editingRecord.section도 같이 변경
        setEditingRecord((prev) => ({
            ...prev,
            section: `${arriveLocation} → ${storageLocation}`
        }));
    };

    return (
        <>
            <Modal
                title="예약 정보 수정"
                style={{zIndex: 100}}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={async () => {
                    const prevItem = combinedData.find(
                        (i) => i.key === editingRecord.key
                    );
                    const prevStatus = prevItem?.processingStatus;
                    const operator = sessionStorage.getItem("name") || "알 수 없음";

                    await updateToSupabase(editingRecord);

                    if (prevStatus !== editingRecord.processingStatus) {
                        await supabase.from("status_logs").insert({
                            table_name:
                                editingRecord.division === "보관" ? "storage" : "delivery",
                            key_value: editingRecord.id,
                            prev_status: prevStatus,
                            new_status: editingRecord.processingStatus,
                            updated_at: new Date().toISOString(),
                            operator,
                        });
                    }

                    // 👇 수정된 부분: 부모의 새로고침 함수 호출
                    if (typeof refreshAll === "function") {
                        await refreshAll();
                    }

                    setIsModalOpen(false);
                }}
            >
                <Form layout="vertical">
                    <Form.Item label="구분">
                        <Input value={editingRecord?.division} disabled/>
                    </Form.Item>
                    <Form.Item label="예약자명">
                        <Input
                            value={editingRecord?.reservationName}
                            onChange={(e) =>
                                setEditingRecord({
                                    ...editingRecord,
                                    reservationName: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="연락처">
                        <Input
                            value={editingRecord?.reservationPhone}
                            onChange={(e) =>
                                setEditingRecord({
                                    ...editingRecord,
                                    reservationPhone: e.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="이용구간">
                        {serviceType === "delivery" ? (
                            <>
                                {/* 출발지 */}
                                <Select
                                    className="select"
                                    value={storageLocation || undefined}
                                    style={{width: 170, margin: 0}}
                                    onChange={handleLocationChange}
                                    options={startOptions}
                                    placeholder="출발지"
                                />
                                <button className="mbtn_swap" type="button" onClick={handleSwap}>
                                    <img src={swap} alt="mswap" className="swap"/>
                                </button>
                                {/* 도착지 */}
                                <Select
                                    className="select"
                                    value={arriveLocation || undefined}
                                    style={{width: 170, margin: 0}}
                                    onChange={handleArriveLocationChange}
                                    options={endOptions}
                                    placeholder="도착지"
                                />
                            </>
                        ) : (
                            <Select
                                className="select"
                                value={storageLocation || undefined}
                                style={{width: 170, margin: 0}}
                                onChange={handleLocationChange}
                                options={allLocationOptions}
                                placeholder="보관장소 선택"
                                showSearch
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="예약일자">
                        {editingRecord?.division === "보관" ? (
                            <DatePicker.RangePicker
                                style={{width: "100%"}}
                                value={
                                    editingRecord && editingRecord.reservationPeriod
                                        ? editingRecord.reservationPeriod.includes("~")
                                            ? [
                                                dayjs(
                                                    editingRecord.reservationPeriod.split("~")[0].trim()
                                                ),
                                                dayjs(
                                                    editingRecord.reservationPeriod.split("~")[1].trim()
                                                ),
                                            ]
                                            : [
                                                dayjs(editingRecord.reservationPeriod),
                                                dayjs(editingRecord.reservationPeriod),
                                            ]
                                        : null
                                }
                                onChange={(dates, dateStrings) =>
                                    setEditingRecord({
                                        ...editingRecord,
                                        reservationPeriod: `${dateStrings[0]} ~ ${dateStrings[1]}`,
                                        reservationTime: dateStrings[0], // 시작일(정렬용, 저장용)
                                        reservationEndTime: dateStrings[1], // 종료일(저장용)
                                    })
                                }
                                disabledDate={(current) =>
                                    current && current < dayjs().startOf("day")
                                }
                            />
                        ) : (
                            <DatePicker
                                style={{width: "100%"}}
                                value={
                                    editingRecord && editingRecord.reservationTime
                                        ? dayjs(
                                            editingRecord.reservationTime.includes("~")
                                                ? editingRecord.reservationTime.split("~")[0].trim()
                                                : editingRecord.reservationTime
                                        )
                                        : null
                                }
                                onChange={(date, dateString) =>
                                    setEditingRecord({
                                        ...editingRecord,
                                        reservationTime: dateString, // 단일 날짜로 저장
                                    })
                                }
                                disabledDate={(current) =>
                                    current && current < dayjs().startOf("day")
                                }
                            />
                        )}
                    </Form.Item>

                    <Form.Item label="처리현황">
                        <Select
                            defaultValue={editingRecord?.processingStatus}
                            value={editingRecord?.processingStatus}
                            onChange={(val) =>
                                setEditingRecord({...editingRecord, processingStatus: val})
                            }
                        >
                            {editingRecord?.division === "배송" ? (
                                <>
                                    <Option value="접수">접수</Option>
                                    <Option value="배송대기">배송대기</Option>
                                    <Option value="배송중">배송중</Option>
                                    <Option value="배송완료">배송완료</Option>
                                    <Option value="취소">취소</Option>
                                </>
                            ) : editingRecord?.division === "보관" ? (
                                <>
                                    <Option value="접수">접수</Option>
                                    <Option value="보관중">보관중</Option>
                                    <Option value="보관완료">보관완료</Option>
                                    <Option value="취소">취소</Option>
                                </>
                            ) : null}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Form form={form} component={false}>
                <div style={{overflowX: "auto"}}>
                    <Table
                        components={{body: {cell: EditableCell}}}
                        bordered
                        dataSource={currentData}
                        columns={columns}
                        pagination={false}
                        rowKey="key"
                        onChange={handleTableChange}
                        locale={{emptyText: "검색 결과가 없습니다."}}
                    />
                </div>

                {showCheckbox && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            padding: "8px 16px",
                        }}
                    >
                        <h3 style={{margin: 0}}>
                            체크한 게시물 {checkedRows.length}개를
                        </h3>
                        <Button
                            type="primary"
                            danger
                            disabled={checkedRows.length === 0}
                            onClick={handleDeleteSelected}
                            style={{marginLeft: 8}}
                        >
                            삭제
                        </Button>
                    </div>
                )}

                <div
                    className="pagination"
                    style={{
                        marginTop: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <button onClick={goToFirstGroup} disabled={currentGroup === 0}>
                        <FontAwesomeIcon icon={faAnglesLeft}/>
                    </button>
                    <button onClick={goToPrevPage} disabled={currentPage === 1}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>

                    {Array.from({length: endPage - startPage + 1}).map((_, i) => {
                        const pageNum = startPage + i;
                        return (
                            <button
                                key={pageNum}
                                className={`page-btn ${pageNum === currentPage ? "active" : ""
                                }`}
                                onClick={() => setCurrentPage(pageNum)}
                                style={{
                                    margin: "0 4px",
                                    padding: "6px 12px",
                                    fontWeight: pageNum === currentPage ? "bold" : "normal",
                                    backgroundColor:
                                        pageNum === currentPage ? "#1e83f1" : "white",
                                    color: pageNum === currentPage ? "white" : "#333",
                                    border: "1px solid #ddd",
                                    borderRadius: "4px",
                                }}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                    <button onClick={goToNextGroup} disabled={endPage === totalPages}>
                        <FontAwesomeIcon icon={faAnglesRight}/>
                    </button>
                </div>
            </Form>
        </>
    );
};

export default ExcelTable;
