import React, {useEffect, useState} from 'react';
import {
    Form, Input, InputNumber, Popconfirm, Table, Typography,
    Checkbox, Button, Select, Pagination, message, Modal, DatePicker
} from 'antd';
import {DeleteOutlined, EditOutlined} from "@mui/icons-material";
import {createClient} from '@supabase/supabase-js'; // ✅ Supabase 클라이언트 추가
import dayjs from 'dayjs';

// import('src/lib/supabase.js')
const {Option} = Select;

// ✅ Supabase 설정
const supabase =
    createClient('https://zgrjjnifqoactpuqolao.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncmpqbmlmcW9hY3RwdXFvbGFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNDc0NTgsImV4cCI6MjA1NjgyMzQ1OH0._Vl-6CRKdMjeDRyNoxlfect7sgusZ7L0N5OYu0a5hT0');

const EditableCell = ({editing, dataIndex, title, inputType, record, index, children, ...restProps}) => {
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
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

const ExcelTable = ({showCheckbox, combinedSearchData, filteredData}) => {
    const dataToRender = filteredData || combinedSearchData || [];

    const [form] = Form.useForm();
    const [combinedData, setCombinedData] = useState([]);
    const [checkedRows, setCheckedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [currentData, setCurrentData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    useEffect(() => {
        if (combinedSearchData?.length > 0) {
            setCombinedData(combinedSearchData);
            setCurrentPage(1);
        }
    }, [combinedSearchData]);

    const updateToSupabase = async (record) => {
        const table = record.division === '보관' ? 'storage' : 'delivery';

        const updateFields = {
            name: record.reservationName,
            phone: record.reservationPhone,
            // location: record.section,
            reservation_time: record.reservationTime,
            situation: record.processingStatus
        };

        // ✅ 구분에 따라 필드 다르게 설정
        if (table === 'storage') {
            updateFields.storage_start_date = record.date;// 🔁 실제 컬럼명 반영
            updateFields.situation = record.processingStatus;
        } else {
            updateFields.delivery_date = record.date;
            updateFields.situation = record.processingStatus;
            updateFields.delivery_start = record.section?.split(' → ')[0] || '';
            updateFields.delivery_arrive = record.section?.split(' → ')[1] || '';
        }

        const {error} = await supabase
            .from(table)
            .update(updateFields)
            .eq(
                table === 'storage' ? 'reservation_number' : 're_num',
                record.id
            );

        if (error) {
            console.error('Supabase 업데이트 실패:', error);
            message.error('수정 실패')
        } else {
            console.log('Supabase 업데이트 성공');
            message.success('수정 완료')
        }
    };

    const deleteFromSupabase = async (record) => {
        const table = record.division === '보관' ? 'storage' : 'delivery';

        let keyField;
        if (table === 'storage') {
            keyField = 'reservation_number';
        } else {
            keyField = 're_num';
        }

        const {error} = await supabase
            .from(table)
            .delete()
            .eq(keyField, record.id);

        if (error) {
            console.error('Supabase 삭제 실패:', error);
            message.error('삭제 실패')
        } else {
            console.log('Supabase 삭제 성공');
            message.success('삭제 성공')
        }
    };

    const fetchData = async () => {
        const {data: storage} = await supabase.from('storage').select('*');
        const {data: delivery} = await supabase.from('delivery').select('*');

        const formattedStorage = (storage || []).map((item, idx) => ({
            ...item,
            id: item.reservation_number,
            division: '보관',
            reservationTime: item.storage_start_date,
            section: '-',
            luggageNumber: item.small + item.medium + item.large,
            reservationName: item.name,
            reservationPhone: item.phone,
            date: item.storage_start_date,
            driver: '-',
            processingStatus: item.situation || '미배정',
            key: `storage-${item.id || idx}`,
            number: idx + 1
        }));

        const formattedDelivery = (delivery || []).map((item, idx) => ({
            ...item,
            id: item.re_num,
            division: '배송',
            reservationTime: item.delivery_date,
            section: `${item.delivery_start} → ${item.delivery_arrive}`,
            luggageNumber: item.small + item.medium + item.large,
            reservationName: item.name,
            reservationPhone: item.phone,
            date: item.delivery_date,
            driver: item.driver || '-',
            processingStatus: item.situation || '미배정',
            key: `delivery-${item.id || idx}`,
            number: formattedStorage.length + idx + 1
        }));

        setCombinedData([...formattedStorage, ...formattedDelivery]);
    };


    // ✅ 바로 이 위치에 useEffect 추가
    useEffect(() => {
        fetchData(); // 페이지 진입 시 자동 실행
    }, []);

    useEffect(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const sliced = dataToRender.slice(start, end);

        setCurrentData(sliced);
        setSelectAllChecked(sliced.every(item => checkedRows.includes(item.key)));
    }, [dataToRender, currentPage, pageSize, checkedRows, showCheckbox]);


    const handleDelete = key => {
        const newData = combinedData.filter(item => item.key !== key);
        setCombinedData(newData);
    };
    const handleDeleteSelected = () => {
        if (checkedRows.length > 0) {
            setCombinedData(prevData => prevData.filter(item => !checkedRows.includes(item.key)));
            setCheckedRows([]);
            setSelectAllChecked(false);
        }
    };

    const columns = [
        {
            title: showCheckbox ? (
                <Checkbox
                    checked={selectAllChecked}
                    indeterminate={checkedRows.length > 0 && checkedRows.length < currentData.length}
                    onChange={e => {
                        if (e.target.checked) {
                            const keys = currentData.map(item => item.key);
                            setCheckedRows(prev => [...new Set([...prev, ...keys])]);
                        } else {
                            const keys = currentData.map(item => item.key);
                            setCheckedRows(prev => prev.filter(k => !keys.includes(k)));
                        }
                        setSelectAllChecked(e.target.checked);
                    }}
                />
            ) : '번호',
            dataIndex: 'number',
            align: 'center',
            render: (_, record) => showCheckbox ? (
                <Checkbox
                    checked={checkedRows.includes(record.key)}
                    onChange={e => {
                        setCheckedRows(prev => e.target.checked
                            ? [...prev, record.key]
                            : prev.filter(k => k !== record.key));
                    }}
                />
            ) : record.number
        },
        {title: '구분', dataIndex: 'division', align: 'center'},
        {title: '예약시간', dataIndex: 'reservationTime', align: 'center'},
        {title: '이용구간', dataIndex: 'section', align: 'center', width: 200},
        {title: '짐갯수', dataIndex: 'luggageNumber', align: 'center',width: 200},
        {title: '예약자명', dataIndex: 'reservationName', align: 'center', width: 100},
        {title: '연락처', dataIndex: 'reservationPhone', align: 'center', width: 140},
        {title: '신청일자', dataIndex: 'date', align: 'center'},
        {title: '배정기사', dataIndex: 'driver', align: 'center', width: 100},
        {
            title: '처리현황',
            dataIndex: 'processingStatus',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <Select
                    defaultValue={record.processingStatus}
                    style={{width: 90}}
                    onChange={(value) => {
                        const newData = [...combinedData];
                        const index = newData.findIndex(item => item.key === record.key);
                        if (index > -1) {
                            newData[index].processingStatus = value;
                            setCombinedData(newData);
                        }
                    }}
                >
                    <Option value="미배정">미배정</Option>
                    <Option value="취소">취소</Option>
                    <Option value="처리완료">처리완료</Option>
                </Select>
            )
        },
        {
            title: '관리',
            dataIndex: 'operation',
            align: 'center',
            render: (_, record) => (
                <span>
      <Typography.Link onClick={() => {
          setEditingRecord(record);
          setIsModalOpen(true);
      }}>
        <EditOutlined/>
      </Typography.Link>

      <Popconfirm
          title="정말 삭제하시겠습니까?"
          onConfirm={async () => {
              await deleteFromSupabase(record);
              handleDelete(record.key);
          }}
      >
        <a style={{marginLeft: 8}}><DeleteOutlined/></a>
      </Popconfirm>
    </span>
            )
        },
    ];

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        // setSortOrder(sorter.order);
        // setSortField(sorter.field);
    };

    return (
        <>
            <Modal
                title="예약 정보 수정"
                style={{zIndex: 100}}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={async () => {
                    await updateToSupabase(editingRecord);
                    setCombinedData(prev =>
                        prev.map(item => item.key === editingRecord.key ? editingRecord : item)
                    );
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
                            onChange={(e) => setEditingRecord({...editingRecord, reservationName: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item label="연락처">
                        <Input
                            value={editingRecord?.reservationPhone}
                            onChange={(e) => setEditingRecord({...editingRecord, reservationPhone: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item label="이용구간">
                        <Input
                            value={editingRecord?.section}
                            onChange={(e) => setEditingRecord({...editingRecord, section: e.target.value})}
                        />
                    </Form.Item>
                    {/*<Form.Item label="예약시간">*/}
                    {/*    <Input*/}
                    {/*        value={editingRecord?.reservationTime}*/}
                    {/*        onChange={(e) => setEditingRecord({...editingRecord, reservationTime: e.target.value})}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                    <Form.Item label="신청일자">
                        <DatePicker
                            style={{width: '100%'}}
                            value={editingRecord?.date ? dayjs(editingRecord.date) : null}
                            onChange={(date, dateString) => setEditingRecord({...editingRecord, date: dateString})}
                        />
                    </Form.Item>
                    <Form.Item label="처리현황">
                        <Select
                            defaultValue={editingRecord?.processingStatus}
                            value={editingRecord?.processingStatus}
                            onChange={(val) =>
                                setEditingRecord({ ...editingRecord, processingStatus: val })
                            }
                        >
                            <Option value="미배정">미배정</Option>
                            <Option value="취소">취소</Option>
                            <Option value="처리완료">처리완료</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Form form={form} component={false}>
                <Table
                    components={{body: {cell: EditableCell}}}
                    bordered
                    dataSource={currentData}
                    columns={columns}
                    pagination={false}
                    rowKey="key"
                    onChange={handleTableChange}
                />

                {showCheckbox && (
                    <div style={{display: 'flex', justifyContent: 'flex-start', padding: '8px 16px'}}>
                        <h3 style={{margin: 0}}>체크한 게시물 {checkedRows.length}개를</h3>
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

                <Pagination
                    current={currentPage}
                    pageSize={10}
                    total={combinedData.length}
                    showSizeChanger={false}
                    style={{display: 'flex', justifyContent: 'center', marginTop: 16, marginBottom: 20}}
                    onChange={(page, newPageSize) => {
                        setCurrentPage(page);
                        setPageSize(newPageSize);
                    }}
                />
            </Form>
        </>
    );
};


export default ExcelTable;
