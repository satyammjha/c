import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './index.css';
import SkillsContextProvider from './Context/SkillsContext.jsx';
import { JdProvider } from './Context/JdContext.jsx';
import { UserProvider } from './Context/UserContext.jsx';
import { JobDataProvider } from './Context/jobDataProvider.jsx';
import { HelmetProvider } from 'react-helmet-async';
import MatchedJobsContextProvider from './Context/MatchedJobs.jsx';
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}
ReactDOM.createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">

        <HelmetProvider>
            <UserProvider>
                <JobDataProvider>
                    <JdProvider>
                        <SkillsContextProvider>
                            <React.StrictMode>
                                <BrowserRouter>
                                    <MatchedJobsContextProvider>
                                        <App />
                                    </MatchedJobsContextProvider>
                                </BrowserRouter>
                            </React.StrictMode>
                        </SkillsContextProvider>
                    </JdProvider>
                </JobDataProvider>
            </UserProvider>
        </HelmetProvider>
    </ClerkProvider>
);