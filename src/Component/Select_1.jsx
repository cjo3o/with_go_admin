import React from 'react';
import { Select, Space } from 'antd';
import('../css/Reservation.css')

const handleChange = value => {
    console.log(`selected ${value}`);
};

const App = () => (
    <Space
        wrap
        className="select_1"
        style={{ borderRadius: 5 }}
    >
        <Select
            defaultValue="최근등록순"
            style={{ width: 130, height: 40}}
            onChange={handleChange}
            options={[
                { value: '최근등록순', label: '최근등록순' },
                // { value: '번호내림차순', label: '번호내림차순' },
                { value: '기사이름순', label: '기사이름순' },
                // { value: '', label: 'Disabled' },
            ]}
        />
    </Space>
);
export default App;