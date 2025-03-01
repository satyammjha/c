import React from "react";
import { Timeline } from "../components/ui/timeline";
import { Upload, Wand2, Briefcase, Rocket, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function WorkflowTimeline() {
    const workflowSteps = [
        {
            title: "Step 1: Upload Resume",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Supported Formats: PDF, DOCX, TXT</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                        Securely upload your resume. Our system automatically parses and extracts key information.
                    </p>
                </div>
            ),
            icon: <Upload className="w-6 h-6" />,
            status: "complete",
        },
        {
            title: "Step 2: AI Analysis",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <Wand2 className="w-5 h-5 animate-pulse" />
                        <span className="text-sm font-medium">Real-time Processing</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                        Our AI evaluates your skills, experience, and qualifications to identify optimal matches.
                    </p>
                </div>
            ),
            icon: <Wand2 className="w-6 h-6" />,
            status: "current",
        },
        {
            title: "Step 3: Smart Matching",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                        <Briefcase className="w-5 h-5" />
                        <span className="text-sm font-medium">5000+ Job Opportunities</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                        Instant matches with companies looking for your specific skill set and experience level.
                    </p>
                </div>
            ),
            icon: <Briefcase className="w-6 h-6" />,
            status: "upcoming",
        },
        {
            title: "Step 4: Apply Confidently",
            content: (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <Rocket className="w-5 h-5" />
                        <span className="text-sm font-medium">1-Click Application</span>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                        Generate personalized applications and track submissions in real-time.
                    </p>
                </div>
            ),
            icon: <Rocket className="w-6 h-6" />,
            status: "upcoming",
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">
                Application Workflow
            </h2>
            
            <Timeline 
                data={workflowSteps.map((step, index) => ({
                    title: (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                ${step.status === "complete" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                                step.status === "current" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                                "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
                            >
                                {step.icon}
                            </div>
                            <span className={`font-semibold ${step.status === "current" ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                                {step.title}
                            </span>
                        </motion.div>
                    ),
                    content: (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="ml-12 pl-4 border-l-2 border-gray-200 dark:border-gray-700"
                        >
                            {step.content}
                            {step.status === "current" && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                                    <span className="animate-pulse">●</span>
                                    Currently processing...
                                </div>
                            )}
                        </motion.div>
                    )
                }))}
                options={{
                    lineClassName: "bg-gradient-to-b from-emerald-400 to-blue-400",
                    dotClassName: "ring-4 ring-white dark:ring-gray-900",
                    contentContainerClassName: "space-y-8",
                    itemClassName: "relative pb-8"
                }}
            />
        </div>
    );
}