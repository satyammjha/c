import { cn } from "@/lib/utils";
import {
  BrainCircuit,
  ClipboardEdit,
  SearchCheck,
  BarChart4,
  Zap,
  BellPlus,
  HeartHandshake
} from "lucide-react";
export default function FeaturesSection() {
  const features = [
    {
      title: "Accumulated Jobs Data",
      description: "Access to millions of job listings from various platforms in one place",
      icon: <BarChart4 className="w-6 h-6" />,
    },
    {
      title: "AI-Powered Job Matching",
      description: "Smart algorithms analyze your resume and preferences to find perfect role matches",
      icon: <BrainCircuit className="w-6 h-6" />,
    },
    {
      title: "Resume Score Analyzer",
      description: "Instant feedback on your resume's effectiveness with improvement suggestions",
      icon: <ClipboardEdit className="w-6 h-6" />,
    },
    {
      title: "Real-Time Application Tracking",
      description: "Dashboard to monitor application status across multiple platforms",
      icon: <SearchCheck className="w-6 h-6" />,
    },
    {
      title: "Personalized Job Alerts",
      description: "Get instant notifications for new matching opportunities",
      icon: <BellPlus className="w-6 h-6" />,
    },
    {
      title: "Fast Application System",
      description: "One-click apply to multiple job platforms simultaneously",
      icon: <Zap className="w-6 h-6" />,
    }
  ];


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({ title, description, icon, index }) => {
  return (
    <div
      className={cn(
        "flex flex-col border dark:border-neutral-800 py-10 relative group/feature",
        index % 3 === 0 && "lg:border-l dark:border-neutral-800",
        index < 3 && "lg:border-b dark:border-neutral-800"
      )}
    >
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};