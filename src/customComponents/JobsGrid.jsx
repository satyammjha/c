import React, { useContext, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobData } from "../Context/jobDataProvider";
import useUserData from "../Context/UserContext";
import { MatchedJobsContext } from "../Context/MatchedJobs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Toaster } from "../components/ui/sonner";
import { Skeleton } from "../components/ui/skeleton";
import {
    NoJobsFound,
    LoginPrompt
} from "../customComponents/JobsGrid/EmptyStates";
import { JobsGridLayout } from "./JobsGrid/JobsGridLayout";

export function JobsGrid() {
    const { jobs, isLoading } = useJobData();
    const [searchQuery, setSearchQuery] = React.useState("");
    const { userData } = useUserData();
    const { matchedJobs } = useContext(MatchedJobsContext);

    const filterJobs = (jobsArray) => {
        if (!Array.isArray(jobsArray)) return [];
        const searchLower = searchQuery.toLowerCase().trim();
        return jobsArray.filter(job => {
            return (
                job.title?.toLowerCase().includes(searchLower) ||
                job.company?.toLowerCase().includes(searchLower) ||
                job.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        });
    };

    const filteredJobs = useMemo(() => filterJobs(jobs), [jobs, searchQuery]);
    const filteredMatchedJobs = useMemo(
        () => filterJobs(matchedJobs?.matchedJobs || []),
        [matchedJobs, searchQuery]
    );

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
            <div className="max-w-[80vw] mx-auto space-y-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                >
                    <Input
                        placeholder="Search roles, companies, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-2xl h-14 rounded-xl shadow-lg px-6 text-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4"
                        aria-label="Job search input"
                    />
                </motion.div>

                <Tabs
                    defaultValue={userData ? "matched" : "all"}
                    className="w-full"
                    orientation="vertical"
                >
                    <TabsList className="h-auto flex flex-col sm:flex-row items-stretch sm:justify-center gap-2 w-full p-2 bg-transparent">
                        {userData && (
                            <TabsTrigger
                                value="matched"
                                className="h-14 px-8 text-base data-[state=active]:shadow-lg rounded-xl"
                            >
                                🎯 Personalized Matches
                            </TabsTrigger>
                        )}
                        <TabsTrigger
                            value="all"
                            className="h-14 px-8 text-base data-[state=active]:shadow-lg rounded-xl"
                        >
                            🌐 All Opportunities
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        {userData ? (
                            <TabsContent value="matched" className="mt-8 relative">
                                {isLoading ? (
                                    <JobGridSkeleton />
                                ) : matchedJobs.length ? (
                                    <JobsGridLayout
                                        jobs={matchedJobs}
                                        scrollClassName="h-[calc(100vh-320px)]"
                                    />
                                ) : (
                                    <NoJobsFound />
                                )}
                            </TabsContent>
                        ) : (
                            <TabsContent value="matched" className="mt-8">
                                <LoginPrompt />
                            </TabsContent>
                        )}

                        <TabsContent value="all" className="mt-8">
                            {isLoading ? (
                                <JobGridSkeleton />
                            ) : filteredJobs.length ? (
                                <JobsGridLayout
                                    jobs={filteredJobs}
                                    scrollClassName="h-[calc(100vh-320px)]"
                                />
                            ) : (
                                <NoJobsFound />
                            )}
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
                <Toaster position="bottom-left" theme="system" richColors />
            </div>
        </section>
    );
}

const JobGridSkeleton = ({ count = 8 }) => (
    <div className="grid md:auto-rows-[100rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
            <div
                key={i}
                className="h-full rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 overflow-hidden"
            >
                <div className="h-full p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-3 w-[90%]">
                                <Skeleton className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-slate-800" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-slate-800" />
                                    <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800" />
                                </div>
                            </div>
                            <Skeleton className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                            <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                            <Skeleton className="h-6 w-24 bg-gray-200 dark:bg-slate-800 rounded-xl" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                            <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-full bg-gray-200 dark:bg-slate-800 rounded-xl" />
                </div>
            </div>
        ))}
    </div>
);