// SocketContext.js
import { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { AuthenticationContext } from './AuthenticationContext';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:3000'); // Remplacez par votre URL de serveur
      setSocket(newSocket);

      // Émettre l'événement loginUser après la connexion du socket
      newSocket.on('connect', () => {
        newSocket.emit('loginUser', user._id);
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      // Si l'utilisateur n'est pas connecté, s'assurer que le socket est déconnecté
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [ user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
