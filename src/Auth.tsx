import React, { createContext, ReactNode, useState } from "react";
import { Loader } from "./components/UI/Loader";
import { useHistory } from "react-router";
import { signIn } from "./services/userAPI";

export interface AuthContextType {
  token: string;
  loading: boolean;
  login: (username: string, password: string) => void;
  error?: any;
}
export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();

  const login = (username: string, password: string) => {
    setLoading(true);

    signIn(username, password)
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        history.push("/");
      })
      .catch((newError) => {
        setError(newError);
        const timer = setTimeout(() => {
          clearTimeout(timer);
          setError(false);
        }, 5000);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <Loader />;
  }

  const value = {
    token,
    loading,
    error,
    login,
  };

  return (
    <AuthContext.Provider value={value as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
};
