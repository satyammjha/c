import { motion } from "framer-motion";
import { Globe, LogIn } from "lucide-react";
import { Button } from "../../components/ui/button";

export const NoJobsFound = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12 text-gray-500 dark:text-gray-400"
  >
    <Globe className="mx-auto h-12 w-12 mb-4 text-gray-400 dark:text-slate-600" />
    <p className="text-lg">No positions found matching your criteria</p>
    <p className="text-sm mt-2 text-gray-400 dark:text-slate-500">
      Try adjusting your search filters
    </p>
  </motion.div>
);

export const LoginPrompt = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12 space-y-4"
  >
    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
      <LogIn className="h-8 w-8 text-gray-600 dark:text-slate-400" />
    </div>
    <p className="text-gray-600 dark:text-gray-300 text-lg">
      Sign in to view your personalized job matches
    </p>
    <Button asChild variant="outline" className="gap-2">
      <a href="/login">
        <LogIn className="w-4 h-4" />
        Login to Continue
      </a>
    </Button>
  </motion.div>
);