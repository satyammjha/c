import React, { createContext, useState } from 'react';

export const JdContext = createContext();

export const JdProvider = ({ children }) => {
    const [Jd, setJd] = useState('');

    return (
        <JdContext.Provider value={{ Jd, setJd }}>
            {children}
        </JdContext.Provider>
    );
};
