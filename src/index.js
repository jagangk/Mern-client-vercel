import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
const rootElement = createRoot(root);
rootElement.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
reportWebVitals();
