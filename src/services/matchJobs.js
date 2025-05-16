

import stringSimilarity from "string-similarity";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const matchJobs = async (skills, jobs) => {
    console.log("skills", skills, "jobs", jobs);
    try {
        const response = await axios.post(`${API_URL}/match`, {
            skills,
            jobs
        });
        return response.data;
    } catch (error) {
        console.error("Error matching jobs:", error?.response?.data || error.message);
        throw new Error("Failed to match jobs. Please try again later.");
    }
};


export const newMatch = async (skills, jobs) => {
    const userSkills = skills.map(s => s.toLowerCase());

    const matchedJobs = jobs
        .map(job => {
            // Use job.tags if available, otherwise split the title into words
            const rawSkills = job.tags?.length
                ? job.tags
                : job.title?.split(/\s|[-,()]+/) || [];

            const jobSkills = rawSkills.map(s => s.toLowerCase()).filter(Boolean);

            let matchCount = 0;
            let matchedSkills = [];

            jobSkills.forEach(jobSkill => {
                const { bestMatch } = stringSimilarity.findBestMatch(jobSkill, userSkills);
                if (bestMatch.rating >= 0.7) {
                    matchCount++;
                    matchedSkills.push(jobSkill);
                }
            });

            const score = jobSkills.length > 0 ? matchCount / jobSkills.length : 0;

            return {
                ...job,
                matchScore: score,
                matchedSkills,
            };
        })
        .filter(job => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);

    return matchedJobs;
};
