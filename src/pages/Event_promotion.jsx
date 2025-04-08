import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import supabase from '../lib/SupabaseClient_evpro.js';
import '../css/Evpro.css';

function EventList() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const {data, error} = await supabase
                .from('withgo_event')
                .select('*');

            if (error) {
                console.error('이벤트 로드 실패:', error);
            } else {
                setEvents(data);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('정말 이 이벤트를 삭제하시겠습니까?');
        if (!confirmDelete) return;

        const {error} = await supabase
            .from('withgo_event')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('삭제 실패:', error);
            alert('삭제 중 오류 발생');
        } else {
            setEvents(events.filter(event => event.id !== id));
            alert('이벤트가 삭제되었습니다');
        }
    };

    return (
        <div className="main">
            <div className="header">이벤트·프로모션 관리</div>

            <div className="card">
                <h3>이벤트 목록</h3>

                <table>
                    <thead>
                    <tr>
                        <th className="col-title">제목</th>
                        <th className="col-date">날짜</th>
                        <th className="col-link">링크</th>
                        <th className="col-status">상태</th>
                        <th className="col-actions">관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td className="col-title">{event.title}</td>
                            <td>{event.date}</td>
                            <td>
                                <a href={event.link_url} target="_blank" rel="noopener noreferrer">
                                    상세보기 →
                                </a>
                            </td>
                            <td>
                            <span className={`status-badge ${new Date(event.date) >= new Date() ? 'active' : 'ended'}`}>
                              {new Date(event.date) >= new Date() ? '이벤트 진행중' : '이벤트 종료'}
                            </span>
                            </td>
                            <td>
                                <div className="btn-group">
                                    <button className="btn btn-edit"
                                            onClick={() => navigate(`/event-edit/${event.id}`)}>수정
                                    </button>
                                    <button className="btn btn-delete" onClick={() => handleDelete(event.id)}>삭제
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'right', paddingTop: '10px' }}>
                            <button className="btn btn-add" onClick={() => navigate('/event-add')}>
                                새 이벤트 등록
                            </button>
                        </td>
                    </tr>
                    </tfoot>
                </table>


            </div>

        </div>
    );
}

export default EventList;
