import { useState, useContext } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Trash2, UploadCloud } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Loader2, UploadCloudIcon } from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";

function UploadResume() {
    const isLoggedIn = true;
    const aiCredits = 40;

    const [currentPdf, setCurrentPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [AIReview, setAIReview] = useState(null);
    const [compatibilityScore, setCompatibilityScore] = useState(null);
    const [suggestions, setSuggestions] = useState({
        strengths: [],
        weaknesses: [],
        suggestions: []
    });
    const bearerToken = "";

    const uploadAndAnalyzeResume = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (aiCredits <= 0 || aiCredits < 20) {
            if (aiCredits <= 0) {
                toast.error("You're out of AI credits!");
            } else {
                toast.warning("Your AI credits are running low!");
            }
            event.target.value = "";
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('https://z.satyamjha.me/resume/review', formData, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000,
            });

            const result = response.data;
            console.log("API response:", result);
            const newPdf = {
                id: Date.now(),
                name: file.name,
                date: new Date().toLocaleString(),
            };
            setCurrentPdf(newPdf);
            console.log("skills extracted:", result.skills);
            if (result.analysis) {
                setAIReview(result.analysis);
                if (result.analysis.score) {
                    setCompatibilityScore(result.analysis.score);
                }
                setSuggestions({
                    strengths: result.analysis.strengths || [],
                    weaknesses: result.analysis.weaknesses || [],
                    suggestions: result.analysis.suggestions || []
                });
            }

            toast.success("Resume analyzed successfully!");

        } catch (error) {
            console.error("Error uploading and analyzing resume:", error);
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error || 'Server error';

                if (status === 401) {
                    toast.error("Authentication failed. Please check your credentials.");
                } else if (status === 413) {
                    toast.error("File too large. Please upload a smaller file.");
                } else if (status === 429) {
                    toast.error("Too many requests. Please try again later.");
                } else {
                    toast.error(`Error: ${message}`);
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error("Failed to analyze resume. Please try again.");
            }

            clearData();
        } finally {
            setIsLoading(false);
            event.target.value = "";
        }
    };

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            <Toaster richColors position="top-center" />
            {!currentPdf ? (
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            AI-Powered Resume Analysis
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 px-4">
                            Instant ATS feedback • Skill analysis • AI Review
                        </p>

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 transition-colors hover:border-blue-500 hover:dark:border-blue-600">
                            <label className="flex flex-col items-center gap-5 cursor-pointer">
                                <UploadCloudIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />

                                <div className="space-y-2">
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Drag PDF here or{" "}
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            browse files
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Supported format: .pdf
                                    </p>
                                </div>

                                <Input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={uploadAndAnalyzeResume}
                                    disabled={isLoading}
                                    className="hidden"
                                />
                                <Button
                                    className={`px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Analyzing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <UploadCloud className="h-4 w-4" />
                                            Upload Resume
                                        </span>
                                    )}
                                </Button>
                            </label>
                        </div>

                        {/* Test info */}
                        <div className="mt-4 text-xs text-gray-500">
                            Test Mode: Credits: {aiCredits} | Logged In: {isLoggedIn ? 'Yes' : 'No'}
                        </div>
                    </div>
                </div>
            ) : (
                <Card className="transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{currentPdf.name}</CardTitle>
                                <CardDescription>
                                    Uploaded: {currentPdf.date}
                                    {isLoggedIn && (
                                        <span className="block text-xs mt-1 text-green-600">
                                            Test user logged in
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearData}
                                aria-label="Delete PDF"
                            >
                                <Trash2 className="h-4 w-4 text-red-600 rounded-sm" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <h3 className="text-md font-semibold mb-2">Extracted Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-20 rounded-md" />
                                ))
                            ) : skills.length > 0 ? (
                                skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-blue-100 rounded-md text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        {skill}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No skills extracted yet</p>
                            )}
                        </div>
                    </CardContent>

                    <CardContent>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            AI Analysis Report
                        </h3>
                        {isLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        ) : AIReview ? (
                            AIReview.error ? (
                                <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
                                    {AIReview.error}
                                </div>
                            ) : (
                                <>
                                    {compatibilityScore && (
                                        <div className="mb-8 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/30">
                                            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                                Overall Compatibility Score
                                            </h3>
                                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {compatibilityScore}/100
                                            </div>
                                        </div>
                                    )}

                                    <Accordion type="multiple" className="w-full space-y-4">
                                        {['strengths', 'weaknesses', 'suggestions'].map((section) => {
                                            const title = section.charAt(0).toUpperCase() + section.slice(1);
                                            const isStrength = section === 'strengths';
                                            const isWeakness = section === 'weaknesses';
                                            const content = suggestions[section] || [];

                                            if (content.length === 0) return null;

                                            return (
                                                <AccordionItem key={section} value={section} className="border-none">
                                                    <AccordionTrigger className="hover:no-underline px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                        <div className="flex items-center gap-3 w-full">
                                                            <span className={`w-3 h-3 rounded-full ${isStrength ? 'bg-green-500' :
                                                                isWeakness ? 'bg-red-500' :
                                                                    'bg-blue-500'
                                                                }`}></span>
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                {title} ({content.length})
                                                            </span>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 py-3">
                                                        <ul className="list-disc list-inside pl-4 space-y-2 text-gray-600 dark:text-gray-400">
                                                            {content.map((item, i) => (
                                                                <li key={i} className="text-sm leading-relaxed">
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            );
                                        })}
                                    </Accordion>
                                </>
                            )
                        ) : (
                            <p className="text-gray-500 text-sm">Upload a resume to see AI analysis</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UploadResume;