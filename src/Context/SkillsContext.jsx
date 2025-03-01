import React from 'react'
import { createContext, useState } from 'react'

export const SkillsContext = createContext();

const SkillsContextProvider = ({ children }) => {
    const [globalSkills, setGlobalSkills] = useState([]);

    return (
        <SkillsContext.Provider value={{ globalSkills, setGlobalSkills }}>
            {children}
        </SkillsContext.Provider>
    )
}

export default SkillsContextProvider;