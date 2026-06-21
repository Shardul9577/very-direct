import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const verify = useCallback(async () => {
    const token = localStorage.getItem('vd_token');
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }
    try {
      const data = await adminApi.verify();
      setAdmin(data.valid ? { username: data.username } : null);
      if (!data.valid) localStorage.removeItem('vd_token');
    } catch {
      setAdmin(null);
      localStorage.removeItem('vd_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verify();
  }, [verify]);

  const login = async (username, password) => {
    const data = await adminApi.login(username, password);
    localStorage.setItem('vd_token', data.token);
    setAdmin({ username: data.username });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('vd_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
