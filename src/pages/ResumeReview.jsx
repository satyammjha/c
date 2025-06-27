import React from 'react';
import { Helmet } from "react-helmet-async";
import { SparklesIcon } from 'lucide-react';
import UploadResume from '../components/Resume/UploadResume';
import HandleJobDescription from '../components/Resume/HandleJobDescription';

const ResumeReview = () => {

    return (
        <>
            <Helmet>
                <title>AI Resume Review | Zobly</title>
                <meta name="description" content="Enhance your job search with AI-powered resume analysis on Zobly. Get smart insights and match jobs effortlessly." />
                <meta name="keywords" content="AI resume analysis, job matching, resume review, job search, Zobly AI, career growth" />
                <meta name="author" content="Zobly" />
                <meta property="og:title" content="AI Resume Review | Zobly" />
                <meta property="og:description" content="Enhance your job search with AI-powered resume analysis on Zobly. Get smart insights and match jobs effortlessly." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.zobly.com/resume-review" />
                <meta property="og:image" content="https://www.zobly.com/assets/resume-analysis-banner.png" />
            </Helmet>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="flex flex-col items-center justify-center gap-8">
                        <div className="space-y-4 text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-black dark:from-gray-100 dark:via-gray-300 dark:to-white bg-clip-text text-transparent flex items-center justify-center gap-3">
                                <SparklesIcon className="w-10 h-10 text-gray-800 dark:text-gray-200 animate-pulse" />
                                Smart Resume Analysis
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-medium">
                                AI-powered insights to boost your job search success
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <div className="w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full animate-pulse"></div>
                                <span>Powered by Advanced AI</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                            <UploadResume />
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                            <HandleJobDescription />
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <SparklesIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI-Powered Analysis</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Get detailed insights and recommendations to improve your resume</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <SparklesIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Smart Matching</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Match your resume with relevant job opportunities</p>
                            </div>
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <SparklesIcon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Career Boost</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Professional insights to accelerate your career growth</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResumeReview;