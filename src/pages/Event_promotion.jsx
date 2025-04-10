import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import supabase from '../lib/SupabaseClient_evpro.js';
import '../css/Evpro.css';
import 'antd/dist/reset.css'; // antd 스타일도 꼭 포함해 주세요!

function EventList() {
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase.from('withgo_event').select('*');
            if (error) {
                console.error('이벤트 로드 실패:', error);
            } else {
                setEvents(data);
            }
        };
        fetchEvents();
    }, []);

    const handleCheckboxChange = (id) => {
        setSelectedEvents((prev) =>
            prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedEvents(events.map((ev) => ev.id));
        } else {
            setSelectedEvents([]);
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm('선택한 이벤트를 삭제하시겠습니까?')) return;

        const { error } = await supabase
            .from('withgo_event')
            .delete()
            .in('id', selectedEvents);

        if (error) {
            alert('삭제 중 오류 발생');
        } else {
            setEvents(events.filter((ev) => !selectedEvents.includes(ev.id)));
            setSelectedEvents([]);
            alert('선택한 이벤트가 삭제되었습니다');
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
                        <th>
                            <Checkbox
                                onChange={handleSelectAll}
                                checked={selectedEvents.length === events.length && events.length > 0}
                            />
                        </th>
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
                            <td>
                                <Checkbox
                                    checked={selectedEvents.includes(event.id)}
                                    onChange={() => handleCheckboxChange(event.id)}
                                />
                            </td>
                            <td className="col-title">{event.title}</td>
                            <td>{event.date}</td>
                            <td>
                                <a href={event.link_url} target="_blank" rel="noopener noreferrer">
                                    상세보기 →
                                </a>
                            </td>
                            <td>
                  <span
                      className={`status-badge ${
                          event.status === '이벤트 진행중' ? 'active' : 'ended'
                      }`}
                  >
                    {event.status}
                  </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-edit"
                                    onClick={() => navigate(`/event-edit/${event.id}`)}
                                >
                                    수정
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="6">
                            <div className="add-button-wrapper">
                                {selectedEvents.length > 0 && (
                                    <button className="btn btn-delete" onClick={handleBulkDelete}>
                                        선택 삭제 ({selectedEvents.length})
                                    </button>
                                )}
                                <button className="btn btn-add" onClick={() => navigate('/event-add')}>
                                    새 이벤트 등록
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

export default EventList;
