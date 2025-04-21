import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Switch } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAnglesLeft,
    faAnglesRight,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
    faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import supabase from '../lib/supabase';
import '../css/inquiry.css';
import '../css/layout.css';
import '../css/ui.css';

const InquiryList = ({ filterType = '', searchKeyword = '' }) => {
    const [inquiries, setInquiries] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc');
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 7;

    useEffect(() => {
        fetchInquiries();
    }, [filterType, searchKeyword, sortOrder]);

    const fetchInquiries = async () => {
        let query = supabase.from('question').select('*');
        if (filterType) query = query.eq('type', filterType);
        if (searchKeyword) query = query.ilike('question', `%${searchKeyword}%`);
        query = query.order('created_at', { ascending: sortOrder === 'asc' });
        const { data, error } = await query;
        if (!error) setInquiries(data);
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm('선택한 문의를 삭제할까요?')) return;
        const { error } = await supabase.from('question').delete().in('id', selectedIds);
        if (!error) {
            setInquiries(inquiries.filter(inquiry => !selectedIds.includes(inquiry.id)));
            setSelectedIds([]);
        }
    };

    const handleStatusToggle = async (id, newStatus) => {
        const { error } = await supabase
            .from('question')
            .update({ stat: newStatus ? '공개' : '숨김' })
            .eq('id', id);
        if (!error) {
            setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, stat: newStatus ? '공개' : '숨김' } : inq));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedIds.length === currentItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentItems.map(item => item.id));
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = inquiries.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(inquiries.length / itemsPerPage);

    return (
        <div className="inquiry-wrapper">
            <table className="inquiry-table">
                <thead>
                <tr>
                    <th className="inquiry-col-select">
                        <Checkbox onChange={toggleAll} checked={selectedIds.length === currentItems.length} />
                    </th>
                    <th className="inquiry-col-category">구분</th>
                    <th className="inquiry-col-title">질문</th>
                    <th className="inquiry-col-content">답변</th>
                    <th className="inquiry-col-writer">작성자</th>
                    <th className="inquiry-col-date" onClick={toggleSortOrder}>
                        작성일 <FontAwesomeIcon icon={sortOrder === 'asc' ? faChevronUp : faChevronDown} />
                    </th>
                    <th className="inquiry-col-visible">공개</th>
                    <th className="inquiry-col-actions">관리</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((inquiry) => (
                    <tr key={inquiry.id}>
                        <td><Checkbox onChange={() => toggleSelect(inquiry.id)} checked={selectedIds.includes(inquiry.id)} /></td>
                        <td>{inquiry.type}</td>
                        <td className="inquiry-col-title">{inquiry.question}</td>
                        <td className="inquiry-col-content">
                            <div
                                className={`inquiry-toggle-box ${expanded === inquiry.id ? 'open' : ''}`}
                                onClick={() => setExpanded(expanded === inquiry.id ? null : inquiry.id)}
                                dangerouslySetInnerHTML={{
                                    __html: expanded === inquiry.id
                                        ? inquiry.title
                                        : inquiry.title?.replace(/<br\s*\/?>/gi, ' ')
                                }}
                            ></div>
                        </td>
                        <td>{inquiry.name}</td>
                        <td>{inquiry.created_at?.split('T')[0]}</td>
                        <td>
                            <Switch checked={inquiry.stat === '공개'} onChange={(checked) => handleStatusToggle(inquiry.id, checked)} />
                        </td>
                        <td>
                            <button className="inquiry-btn inquiry-btn-edit" onClick={() => navigate(`/inquiry-edit/${inquiry.id}`)}>수정</button>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan="8">
                        <div className="inquiry-footer">
                            {selectedIds.length > 0 && (
                                <button className="inquiry-btn inquiry-btn-delete" onClick={handleDeleteSelected}>
                                    선택 삭제 ({selectedIds.length})
                                </button>
                            )}
                            <button className="inquiry-btn inquiry-btn-add" onClick={() => navigate('/inquiry-add')}>
                                새 문의 등록
                            </button>
                        </div>
                    </td>
                </tr>
                </tfoot>
            </table>

            <div className="inquiry-pagination">
                <button className="inquiry-arrow-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
                <button className="inquiry-arrow-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx + 1}
                        className={`inquiry-page-btn ${currentPage === idx + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button className="inquiry-arrow-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button className="inquiry-arrow-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                </button>
            </div>
        </div>
    );
};

export default InquiryList;