import { cn } from "../../lib/utils";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "./button";
import { ArrowRight, Bookmark } from "lucide-react";
import { Toaster } from "./sonner";
import { toast } from "sonner";
import { useSavedJobs } from "../../Context/SavedJobContext";

export const InfiniteMovingCards = ({ jobs, direction, speed, pauseOnHover, className }) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);
  const { savedJobs, saveJob } = useSavedJobs();

  const handleSaveJob = (job) => {
    const jobToSave = {
      jobId: job.jobId || job._id,
      title: job.title,
      company: job.company,
      location: job.location || "Not Specified",
      salary: job.salary || "Not Disclosed",
      experience: job.experience || "Not Mentioned",
      posted: job.posted || "Unknown",
      link: job.link,
      tags: job.tags || [],
      savedDate: new Date().toISOString(),
      logo: job.logo || "",
    };

    saveJob(jobToSave);
    toast.success(`Saved ${job.title} to bookmarks`);
  };

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      Array.from(scrollerRef.current.children).forEach(item => {
        scrollerRef.current.appendChild(item.cloneNode(true));
      });
      containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
      const durations = { fast: "20s", normal: "40s", slow: "720s" };
      containerRef.current.style.setProperty("--animation-duration", durations[speed]);
      setStart(true);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        "dark:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div className="z-50">
        <Toaster position="bottom-left" />
      </div>
      <style>{`
        @keyframes scroll { to { transform: translate(calc(-50% - 0.5rem)); } }
        .animate-scroll { animation: scroll var(--animation-duration, 40s) linear infinite; animation-direction: var(--animation-direction, forwards); }
        .animate-scroll:hover { animation-play-state: paused; }
      `}</style>
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {jobs.map((job, idx) => (
          <li
            key={`${job.jobId || job._id}-${idx}`}
            className="w-[350px] h-[320px] relative rounded-xl border flex-shrink-0 border-gray-100 dark:border-slate-800 px-5 py-4 bg-white dark:bg-slate-900 shadow-md hover:shadow-lg dark:shadow-slate-950/50 transition-all duration-300 hover:-translate-y-1 group flex flex-col"
            role="article"
            aria-label={`Job listing for ${job.title} at ${job.company}`}
          >
            <div className="flex flex-col flex-1 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white dark:bg-slate-800 rounded-md border border-gray-100 dark:border-slate-700">
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-8 h-8 object-contain"
                    loading="lazy"
                    width="32"
                    height="32"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-slate-400">📍</span>
                    <span className="text-gray-700 dark:text-slate-300 line-clamp-1">{job.location}</span>
                  </div>
                )}
                {job.experience && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 dark:text-slate-400">💼</span>
                    <span className="text-gray-700 dark:text-slate-300 line-clamp-1">{job.experience}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 dark:text-slate-400">💰</span>
                  <span className="text-gray-700 dark:text-slate-300 line-clamp-1">{job.salary || "Not Disclosed"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 dark:text-slate-400">⏳</span>
                  <span className="text-gray-700 dark:text-slate-300 line-clamp-1">{job.posted || "Unknown"}</span>
                </div>
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {job.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-auto pt-3">
                <Button
                  className="bg-black hover:bg-gray-900 text-white transition-colors duration-300 flex items-center gap-1.5 justify-center py-1.5 px-3 text-sm shadow-sm hover:shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => window.open(job.link, "_blank")}
                  aria-label="Apply now"
                >
                  Apply Now <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
                <Button
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md 
             hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 ease-in-out"
                  aria-label="Save job"
                  onClick={() => handleSaveJob(job)}
                >
                  <Bookmark
                    className={`w-5 h-5 transition-colors duration-200 ease-in-out ${savedJobs.some((saved) => saved.jobId === (job.jobId || job._id))
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Save</span>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};