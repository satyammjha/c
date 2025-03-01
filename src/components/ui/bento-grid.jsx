import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export const BentoGrid = ({ className, children }) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({ className, jobs }) => {
  const hasTags = jobs.tags?.length > 0;
  const details = [
    { icon: 'map-pin', text: jobs.location, fallback: "Remote" },
    { icon: 'briefcase', text: jobs.experience, fallback: "Not specified" },
    { icon: 'coins', text: jobs.salary, fallback: "Competitive" },
    { icon: 'calendar-days', text: jobs.posted, fallback: "Recently" }
  ];

  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group border hover:border-gray-200 dark:hover:border-gray-700",
        "transition-all duration-300 shadow-sm hover:shadow-lg dark:shadow-neutral-800/20",
        "p-6 dark:bg-gray-900 bg-white border-gray-100 dark:border-gray-800",
        "flex flex-col justify-between min-h-[22rem]",
        className
      )}
    >
      <div className="mb-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <img
              src={jobs.logo}
              alt={`${jobs.company} logo`}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
              {jobs.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {jobs.company}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        {details.map((detail, index) => (
          <div key={index} className="flex items-center gap-2 min-h-[24px]">
            <span className={`i-lucide-${detail.icon} w-4 h-4 text-gray-500`} />
            <span>{detail.text || detail.fallback}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className={`flex flex-wrap gap-2 ${!hasTags ? 'invisible' : ''}`}>
          {(jobs.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <Button
        variant="secondary"
        className="mt-4 w-full font-medium bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-gray-100 dark:text-gray-900 transition-colors"
      >
        Apply Now
      </Button>
    </div>
  );
};