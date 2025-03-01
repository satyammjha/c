import React from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";
import { useJobData } from "../Context/jobDataProvider";

export default function InfiniteMovingCardsDemo() {
  const { jobs, error, isLoading } = useJobData();

  return (
    <div className="w-screen overflow-hidden flex items-center justify-center">
      {isLoading ? (
        <p className="text-lg text-gray-600">Loading jobs...</p>
      ) : error ? (
        <p className="text-lg text-red-500">Error loading jobs. Please try again later.</p>
      ) : (
        <div className="h-full w-full">
          <InfiniteMovingCards
            jobs={jobs.length > 0 ? jobs : items}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
        </div>
      )}
    </div>
  );
}