import React from 'react';
import { createRoot } from 'react-dom/client'
import { ThemeProvider, DefaultTheme } from "react-jss";
import App from './App';
import './index.sass'

export interface ICustomTheme {
    "bittersweet": string
    "dull_lavender": string
    "san_marino": string
    "background": string
}

export const CustomTheme: ICustomTheme = {
    'bittersweet': "#FF7765",
    'dull_lavender': "#9198e5",
    'san_marino': "#3f589e",
    'background': "rgb(232, 240, 254)",
};

const container = document.getElementById('app')!;
const root = createRoot(container)
root.render(
    <ThemeProvider theme={CustomTheme}>
        <App />
    </ThemeProvider>
)