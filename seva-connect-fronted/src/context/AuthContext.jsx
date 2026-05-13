import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async user fetch or check token validity
    const fetchUser = async () => {
      // e.g., fetch user from localStorage or API
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
