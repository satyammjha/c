import React, { useState, useCallback } from 'react';
import { Input } from '../../../components/ui/input';
import { Search, Briefcase, MapPin, Building, X } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { useJobData } from '../../../Context/jobDataProvider';
import { Dialog, DialogContent, DialogTrigger } from "../../../components/ui/dialog";

// Keep existing search logic unchanged
const performSearch = (jobs, query) => {
  if (!query.trim()) return [];
  const lowercaseQuery = query.toLowerCase();
  return jobs.filter(job => {
    return (
      (job.title && job.title.toLowerCase().includes(lowercaseQuery)) ||
      (job.company && job.company.toLowerCase().includes(lowercaseQuery)) ||
      (job.location && job.location.toLowerCase().includes(lowercaseQuery)) ||
      (job.tags && job.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) ||
      (job.matchedSkills && job.matchedSkills.some(skill => skill.toLowerCase().includes(lowercaseQuery)))
    );
  }).slice(0, 20);
};

const JobItem = React.memo(({ job }) => {
  const skills = job.tags || job.matchedSkills || [];
  return (
    <div className="flex items-start gap-3 p-3 border-b hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
        <Briefcase className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium text-sm line-clamp-1 dark:text-white">{job.title}</h4>
        <div className="flex gap-3 mt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span className="dark:text-slate-300">{job.company}</span>
          </div>
          {job.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="dark:text-slate-300">{job.location}</span>
            </div>
          )}
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="secondary" className="px-1.5 py-0 text-xs bg-primary/5 dark:bg-primary/20">
                {skill}
              </Badge>
            ))}
            {skills.length > 2 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-xs bg-primary/5 dark:bg-primary/20">
                +{skills.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { jobs } = useJobData();
  const searchResults = performSearch(jobs, query);

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full max-w-lg mx-auto cursor-text">
          <div className="relative">
            <Input
              readOnly
              placeholder="Search jobs..."
              className="pl-10 py-2 border dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              onClick={() => setIsOpen(true)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 overflow-hidden shadow-xl dark:border-slate-700">
        <div className="bg-white dark:bg-slate-900">
          <div className="flex items-center px-4 border-b dark:border-slate-700">
            <Search className="h-5 w-5 text-muted-foreground mr-2" />
            <input
              value={query}
              onChange={handleChange}
              placeholder="Search by job title, company, skills..."
              className="w-full py-4 bg-transparent outline-none placeholder:text-muted-foreground dark:text-white"
              autoFocus
            />
            
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              searchResults.map((job) => (
                <JobItem key={job._id} job={job} />
              ))
            ) : query ? (
              <div className="p-6 text-center text-sm text-muted-foreground dark:text-slate-400">
                No jobs found for "{query}"
              </div>
            ) : (<>
              <div className="p-6 text-center text-sm text-muted-foreground dark:text-slate-400">
                Start typing to search {jobs.length.toLocaleString()} opportunities
              </div>
           
            </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(SearchBar);