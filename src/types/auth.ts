export type UserRole = "depute" | "president" | "rapporteur" | "bureau_etudes";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  parlementaryGroup?: string;
  constituency?: "Funa" | "Mont Amba" | "Lukunga" | "Tshangu";
  isActive: boolean;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  parlementaryGroup?: string;
  constituency?: string;
}
