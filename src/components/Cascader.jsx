import React from 'react';
import {Cascader} from 'antd';

const options = [
    {
        value: 'Daegu',
        label: <span>대구</span>,
        children: [
            {
                value: 'Daego-center',
                label: '중구',
            },
            {
                value: 'Daego-All',
                label: '동구',
            },
            {
                value: 'Daego-All',
                label: '서구'
            },
            // children: [
            //     {
            //         value: '',
            //         label: 'West Lake',
            //     },
            // ],
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
];
const onChange = value => {
    console.log(value);
};
// Just show the latest item.
const displayRender = labels => labels[labels.length - 1];
const App = () => (
    <Cascader
        options={options}
        expandTrigger="hover"
        displayRender={displayRender}
        onChange={onChange}
    />
);
export default App;