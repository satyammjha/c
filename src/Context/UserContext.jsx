import { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [userData, setUserData] = useState(null);

    const fetchUserData = useCallback(async (email) => {
        try {
            console.log("Fetching user data for:", email);
            const response = await axios.post(
                "http://localhost:5000/data/fetchuserdata",
                { email: email }
            );
            setUserData(response.data.user);
            console.log("User data received:", response.data.user);
        } catch (error) {
            console.error("Error fetching user data:", error);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Response:", error.response.data);
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ userData, fetchUserData }}>
            {children}
        </UserContext.Provider>
    );
}

export default function useUserData() {
    return useContext(UserContext);
}