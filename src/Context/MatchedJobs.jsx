import React, { createContext, useState, useEffect, useContext } from "react";
import { newMatch } from "../services/matchJobs";
import { SkillsContext } from "../Context/SkillsContext";
import { useJobData } from "../Context/jobDataProvider";
export const MatchedJobsContext = createContext();

const MatchedJobsContextProvider = ({ children }) => {
    const [matchedJobs, setMatchedJobs] = useState([]);
    const { globalSkills } = useContext(SkillsContext);
    const { jobs } = useJobData();
    useEffect(() => {

        if (!globalSkills?.length || !jobs?.length) {
            console.warn("🚫 Skipping API call: No skills or jobs.");
            return;
        }

        const match = async () => {
            try {
                const bestJobs = await newMatch(globalSkills, jobs);
                console.log("✅ Best matched jobs:", bestJobs);
                setMatchedJobs(bestJobs);
                console.log("Matched jobs set in context:", matchedJobs);
            } catch (error) {
                console.error("❌ Error fetching matched jobs:", error);
            }
        };

        match();
    }, [globalSkills, jobs]);

    return (
        <MatchedJobsContext.Provider value={{ matchedJobs }}>
            {children}
        </MatchedJobsContext.Provider>
    );
};

export default MatchedJobsContextProvider;