import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Briefcase, Bell, Rocket, Bot, FileText, Share2, ScanSearch, AlertCircle, Globe, Zap, BarChart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { blogContent } from '../data/blogs';

const BlogDetails = () => {
    return (
        <article className="max-w-6xl mx-auto px-4 py-12">
            <Helmet>
                <title>Zobly: Global AI Job Platform | Smart Job Search 2024</title>
                <meta name="description" content="World's first AI-powered job aggregator combining LinkedIn, Glassdoor, Naukri & Indeed. Get smart alerts, resume analysis, and instant cover letters." />
                <meta name="keywords" content={blogContent.map(blog => blog.keywords).join(', ')} />
                <meta property="og:title" content="Zobly: Global AI Job Platform | Smart Job Search 2024" />
                <meta property="og:description" content="Unified job search across 50+ countries with AI-powered tools for professionals worldwide." />
                <meta property="og:image" content="https://www.zobly.com/og-global-job-search.jpg" />
                <meta property="og:url" content="https://www.zobly.com/global-job-platform" />
                <link rel="canonical" href="https://www.zobly.com/global-job-platform" />
            </Helmet>

            <header className="mb-16 text-center space-y-6">
                <div className="inline-flex items-center gap-2 bg-accent/20 px-6 py-2 rounded-full mb-4">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Available Worldwide</span>
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    Smart Job Search for Global Professionals
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    AI-powered job aggregation from 50+ platforms including LinkedIn, Indeed, and Naukri. Available in 100+ countries.
                </p>
                <div className="flex justify-center gap-4 mt-8">
                    <Button size="lg" className="gap-2 shadow-lg">
                        <Zap className="w-5 h-5" />
                        Start Free Trial
                    </Button>
                    <Button variant="outline" size="lg" className="gap-2">
                        <BarChart className="w-5 h-5" />
                        Watch Demo
                    </Button>
                </div>
            </header>

            <div className="relative mb-16 rounded-2xl overflow-hidden shadow-2xl">
                <img
                    src="/global-job-platform.jpg"
                    alt="Zobly platform interface showing global job search results"
                    className="w-full h-96 object-cover"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
            </div>

            <nav className="mb-16 p-6 bg-muted rounded-xl sticky top-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">In this guide:</h2>
                <ul className="columns-2 gap-8">
                    {blogContent.map((section, index) => (
                        <li key={index} className="mb-2">
                            <a href={`#section-${index}`} className="hover:text-primary transition-colors">
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="grid gap-16">
                {blogContent.map((section, index) => (
                    <section
                        key={index}
                        id={`section-${index}`}
                        className="scroll-mt-24 group relative pb-8 border-b last:border-0"
                    >
                        <div className="flex gap-4 mb-6">
                            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg">
                                {index === 0 && <AlertCircle className="w-6 h-6 text-primary" />}
                                {index === 1 && <Rocket className="w-6 h-6 text-primary" />}
                                {index === 2 && <Bell className="w-6 h-6 text-primary" />}
                                {index === 3 && <ScanSearch className="w-6 h-6 text-primary" />}
                                {index === 4 && <Bot className="w-6 h-6 text-primary" />}
                                {index === 5 && <FileText className="w-6 h-6 text-primary" />}
                            </div>
                            <h2 className="text-3xl font-semibold mt-1">{section.title}</h2>
                        </div>

                        <div className="grid md:grid-cols-[2fr_1fr] gap-8">
                            <div className="space-y-4">
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {section.content}
                                </p>
                                {index === 4 && (
                                    <div className="p-6 bg-blue-50 rounded-xl">
                                        <h4 className="font-medium mb-3">Popular Global Searches:</h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2">
                                                <span className="text-primary">✓</span>
                                                "Remote Software Engineer jobs $100k+ (USA)"
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-primary">✓</span>
                                                "Marketing Manager positions in London (UK)"
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="text-primary">✓</span>
                                                "IT Jobs in Berlin with visa sponsorship"
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {section.keywords.split(', ').map((keyword, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="outline"
                                                className="px-3 py-1 text-sm font-normal"
                                            >
                                                {keyword}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {(index === 2 || index === 5) && (
                                    <Button variant="outline" className="w-full gap-2">
                                        <Share2 className="w-4 h-4" />
                                        Share Feature
                                    </Button>
                                )}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <footer className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white shadow-xl">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4">Join 2M+ Global Professionals</h2>
                    <p className="text-lg mb-8">Find better jobs faster in 100+ countries</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" size="lg" className="gap-2">
                            <Rocket className="w-5 h-5" />
                            Start Free Trial
                        </Button>
                        <Button variant="outline" size="lg" className="text-white border-white/30 gap-2">
                            <BarChart className="w-5 h-5" />
                            View Pricing
                        </Button>
                    </div>
                </div>
            </footer>
        </article>
    );
};

export default BlogDetails;