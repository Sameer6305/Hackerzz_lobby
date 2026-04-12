import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import logoImg from './Img/logo.png';

const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
faviconLink.rel = 'icon';
faviconLink.type = 'image/png';
faviconLink.href = logoImg;
document.head.appendChild(faviconLink);

const appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") || document.createElement('link');
appleTouchIcon.rel = 'apple-touch-icon';
appleTouchIcon.href = logoImg;
document.head.appendChild(appleTouchIcon);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
