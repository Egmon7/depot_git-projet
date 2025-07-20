// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';
import { LoginCredentials, User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/test-protected/');
          const userData = response.data.user;
          setAuthState({
            user: {
              id: userData.id,
              nom: userData.nom,
              postnom: userData.postnom,
              prenom: userData.prenom,
              email: userData.email,
              sexe: userData.sexe,
              circonscription: userData.circonscription,
              role: userData.role,
              partie_politique: userData.partie_politique,
              poste_partie: userData.poste_partie,
              direction: userData.direction,
              groupe_parlementaire: userData.groupe_parlementaire,
              statut: userData.statut,
            },
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem('role', userData.role);
          localStorage.setItem('email', userData.email);
        } catch (err) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('email');
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post('/login/', credentials);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', credentials.email);
      const userData = response.data.user || {};
      setAuthState({
        user: {
          id: userData.id || '',
          nom: userData.nom || '',
          postnom: userData.postnom || '',
          prenom: userData.prenom || '',
          email: credentials.email,
          sexe: userData.sexe || 'homme',
          circonscription: userData.circonscription || '',
          role: response.data.role,
          partie_politique: userData.partie_politique || '',
          poste_partie: userData.poste_partie || '',
          direction: userData.direction || '',
          groupe_parlementaire: userData.groupe_parlementaire || '',
          statut: userData.statut || true,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      throw new Error('Échec de la connexion');
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  };

  const updateUser = (updatedData: Partial<User>) => {
    setAuthState((prevState) => {
      if (!prevState.user) return prevState;
      return {
        ...prevState,
        user: {
          ...prevState.user,
          ...updatedData,
        },
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};