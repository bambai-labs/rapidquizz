import { create } from "zustand";
import { AuthStatus } from "@/modules/auth/types/AuthStatus";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  authStatus: AuthStatus;
  login: (user: User) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authStatus: AuthStatus.CHECKING,
  login: (user) => {
    set({ user, authStatus: AuthStatus.AUTHENTICATED });
    localStorage.setItem("user", JSON.stringify({ user }));
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, authStatus: AuthStatus.UNAUTHENTICATED });
  },
  checkAuthStatus: () => {
    const user = localStorage.getItem("user");
    if (user) {
      set({ user: JSON.parse(user), authStatus: AuthStatus.AUTHENTICATED });
      return;
    }

    set({ authStatus: AuthStatus.UNAUTHENTICATED });
  },
}));
