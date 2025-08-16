"use client";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { AuthStatus } from "../types/AuthStatus";

interface Props {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: Props) => {
  const router = useRouter();
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    const unsuscribe = useAuthStore.subscribe(({ authStatus }) => {
      if (authStatus === AuthStatus.CHECKING) {
        return;
      }

      if (authStatus === AuthStatus.UNAUTHENTICATED) {
        router.replace("/landing");
        return;
      }

      if (authStatus === AuthStatus.AUTHENTICATED) {
        router.replace("/home");
        return;
      }
    });

    checkAuthStatus();

    return () => {
      unsuscribe();
    };
  }, []);

  return <div>{children}</div>;
};
