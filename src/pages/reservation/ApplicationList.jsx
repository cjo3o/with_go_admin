import React, { useEffect, useState } from 'react';
import { Button, Layout, Tabs, DatePicker, Select, Input, Space, message } from 'antd';
import ExcelTable from "../../components/ExcelTable.jsx";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Content } = Layout;

function ApplicationList() {
    const [currentTab, setCurrentTab] = useState('all');
    const [combinedData, setCombinedData] = useState([]);
    const [searchField, setSearchField] = useState('예약자명');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const mockData = [
                {
                    id: 1,
                    division: '배송',
                    processingStatus: '미배정',
                    reservationName: '홍길동',
                    reservationPhone: '010-1234-5678',
                    date: '2025-04-29',
                    driver: '김기사'
                },
                {
                    id: 2,
                    division: '보관',
                    processingStatus: '처리완료',
                    reservationName: '이순신',
                    reservationPhone: '010-2345-6789',
                    date: '2025-04-28',
                    driver: '-'
                },
                {
                    id: 3,
                    division: '배송',
                    processingStatus: '취소',
                    reservationName: '강감찬',
                    reservationPhone: '010-3456-7890',
                    date: '2025-04-27',
                    driver: '박기사'
                }
            ];

            const dataWithKey = mockData.map((item, index) => ({
                ...item,
                key: item.id || `mock-${index}`
            }));

            setCombinedData(dataWithKey);
        };

        fetchData();
    }, []);


    const getFilteredResults = (tabKey) => {
        const baseData = searchResults.length > 0 ? searchResults : combinedData;

        if (tabKey === 'delivery') {
            return baseData.filter(d => d.division === '배송' && d.processingStatus !== '취소');
        }
        if (tabKey === 'storage') {
            return baseData.filter(d => d.division === '보관' && d.processingStatus !== '취소');
        }
        if (tabKey === 'cancel') {
            return baseData.filter(d => d.processingStatus === '취소');
        }
        return baseData.filter(d => d.processingStatus !== '취소');
    };

    const counts = {
        all: combinedData.filter(d => d.processingStatus !== '취소').length,
        delivery: combinedData.filter(d => d.division === '배송' && d.processingStatus !== '취소').length,
        storage: combinedData.filter(d => d.division === '보관' && d.processingStatus !== '취소').length,
        cancel: combinedData.filter(d => d.processingStatus === '취소').length
    };

    const handleSearch = () => {
        const keyword = searchKeyword.toLowerCase();

        const filtered = combinedData.filter(item => {
            const inDateRange = !dateRange.length || (
                item.date >= dateRange[0].format('YYYY-MM-DD') &&
                item.date <= dateRange[1].format('YYYY-MM-DD')
            );

            const inKeyword = !keyword || (() => {
                if (searchField === '예약자명') return item.reservationName.toLowerCase().includes(keyword);
                if (searchField === '연락처') return item.reservationPhone.includes(keyword);
                if (searchField === '배정기사명') return item.driver.toLowerCase().includes(keyword);
                return false;
            })();

            return inDateRange && inKeyword;
        });

        if (filtered.length === 0) {
            message.warning("검색 결과가 없습니다.");
        }

        setSearchResults(filtered);
    };

    return (
        <Content>
            <div className="main">
                <div className="header">
                    <h3>예약관리</h3>
                </div>
                <div className="card">
                    <div
                        className="title"
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    >
                        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>예약신청목록</h1>
                        <Button type="primary" href="/NewReservationAddPage">신규예약등록</Button>
                    </div>
                    <div className="content_middle" style={{ padding: '0 20px' }}>
                        <div className="content_middle_two" style={{ marginTop: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 20 }}>
                                <RangePicker
                                    onChange={(dates) => setDateRange(dates)}
                                    style={{ width: 240 }}
                                />
                                <Select
                                    value={searchField}
                                    onChange={setSearchField}
                                    style={{ width: 140 }}
                                >
                                    <Option value="예약자명">예약자명</Option>
                                    <Option value="연락처">연락처</Option>
                                    <Option value="배정기사명">배정기사명</Option>
                                </Select>
                                <Input
                                    placeholder="검색어 입력"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    style={{ width: 200 }}
                                />
                                <Button type="primary" onClick={handleSearch}>검색</Button>
                            </div>

                            <Tabs
                                activeKey={currentTab}
                                onChange={setCurrentTab}
                                items={[
                                    {
                                        label: `전체 (${counts.all})`,
                                        key: 'all',
                                        children: <ExcelTable showCheckbox={false} combinedSearchData={getFilteredResults('all')} />,
                                    },
                                    {
                                        label: `배송 (${counts.delivery})`,
                                        key: 'delivery',
                                        children: <ExcelTable showCheckbox={false} combinedSearchData={getFilteredResults('delivery')} />,
                                    },
                                    {
                                        label: `보관 (${counts.storage})`,
                                        key: 'storage',
                                        children: <ExcelTable showCheckbox={false} combinedSearchData={getFilteredResults('storage')} />,
                                    },
                                    {
                                        label: `취소 (${counts.cancel})`,
                                        key: 'cancel',
                                        children: <ExcelTable showCheckbox={false} combinedSearchData={getFilteredResults('cancel')} />,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    );
}

export default ApplicationList;