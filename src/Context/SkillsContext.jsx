import React, { useEffect } from 'react'
import { createContext, useState } from 'react'
export const SkillsContext = createContext();


const SkillsContextProvider = ({ children }) => {
    const [globalSkills, setGlobalSkills] = useState([]);
    useEffect(() => {
        const globalSkills = localStorage.getItem("globalSkills");
        if (globalSkills) {
            setGlobalSkills(JSON.parse(globalSkills));
        }
    }, []);

    return (
        <SkillsContext.Provider value={{ globalSkills, setGlobalSkills }}>
            {children}
        </SkillsContext.Provider>
    )
}

export default SkillsContextProvider;