import React from 'react';
import {Form, Input, Button, Modal, Layout, message} from "antd";
import supabase from "../lib/supabase.js";
import bcrypt from "bcryptjs";
import {useNavigate} from "react-router-dom";

function Login(props) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loginModal, setLoginModal] = React.useState(true);
    const onFinish = async ({email,password}) => {
        const {data, error} = await supabase
            .from("employees")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !data) {
            message.error('이메일 또는 비밀번호가 일치하지 않습니다.');
            return;
        }
        const isValid = await bcrypt.compare(password, data.password); // 해시 비교

        if (!isValid) {
            message.error('비밀번호가 일치하지 않습니다.');
            return;
        }

        message.success('로그인 성공');
        setLoginModal(false);
        navigate("/");
    }
    return (
        <>
            <Modal
                width="25%"
                title="로그인"
                open={loginModal}
                onOk={() => form.submit()}
                closable={false}
                footer={[
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        로그인
                    </Button>
                ]
                }>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="이메일"
                        name="email"
                        rules={[{
                            required: true,
                            type: "email",
                            message: ('이메일을 확인해주세요.')
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="패스워드"
                        name="password"
                        rules={[{
                            required: true,
                            message: ('패스워드를 확인해주세요.')
                        }]}
                    >
                        <Input.Password/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Login;