import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { JobCard } from "./JobCard";
import { motion } from "framer-motion";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[minmax(250px,auto)] grid-cols-1 gap-3 md:grid-cols-12",
        className
      )}
    >
      {children}
    </div>
  );
};

export const JobsGridLayout = ({ jobs, scrollClassName = "h-[calc(100vh-200px)]" }) => {
  const spanPattern = [
    { col: "md:col-span-6", row: "md:row-span-2" }, // Full width pair
    { col: "md:col-span-6", row: "md:row-span-2" },
    { col: "md:col-span-4", row: "md:row-span-1" }, // Three column row
    { col: "md:col-span-4", row: "md:row-span-1" },
    { col: "md:col-span-4", row: "md:row-span-1" },
    { col: "md:col-span-8", row: "md:row-span-2" }, // Wide + narrow row
    { col: "md:col-span-4", row: "md:row-span-1" },
  ];

  return (
    <ScrollArea className={cn("w-full rounded-lg border", scrollClassName)}>
      <BentoGrid className="p-4">
        {jobs.map((job, index) => {
          const pattern = spanPattern[index % spanPattern.length];
          
          return (
            <motion.div
              key={job.jobId || job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className={cn(
                "overflow-hidden rounded-xl border bg-background shadow-sm transition-all hover:shadow-md",
                pattern.col,
                pattern.row
              )}
            >
              <JobCard job={job} />
            </motion.div>
          );
        })}
      </BentoGrid>
    </ScrollArea>
  );
};