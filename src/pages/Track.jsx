import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";
import { useSavedJobs } from "../Context/SavedJobContext";
import useUserData from "../Context/UserContext";
import { FilterControls } from "../customComponents/SavedJobs/FilterControls";
import { StatusCards } from "../customComponents/SavedJobs/StatusCards";
import { JobTable } from "../customComponents/SavedJobs/JobTable";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BellDotIcon, BellIcon, Trash2 } from "lucide-react";
import axios from "axios";

export default function JobDashboard() {
  const { savedJobs } = useSavedJobs();
  const { userData } = useUserData();
  const [jobsData, setJobsData] = useState([]);
  const [notes, setNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [userNotificationPreference, setUserNotificationPreference] = useState();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setJobsData(savedJobs);
  }, [savedJobs]);

  useEffect(() => {
    if (userData?.notifyAboutExpiringJobs !== undefined) {
      setUserNotificationPreference(userData.notifyAboutExpiringJobs);
      setLoading(false);
    }
  }, [userData, userData?.notifyAboutExpiringJobs]);

  const handleStatusChange = (jobId, newStatus) => {
    setJobsData((prev) =>
      prev.map((job) =>
        job.jobId === jobId ? { ...job, status: newStatus } : job
      )
    );
  };

  const toggleNotifications = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/notify/toggle-expiring-jobs`,
        { email: userData.email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data.success) {
        console.log("Notification preference updated:", response.data.notifyAboutExpiringJobs);
        setUserNotificationPreference(response.data.notifyAboutExpiringJobs);
        toast.success("Notification preference updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update notification preference");
      }
    } catch (error) {
      console.error("Error updating preference:", error);
      toast.error("Failed to update notification preference");
    }
  };


  const handleSelectAll = (checked) => {
    const ids = filteredJobs.map((job) => job.jobId);
    setSelectedJobs((prev) => {
      const next = new Set(prev);
      if (checked) {
        ids.forEach((id) => next.add(id));
      } else {
        ids.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (!selectedJobs.size || !userData?.email) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/data/jobs/delete`,
        {
          data: {
            jobs: Array.from(selectedJobs),
            email: userData.email,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) throw new Error("Failed to delete jobs");
      setJobsData((prev) => prev.filter((job) => !selectedJobs.has(job.jobId)));
      setSelectedJobs(new Set());
      toast.success("Jobs deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete jobs");
    }
  };

  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate =
      !dateFilter ||
      (job.date && new Date(job.date).toDateString() === dateFilter.toDateString());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <>
      <Toaster position="center-top" />
      <Helmet>
        <title>Job Application Tracker | Zobly</title>
        <meta
          name="description"
          content="Track your job applications and keep an eye on saved job listings with Zobly's job status tracking feature."
        />
        <meta
          name="keywords"
          content="job application tracking, saved jobs, job status, career tracker, job search management, Zobly"
        />
        <meta name="author" content="Zobly" />
        <meta property="og:title" content="Job Application Tracker | Zobly" />
        <meta
          property="og:description"
          content="Track your job applications and keep an eye on saved job listings with Zobly's job status tracking feature."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.zobly.com/job-tracking" />
        <meta
          property="og:image"
          content="https://www.zobly.com/assets/job-tracker-banner.png"
        />
      </Helmet>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <div className="flex gap-4">
            <Button onClick={toggleNotifications}>

              {loading ? "Loading..." : userNotificationPreference ? "Turn Notifications Off" : "Turn Notifications On"}
              <span className="ml-2">
                {userNotificationPreference ? <BellDotIcon /> : <BellIcon />}
              </span>
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={!selectedJobs.size}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>

        <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </Card>

        <StatusCards
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          savedJobs={savedJobs}
          jobsData={jobsData}
        />
        <Card className="shadow-lg">
          <div className="relative">
            <JobTable
              filteredJobs={filteredJobs}
              selectedJobs={selectedJobs}
              handleSelectAll={handleSelectAll}
              handleStatusChange={handleStatusChange}
              setSelectedJobs={setSelectedJobs}
              notes={notes}
              setNotes={setNotes}
            />
            {filteredJobs.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No jobs found matching your criteria</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}