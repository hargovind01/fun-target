import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // Timer state
  const [mode, setMode] = useState(1); // Default mode from localStorage
  const authorizationToken = `Bearer ${token}`;

  const storeTokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };

  let isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken("");
    setUser("");
    localStorage.removeItem("token");
    localStorage.removeItem("mode");
  };

  const userAuthentication = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsLoading(false);
      } else {
        console.error("Error Fetching User Data");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTimer = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/timer");
      if (response.ok) {
        const data = await response.json();
        setTimeLeft(data.timeLeft);
      } else {
        console.error("Error Fetching Timer");
      }
    } catch (error) {
      console.error("Timer Fetch Error:", error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");

    // Listen for mode changes from the server
    socket.on("modeChange", (newMode) => {
      console.log("Mode updated via socket:", newMode);
      setMode(newMode);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateMode = (newMode) => {
    setMode(newMode); // Update the local state
    const socket = io("http://localhost:8000");
    socket.emit("modeChange", newMode); // Notify the server
  };

  useEffect(() => {
    userAuthentication();

    const timerInterval = setInterval(() => {
      fetchTimer();
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        authorizationToken,
        isLoading,
        timeLeft,
        mode,
        updateMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authcontextValue = useContext(AuthContext);

  if (!authcontextValue) {
    throw new Error("useAuth used outside of the Provider");
  }

  return authcontextValue;
};
