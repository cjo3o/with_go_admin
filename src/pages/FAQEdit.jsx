import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import supabase from '../lib/supabase';
import '../css/NoticePromotion.css';
import '../css/layout.css';
import '../css/ui.css';

function NoticeEdit() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: '공개'
    });

    useEffect(() => {
        const fetchNotice = async () => {
            const { data, error } = await supabase
                .from('withgo_notifications')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setFormData(data);
            }
        };
        fetchNotice();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('withgo_notifications')
            .update(formData)
            .eq('id', id);

        if (!error) {
            alert('공지사항이 수정되었습니다');
            navigate('/notice-promotion');
        }
    };

    return (
        <div className="main-content">
            <div className="notice-header">공지사항 수정</div>
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
                        <button type="submit" className="btn-standard btn-edit-confirm">
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NoticeEdit;