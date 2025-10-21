import { cn } from "../../lib/utils";
import { useEffect, useState, useRef } from "react";
import { Button } from "./button";
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import useUserData from "../../Context/UserContext";
import { saveJob } from "../../services/jobService";

export const InfiniteMovingCards = ({
  jobs,
  direction,
  speed,
  pauseOnHover,
  className,
}) => {
  const { userData, token, setUser } = useUserData();
  const isLoggedIn = Boolean(userData && token);
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  const handleSaveJob = async (job) => {
    if (!isLoggedIn) {
      toast.error("Please login to save jobs");
      return;
    }

    try {
      const responseInfi = await saveJob({ jobId: job._id }, token);
      console.log("Response from saveJob:", responseInfi);
      setUser(responseInfi.user, token);

      if (responseInfi.message === "Job already saved") {
        toast.warn(`Job already saved`);
      } else {
        toast.success(`Saved ${job.job_title}`);
      }
    } catch (error) {
      toast.error("Failed to save job. Please try again.");
    }
  };

  const isJobSaved = (job) => {
    if (!isLoggedIn) return false;
    return userData?.savedJobs?.some((saved) => saved.jobId === job._id);
  };

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      Array.from(scrollerRef.current.children).forEach((item) => {
        scrollerRef.current.appendChild(item.cloneNode(true));
      });
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
      const durations = { fast: "20s", normal: "40s", slow: "720s" };
      containerRef.current.style.setProperty(
        "--animation-duration",
        durations[speed]
      );
      setStart(true);
    }
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
            key={`${job._id}-${idx}`}
            className="w-80 sm:w-72 md:w-80 lg:w-[340px] h-auto min-h-[200px] relative rounded-xl border flex-shrink-0 
                       border-gray-200/60 dark:border-slate-700/60 p-6 
                       bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm
                       shadow-md hover:shadow-xl dark:shadow-slate-950/30
                       transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]
                       flex flex-col gap-3"
          >
            <div>
              <h3 className="font-semibold text-base lg:text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
                {job.job_title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {job.company_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Posted on: {formatDate(job.posted_at)}
              </p>
            </div>

            {job.location && (
              <p className="text-sm text-gray-700 dark:text-slate-300 mt-1">
                📍 {job.location}
              </p>
            )}

            {job.min_salary > 0 && job.max_salary > 0 && (
              <p className="text-sm text-gray-700 dark:text-slate-300">
                💰 ₹{job.min_salary.toLocaleString()} - ₹
                {job.max_salary.toLocaleString()} {job.salary_currency}
              </p>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {job.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-xs bg-blue-50/90 dark:bg-slate-800/80 text-blue-700 dark:text-blue-300 
                               rounded-lg border border-blue-100 dark:border-slate-700 font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
            {job.location && <p>{job.location}</p>}

            <div className="flex items-center justify-between mt-auto pt-3 gap-3">
              <Button
                className="flex-1 bg-gray-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 
                           text-white transition-all duration-200 flex items-center gap-2 justify-center 
                           py-2.5 px-4 text-sm rounded-lg"
                onClick={() => window.open(job.apply_url, "_blank")}
              >
                Apply <ArrowRight className="w-4 h-4" />
              </Button>

              {isJobSaved(job) ? (
                <div
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold 
                             bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  Saved
                </div>
              ) : (
                <Button
                  className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                  onClick={() => handleSaveJob(job)}
                >
                  <Bookmark className="w-5 h-5 text-gray-500 dark:text-slate-400" />
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
