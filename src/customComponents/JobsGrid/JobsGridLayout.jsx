import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { JobCard } from "./JobCard";
import { motion } from "framer-motion";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 md:grid-cols-12",
        "auto-rows-[minmax(300px,auto)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export const JobsGridLayout = ({ jobs, scrollClassName = "h-[800px]" }) => {
  const spanPattern = [
    'md:col-span-6',
    'md:col-span-4', 
    'md:col-span-4',  
    'md:col-span-3',   
    'md:col-span-5',  
    'md:col-span-7',  
  ];

  return (
    <ScrollArea className={cn("w-full rounded-lg", scrollClassName)}>
      <BentoGrid className="p-4">
        {jobs.map((job, index) => {
          const pattern = spanPattern[index % spanPattern.length];
          const rowSpan = index % 4 === 0 ? 'md:row-span-2' : '';

          return (
            <motion.div
              key={job.jobId || job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                "h-full w-full",
                pattern,
                rowSpan
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