import React, { useState } from 'react';
import { Radio, Input } from 'antd';
import FAQList from './FAQList';
import '../css/faq.css';

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
        <div className="faq-tabs-wrapper">
            <div className="faq-main">
                <div className="faq-header">FAQ 관리</div>
                <div className="faq-card">
                    <div className="faq-top-bar">
                        <h3>FAQ 리스트</h3>
                        <div className="faq-tab-search">
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
                                className="faq-search-input"
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