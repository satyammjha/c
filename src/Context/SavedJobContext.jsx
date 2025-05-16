import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import useUserData from "./UserContext";
import axios from "axios";

const SavedJobsContext = createContext();

export const SavedJobsProvider = ({ children }) => {
    const { userData } = useUserData();
    const [savedJobs, setSavedJobs] = useState([]);
    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!userData?.email) return;
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/data/jobs/saved`, {
                    params: { email: userData.email }
                });
                setSavedJobs(response.data.savedJobs || []);
            } catch (error) {
                console.error("Error fetching saved jobs:", error);
            }
        };
        fetchSavedJobs();
    }, [userData?.email]);

    useEffect(() => {
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    }, [savedJobs]);

    const saveJobToServer = async (job) => {
        if (!userData?.email) return;
        try {
            await axios.post(`http://z-lb-1738654449.ap-south-1.elb.amazonaws.com/data/jobs/save`, {
                email: userData.email,
                jobs: [job],
            });
            console.log("Job saved successfully:", job);
        } catch (error) {
            console.error("Error saving job:", error);
        }
    };

    const debouncedSaveJob = useCallback(debounce(saveJobToServer, 500), [userData?.email]);

    const saveJob = (job) => {
        if (!savedJobs.some((saved) => saved.jobId === job.jobId)) {
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