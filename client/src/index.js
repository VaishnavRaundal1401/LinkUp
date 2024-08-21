import React from "react";
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { ContextProvider } from "./SocketContext";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <ContextProvider>
        <App />
    </ContextProvider>
);
