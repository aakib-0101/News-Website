import React, { useState, useEffect } from "react";
import axios from "axios";

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("${import.meta.env.VITE_API_URL}/user/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false); 
      }
    };

    fetchProfile();
  }, []);

  function login(userData, token) {
    setUser(userData);
    if (token) {
      localStorage.setItem("token", token);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
  }

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
export { UserProvider };