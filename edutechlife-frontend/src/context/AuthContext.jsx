import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useSupabaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
