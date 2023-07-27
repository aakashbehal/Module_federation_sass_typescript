import React from 'react'
import { HashRouter, Route, Routes } from "react-router-dom"
import DocumentManager from './components/DocumentManager';

const App = () => {
    return (
        <HashRouter basename='/document_manager'>
            <Routes>
                <Route path="/my_documents" element={<DocumentManager />} />
            </Routes>
        </HashRouter>
    )
}

export default App