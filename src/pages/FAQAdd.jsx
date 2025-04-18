import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import supabase from '../lib/supabase';
import '../css/faq.css';

function FAQAdd() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category: '기타',
        status: '공개'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { error } = await supabase
            .from('withgo_faqs')
            .insert([{ ...formData }]);

        if (error) {
            alert('등록에 실패했습니다');
            console.error(error);
        } else {
            alert('FAQ가 성공적으로 등록되었습니다');
            navigate('/faq');
        }
    };

    return (
        <div className="faq-main">
            <div className="faq-header">새 FAQ 등록</div>
            <div className="faq-card">
                <form onSubmit={handleSubmit} className="faq-form">
                    <div className="faq-form-group">
                        <label>질문</label>
                        <input
                            type="text"
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="faq-form-group">
                        <label>답변</label>
                        <textarea
                            name="answer"
                            value={formData.answer}
                            onChange={handleChange}
                            rows={6}
                            required
                        ></textarea>
                    </div>

                    <div className="faq-form-group">
                        <label>카테고리</label>
                        <div className="custom-select">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="배송">배송</option>
                                <option value="보관">보관</option>
                                <option value="결제">결제</option>
                                <option value="기타">기타</option>
                            </select>
                            <FontAwesomeIcon icon={faArrowDown} className="select-icon" />
                        </div>
                    </div>

                    <div className="faq-form-group">
                        <label>공개 여부</label>
                        <div className="custom-select">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="공개">공개</option>
                                <option value="숨김">숨김</option>
                            </select>
                            <FontAwesomeIcon icon={faArrowDown} className="select-icon" />
                        </div>
                    </div>

                    <div className="faq-form-button-wrapper">
                        <button
                            type="button"
                            className="btn btn-back btn-standard"
                            onClick={() => navigate(-1)}
                        >
                            뒤로가기
                        </button>
                        <button
                            type="submit"
                            className="btn btn-edit-save btn-standard"
                        >
                            등록 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FAQAdd;
