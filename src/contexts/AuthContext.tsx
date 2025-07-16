import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthState, LoginCredentials, RegisterData } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const mockUsers: User[] = [
  {
    id: "1",
    email: "president@assemblee.cd",
    firstName: "Prospere",
    lastName: "Egmon",
    role: "president",
    isActive: true,
  },
  {
    id: "2",
    email: "depute1@assemblee.cd",
    firstName: "Marie",
    lastName: "Mukendi",
    role: "depute",
    parlementaryGroup: "UDPS",
    constituency: "Funa",
    isActive: true,
  },
  {
    id: "3",
    email: "rapporteur@assemblee.cd",
    firstName: "Jean",
    lastName: "Tshisekedi",
    role: "rapporteur",
    isActive: true,
  },
  {
    id: "4",
    email: "bureau@assemblee.cd",
    firstName: "Claude",
    lastName: "Nyembo",
    role: "bureau_etudes",
    isActive: true,
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored authentication
    const storedUser = localStorage.getItem("legislativeApp_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        localStorage.removeItem("legislativeApp_user");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Mock authentication
    const user = mockUsers.find((u) => u.email === credentials.email);

    if (user && credentials.password === "password") {
      localStorage.setItem("legislativeApp_user", JSON.stringify(user));
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw new Error("Identifiants invalides");
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      parlementaryGroup: data.parlementaryGroup,
      constituency: data.constituency as any,
      isActive: true,
    };

    mockUsers.push(newUser);
    localStorage.setItem("legislativeApp_user", JSON.stringify(newUser));

    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem("legislativeApp_user", JSON.stringify(user));
    setAuthState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        login,
        register,
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
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};