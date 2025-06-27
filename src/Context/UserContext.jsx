import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        if (savedUser && savedToken) {
            setUserData(JSON.parse(savedUser));
            setToken(savedToken);
        }
    }, []);

    const setUser = (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUserData(user);

        if (token !== undefined) {
            localStorage.setItem("token", token);
            setToken(token);
            console.log("Token updated:", token);
        } else {
            console.log("Token untouched");
        }

        console.log("User data set in localStorage:", user);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUserData(null);
        setToken(null);
    };

    return (
        <UserContext.Provider value={{ userData, token, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export default function useUserData() {
    return useContext(UserContext);
}