import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        const storedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
        setSavedJobs(storedJobs);
    }, []);

    useEffect(() => {
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    }, [savedJobs]);

    const saveJobToServer = async (job) => {
        try {
            const response = await fetch("/api/save-job", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(job),
            });
            if (!response.ok) throw new Error("Failed to save job");
        } catch (error) {
            console.error(error);
        }
    };

    const debouncedSaveJob = useCallback(debounce(saveJobToServer, 500), []);

    const saveJob = (job) => {
        if (!savedJobs.some((saved) => saved._id === job._id)) {
            setSavedJobs((prev) => [...prev, job]);
            debouncedSaveJob(job);
        }
    };

    return (
        <SavedJobsContext.Provider value={{ savedJobs, saveJob }}>
            {children}
        </SavedJobsContext.Provider>
    );
};

export const useSavedJobs = () => {
    return useContext(SavedJobsContext);
};