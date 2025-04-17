import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Input, Switch } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronUp, faChevronDown,
    faAnglesLeft, faAnglesRight,
    faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import supabase from '../lib/supabase';
import '../css/FAQ.css';

function FAQList({ filterType = '', searchKeyword = '' }) {
    const [faqs, setFaqs] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [expanded, setExpanded] = useState(null);
    const [sortField, setSortField] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();
    const itemsPerPage = 7;

    useEffect(() => {
        fetchFAQs();
    }, [sortField, sortOrder]);

    const fetchFAQs = async () => {
        const { data, error } = await supabase
            .from('withgo_faqs')
            .select('*')
            .order(sortField, { ascending: sortOrder === 'asc' });
        if (!error) setFaqs(data);
    };

    const handleToggle = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm('선택한 FAQ를 삭제할까요?')) return;
        const { error } = await supabase
            .from('withgo_faqs')
            .delete()
            .in('id', selectedIds);
        if (!error) {
            setFaqs((prev) => prev.filter((faq) => !selectedIds.includes(faq.id)));
            setSelectedIds([]);
            alert('삭제 완료!');
        }
    };

    const handleToggleStatus = async (id, checked) => {
        const newStatus = checked ? '공개' : '숨김';
        const { error } = await supabase
            .from('withgo_faqs')
            .update({ status: newStatus })
            .eq('id', id);
        if (!error) {
            setFaqs((prev) =>
                prev.map((faq) =>
                    faq.id === id ? { ...faq, status: newStatus } : faq
                )
            );
        }
    };

    const handleCheckbox = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) setSelectedIds(currentItems.map((faq) => faq.id));
        else setSelectedIds([]);
    };

    const stripBr = (text) => text?.replace(/<br\s*\/?>/gi, ' ') ?? '';
    const formatDate = (str) => {
        if (!str) return '-';
        const date = new Date(str);
        return isNaN(date.getTime()) ? '-' : date.toISOString().split('T')[0];
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const filtered = faqs
        .filter((f) => f.question.toLowerCase().includes(searchKeyword.toLowerCase()))
        .filter((f) => (filterType === '' ? true : f.category === filterType));

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    const groupSize = 7;
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    return (
        <div className="faq-card">
            <table>
                <thead>
                <tr>
                    <th className="col-select"><Checkbox onChange={(e) => handleSelectAll(e.target.checked)} checked={selectedIds.length === currentItems.length && currentItems.length > 0} /></th>
                    <th className="col-type">카테고리</th>
                    <th className="col-title">질문</th>
                    <th className="col-content">답변</th>
                    <th className="col-status" style={{ width: '8%' }}>공개</th>
                    <th className="col-date" style={{ width: '9%' }} onClick={() => handleSort('created_at')}>
                        등록일 <FontAwesomeIcon icon={sortOrder === 'asc' ? faChevronUp : faChevronDown} />
                    </th>
                    <th className="col-actions">관리</th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((faq) => (
                    <tr key={faq.id}>
                        <td className="col-select"><Checkbox checked={selectedIds.includes(faq.id)} onChange={() => handleCheckbox(faq.id)} /></td>
                        <td className="col-type">{faq.category}</td>
                        <td className="col-title" style={{ whiteSpace: 'normal' }}>{faq.question}</td>
                        <td className="col-content">
                            <div className={`faq-toggle-box ${expanded === faq.id ? 'open' : ''}`} onClick={() => handleToggle(faq.id)}>
                                {expanded === faq.id ? stripBr(faq.answer) : stripBr(faq.answer).slice(0, 30) + '...'}
                            </div>
                        </td>
                        <td className="col-visible">
                            <Switch checked={faq.status === '공개'} onChange={(checked) => handleToggleStatus(faq.id, checked)} size="small" />
                        </td>
                        <td className="col-date">{formatDate(faq.created_at)}</td>
                        <td className="col-actions">
                            <button className="btn btn-edit" onClick={() => navigate(`/faq-edit/${faq.id}`)}>수정</button>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan="7">
                        <div className="add-button-wrapper">
                            {selectedIds.length > 0 && (
                                <button className="btn btn-delete" onClick={handleDeleteSelected}>
                                    선택 삭제 ({selectedIds.length})
                                </button>
                            )}
                            <button className="btn btn-add" onClick={() => navigate('/faq-add')}>
                                새 FAQ 등록
                            </button>
                        </div>
                    </td>
                </tr>
                </tfoot>
            </table>

            <div className="pagination">
                <button className="group-btn" onClick={() => setCurrentPage(1)} disabled={currentGroup === 0}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
                <button className="arrow-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className="page-btns">
                    {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
                        const pageNum = startPage + i;
                        return (
                            <button
                                key={pageNum}
                                className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>
                <button className="arrow-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                <button className="group-btn" onClick={() => setCurrentPage(endPage + 1)} disabled={endPage === totalPages}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                </button>
            </div>
        </div>
    );
}

export default FAQList;
