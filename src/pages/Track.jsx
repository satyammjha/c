import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import useUserData from '../Context/UserContext'
import { FilterControls } from "../components/SavedJobs/FilterControls";
import { StatusCards } from "../components/SavedJobs/StatusCards";
import { JobTable } from "../components/SavedJobs/JobTable";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";

export default function JobDashboard() {
  const { userData } = useUserData();
  const [jobsData, setJobsData] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notes, setNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJobs, setSelectedJobs] = useState(new Set());

  useEffect(() => {
    setSavedJobs(userData.savedJobs || []);
    setJobsData(userData.savedJobs || []);
    console.log("User's saved jobs:", userData.savedJobs);
  }, [userData.savedJobs]);

  const handleStatusChange = (jobId, newStatus) => {
    setJobsData((prev) =>
      prev.map((job) =>
        job.jobId === jobId ? { ...job, status: newStatus } : job
      )
    );
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
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Applications</h1>
          <div className="flex gap-4">
            <Button
              variant="destructive"

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