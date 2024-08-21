import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SearchContextProvider from './context/SearchContext'
import AuthenticationContextProvider from './context/AuthenticationContext'
import { StripeProvider } from './context/StripeContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthenticationContextProvider>
      <SearchContextProvider>
        <StripeProvider>
          <App />
        </StripeProvider>
      </SearchContextProvider>
    </AuthenticationContextProvider>
  </React.StrictMode>
)
