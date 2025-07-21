
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Initializing application...');

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

console.log('Creating root...');
const root = createRoot(container);

console.log('Rendering app...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
