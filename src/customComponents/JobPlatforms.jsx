import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useId } from "react";
import { Briefcase, Globe, Users, Code, Shield, Monitor, Network, Cloud, Database } from 'lucide-react';
import { useJobData } from '../Context/jobDataProvider';

const platformIcons = {
    "Indeed": <Briefcase size={40} />,
    "AngelList": <Globe size={40} />,
    "Glassdoor": <Users size={40} />,
    "Monster": <Shield size={40} />,
    "Dice": <Monitor size={40} />,
    "We Work Remotely": <Network size={40} />,
    "Remote.co": <Cloud size={40} />,
    "Stack Overflow": <Code size={40} />,
    "GitHub": <Database size={40} />,
};

const fallbackJobs = [
    {
        id: 'fallback-1',
        title: 'Software Engineer',
        platform: 'GitHub',
        company: 'Fallback Inc.',
        location: 'Remote'
    }
];

export default function JobPlatformsCarousel() {
    const { jobs, error, isLoading } = useJobData();
    
    const normalizedJobs = (jobs?.length > 0 ? jobs : fallbackJobs).map(job => ({
        id: job.jobId || Math.random().toString(36).substr(2, 9),
        title: job.title || 'Position Available',
        platform: job.platform || job.company || 'Unknown Platform',
    }));

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
                        Jobs from Top Platforms
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Discover opportunities from the world's leading job platforms
                    </p>
                </motion.div>

                {error && (
                    <div className="text-center text-red-500 text-lg">
                        Error loading job platforms. Showing demo data.
                    </div>
                )}

                <div className="relative h-[500px] w-full overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-pulse text-gray-500">Loading platforms...</div>
                        </div>
                    ) : (
                        <>
                            <Carousel 
                                direction="left" 
                                jobs={normalizedJobs.slice(0, Math.ceil(normalizedJobs.length / 2))} 
                                speed={30} 
                            />
                            <Carousel 
                                direction="right" 
                                jobs={normalizedJobs.slice(Math.ceil(normalizedJobs.length / 2))} 
                                speed={35} 
                            />
                            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-20" />
                            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-20" />
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
function Carousel({ direction, jobs, speed }) {
    const id = useId();
    const duplicatedJobs = [...jobs, ...jobs];
    return (
        <motion.div
            key={`${id}-${direction}`}
            className="flex gap-8 items-center w-max"
            animate={{ x: direction === "left" ? ['0%', '-100%'] : ['0%', '100%'] }}
            transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: speed,
                ease: "linear",
            }}
        >
            {duplicatedJobs.map((job, index) => (
                <motion.div
                    key={`${job.id}-${direction}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 mt-5"
                >
                    <Card className="w-60 h-60 p-6 bg-white/20 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center h-full p-4">
                            <motion.div
                                className="w-20 h-20 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 bg-white/50 dark:bg-gray-900/50 rounded-2xl p-4"
                                whileHover={{ rotate: 15, scale: 1.1 }}
                            >
                                {platformIcons[job.platform] || <Briefcase size={40} />}
                            </motion.div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center line-clamp-2">
                                {job.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                                {job.platform}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    );
}