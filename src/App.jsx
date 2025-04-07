import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from 'react'

import './App.css'

import Home from "./pages/Home.jsx";
import Sidebar from "./layouts/Sidebar.jsx";
<<<<<<< HEAD
import PartnerList from "./pages/PartnerList.jsx";
import PartnerCreate from "./pages/PartnerCreate.jsx";
import StorageList from "./pages/StorageList.jsx";
import StorageCreate from "./pages/StorageCreate.jsx";

=======
import EventList from "./pages/Event_promotion.jsx";
>>>>>>> hem

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="wrapper">
                <BrowserRouter>
                    <Sidebar></Sidebar>
                    <Routes>
                        <Route path="/" element={<Home/>}></Route>
<<<<<<< HEAD
                        <Route path="/partner/list" element={<PartnerList />} />
                        <Route path="/partner/create" element={<PartnerCreate />} />
                        <Route path="/storage/list" element={<StorageList />} />
                        <Route path="/storage/create" element={<StorageCreate />} />
=======
                        <Route path="/event-promotion" element={<EventList />} />
>>>>>>> hem
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
