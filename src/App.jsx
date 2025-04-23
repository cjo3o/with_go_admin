import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faCheck, faPlay, faCircleStop, faArrowDown } from '@fortawesome/free-solid-svg-icons';
library.add(faArrowLeft, faCheck, faPlay, faCircleStop, faArrowDown);

import './App.css';
import 'antd/dist/reset.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from "./pages/Home.jsx";
import Sidebar from "./layouts/Sidebar.jsx";

import PartnerList from "./pages/PartnerList.jsx";
import PartnerCreate from "./pages/PartnerCreate.jsx";
import StorageList from "./pages/StorageList.jsx";
import StorageCreate from "./pages/StorageCreate.jsx";


import Admin from "./pages/Admin.jsx";


import EmployeeList from "./pages/EmployeeList.jsx";
import EventAdd from "./pages/Event_add.jsx";
import EventEdit from "./pages/Eventedit.jsx";
import Login from "./pages/Login.jsx";

import EventList from "./pages/EventList.jsx";

import NoticeList from "./pages/NoticeList.jsx";

import NoticeAdd from './pages/NoticeAdd.jsx';
import NoticeEdit from './pages/NoticeEdit.jsx';

import ReviewTabspage from './pages/ReviewTabspage.jsx';
import ReviewEdit from './pages/ReviewEdit.jsx';

import FAQEdit from './pages/FAQEdit';
import FAQAdd from "./pages/FAQAdd.jsx";

import Memberlist from "./pages/Memberlist.jsx";
import DriverList from "./pages/DriverList.jsx";
import DriverRegistration from "./pages/DriverRegistration.jsx";

import FAQTabspage from './pages/FAQTabspage.jsx';

import InquiryTabs from './pages/InquiryTabspage.jsx';
import InquiryEdit from './pages/InquiryEdit.jsx';


function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="wrapper">
            <BrowserRouter>
                <Sidebar />
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/Admin" element={<Admin/>}/>
                    <Route path="/Memberlist" element={<Memberlist/>}/>
                    <Route path="/DriverList" element={<DriverList/>}/>
                    <Route path="/DriverRegistration" element={<DriverRegistration/>}></Route>
                    <Route path="/partner/list" element={<PartnerList/>}/>
                    <Route path="/partner/create" element={<PartnerCreate/>}/>
                    <Route path="/partner/create/:partner_id" element={<PartnerCreate />} />
                    <Route path="/storage/list" element={<StorageList/>}/>
                    <Route path="/storage/create" element={<StorageCreate/>}/>

                    <Route path="/event/list" element={<EventList />} />
                    <Route path="/event-add" element={<EventAdd />} />
                    <Route path="/event-edit/:id" element={<EventEdit />} />
                    <Route path="/employee-list" element={<EmployeeList />} />

                    <Route path="/notice-promotion" element={<NoticeList />} />
                    <Route path="/notice-add" element={<NoticeAdd />} />
                    <Route path="/notice-edit/:id" element={<NoticeEdit />} />

                    <Route path="/review" element={<ReviewTabspage />} />
                    <Route path="/review-edit/:id" element={<ReviewEdit />} />

                    <Route path="/faq/list" element={<FAQTabspage />} />
                    <Route path="/faq-edit/:id" element={<FAQEdit />} />
                    <Route path="/faq-add" element={<FAQAdd />} />

                    <Route path="/inquiry/list" element={<InquiryTabs />} />
                    <Route path="/inquiry-edit/:id" element={<InquiryEdit />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
