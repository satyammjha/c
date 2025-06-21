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
      jobId: job.job_id || job._id,
      title: job.job_title,
      company: job.company_name,
      location: job.location || "Not Specified",
      salary: job.salary || "Not disclosed",
      experience: job.experience || "Not Mentioned",
      posted: job.footer_label || "Unknown",
      link: job.job_url,
      skills: job.skills || [],
      savedDate: new Date().toISOString(),
      logo: job.company_logo || "",
    };

    saveJob(jobToSave);
    toast.success(`Saved ${job.job_title} to bookmarks`);
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
            key={`${job.job_id || job._id}-${idx}`}
            className="w-80 sm:w-72 md:w-80 lg:w-[340px] h-auto min-h-[240px] relative rounded-xl border flex-shrink-0 
                       border-gray-200/50 dark:border-slate-700/50 p-5 
                       bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm
                       shadow-sm hover:shadow-lg dark:shadow-slate-950/20
                       transition-all duration-300 hover:-translate-y-1 
                       group flex flex-col gap-4"
            role="article"
            aria-label={`Job listing for ${job.job_title} at ${job.company_name}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
                <img
                  src={job.company_logo}
                  alt={`${job.company_name} logo`}
                  className="w-8 h-8 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base lg:text-lg text-gray-900 dark:text-gray-100 leading-tight line-clamp-2">
                  {job.job_title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                  {job.company_name}
                </p>
                {job.company_rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-amber-600 dark:text-amber-400">⭐</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{job.company_rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {job.location && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">📍</span>
                  <span className="text-gray-700 dark:text-slate-300">{job.location}</span>
                </div>
              )}
              {job.experience && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">💼</span>
                  <span className="text-gray-700 dark:text-slate-300">{job.experience}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-slate-400">💰</span>
                <span className="text-gray-700 dark:text-slate-300">{job.salary}</span>
              </div>
              {job.footer_label && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-slate-400">⏳</span>
                  <span className="text-gray-700 dark:text-slate-300">{job.footer_label}</span>
                </div>
              )}
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.skills.slice(0, 3).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-blue-50/80 dark:bg-slate-800/60 text-blue-700 dark:text-blue-300 
                               rounded-md border border-blue-100 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-2 gap-3">
              <Button
                className="flex-1 bg-gray-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 
                           text-white transition-all duration-200 flex items-center gap-2 justify-center 
                           py-2 px-4 text-sm rounded-lg shadow-sm hover:shadow-md
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500"
                onClick={() => window.open(job.job_url, "_blank")}
                aria-label="Apply now"
              >
                Apply
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>

              <Button
                className="flex items-center justify-center p-2 bg-white dark:bg-slate-900 
                           border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:shadow-md 
                           hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200"
                aria-label="Save job"
                onClick={() => handleSaveJob(job)}
              >
                <Bookmark
                  className={`w-5 h-5 transition-colors duration-200 ${savedJobs.some((saved) => saved.jobId === (job.job_id || job._id))
                    ? "text-blue-600 dark:text-blue-400 fill-current"
                    : "text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};