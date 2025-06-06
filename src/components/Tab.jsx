import React from 'react';
import { Tabs } from 'antd';
const onChange = key => {
    console.log(key);
};
const App = () => (
    <Tabs
        onChange={onChange}
        type="card"
        items={Array.from({ length: 3 }).map((_, i) => {
            const id = String(i + 1);
            return {
                label: `Tab ${id}`,
                key: id,
                children: `Content of Tab Pane ${id}`,
            };
        })}
    />
);
export default App;