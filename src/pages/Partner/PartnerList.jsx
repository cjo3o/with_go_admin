import React, {useEffect, useState} from 'react';
import supabase from "../lib/supabase.js";
import "../css/PartnerList.css"
import {Checkbox, Image} from "antd";
import {useNavigate} from 'react-router-dom';
import Lookup from "../layouts/Lookup.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesLeft, faAnglesRight, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {CloseOutlined} from "@ant-design/icons";

function PartnerList() {
    const [partners, setPartners] = useState([]);
    const [selectedPartners, setSelectedPartners] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 4;
    const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);

    const groupSize = 10;
    const currentGroup = Math.floor((currentPage - 1) / groupSize);
    const startPage = currentGroup * groupSize + 1;
    const endPage = Math.min(startPage + groupSize - 1, totalPages);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPartners.slice(indexOfFirstItem, indexOfLastItem);


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
            .from('partner_place')
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
            .from('partner_place')
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

    const goToFirstGroup = () => setCurrentPage(1);
    const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const goToNextGroup = () => {
        const nextGroupPage = Math.min(endPage + 1, totalPages);
        if (nextGroupPage > currentPage) setCurrentPage(nextGroupPage);
    };

    return (
        <>
            <div className='main'>
                <div className='header'>제휴숙소관리</div>

                <div className='card'>
                    <div className='middle'>
                        <div className='middle-left'>
                            <h3 style={{marginBottom: 0}}>제휴숙소목록</h3>
                            <Checkbox
                                onChange={handleSelectAll}
                                checked={
                                    currentItems.length > 0 &&
                                    currentItems.every(p => selectedPartners.includes(p.partner_id))
                                }
                            ></Checkbox>
                        </div>
                        <div className='middle-right'>
                            <div className="middle-actions" style={{display: 'flex', alignContent: 'center', gap: '10px'}}>
                                <div className={`add-button-wrapper delBtnMargin`}>
                                    <button
                                        className="btn btn-delete"
                                        disabled={selectedPartners.length === 0}
                                        onClick={handleBulkDelete}
                                    >
                                        삭제 ({selectedPartners.length})
                                    </button>
                                </div>
                                <div className='PartnerList_Search'>
                                    <Lookup onSearch={handleSearch}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-container">
                        {currentItems.map((partner) => (
                            <div className="partner-card" key={partner.partner_id}>
                                <div className="card-top">
                                    <div className='card-top-left'>
                                        <Checkbox
                                            checked={selectedPartners.includes(partner.partner_id)}
                                            onChange={() => handleCheckboxChange(partner.partner_id)}
                                        />
                                        <span>ID : {partner.partner_id}</span>
                                    </div>
                                    <div className="card-top-right">
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => navigate(`/partner/create/${partner.partner_id}`)}
                                        >
                                            수정
                                        </button>
                                    </div>
                                </div>

                                <div className="card-content">
                                        <div className='card-content-text'>
                                            <p className='strong'><strong>숙소명</strong></p>
                                            <p className='content-txt'>{partner.name}</p>
                                        </div>


                                        <div className='card-content-text'>
                                            <p className='strong'><strong>주 소</strong></p>
                                            <p className='content-txt partner-add'>{partner.address}</p>
                                        </div>


                                        <div className='card-content-text'>
                                            <p className='strong'><strong>연락처</strong></p>
                                            <p className='content-txt'>{partner.phone}</p>
                                        </div>

                                    <div className="card-image">
                                        {partner.image ? (
                                            <Image
                                                src={partner.image}
                                                alt="장소 이미지"
                                                width="100%"
                                                height={150}
                                                style={{ objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                        ) : (
                                            <img
                                                src="/placeholder.jpg"
                                                alt="이미지 없음"
                                                style={{ width: '100%', height: 150, opacity: 0.3, objectFit: 'cover', borderRadius: '6px' }}
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
                                                        style={{border: 'none'}}
                                                        allowFullScreen=""
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                        title="지도"
                                                    ></iframe>
                                                )}>
                                                <iframe
                                                    src={partner.map_url.match(/src="([^"]+)"/)?.[1] || partner.map_url}
                                                    width="100%"
                                                    height="150"
                                                    style={{border: 'none', pointerEvents: 'none'}}
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
                    {/* 페이지네이션 */}
                    <div className="pagination" style={{marginTop: '30px'}}>
                        <button className="group-btn" onClick={goToFirstGroup} disabled={currentGroup === 0}>
                            <FontAwesomeIcon icon={faAnglesLeft} />
                        </button>
                        <button className="arrow-btn" onClick={goToPrevPage} disabled={currentPage === 1}>
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

                        <button className="arrow-btn" onClick={goToNextPage} disabled={currentPage === totalPages}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <button className="group-btn" onClick={goToNextGroup} disabled={endPage === totalPages}>
                            <FontAwesomeIcon icon={faAnglesRight} />
                        </button>
                    </div>
                    <div className={`add-button-wrapper delBtnMargin`}>
                        <button className="btn btn-add btn-standard" style={{marginRight: '30px'}}
                                onClick={() => navigate('/partner/create')}>
                            새 제휴숙소 등록
                        </button>
                    </div>
                </div>

            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}><CloseOutlined /></button>
                        {modalContent}
                    </div>
                </div>
            )}
        </>
    );
}

export default PartnerList;