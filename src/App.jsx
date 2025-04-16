import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState} from 'react'

import './App.css'

import Home from "./pages/Home.jsx";
import Reservation from "./pages/reservation/Reservation.jsx";
import Sidebar from "./layouts/Sidebar.jsx";
import NewReservationAddPage from "./pages/reservation/NewReservationAddPage.jsx";

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <div className="wrapper">
                <BrowserRouter>
                    <Sidebar></Sidebar>
                    <Routes>
                        <Route path="/admin" element={<Home/>}></Route>
                        <Route path="/reservation" element={<Reservation/>}/>
                        <Route path="/newreservationadd" element={<NewReservationAddPage/>}/>
                    </Routes>
                </BrowserRouter>
            </div>
        </>
    )
}

export default App
