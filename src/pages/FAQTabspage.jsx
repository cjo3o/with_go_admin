import React, { useState } from 'react';
import { Radio, Input } from 'antd';
import FAQList from './FAQList';
import '../css/layout.css';
import '../css/ui.css';
import '../css/faq.css'; // 이건 FAQ 전용 스타일만! (충돌주의)

const FAQTabspage = () => {
    const [filterType, setFilterType] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const handleSearch = (value) => {
        setSearchValue(value);
    };

    return (
        <div className="wrapper">
            <div className="main-content">
                <div className="header">FAQ 관리</div>
                <div className="card">
                    <div className="top-bar">
                        <div className="title">FAQ 리스트</div>
                        <div className="tab-and-search">
                            <Radio.Group
                                defaultValue=""
                                buttonStyle="solid"
                                onChange={handleFilterChange}
                            >
                                <Radio.Button value="">전체</Radio.Button>
                                <Radio.Button value="보관">보관</Radio.Button>
                                <Radio.Button value="배송">배송</Radio.Button>
                                <Radio.Button value="결제">결제</Radio.Button>
                                <Radio.Button value="기타">기타</Radio.Button>
                            </Radio.Group>
                            <Input.Search
                                placeholder="질문 검색"
                                allowClear
                                size="middle"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onSearch={handleSearch}
                                className="search-input"
                            />
                        </div>
                    </div>

                    <FAQList filterType={filterType} searchKeyword={searchValue} />
                </div>
            </div>
        </div>
    );
};

export default FAQTabspage;
