import axios from "axios";
import useUserData from "../Context/UserContext";
const BASE_URL = `${import.meta.env.VITE_APP_API_URL}`;
// const BASE_URL = `http://localhost:7000`;
console.log("Base URL:", BASE_URL);

/**
 * @param {Array} jobIds 
 * @param {string} email 
 */

export const saveJob = async (job, token) => {
  try {
    console.log("Saving job with token:", token);
    console.log("Saving job:", job);

    const response = await axios.post(`${BASE_URL}/jobs/save`, job, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (data.message === "Job already saved") {
      console.warn("Job was already saved.");
    } else {
      console.log("Job saved successfully:", data);
    }

    return data;

  } catch (error) {
    console.error("Error saving job:", error);
    throw error;
  }
};


export const getSavedJobs = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/saved`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Fetched saved jobs:", response.data);
    return response.data;

  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    throw error;
  }
}

export const deleteJobs = async (jobIds, email) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete`, {
      data: { jobs: jobIds, email },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting jobs:", error);
    throw error;
  }
};