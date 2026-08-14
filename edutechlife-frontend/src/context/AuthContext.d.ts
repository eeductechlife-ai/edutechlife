import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

/**
 * Declaración de tipos para context/AuthContext.jsx (JS puro).
 * Sin esta declaración, `useAuth()` infiere `user: null` (literal) y los
 * consumidores TS ven `user` como `never`.
 */

export interface ProfileRecord {
  id?: string;
  email?: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  profile: ProfileRecord | null;
  loading: boolean;
  error: Error | null;
  isSignedIn: boolean;
  userId: string | null;
  email: string | null;
  signUp: (data: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ user: User | null; token?: string }>;
  signIn: (data: {
    email: string;
    password: string;
  }) => Promise<{ user: User | null; token?: string }>;
  signOut: () => Promise<void>;
}

export declare const AuthProvider: (props: {
  children: ReactNode;
}) => JSX.Element;

export declare function useAuth(): AuthState;