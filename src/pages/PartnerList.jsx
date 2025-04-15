import React, {useEffect, useState} from 'react';
import supabase from "../lib/supabase.js";
import "../css/PartnerList.css"
import {Checkbox} from "antd";
import {useNavigate} from 'react-router-dom';
import Lookup from "../layouts/Lookup.jsx";

function PartnerList() {
    const [partners, setPartners] = useState([]);
    const [selectedPartners, setSelectedPartners] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPartners, setFilteredPartners] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

    const navigate = useNavigate();

    // 이미지/지도 클릭 시 열리는 모달
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalContent(null);
        setIsModalOpen(false);
    };

    // 데이터 불러오기
    const fetchPartners = async () => {
        const {data, error} = await supabase
            .from('partner')
            .select('*')
            .order('created_at', {ascending: false});

        if (error) {
            console.error('제휴숙소 조회 오류:', error);
        } else {
            setPartners(data);
        }
    };

// 1. 초기 데이터 로딩
    useEffect(() => {
        fetchPartners();
    }, []);

// 2. 검색어 변경되거나 partners 업데이트될 때 필터링
    useEffect(() => {
        if (!searchTerm) {
            setFilteredPartners(partners);
        } else {
            const lowerSearch = searchTerm.toLowerCase();
            const filtered = partners.filter(partner =>
                partner.name.toLowerCase().includes(lowerSearch) ||
                partner.address.toLowerCase().includes(lowerSearch) ||
                partner.phone.toLowerCase().includes(lowerSearch)
            );
            setFilteredPartners(filtered);
        }
    }, [searchTerm, partners]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    // 체크박스 전체 선택
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const visibleIds = currentItems.map(p => p.partner_id);
            setSelectedPartners(prev => [...new Set([...prev, ...visibleIds])]);
        } else {
            const visibleIds = currentItems.map(p => p.partner_id);
            setSelectedPartners(prev => prev.filter(id => !visibleIds.includes(id)));
        }
    };

    // 체크박스 개별 선택
    const handleCheckboxChange = (id) => {
        setSelectedPartners(prev =>
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    // 선택 삭제
    const handleBulkDelete = async () => {
        if (!window.confirm('선택한 숙소를 삭제하시겠습니까?')) return;

        const {error} = await supabase
            .from('partner')
            .delete()
            .in('partner_id', selectedPartners);

        if (error) {
            alert('삭제 중 오류 발생');
        } else {
            alert('선택한 숙소가 삭제되었습니다');
            fetchPartners();
            setSelectedPartners([]);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPartners.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className='main'>
                <div className='header'>제휴숙소관리</div>

                <div className='card'>
                    <div className='middle'>
                        <h3>제휴숙소목록</h3>
                        <Checkbox
                            onChange={handleSelectAll}
                            checked={
                                currentItems.length > 0 &&
                                currentItems.every(p => selectedPartners.includes(p.partner_id))
                            }
                        ></Checkbox>
                        <div className="middle-actions" style={{display: 'flex', alignContent: 'center'}}>
                            <div style={{marginTop: 0}} className="add-button-wrapper">
                                {selectedPartners.length > 0 && (
                                    <button className="btn btn-delete" onClick={handleBulkDelete}>
                                        삭제 ({selectedPartners.length})
                                    </button>
                                )}
                            </div>
                            <div className="add-button-wrapper">
                                <button className="btn btn-add btn-standard"
                                        onClick={() => navigate('/partner/create')}>
                                    새 제휴숙소 등록
                                </button>
                            </div>
                            <div className='PartnerList_Search'>
                                <Lookup onSearch={handleSearch}/>
                            </div>
                        </div>
                    </div>

                    <div className="card-container">
                        {currentItems.map((partner) => (
                            <div className="card" key={partner.partner_id}>
                                <div className="card-top">
                                    <Checkbox
                                        checked={selectedPartners.includes(partner.partner_id)}
                                        onChange={() => handleCheckboxChange(partner.partner_id)}
                                    />
                                    <span>ID : {partner.partner_id}</span>
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => navigate(`/partner/create/${partner.partner_id}`)}
                                    >
                                        수정
                                    </button>
                                </div>

                                <div className="card-content">
                                    <p><strong>숙소명</strong> {partner.name}</p>
                                    <p><strong>주소</strong> {partner.address}</p>
                                    <p><strong>연락처</strong> {partner.phone}</p>

                                    <div className="card-image">
                                        {partner.image ? (
                                            <img
                                                src={partner.image}
                                                alt="숙소 이미지"
                                                onClick={() =>
                                                    openModal(
                                                        <img
                                                            src={partner.image}
                                                            alt="확대 이미지"
                                                            style={{ width: '100%', height: 'auto' }}
                                                        />
                                                    )
                                                }
                                            />
                                        ) : (
                                            <img
                                                src="/placeholder.jpg"
                                                alt="이미지 없음"
                                                style={{ width: '100%', opacity: 0.3 }}
                                            />
                                        )}
                                    </div>

                                    <div className="card-map">
                                        {partner.map_url ? (
                                            <div onClick={() =>
                                                openModal(
                                                    <iframe
                                                        src={partner.map_url.match(/src="([^"]+)"/)?.[1] || partner.map_url}
                                                        width="600"
                                                        height="400"
                                                        style={{ border: 'none' }}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title="지도"
                                                    ></iframe>
                                                )}>
                                                <iframe
                                                    src={partner.map_url.match(/src="([^"]+)"/)?.[1] || partner.map_url}
                                                    width="100%"
                                                    height="100"
                                                    style={{ border: 'none', pointerEvents: 'none' }}
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title="지도"
                                                ></iframe>
                                            </div>
                                        ) : (
                                            '지도 없음'
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 페이지네이션 */}
                <div className="pagination">
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                        &laquo;
                    </button>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        &lt;
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        &gt;
                    </button>
                    <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                        &raquo;
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>X</button>
                        {modalContent}
                    </div>
                </div>
            )}
        </>
    );
}

export default PartnerList;