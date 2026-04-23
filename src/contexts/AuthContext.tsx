
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'manager' | 'employee' | null;
  userEmail: string | null;
  login: (token: string, role: 'manager' | 'employee', email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'manager' | 'employee' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const authData = authService.getAuthData();
    if (authData.token && authData.role && authData.email) {
      setIsAuthenticated(true);
      setUserRole(authData.role as 'manager' | 'employee');
      setUserEmail(authData.email);
    }
  }, []);

  const login = (token: string, role: 'manager' | 'employee', email: string) => {
    authService.saveAuthData(token, role, email);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    authService.clearAuthData();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
