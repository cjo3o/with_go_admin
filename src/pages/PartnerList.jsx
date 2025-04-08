import React, {useEffect, useState} from 'react';
import {supabase} from "../lib/supabase.js";
import "../css/PartnerList.css"

function PartnerList() {
    const [partners, setPartners] = useState([]);


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

    useEffect(() => {
        async function fetchPartners() {
            const {data, error} = await supabase
                .from('partner')
                .select('*')
                .order('created_at', {ascending: false});

            if (error) {
                console.error('제휴숙소 조회 오류:', error);
            } else {
                setPartners(data);
            }
        }

        fetchPartners();
    }, []);


    return (
        <>
            <div className='main'>
                <div className='header'>제휴숙소관리</div>

                <div className='card'>
                    <h3>제휴숙소목록</h3>
                        <table>
                            <thead>
                            <tr>
                                <th className='id'>ID</th>
                                <th className='name'>숙소명</th>
                                <th className='address'>주소</th>
                                <th className='phone'>연락처</th>
                                <th className='map'>지도</th>
                                <th className='img'>숙소 이미지</th>
                                <th className='date'>등록일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {partners.map((partner) => (
                                <tr key={partner.partner_id}>
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
                                                    style={{ border: 'none' }}
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
                                                    style={{ border: 'none', pointerEvents: 'none' }}
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
                                                style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
                                                onClick={() => openModal(
                                                    <img src={partner.image} alt="확대 이미지" style={{ width: '100%', height: 'auto' }} />
                                                )}
                                            />
                                        ) : (
                                            '없음'
                                        )}
                                    </td>
                                    <td>{new Date(partner.created_at).toLocaleString('ko-KR')}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
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