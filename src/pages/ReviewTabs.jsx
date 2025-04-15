import React, { useState } from 'react';
import { Radio } from 'antd';
import ReviewTable from './ReviewTable';
import Sidebar from '../layouts/Sidebar';
import '../css/Review.css';
import '../css/ReviewWrapper.css';

const ReviewTabs = () => {
    const [filterType, setFilterType] = useState('');

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    return (
        <div className="wrapper">
            <div className="main">
                <div className="header">이용후기 관리</div>
                <div className="card">
                    <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3>이용후기 리스트</h3>
                        <Radio.Group
                            defaultValue=""
                            buttonStyle="solid"
                            onChange={handleFilterChange}
                        >
                            <Radio.Button value="">전체</Radio.Button>
                            <Radio.Button value="보관">보관</Radio.Button>
                            <Radio.Button value="배송">배송</Radio.Button>
                        </Radio.Group>
                    </div>
                    <ReviewTable filterType={filterType} />
                </div>
            </div>
        </div>
    );
};

export default ReviewTabs;