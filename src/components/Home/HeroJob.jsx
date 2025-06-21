import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
import { useJobData } from "../../Context/jobDataProvider";

export default function HeroJobs() {
  const { jobs, error, isLoading } = useJobData();
  console.log("Jobs in InfiniteMovingCardsDemo:", jobs);
  return (
    <div className="w-screen overflow-hidden flex items-center justify-center">
      {isLoading ? (
        <p className="text-lg text-gray-600">Loading jobs...</p>
      ) : error ? (
        <p className="text-lg text-red-500">Error loading jobs. Please try again later.</p>
      ) : (
        <div className="h-full w-full">
          <InfiniteMovingCards
            jobs={jobs}
            direction="left"
            speed="slow"
            pauseOnHover={true}
          />
        </div>
      )}
    </div>
  );
}