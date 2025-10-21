import { createContext, useContext } from "react";
import useSWR from "swr";
import axios from "axios";

const fetchJobs = async () => {
  const response = await axios.get(`https://z.satyamjha.me/jobs`);
  const jobs = response.data.allJobs;
  console.log("Jobs:", jobs);
  return jobs;
};


const JobDataContext = createContext();
export const JobDataProvider = ({ children }) => {
  const {
    data: jobs,
    error,
    isLoading,
  } = useSWR("jobsData", fetchJobs, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return (
    <JobDataContext.Provider
      value={{
        jobs: jobs || [],
        error,
        isLoading,
      }}
    >
      {children}
    </JobDataContext.Provider>
  );
};
export const useJobData = () => useContext(JobDataContext);