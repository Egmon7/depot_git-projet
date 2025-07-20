// frontend/src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/lib/api";
import { LoginCredentials, User } from "@/types/auth";

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Rechargement au refresh de page
  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get("/test-protected/");
        const userData = response.data;

        const parsedUser: User = {
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
        };

        setUser(parsedUser);
        setIsAuthenticated(true);
        setIsLoading(false);

        localStorage.setItem("role", userData.role);
        localStorage.setItem("email", userData.email);
      } catch (error) {
        console.error("Erreur lors du rechargement de l'utilisateur :", error);
        logout();
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post("/login/", credentials);
      const userData = response.data;

      const parsedUser: User = {
        id: userData.id,
        nom: userData.nom,
        postnom: userData.postnom,
        prenom: userData.prenom,
        email: credentials.email,
        sexe: userData.sexe || "homme",
        circonscription: userData.circonscription || "",
        role: response.data.role,
        partie_politique: userData.partie_politique || "",
        poste_partie: userData.poste_partie || "",
        direction: userData.direction || "",
        groupe_parlementaire: userData.groupe_parlementaire || "",
        statut: userData.statut ?? true,
      };

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", credentials.email);

      setUser(parsedUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (err) {
      throw new Error("Échec de la connexion");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
