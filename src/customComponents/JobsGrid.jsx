import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useJobData } from "../Context/jobDataProvider";
import { Skeleton } from "../components/ui/skeleton";
import { JobsGridLayout } from "./JobsGrid/JobsGridLayout";
import { ScrollArea } from "../components/ui/scroll-area";

export function JobsGrid() {
  const { jobs, isLoading } = useJobData();

  const randomJobs = React.useMemo(() => {
    if (!jobs) return [];
    return [...jobs]
      .sort(() => Math.random() - 0.5)
      .slice(0, 27);
  }, [jobs]);
console.log("randomJobs", randomJobs);
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-[80vw] mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <JobGridSkeleton />
          ) : (
            <ScrollArea className="h-[calc(100vh-160px)] rounded-lg border">
              <JobsGridLayout 
                jobs={randomJobs}
                scrollClassName="h-[calc(100vh-160px)]"
              />
            </ScrollArea>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const JobGridSkeleton = ({ count = 27 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="h-64 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4"
      >
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-slate-800 rounded-lg" />
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800 rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded-lg" />
            <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-slate-800 rounded-lg" />
          </div>
          <Skeleton className="h-24 w-full bg-gray-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);