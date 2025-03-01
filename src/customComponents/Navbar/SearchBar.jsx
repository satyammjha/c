import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Search, Sparkles, Command, CornerDownLeft, RotateCw } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isOpen) {
                handleSearch();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleSearch = async () => {
        if (!query) return;
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="relative group max-w-xl transition-transform hover:scale-[1.02] active:scale-95">
                    <div className="absolute blur-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Input
                        type="text"
                        placeholder="Ask AI to find your next job..."
                        className=" pl-12 pr-24 rounded-full bg-background/95 backdrop-blur-sm 
                                  ring-1 ring-border/50 hover:ring-primary/30 focus-visible:ring-primary/50 
                                  cursor-text transition-all h-12 shadow-sm"
                        readOnly
                        aria-label="Open AI-powered search"
                    />
                    <div className="absolute inset-y-0 left-4 flex items-center">
                        <Search className="h-4 w-4 text-foreground/60 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="absolute inset-y-0 right-4 flex items-center gap-1.5">
                        <Badge
                            variant="outline"
                            className="px-2 py-1 text-xs font-mono bg-background/80 backdrop-blur-sm 
                                    shadow-sm hover:bg-primary/5"
                        >
                            {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
                        </Badge>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent
                role="dialog"
                aria-labelledby="searchDialogTitle"
                className="max-w-2xl border-0 p-0 overflow-hidden"
            >
                <div className="backdrop-blur-lg">
                    <DialogHeader className="px-6 pt-6">
                        <DialogTitle
                            id="searchDialogTitle"
                            className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Sparkles className="h-7 w-7 text-primary" />
                                </div>
                                <span>AI Job Search</span>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 p-6">
                        <div className="relative group">
                            <Input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Try: 'Remote React developer jobs with stock options'"
                                className="w-full pl-14 pr-24 border-2 rounded-[1rem] py-6"
                                autoFocus
                                aria-label="AI search input"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <Search className="h-6 w-6 text-primary/80" />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                <Button
                                    size="sm"
                                    className="rounded-full gap-2 px-4 shadow-md hover:shadow-lg transition-shadow"
                                    onClick={handleSearch}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <RotateCw className="h-4 w-4 animate-spin" />
                                            Searching...
                                        </>
                                    ) : (
                                        <>
                                            Search
                                            <CornerDownLeft className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                                <Badge
                                    variant="outline"
                                    className="px-2 py-1 text-xs font-mono bg-background/80"
                                >
                                    {navigator.platform.includes('Mac') ? '⌘⏎' : 'Ctrl+Enter'}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl  border border-primary/10">
                                <h3 className="text-lg font-semibold text-foreground/90 mb-3">
                                    ✨ AI-Powered Features
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-foreground/80">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Natural language understanding
                                    </li>
                                    <li className="flex items-center gap-2 text-foreground/80">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Multi-platform job aggregation
                                    </li>
                                    <li className="flex items-center gap-2 text-foreground/80">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Salary & benefits analysis
                                    </li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10">
                                <h3 className="text-lg font-semibold text-foreground/90 mb-3">
                                    🔍 Recent Searches
                                </h3>
                                <div className="space-y-2">
                                    <Button variant="ghost" className="w-full justify-start text-foreground/70">
                                        Senior UX roles in San Francisco
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-foreground/70">
                                        Entry-level Python remote jobs
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start text-foreground/70">
                                        Tech startups with 401k matching
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-sm text-foreground/70 flex gap-2">
                                <span className="text-primary">💡 Pro Tip:</span>
                                Use natural language like "Jobs for React developers with 5+ years experience"
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SearchBar;