// StripeContext.js
import { createContext } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


// Utilisez le bon préfixe pour les variables d'environnement
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

// Charger Stripe avec la clé publique
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const StripeContext = createContext();

export const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={{}}>
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};
