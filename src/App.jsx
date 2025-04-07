import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from 'react'

import './App.css'

import Home from "./pages/Home.jsx";
import Sidebar from "./layouts/Sidebar.jsx";
import EventList from "./pages/Event_promotion.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="wrapper">
                <BrowserRouter>
                    <Sidebar></Sidebar>
                    <Routes>
                        <Route path="/" element={<Home/>}></Route>
                        <Route path="/event-promotion" element={<EventList />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
