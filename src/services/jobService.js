import axios from "axios";

const BASE_URL = `"${import.meta.env.VITE_APP_API_URL}/data/jobs"`;

/**
 * @param {Array} jobIds 
 * @param {string} email
 */
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

