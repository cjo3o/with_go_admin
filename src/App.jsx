import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from 'react'

import './App.css'

import Home from "./pages/Home.jsx";
import Sidebar from "./layouts/Sidebar.jsx";

import PartnerList from "./pages/PartnerList.jsx";
import PartnerCreate from "./pages/PartnerCreate.jsx";
import StorageList from "./pages/StorageList.jsx";
import StorageCreate from "./pages/StorageCreate.jsx";


import EventList from "./pages/Event_promotion.jsx";
import EventAdd from "./pages/Event_add.jsx";
import EventEdit from "./pages/Eventedit.jsx";
import 'antd/dist/reset.css';

import NoticeList from "./pages/Notice_promotion.jsx";
import NoticeAdd from './pages/NoticeAdd.jsx';
import NoticeEdit from './pages/NoticeEdit.jsx';


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="wrapper">
                <BrowserRouter>
                    <Sidebar></Sidebar>
                    <Routes>
                        <Route path="/" element={<Home/>}></Route>

                        <Route path="/partner/list" element={<PartnerList />} />
                        <Route path="/partner/create" element={<PartnerCreate />} />
                        <Route path="/storage/list" element={<StorageList />} />
                        <Route path="/storage/create" element={<StorageCreate />} />

                        <Route path="/event-promotion" element={<EventList />} />
                        <Route path="/event-add" element={<EventAdd />} />
                        <Route path="/event-edit/:id" element={<EventEdit />} />

                        <Route path="/notice-promotion" element={<NoticeList />} />
                        <Route path="/notice-add" element={<NoticeAdd />} />
                        <Route path="/notice-edit/:id" element={<NoticeEdit />} />


                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
