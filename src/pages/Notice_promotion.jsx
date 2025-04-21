import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Checkbox} from 'antd';
import supabase from '../lib/supabase';
import '../css/ui.css';
import '../css/NoticePromotion.css';

function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            const {data, error} = await supabase
                .from('withgo_notifications')
                .select('*')
                .order('created_at', {ascending: false});

            if (!error) setNotices(data);
        };
        fetchNotices();
    }, []);

    const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

    const truncate = (text, length = 40) => {
        const noLineBreaks = text.replace(/[\r\n]+/g, ' ');
        return noLineBreaks.length > length
            ? noLineBreaks.slice(0, length) + '...'
            : noLineBreaks;
    };


    const handleSelect = (checked, id) => {
        setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((item) => item !== id));
    };

    const handleSelectAll = (checked) => {
        setSelectedIds(checked ? notices.map((n) => n.id) : []);
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm('선택한 공지를 삭제하시겠습니까?')) return;

        const {error} = await supabase
            .from('withgo_notifications')
            .delete()
            .in('id', selectedIds);

        if (!error) {
            setNotices((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
            setSelectedIds([]);
        }
    };

    return (
        <div className="notice-main">
            <div className="notice-header">공지사항 관리</div>
            <div className="notice-card">
                <div className="top-bar">
                    <h3>공지사항 목록</h3>
                </div>

                <table className="notice-table">
                    <thead>
                    <tr>
                        <th>
                            <Checkbox
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                checked={selectedIds.length === notices.length && notices.length > 0}
                                indeterminate={selectedIds.length > 0 && selectedIds.length < notices.length}
                            />
                        </th>
                        <th className="notice-col-title">제목</th>
                        <th className="notice-col-date">등록일</th>
                        <th className="notice-col-content">내용</th>
                        <th className="notice-col-actions">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notices.map((notice) => (
                        <tr key={notice.id}>
                            <td>
                                <Checkbox
                                    onChange={(e) => handleSelect(e.target.checked, notice.id)}
                                    checked={selectedIds.includes(notice.id)}
                                />
                            </td>
                            <td className="notice-col-title">{notice.title}</td>
                            <td className="notice-col-date" style={{textAlign: 'center'}}>
                                {formatDate(notice.created_at)}
                            </td>
                            <td className="notice-col-content">{truncate(notice.content)}</td>
                            <td className="notice-col-actions">
                                <button
                                    className="btn-standard btn-edit"
                                    onClick={() => navigate(`/notice-edit/${notice.id}`)}
                                >
                                    수정
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="5">
                            <div className="notice-add-button-wrapper">
                                {selectedIds.length > 0 && (
                                    <button
                                        className="btn-standard btn-delete"
                                        onClick={handleDeleteSelected}
                                    >
                                        선택 삭제 ({selectedIds.length})
                                    </button>
                                )}
                                <button className="btn-standard btn-add-event"
                                        onClick={() => navigate('/notice-add')}
                                >
                                    새 공지 등록
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}

export default NoticeList;
