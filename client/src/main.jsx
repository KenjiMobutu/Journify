import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SearchContextProvider from './context/SearchContext'
import AuthenticationContextProvider from './context/AuthenticationContext'
import { SocketProvider } from './context/SocketContext';
import { StripeProvider } from './context/StripeContext.jsx'
import { Provider } from 'react-redux'
import { setupStore } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { PersistorProvider } from './context/PersistorContext';
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query';
import { ChatProvider } from './context/ChatContext';

// Create a client
const queryClient = new QueryClient()

const userId = localStorage.getItem('userId'); // Obtenu lors de l'authentification

const { store, persistor } = setupStore(userId);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistorProvider persistor={persistor}>
          <AuthenticationContextProvider>
          <SocketProvider>
            <SearchContextProvider>
              <StripeProvider>
                <QueryClientProvider client={queryClient}>
                  <ChatProvider>
                    <App />
                  </ChatProvider>
                </QueryClientProvider>
              </StripeProvider>
            </SearchContextProvider>
          </SocketProvider>
          </AuthenticationContextProvider>
        </PersistorProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
