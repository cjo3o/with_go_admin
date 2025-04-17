import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from 'react';

import './App.css';
import 'antd/dist/reset.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from "./pages/Home.jsx";
import Sidebar from "./layouts/Sidebar.jsx";

import PartnerList from "./pages/PartnerList.jsx";
import PartnerCreate from "./pages/PartnerCreate.jsx";
import StorageList from "./pages/StorageList.jsx";
import StorageCreate from "./pages/StorageCreate.jsx";

import EventList from "./pages/Event_promotion.jsx";
import employeeList from "./pages/EmployeeList.jsx";
import EmployeeList from "./pages/EmployeeList.jsx";
import EventAdd from "./pages/Event_add.jsx";
import EventEdit from "./pages/Eventedit.jsx";

import NoticeList from "./pages/Notice_promotion.jsx";
import NoticeAdd from './pages/NoticeAdd.jsx';
import NoticeEdit from './pages/NoticeEdit.jsx';

import ReviewTabs from './pages/ReviewTabs.jsx';
import ReviewEdit from './pages/ReviewEdit.jsx';

import FAQList from './pages/FAQList.jsx';
import FAQEdit from './pages/FAQEdit';
import FAQAdd from "./pages/FAQAdd.jsx";
function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="wrapper">
            <BrowserRouter>
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/partner/list" element={<PartnerList />} />
                    <Route path="/partner/create" element={<PartnerCreate />} />
                    <Route path="/partner/create/:partner_id" element={<PartnerCreate />} />
                    <Route path="/storage/list" element={<StorageList />} />
                    <Route path="/storage/create" element={<StorageCreate />} />

                    <Route path="/event-promotion" element={<EventList />} />
                    <Route path="/event-add" element={<EventAdd />} />
                    <Route path="/event-edit/:id" element={<EventEdit />} />
                    <Route path="/employee-list" element={<EmployeeList />} />

                    <Route path="/notice-promotion" element={<NoticeList />} />
                    <Route path="/notice-add" element={<NoticeAdd />} />
                    <Route path="/notice-edit/:id" element={<NoticeEdit />} />

                    <Route path="/review" element={<ReviewTabs />} />
                    <Route path="/review-edit/:id" element={<ReviewEdit />} />

                    <Route path="/faq/list" element={<FAQList />} />
                    <Route path="/faq-edit/:id" element={<FAQEdit />} />
                    <Route path="/faq-add" element={<FAQAdd />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
