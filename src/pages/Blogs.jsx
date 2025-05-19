import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Rocket, Globe, Zap, Search, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { blogContent } from '../data/blogs';

const BlogDetails = () => {
    return (
        <article className="max-w-4xl mx-auto px-4 py-8">
            <Helmet>
                <title>AI Job Search 2024 | Global Job Platform | Zobly</title>
                <meta name="description" content="Smart job search platform aggregating LinkedIn, Indeed, Glassdoor & Naukri. AI-powered tools for global professionals in 100+ countries." />
                <meta name="keywords" content="AI job search, global job platform, 2024 career trends, smart job alerts, resume optimization" />
                <meta property="og:title" content="AI-Powered Global Job Search Platform | Zobly 2024" />
                <meta property="og:description" content="Unified job search with AI analysis across 50+ job boards worldwide." />
                <meta property="og:image" content="https://www.zobly.com/og-ai-job-search.jpg" />
                <link rel="canonical" href="https://www.zobly.com/ai-job-platform" />
            </Helmet>

            <header className="mb-12 text-center space-y-4">
                <div className="inline-flex items-center gap-2 text-sm bg-muted px-4 py-1 rounded-full">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Global Job Platform</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    AI-Driven Job Search Solutions
                </h1>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Smart job aggregation from 50+ sources with real-time market analysis
                </p>
                <Button size="lg" className="mt-6 gap-2">
                    <Zap className="w-4 h-4" />
                    Try Free Search
                </Button>
            </header>

            <div className="mb-12 rounded-xl overflow-hidden border">
                <img
                    src="/ai-job-search-interface.jpg"
                    alt="AI job search platform interface"
                    className="w-full h-64 object-cover"
                    loading="lazy"
                />
            </div>

            <div className="space-y-20">
                {blogContent.map((section, index) => (
                    <section key={index} className="space-y-4 scroll-mt-24">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                {index === 0 && <Search className="w-5 h-5 text-blue-600" />}
                                {index === 1 && <Rocket className="w-5 h-5 text-blue-600" />}
                                {index === 2 && <Briefcase className="w-5 h-5 text-blue-600" />}
                                {index === 3 && <FileText className="w-5 h-5 text-blue-600" />}
                            </div>
                            <h2 className="text-2xl font-semibold">{section.title}</h2>
                        </div>

                        <div className="space-y-4 text-muted-foreground">
                            <p className="leading-relaxed">{section.content}</p>
                            
                            {index === 1 && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h3 className="font-medium mb-2">Top Search Patterns:</h3>
                                    <ul className="space-y-2 text-sm">
                                        <li>✓ Remote engineering positions (Global)</li>
                                        <li>✓ Marketing roles in London (UK)</li>
                                        <li>✓ Visa-sponsored IT jobs (Europe)</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            <footer className="mt-16 py-12 text-center border-t">
                <h2 className="text-xl font-semibold mb-4">Start Smart Job Search</h2>
                <p className="text-muted-foreground mb-6">Join 1M+ professionals worldwide</p>
                <Button size="lg" className="gap-2">
                    <Rocket className="w-4 h-4" />
                    Get Started
                </Button>
            </footer>
        </article>
    );
};

export default BlogDetails;