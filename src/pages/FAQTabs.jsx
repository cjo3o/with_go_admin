import React, { useState } from 'react';
import { Radio, Input } from 'antd';
import FAQList from './FAQList';
import '../css/FAQ.css';

function FAQTabs() {
    const [filterType, setFilterType] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    return (
        <div className="wrapper">
            <div className="main">
                <div className="header">FAQ 관리</div>
                <div className="faq-card">
                    <div className="top-bar">
                        <h3>FAQ 리스트</h3>
                        <div className="tab-and-search">
                            <Radio.Group
                                defaultValue=""
                                buttonStyle="solid"
                                onChange={(e) => setFilterType(e.target.value)}
                                className="review-radio-group"
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
                                onSearch={(value) => setSearchKeyword(value)}
                                className="review-search-input"
                            />
                        </div>
                    </div>

                    <FAQList filterType={filterType} searchKeyword={searchKeyword} />
                </div>
            </div>
        </div>
    );
}

export default FAQTabs;
