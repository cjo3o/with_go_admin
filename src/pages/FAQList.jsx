import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Input, Select, Switch } from 'antd';
import supabase from '../lib/supabase';
import '../css/FAQ.css';

const { Option } = Select;

function FAQList() {
    const [faqs, setFaqs] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchTrigger, setSearchTrigger] = useState('');
    const itemsPerPage = 7;
    const navigate = useNavigate();

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = async () => {
        const { data, error } = await supabase
            .from('withgo_faqs')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setFaqs(data);
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

    const handleCategoryChange = async (id, newValue) => {
        const { error } = await supabase
            .from('withgo_faqs')
            .update({ category: newValue })
            .eq('id', id);
        if (!error) {
            setFaqs((prev) =>
                prev.map((faq) =>
                    faq.id === id ? { ...faq, category: newValue } : faq
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

    const filtered = faqs.filter((f) =>
        f.question.toLowerCase().includes(searchTrigger.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirst, indexOfLast);

    const groupSize = 7;
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const stripBR = (html) => html?.replace(/<br\s*\/?>/gi, ' ') || '';

    return (
        <div className="faq-wrapper">
            <div className="header">FAQ 관리</div>
            <div className="card">
                <div className="top-bar">
                    <h3>FAQ 목록</h3>
                    <Input.Search
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={() => setSearchTrigger(search)}
                        placeholder="질문 검색"
                        allowClear
                        style={{ width: 200 }}
                    />
                </div>

                <table>
                    <thead>
                    <tr>
                        <th className="col-select">
                            <Checkbox
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                            />
                        </th>
                        <th className="col-type">카테고리</th>
                        <th className="col-title">질문</th>
                        <th className="col-content">답변</th>
                        <th className="col-status">공개여부</th>
                        <th className="col-actions">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((faq) => (
                        <tr key={faq.id}>
                            <td className="col-select">
                                <Checkbox
                                    checked={selectedIds.includes(faq.id)}
                                    onChange={() => handleCheckbox(faq.id)}
                                />
                            </td>
                            <td className="col-type">
                                <Select
                                    value={faq.category}
                                    onChange={(value) => handleCategoryChange(faq.id, value)}
                                    size="small"
                                    style={{ width: 80 }}
                                >
                                    <Option value="배송">배송</Option>
                                    <Option value="보관">보관</Option>
                                    <Option value="결제">결제</Option>
                                    <Option value="기타">기타</Option>
                                </Select>
                            </td>
                            <td className="col-title">{faq.question}</td>
                            <td className="col-content">{stripBR(faq.answer)}</td>
                            <td className="col-status">
                                <Switch
                                    checked={faq.status === '공개'}
                                    onChange={(checked) => handleToggleStatus(faq.id, checked)}
                                    size="small"
                                />
                            </td>
                            <td className="col-actions">
                                <button className="btn btn-edit" onClick={() => navigate(`/faq-edit/${faq.id}`)}>수정</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="6">
                            <div className="add-button-wrapper">
                                {selectedIds.length > 0 && (
                                    <button className="btn btn-delete btn-standard" onClick={handleDeleteSelected}>
                                        선택 삭제 ({selectedIds.length})
                                    </button>
                                )}
                                <button className="btn btn-add btn-standard" onClick={() => navigate('/faq-add')}>
                                    새 FAQ 등록
                                </button>
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                </table>

                <div className="pagination">
                    <button className="group-btn" onClick={() => setCurrentPage(1)} disabled={currentGroup === 0}>
                        <i className="fas fa-angle-double-left" />
                    </button>
                    <button className="arrow-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                        <i className="fas fa-angle-left" />
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
                        <i className="fas fa-angle-right" />
                    </button>
                    <button className="group-btn" onClick={() => setCurrentPage(endPage + 1)} disabled={endPage === totalPages}>
                        <i className="fas fa-angle-double-right" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FAQList;