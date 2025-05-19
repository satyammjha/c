import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight, MapPin, Briefcase, Banknote, Building2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useSavedJobs } from "../../Context/SavedJobContext";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

export const JobCard = ({ job, className }) => {
    const { saveJob, savedJobs } = useSavedJobs();
    const [isHovered, setIsHovered] = useState(false);

    const handleSaveJob = () => {
        const jobToSave = {
            jobId: job.jobId || job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            experience: job.experience,
            link: job.link,
            tags: job.tags,
            logo: job.logo,
            posted: job.posted,
        };

        saveJob(jobToSave);
        toast.success(`${job.title} saved to your bookmarks`);
    };

    // Helper function to format the posted date
    const formatPostedDate = (posted) => {
        if (!posted) return "";
        if (posted === "24h") return "Posted 1 day ago";
        return `Posted ${posted}`;
    };

    return (
        <motion.div
            className={cn(
                "h-full min-w-fit rounded-2xl border border-gray-200/50 dark:border-slate-800",
                "shadow-lg hover:shadow-2xl transition-shadow duration-300",
                "backdrop-blur-sm bg-white/80 dark:bg-slate-900/80",
                "flex flex-col justify-between p-6",
                className
            )}
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            itemScope
            itemType="https://schema.org/JobPosting"
        >
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-max h-14 rounded-xl bg-gradient-to-br from-white to-gray-100 dark:from-slate-800 dark:to-slate-700 shadow-inner p-1.5">
                            {job.logo ? (
                                <img
                                    src={job.logo}
                                    alt={job.company}
                                    className="w-full h-full object-contain rounded-lg"
                                    loading="lazy"
                                    itemProp="image"
                                />
                            ) : (
                                <Building2 className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h3
                                className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate"
                                itemProp="title"
                            >
                                {job.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <p
                                    className="text-sm text-gray-600 dark:text-gray-400 truncate"
                                    itemProp="hiringOrganization"
                                >
                                    {job.company}
                                </p>
                                {job.posted && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        • {formatPostedDate(job.posted)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleSaveJob}
                        variant="ghost"
                        size="sm"
                        className="p-2 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 rounded-xl"
                        aria-label={`Save ${job.title} position`}
                    >
                        <Bookmark
                            className={`w-6 h-6 transition-colors ${savedJobs.some((s) => s.jobId === (job.jobId || job._id))
                                ? "text-blue-500 fill-current"
                                : "text-gray-400 dark:text-slate-500 hover:text-blue-400"
                                }`}
                        />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="chip bg-blue-100/50 dark:bg-slate-800 text-blue-600 dark:text-blue-300">
                        <MapPin className="w-4 h-4" />
                        <span itemProp="jobLocation">{job.location || "Multiple Locations"}</span>
                    </div>
                    <div className="chip bg-purple-100/50 dark:bg-slate-800 text-purple-600 dark:text-purple-300">
                        <Briefcase className="w-4 h-4" />
                        <span itemProp="experienceRequirements">{job.experience || "Experience not specified"}</span>
                    </div>
                    {job.salary && (
                        <div className="chip bg-green-100/50 dark:bg-slate-800 text-green-600 dark:text-green-300">
                            <Banknote className="w-4 h-4" />
                            <span itemProp="baseSalary">{job.salary}</span>
                        </div>
                    )}
                </div>

                {job.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {job.tags.slice(0, 4).map((tag, index) => (
                            <span
                                key={index}
                                className="tag bg-gray-100/50 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                                itemProp="skills"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <motion.div
                className="mt-6"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Button
                    asChild
                    className="modern-button w-full h-12 rounded-xl gap-2"
                >
                    <a
                        href={job.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="url"
                        aria-label={`Apply for ${job.title} at ${job.company}`}
                    >
                        <span className="font-medium">Apply Now</span>
                        <ArrowRight className="w-4 h-4 transform group-hover/apply:translate-x-1 transition-transform" />
                    </a>
                </Button>
            </motion.div>
        </motion.div>
    );
};