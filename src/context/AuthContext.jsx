import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = savedUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = savedUsers.some((u) => u.email === email);
    if (userExists) return false;

    const newUser = { name, email, password };
    savedUsers.push(newUser);
    localStorage.setItem("users", JSON.stringify(savedUsers));
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

