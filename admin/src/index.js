import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthenticationContextProvider from './context/AuthenticationContext'
import App from './App';
import { DarkModeProvider } from './context/darkModeContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthenticationContextProvider>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </AuthenticationContextProvider>
  </React.StrictMode>
);
