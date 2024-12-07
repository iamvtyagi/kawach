import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fileId, setFileId] = useState(null);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);  // Save token to localStorage after getting from server
  };
  
  const setFile = (id) => { 
    setFileId(id);
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');  // Remove token on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setFile, fileId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
