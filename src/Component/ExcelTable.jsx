import {DeleteOutlined, EditOutlined} from "@mui/icons-material";

var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                    resolve(value);
                });
        }

        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }

            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }

            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }

            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __rest =
    (this && this.__rest) ||
    function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
import React, {useState} from 'react';
import {Form, Input, InputNumber, Popconfirm, Table, Typography} from 'antd';

const originData = Array.from({length: 100}).map((_, i) => ({
    key: i.toString(),
    name: `Edward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
}));
const EditableCell = _a => {
    var {editing, dataIndex, title, inputType, record, index, children} = _a,
        restProps = __rest(_a, [
            'editing',
            'dataIndex',
            'title',
            'inputType',
            'record',
            'index',
            'children',
        ]);
    const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{margin: 0}}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const App = () => {
    const [dataSource, setDataSource] = useState([0])
    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = record => record.key === editingKey;
    const edit = record => {
        form.setFieldsValue(Object.assign({
            number: '',
            division: '',
            reservationTime: '',
            section: '',
            luggageNumber:'',
            reservationName:'',
            reservationPhone:'',
            date:'',
            processingStatus:''
        }, record));
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = key =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const row = yield form.validateFields();
                const newData = [...data];
                const index = newData.findIndex(item => key === item.key);
                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, Object.assign(Object.assign({}, item), row));
                    setData(newData);
                    setEditingKey('');
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey('');
                }
            } catch (errInfo) {
                console.log('Validate Failed:', errInfo);
            }
        });
    const handleDelete = key => {
        const newData = dataSource.filter(item => item.key !== key);
        setDataSource(newData);
    };
    const columns = [
        {
            title: '번호',
            dataIndex: 'number',
            width: '60px',
            align: 'center',
            editable: true,
        },
        {
            title: '구분',
            dataIndex: 'division',
            width: '60px',
            align: 'center',
            editable: true,
        },
        {
            title: '예약시간',
            dataIndex: 'reservationTime',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '이용구간',
            dataIndex: 'section',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '짐갯수',
            dataIndex: 'luggageNumber',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '예약자명',
            dataIndex: 'reservationName',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '연락처',
            dataIndex: 'reservationPhone',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '신청일자',
            dataIndex: 'date',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '담당기사',
            dataIndex: 'delivery-driver',
            width: '200px',
            align: 'center',
            editable: true,
        },
        {
            title: '처리현황',
            dataIndex: 'processingStatus',
            width: '90px',
            align: 'center',
            editable: true,
        },
        {
            title: '관리',
            dataIndex: 'operation',
            width: '95px',
            align: 'center',
            render: (_, record) => {
                const editable = isEditing(record);

                if (editable) {
                    return (
                        <span>
          <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
            저장
          </Typography.Link>
          <Popconfirm title="취소하시겠습니까?" onConfirm={cancel}>
            <a>취소</a>
          </Popconfirm>
        </span>
                    );
                } else {
                    return (
                        <span>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            <EditOutlined />
          </Typography.Link>
          <Popconfirm title="삭제하시겠습니까?" onConfirm={() => handleDelete(record.key)}>
            <a style={{ marginLeft: 5 }}><DeleteOutlined /></a>
          </Popconfirm>
        </span>
                    );
                }
            },
        },
    ];
    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return Object.assign(Object.assign({}, col), {
            onCell: record => ({
                record,
                inputType: col.dataIndex === 'number' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        });
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {cell: EditableCell},
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{onChange: cancel}}
            />
        </Form>
    );
};
export default App;