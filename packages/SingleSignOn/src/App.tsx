import React from 'react'
import { BrowserRouter, HashRouter, MemoryRouter, Route, Routes, useResolvedPath } from "react-router-dom"
import Login from './components/Login';
import Registration from './components/Registration';


const App = () => {


    return (
        <HashRouter basename='/authentication'>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
            </Routes>
        </HashRouter>
    )
}

export default App