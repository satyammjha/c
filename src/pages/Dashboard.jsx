import React, { useState, useEffect } from "react";
import JobDetails from "../customComponents/JobDetails";
import JobItem from "../customComponents/JobItem";
import { Card } from "../components/ui/card";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Helmet } from "react-helmet-async";
import { useJobData } from "../Context/jobDataProvider";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Filter, Star, List, X } from "lucide-react";

const Dashboard = () => {
    const { jobs } = useJobData();
    const [activeJob, setActiveJob] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [activeTab, setActiveTab] = useState("all");
    useEffect(() => {
        if (jobs.length > 0) {
            setActiveJob(jobs[0]);
            setFilteredJobs(jobs);
        }
    }, [jobs]);

    useEffect(() => {
        let filtered = jobs;

        if (activeTab === "recommended") {
            filtered = filtered.filter((job) => job.isRecommended);
        }

        filtered = filtered.filter(
            (job) =>
                job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredJobs(filtered);
    }, [searchQuery, jobs, activeTab]);

    const clearSearch = () => {
        setSearchQuery("");
    };

    return (
        <>
            <Helmet>
                <title>Job Listings Dashboard | Zobly</title>
                <meta
                    name="description"
                    content="Explore job listings from multiple sources and find the best opportunities tailored for you."
                />
                <meta
                    name="keywords"
                    content="job listings, job search, career opportunities, job board, Zobly"
                />
                <meta name="author" content="Zobly" />
                <meta property="og:title" content="Job Listings Dashboard | Zobly" />
                <meta
                    property="og:description"
                    content="Explore job listings from multiple sources and find the best opportunities tailored for you."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.zobly.com/dashboard" />
                <meta
                    property="og:image"
                    content="https://www.zobly.com/assets/job-dashboard-banner.png"
                />
            </Helmet>
            <SignedIn>
                <div className="flex flex-col bg-background p-4">
                    <div className="sticky top-0 bg-background z-10 py-4 shadow-sm">
                        <div className="container mx-auto px-4">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                                <h1 className="text-2xl font-bold whitespace-nowrap">
                                    Job Listings{" "}
                                    <span className="text-muted-foreground">
                                        ({filteredJobs.length} jobs)
                                    </span>
                                </h1>

                                <Tabs
                                    value={activeTab}
                                    onValueChange={setActiveTab}
                                    className="w-full md:w-auto"
                                >
                                    <TabsList className="grid grid-cols-2 w-full md:w-[300px]">
                                        <TabsTrigger value="all" className="flex items-center justify-center">
                                            <List className="h-4 w-4 mr-2" />
                                            All Jobs
                                        </TabsTrigger>
                                        <TabsTrigger value="recommended" className="flex items-center justify-center">
                                            <Star className="h-4 w-4 mr-2" />
                                            Recommended
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 min-w-[200px]">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Search jobs..."
                                            className="pl-10 pr-10 py-2 w-full rounded-lg border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                        {searchQuery && (
                                            <X
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary"
                                                onClick={clearSearch}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 gap-4">
                        <Card className="w-1/3 p-4 overflow-y-auto max-h-[calc(100vh-200px)] border-none hide-scrollbar">
                            <div className="space-y-4">
                                {filteredJobs.map((job, index) => (
                                    <JobItem
                                        key={index}
                                        {...job}
                                        onClick={() => {
                                            console.log("Job Clicked:", job.title);
                                            setActiveJob(job);
                                        }}
                                    />
                                ))}
                                {filteredJobs.length === 0 && (
                                    <p className="text-center text-muted-foreground">
                                        No jobs found.
                                    </p>
                                )}
                            </div>
                        </Card>

                        <div className="w-[2px] bg-muted mx-2"></div>
                        <Card className="flex-1 p-6 border-none max-h-[calc(100vh-200px)] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">Job Details</h2>
                            {activeJob ? (
                                <JobDetails job={activeJob} />
                            ) : (
                                <p className="text-muted-foreground">
                                    Select a job to view details.
                                </p>
                            )}
                        </Card>
                    </div>
                </div>
            </SignedIn>

            <SignedOut>
                <h1>Sign In to See Dashboard</h1>
            </SignedOut>
        </>
    );
};

export default Dashboard;