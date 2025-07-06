// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { SongProvider } from './context/songContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <SongProvider>
      <App />
    </SongProvider>
    </BrowserRouter>
  </React.StrictMode>
);
