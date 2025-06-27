import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Input } from '../../../ui/input';
import { Search, Briefcase, MapPin, Building, Loader2 } from 'lucide-react';
import { Badge } from '../../../ui/badge';
import { useJobData } from '../../../../Context/jobDataProvider';
import { Dialog, DialogContent, DialogTrigger } from "../../../ui/dialog";

// Optimized search with indexing and scoring
class JobSearchIndex {
  constructor(jobs) {
    this.jobs = jobs;
    this.index = this.buildIndex(jobs);
  }

  buildIndex(jobs) {
    return jobs.map((job, idx) => {
      const searchableFields = [
        job.job_title || job.title || '',
        job.company_name || job.company || '',
        job.location || '',
        ...(job.skills || []),
        job.experience || '',
        job.salary || ''
      ];

      return {
        id: idx,
        jobId: job._id || job.job_id || job.id,
        searchText: searchableFields.join(' ').toLowerCase(),
        titleWords: (job.job_title || job.title || '').toLowerCase().split(/\s+/),
        companyWords: (job.company_name || job.company || '').toLowerCase().split(/\s+/),
        skillWords: (job.skills || []).map(s => s.toLowerCase()),
        location: (job.location || '').toLowerCase()
      };
    });
  }

  search(query, limit = 20) {
    if (!query.trim()) return [];

    const queryTerms = query.toLowerCase().trim().split(/\s+/);
    const results = [];

    for (let i = 0; i < this.index.length; i++) {
      const item = this.index[i];
      let score = 0;
      let matchedTerms = 0;

      for (const term of queryTerms) {
        if (item.searchText.includes(term)) {
          matchedTerms++;

          if (item.titleWords.some(word => word.includes(term))) score += 10;
          if (item.companyWords.some(word => word.includes(term))) score += 5;
          if (item.skillWords.some(skill => skill.includes(term))) score += 3;
          if (item.location.includes(term)) score += 2;

          score += 1;
        }
      }

      if (matchedTerms === queryTerms.length) {
        results.push({
          job: this.jobs[item.id],
          score: score,
          id: item.jobId
        });
      }
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(result => result.job);
  }
}

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const JobItem = React.memo(({ job, searchQuery, onClick }) => {
  const skills = job.skills || job.tags || job.matchedSkills || [];
  const jobTitle = job.job_title || job.title || 'Untitled Position';
  const companyName = job.company_name || job.company || 'Unknown Company';

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.split(/\s+/).join('|')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  };

  return (
    <div
      className="flex items-start gap-3 p-3 border-b hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
        <Briefcase className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-grow">
        <h4
          className="font-medium text-sm line-clamp-1 dark:text-white"
          dangerouslySetInnerHTML={{ __html: highlightText(jobTitle, searchQuery) }}
        />
        <div className="flex gap-3 mt-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building className="h-3 w-3" />
            <span
              className="dark:text-slate-300"
              dangerouslySetInnerHTML={{ __html: highlightText(companyName, searchQuery) }}
            />
          </div>
          {job.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span
                className="dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: highlightText(job.location, searchQuery) }}
              />
            </div>
          )}
        </div>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge
                key={`${skill}-${index}`}
                variant="secondary"
                className="px-1.5 py-0 text-xs bg-primary/5 dark:bg-primary/20"
              >
                <span dangerouslySetInnerHTML={{ __html: highlightText(skill, searchQuery) }} />
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-xs bg-primary/5 dark:bg-primary/20">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

const SearchBar = ({ onJobSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { jobs } = useJobData();

  const debouncedQuery = useDebounce(query, 200);
  const searchIndexRef = useRef(null);

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      searchIndexRef.current = new JobSearchIndex(jobs);
    }
  }, [jobs]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!searchIndexRef.current) return;

    setIsSearching(true);

    // Use setTimeout to make search non-blocking
    const timeoutId = setTimeout(() => {
      const results = searchIndexRef.current.search(debouncedQuery, 25);
      setSearchResults(results);
      setIsSearching(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [debouncedQuery]);

  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  const handleJobClick = useCallback((job) => {
    setIsOpen(false);
    setQuery('');
    setSearchResults([]);
    if (onJobSelect) {
      onJobSelect(job);
    }
  }, [onJobSelect]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  const handleDialogClose = useCallback((open) => {
    setIsOpen(open);
    if (!open) {
      setQuery('');
      setSearchResults([]);
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <div className="w-full max-w-lg mx-auto cursor-text">
          <div className="relative">
            <Input
              readOnly
              placeholder="Search jobs..."
              className="pl-10 py-2 border dark:border-slate-700 dark:bg-slate-900 dark:text-white cursor-pointer"
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
              onKeyDown={handleKeyDown}
              placeholder="Search by job title, company, location, skills..."
              className="w-full py-4 bg-transparent outline-none placeholder:text-muted-foreground dark:text-white"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching && query ? (
              <div className="p-6 text-center text-sm text-muted-foreground dark:text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                Searching...
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs text-muted-foreground border-b dark:border-slate-700">
                  {searchResults.length} results found
                </div>
                {searchResults.map((job) => (
                  <JobItem
                    key={job._id || job.job_id || job.id}
                    job={job}
                    searchQuery={query}
                    onClick={() => handleJobClick(job)}
                  />
                ))}
              </>
            ) : query ? (
              <div className="p-6 text-center text-sm text-muted-foreground dark:text-slate-400">
                No jobs found for "{query}"
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground dark:text-slate-400">
                Start typing to search {jobs?.length?.toLocaleString() || 0} opportunities
                <div className="text-xs mt-1 opacity-75">
                  Try searching by job title, company, skills, or location
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

SearchBar.displayName = 'SearchBar';
JobItem.displayName = 'JobItem';

export default React.memo(SearchBar);