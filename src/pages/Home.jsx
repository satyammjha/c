import React, { Suspense, lazy, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import HeroUploadBtn from "../customComponents/Button/HeroButton";
import { JobsGrid } from "../customComponents/JobsGrid";
import FileUpload from "../customComponents/FileUpload";
import { Helmet } from "react-helmet-async";
import { useJobData } from "../Context/jobDataProvider";

const InfiniteMovingCardsDemo = lazy(() => import("../customComponents/HeroJob"));
const WorkflowTimeline = lazy(() => import("../customComponents/TimelineDemo"));
const FeaturesSection = lazy(() => import("../customComponents/Features"));
const Waitlist = lazy(() => import("../customComponents/Waitlist"));

const SkeletonLoader = () => (
    <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-12 w-full mt-4" />
    </div>
);

const Home = () => {
    const location = useLocation();
    const workflowRef = useRef(null);

    

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const refCode = params.get("ref");
        if (refCode) localStorage.setItem("referral", refCode);
    }, [location]);

    const headingAnimation = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const scrollToWorkflow = () => {
        workflowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <Helmet>
                <title>Zobly - AI Job Search Platform & Smart Career Assistant</title>
                <meta name="description" content="Discover top career opportunities with Zobly's AI-powered job search engine. Get resume analysis, personalized cover letters, and smart job matching across Naukri, Glassdoor, and more." />
                <meta name="keywords" content="AI job search, resume optimization, career growth, job matching platform, employment opportunities, resume builder, cover letter generator, job alerts, recruitment platform, hiring solutions, job listings, career portal, professional development, job application tips, smart job search" />
                <link rel="canonical" href="https://zobly.com" />
                <meta property="og:title" content="Zobly - AI-Powered Career Platform & Job Matching Engine" />
                <meta property="og:description" content="Transform your job search with intelligent resume analysis and AI-driven career recommendations. Find perfect job matches across top platforms." />
                <meta property="og:image" content="https://zobly.com/og-image.jpg" />
                <meta property="og:url" content="https://zobly.com" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Zobly - Smart Job Search & Career Development Platform" />
                <meta name="twitter:description" content="Leverage AI for smarter job applications and career growth. Get matched with ideal opportunities and optimize your job search strategy." />
                <meta name="twitter:image" content="https://zobly.com/twitter-image.jpg" />
            </Helmet>

            <main className="relative min-h-screen w-full bg-white dark:bg-black bg-grid-black/[1] dark:bg-grid-white/[1]">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:to-gray-900 opacity-80"></div>
                <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 pt-20 pb-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                        Apply <span className="italic font-bold text-green-600 dark:text-green-400">Smarter</span>, Not {" "}
                        <span className="italic font-bold text-gray-500 dark:text-gray-400">Harder</span>
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                        Let AI match your resume to the best jobs and generate personalized cover letters in seconds.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <HeroUploadBtn />
                        <Button
                            variant="outline"
                            className="px-6 text-lg flex items-center gap-2 border-2 hover:border-primary hover:bg-accent/10"
                            onClick={scrollToWorkflow}
                        >
                            How It Works <Rocket className="w-5 h-5 animate-pulse" />
                        </Button>
                    </div>
                </div>
                <Suspense fallback={<SkeletonLoader />}>
                    <InfiniteMovingCardsDemo />
                </Suspense>
            </main>

            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2
                        {...headingAnimation}
                        className="text-4xl lg:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 mb-12"
                    >
                        Career Enhancement Tools
                    </motion.h2>
                    <Suspense fallback={<SkeletonLoader />}>
                        <FeaturesSection />
                    </Suspense>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-black">
                <div className="mx-auto px-4">
                    <motion.h2
                        {...headingAnimation}
                        className="text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12"
                    >
                        Curated Employment Opportunities
                    </motion.h2>
                    <JobsGrid />
                </div>
            </section>

            <section
                ref={workflowRef}
                className="py-20 bg-gray-50 dark:bg-gray-900"
                aria-label="Career success process"
            >
                <Suspense fallback={<SkeletonLoader />}>
                    <WorkflowTimeline />
                </Suspense>
            </section>

            <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-4xl mx-auto px-4">
                    <motion.h2
                        {...headingAnimation}
                        className="text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12"
                    >
                        Professional Resume Analysis
                    </motion.h2>
                    <FileUpload />
                </div>
            </section>

            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4">
                    <motion.h2
                        {...headingAnimation}
                        className="text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12"
                    >
                        Career Advancement Resources
                    </motion.h2>
                    <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
                        Access expert-curated job search strategies and industry insights
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white dark:bg-black">
                <Suspense fallback={<SkeletonLoader />}>
                    <Waitlist />
                </Suspense>
            </section>
        </>
    );
};

export default Home;