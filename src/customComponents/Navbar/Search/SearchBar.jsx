import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input } from '../../../components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Search, Sparkles, Command, CornerDownLeft, RotateCw, Briefcase, MapPin, Building, SearchIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { useJobData } from '../../../Context/jobDataProvider';

const createWorker = () => new Worker(new URL('./searchWorker.js', import.meta.url));

const SearchBar = ({ variant = 'desktop' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const { jobs } = useJobData();
    const workerRef = React.useRef(null);

    useEffect(() => {
        workerRef.current = createWorker();
        return () => workerRef.current.terminate();
    }, []);

    useEffect(() => {
        if (!workerRef.current) return;

        const handleMessage = (event) => {
            setSearchResults(event.data);
            setIsLoading(false);
        };

        workerRef.current.addEventListener('message', handleMessage);
        return () => workerRef.current.removeEventListener('message', handleMessage);
    }, []);

    const debouncedSearch = useMemo(() => {
        let timeoutId;

        return (query, jobs) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (query.trim()) {
                    setIsLoading(true);
                    workerRef.current.postMessage({ query, jobs });
                } else {
                    setSearchResults([]);
                }
            }, 300);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        debouncedSearch(query, jobs);
    }, [query, jobs, isOpen, debouncedSearch]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleOpenChange = useCallback((open) => {
        setIsOpen(open);
        if (!open) {
            setQuery('');
            setSearchResults([]);
        }
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {variant === 'mobile' ? (

                    <Button
                        className="md:hidden text-white dark:text-black font-bold fixed bottom-4 right-4 z-50 rounded-md bg-black dark:bg-white shadow-lg"
                    >
                        <SearchIcon />
                    </Button>
                ) : (

                    <div className="hidden md:block relative group w-full max-w-2xl transition-transform hover:scale-[1.02] active:scale-95">
                        <div className="absolute blur-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Input
                            type="text"
                            placeholder="Ask AI to find your next job..."
                            className="pl-12 pr-28 rounded-full bg-background/95 backdrop-blur-sm 
                                      ring-1 ring-border/50 hover:ring-primary/30 focus-visible:ring-primary/50 
                                      cursor-text transition-all h-12 shadow-sm text-base sm:text-lg
                                      focus:ring-2 focus:ring-primary/50"
                            readOnly
                            aria-label="Open AI-powered search"
                        />
                        <div className="absolute inset-y-0 left-4 flex items-center">
                            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/60 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="absolute inset-y-0 right-4 flex items-center gap-1.5">
                            <Badge
                                variant="outline"
                                className="px-2 py-1 text-xs font-mono bg-background/80 backdrop-blur-sm 
                                          shadow-sm hover:bg-primary/5 hidden sm:inline-flex"
                            >
                                {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
                            </Badge>
                        </div>
                    </div>
                )}
            </DialogTrigger>

            <DialogContent
                role="dialog"
                aria-labelledby="searchDialogTitle"
                className="max-w-[95vw] md:max-w-3xl border-0 p-0 overflow-hidden h-[90dvh] sm:h-[80dvh]"
            >
                <div className="backdrop-blur-lg h-full flex flex-col">
                    <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
                        <DialogTitle
                            id="searchDialogTitle"
                            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
                        >
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10">
                                    <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                                </div>
                                <span>AI Job Search</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col h-full p-4 sm:p-6">
                        <div className="relative group mb-4 sm:mb-6">
                            <Input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Try: 'Remote React developer jobs with stock options'"
                                className="w-full pl-12 sm:pl-14 pr-24 border-2 rounded-xl sm:rounded-lg py-4 sm:py-5 text-base sm:text-lg
                                           focus-visible:ring-2 focus-visible:ring-primary/50"
                                autoFocus
                                aria-label="AI search input"
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary/80" />
                            </div>
                            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3">
                                {isLoading && (
                                    <RotateCw className="h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-hidden">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
                                    <div className="text-center space-y-4">
                                        <RotateCw className="h-8 w-8 sm:h-10 sm:w-10 animate-spin mx-auto" />
                                        <p className="text-sm sm:text-base">
                                            Analyzing {jobs.length.toLocaleString()} opportunities...
                                        </p>
                                    </div>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="h-full flex flex-col">
                                    <h3 className="text-lg font-semibold px-2 mb-3 sm:mb-4">
                                        {searchResults.length.toLocaleString()} matches found
                                    </h3>
                                    <div className="flex-1 overflow-y-auto scroll-container">
                                        <div className="space-y-2 sm:space-y-3 pr-2">
                                            {searchResults.map(job => (
                                                <div
                                                    key={job.id}
                                                    className="p-3 sm:p-4 rounded-lg border bg-background/90 backdrop-blur-sm 
                                                               hover:bg-accent transition-all cursor-pointer shadow-sm
                                                               hover:shadow-md hover:border-primary/20"
                                                >
                                                    <div className="flex items-start gap-3 sm:gap-4">
                                                        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                                            <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <h4 className="font-semibold text-base sm:text-lg mb-1">
                                                                {job.title}
                                                            </h4>
                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Building className="h-4 w-4 flex-shrink-0" />
                                                                    <span className="truncate">{job.company}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                                                    <span className="truncate">{job.location}</span>
                                                                </div>
                                                            </div>
                                                            {job.skills && (
                                                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                                                                    {job.skills.map((skill, index) => (
                                                                        <Badge
                                                                            key={index}
                                                                            variant="secondary"
                                                                            className="px-2 py-0.5 text-xs font-medium"
                                                                        >
                                                                            {skill}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : query && !isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                    <div className="text-center space-y-2">
                                        <span className="text-lg sm:text-xl">🔍 No matches found</span>
                                        <p className="text-sm sm:text-base text-foreground/70">
                                            Try adjusting your search terms
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full overflow-y-auto scroll-container">
                                    <div className="space-y-4 sm:space-y-6 pb-4">
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            <div className="p-4 rounded-xl border border-primary/10 bg-background/90 backdrop-blur-sm">
                                                <h3 className="text-lg font-semibold mb-3">
                                                    ✨ Smart Search Features
                                                </h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                                        <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium">Natural Language Search</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                "Senior frontend roles in Berlin with remote options"
                                                            </p>
                                                        </div>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                                                        <Sparkles className="h-5 w-5 text-primary flex-shrink-0" />
                                                        <div>
                                                            <h4 className="font-medium">Multi-Platform Aggregation</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                Search across all major job boards simultaneously
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10">
                                                <h3 className="text-lg font-semibold mb-3">🚀 Quick Searches</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <Button
                                                        variant="outline"
                                                        className="justify-start text-sm h-10"
                                                    >
                                                        Remote Software Engineer
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="justify-start text-sm h-10"
                                                    >
                                                        Marketing Manager 5+ years
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                            <p className="text-sm text-foreground/70 flex gap-2">
                                                <span className="text-primary">💡 Pro Tip:</span>
                                                Use filters like "10 LPA", "5+ years experience" or "startups"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchBar;