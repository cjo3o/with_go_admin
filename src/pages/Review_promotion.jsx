import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Checkbox } from 'antd';
import supabase from '../lib/supabase';
import '../css/Review.css';

function ReviewList() {
    const [reviews, setReviews] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('review')
            .select('*')
            .not('review_num', 'is', null)
            .not('title', 'is', null)
            .not('created_at', 'is', null)
            .order('created_at', { ascending: false });

        if (!error) setReviews(data);
    };

    const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

    const handleSelect = (checked, id) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) setSelectedIds(currentItems.map((r) => r.review_num));
        else setSelectedIds([]);
    };

    const handleDeleteSelected = async () => {
        if (!window.confirm('선택한 후기를 삭제하시겠습니까?')) return;
        const { error } = await supabase
            .from('review')
            .delete()
            .in('review_num', selectedIds);

        if (!error) {
            setReviews(reviews.filter((r) => !selectedIds.includes(r.review_num)));
            setSelectedIds([]);
            alert('삭제 완료되었습니다.');
        }
    };

    const toggleBest = async (id, current) => {
        const { error } = await supabase
            .from('review')
            .update({ is_best: !current })
            .eq('review_num', id);
        if (!error) fetchReviews();
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    const handlePageChange = (pageNum) => setCurrentPage(pageNum);

    return (
        <div className="main">
            <div className="header">이용후기 관리</div>
            <div className="card">
                <h3>후기 목록</h3>
                <table>
                    <thead>
                    <tr>
                        <th className="col-select">
                            <Checkbox
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                checked={
                                    selectedIds.length === currentItems.length &&
                                    currentItems.length > 0
                                }
                            />
                        </th>
                        <th className="col-title">제목</th>
                        <th className="col-content">내용</th>
                        <th className="col-writer">작성자</th>
                        <th className="col-date">등록일</th>
                        <th className="col-status">베스트리뷰등록</th>
                        <th className="col-actions">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentItems.map((r) => (
                        <tr key={r.review_num} className={r.is_best ? 'review-best' : ''}>
                            <td className="col-select">
                                <Checkbox
                                    onChange={(e) => handleSelect(e.target.checked, r.review_num)}
                                    checked={selectedIds.includes(r.review_num)}
                                />
                            </td>
                            <td className="col-title">{r.title || '(제목 없음)'}</td>
                            <td className="col-content single-line" style={{ textAlign: 'left' }}>
                                {r.review_txt || '(내용 없음)'}
                            </td>
                            <td className="col-writer">{r.name || '익명'}</td>
                            <td className="col-date">
                                {r.created_at ? formatDate(r.created_at) : '날짜 없음'}
                            </td>
                            <td className="col-status">
                                <button
                                    className={`btn btn-best ${r.is_best ? 'pink' : 'blue'}`}
                                    onClick={() => toggleBest(r.review_num, r.is_best)}
                                >
                                    {r.is_best ? '해제' : '등록'}
                                </button>
                            </td>
                            <td className="col-actions">
                                <button
                                    className="btn btn-edit"
                                    onClick={() => alert('수정 기능 준비 중')}
                                >
                                    수정
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="7">
                            <div className="add-button-wrapper">
                                {selectedIds.length > 0 && (
                                    <button
                                        className="btn btn-delete"
                                        onClick={handleDeleteSelected}
                                    >
                                        선택 삭제 ({selectedIds.length})
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                    </tfoot>
                </table>

                <div className="pagination">

                    <button
                        onClick={() => handlePageChange(1)}
                        className="btn"
                        disabled={currentPage === 1}
                    >
                        <i className="fa-solid fa-angles-left"></i>
                    </button>


                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn"
                        disabled={currentPage === 1}
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`btn ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}


                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn"
                        disabled={currentPage === totalPages}
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>


                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className="btn"
                        disabled={currentPage === totalPages}
                    >
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ReviewList;
