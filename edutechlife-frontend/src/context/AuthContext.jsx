import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";

// Default no-op auth state so consumers always get a valid object even
// during transient hook failures (avoids crashing the app tree).
const defaultAuth = {
  user: null,
  profile: null,
  loading: true,
  error: null,
  isSignedIn: false,
  userId: null,
  email: null,
  signUp: async () => {
    throw new Error("Auth not initialized");
  },
  signIn: async () => {
    throw new Error("Auth not initialized");
  },
  signOut: async () => {
    throw new Error("Auth not initialized");
  },
};

const AuthContext = createContext(defaultAuth);

export const AuthProvider = ({ children }) => {
  const auth = useSupabaseAuth() || defaultAuth;

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // Always returns a valid auth object (defaultAuth if provider missing)
  return context || defaultAuth;
};
