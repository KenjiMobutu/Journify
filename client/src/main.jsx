import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import SearchContextProvider from './context/SearchContext'
import AuthenticationContextProvider from './context/AuthenticationContext'
import { StripeProvider } from './context/StripeContext.jsx'
import { Provider } from 'react-redux'
import { setupStore } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { PersistorProvider } from './context/PersistorContext';

const userId = localStorage.getItem('userId'); // Obtenu lors de l'authentification

const { store, persistor } = setupStore(userId);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistorProvider persistor={persistor}>
          <AuthenticationContextProvider>
            <SearchContextProvider>
              <StripeProvider>
                <App />
              </StripeProvider>
            </SearchContextProvider>
          </AuthenticationContextProvider>
        </PersistorProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
