import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import supabase from '../lib/supabase';
import '../css/NoticePromotion.css';
import '../css/layout.css';
import '../css/ui.css';

function NoticeAdd() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: '공개'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('withgo_notifications').insert([formData]);

        if (!error) {
            alert('공지사항이 등록되었습니다');
            navigate('/notice-promotion');
        }
    };

    return (
        <div className="main-content">
            <div className="notice-header">공지사항 등록</div>
            <div className="notice-card">
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label>제목</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>내용</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="6"
                            required
                        />
                    </div>

                    <div className="form-group custom-select">
                        <label>공개 여부</label>
                        <div className="custom-select-wrapper">
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="공개">공개</option>
                                <option value="비공개">비공개</option>
                            </select>
                            <FontAwesomeIcon icon={faArrowDown} className="select-icon" />
                        </div>
                    </div>

                    <div className="form-button-wrapper">
                        <button type="button" className="btn-standard btn-back" onClick={() => navigate(-1)}>
                            뒤로가기
                        </button>
                        <button type="submit" className="btn-standard btn-add-confirm">
                            등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NoticeAdd;