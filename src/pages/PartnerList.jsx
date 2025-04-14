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

    // 이미지/지도 클릭 시 열리는 모달
    const [modalContent, setModalContent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

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

    useEffect(() => {
        fetchPartners();
    }, []);

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
            const allIds = partners.map(p => p.partner_id);
            setSelectedPartners(allIds);
        } else {
            setSelectedPartners([]);
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

    return (
        <>
            <div className='main'>
                <div className='header'>제휴숙소관리</div>

                <div className='card'>
                    <div className='middle'>
                        <h3>제휴숙소목록</h3>
                        <div className="middle-actions" style={{display: 'flex', alignContent: 'center'}}>
                            <div style={{marginTop: 0}} className="add-button-wrapper">
                                {selectedPartners.length > 0 && (
                                    <button className="btn btn-delete" onClick={handleBulkDelete}>
                                        삭제 ({selectedPartners.length})
                                    </button>
                                )}
                            </div>
                            <div className='PartnerList_Search'>
                                <Lookup onSearch={handleSearch}/>
                            </div>
                        </div>
                    </div>
                    <table>
                        <colgroup>
                            <col style={{width: "5%"}}/>
                            <col style={{width: "5%"}}/>
                            <col style={{width: "15%"}}/>
                            <col style={{width: "18%"}}/>
                            <col style={{width: "9%"}}/>
                            <col style={{width: "13%"}}/>
                            <col style={{width: "10%"}}/>
                            <col style={{width: "10%"}}/>
                            <col style={{width: "10%"}}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th className='P_Checkbox'>
                                <Checkbox
                                    onChange={handleSelectAll}
                                    checked={selectedPartners.length === partners.length && partners.length > 0}
                                />
                            </th>
                            <th className='id'>ID</th>
                            <th className='name'>숙소명</th>
                            <th className='address'>주소</th>
                            <th className='phone'>연락처</th>
                            <th className='map'>지도</th>
                            <th className='img'>숙소 이미지</th>
                            <th className='date'>등록일</th>
                            <th className='edit'>수정</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPartners.map((partner) => (
                            <tr key={partner.partner_id}>
                                <td>
                                    <Checkbox
                                        checked={selectedPartners.includes(partner.partner_id)}
                                        onChange={() => handleCheckboxChange(partner.partner_id)}
                                    />
                                </td>
                                <td className='id'>{partner.partner_id}</td>
                                <td className='name'>{partner.name}</td>
                                <td className='address'>{partner.address}</td>
                                <td className='phone'>{partner.phone}</td>
                                <td className="map">
                                    {partner.map_url ? (
                                        <div className="map-wrapper" onClick={() => openModal(
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
                                                width="300"
                                                height="100"
                                                style={{border: 'none', pointerEvents: 'none'}}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="지도"
                                            ></iframe>
                                        </div>
                                    ) : '없음'}
                                </td>

                                <td className="img">
                                    {partner.image ? (
                                        <img
                                            src={partner.image}
                                            alt="숙소 이미지"
                                            style={{width: '100px', height: 'auto', cursor: 'pointer'}}
                                            onClick={() => openModal(
                                                <img src={partner.image} alt="확대 이미지"
                                                     style={{width: '100%', height: 'auto'}}/>
                                            )}
                                        />
                                    ) : (
                                        '없음'
                                    )}
                                </td>
                                <td className='date'>{new Date(partner.created_at).toLocaleString('ko-KR')}</td>
                                <td>
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => navigate(`/partner/create/${partner.partner_id}`)}>
                                        수정
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="add-button-wrapper">
                        <button className="btn btn-add btn-standard"
                                onClick={() => navigate('/partner/create')}>
                            새 제휴숙소 등록
                        </button>
                    </div>
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