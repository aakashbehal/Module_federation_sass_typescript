import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import "./index.sass"

const container = document.getElementById('app')!;
const root = createRoot(container)
root.render(
    <App />
)