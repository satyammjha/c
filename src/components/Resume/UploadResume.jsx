import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Trash2, UploadCloud, Loader2, Lock, Star, AlertTriangle, Lightbulb, Code, Briefcase, Target, RefreshCw } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion";
import { Toaster, toast } from "sonner";
import axios from "axios";
import useUserData from "../../Context/UserContext";



function UploadResume() {
    const { userData, token, setUser } = useUserData();
    const aiCredits = userData?.aiCredits || 0;
    const isLoggedIn = userData && token;
    let existingResumeData = userData?.resumeReview;

    console.log("UserData", userData);
    console.log("Existing Resume Data", existingResumeData);

    const [currentPdf, setCurrentPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const clearData = () => {
        setCurrentPdf(null);
    };

    const uploadAndAnalyzeResume = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!isLoggedIn) {
            toast.error("Please log in to analyze your resume");
            event.target.value = "";
            return;
        }

        if (aiCredits <= 0) {
            toast.error("You're out of AI credits!");
            event.target.value = "";
            return;
        }

        if (aiCredits < 20) {
            toast.warning("Your AI credits are running low!");
        }

        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('https://z.satyamjha.me/resume/review', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000,
            });

            const result = response.data;
            console.log("Resume analysis result:", result.user);

            setCurrentPdf({
                id: Date.now(),
                name: file.name,
                date: new Date().toLocaleString(),
            });

            setUser(result.user, token);
            setCurrentPdf(null);
            toast.success("Resume analyzed successfully!");

        } catch (error) {
            console.error("Error uploading and analyzing resume:", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error || 'Server error';

                switch (status) {
                    case 401:
                        toast.error("Authentication failed. Please sign in to proceed");
                        break;
                    case 413:
                        toast.error("File too large. Please upload a smaller file.");
                        break;
                    case 429:
                        toast.error("Too many requests. Please try again later.");
                        break;
                    default:
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

    const handleDeleteResume = async () => {
        if (!isLoggedIn) {
            toast.error("Please log in to delete resume data");
            return;
        }

        setIsDeleting(true);

        try {
            // TODO: Replace with actual delete API endpoint
            // const response = await axios.delete('https://z.satyamjha.me/resume/review', {
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //     },
            // });

            // For now, simulate deletion by updating user data
            // Remove resumeReview from userData
            const updatedUserData = { ...userData };
            delete updatedUserData.resumeReview;
            setUser(updatedUserData, token);

            toast.success("Resume data deleted successfully!");
        } catch (error) {
            console.error("Error deleting resume data:", error);
            toast.error("Failed to delete resume data. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-6">
                        <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                            Authentication Required
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please log in to access AI-powered resume analysis
                        </p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        Sign In to Continue
                    </Button>
                </div>
            </div>
        );
    }

    if (existingResumeData && !currentPdf) {
        return (
            <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">


                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        Your Resume Analysis
                                        {existingResumeData?.overallScore && (
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                {existingResumeData.overallScore}/100
                                            </Badge>
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        Checked at: {existingResumeData?.reviewedAt || 'Unknown'}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPdf({ showUpload: true })}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Update Resume
                                    </Button>
                                    {/* <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={handleDeleteResume}
                                        disabled={isDeleting}
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button> */}
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{existingResumeData.overallScore || 'N/A'}</div>
                                <div className="text-sm text-blue-800 dark:text-blue-200">zAI Score</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{existingResumeData.experience?.yearsOfExperience || 'N/A'}</div>
                                <div className="text-sm text-green-800 dark:text-green-200">Years Experience</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">{existingResumeData.skills?.length || 0}</div>
                                <div className="text-sm text-purple-800 dark:text-purple-200">Skills Found</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Code className="h-5 w-5" />
                                Extracted Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {existingResumeData.skills?.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {skill}
                                    </Badge>
                                )) || <p className="text-gray-500 text-sm">No skills extracted</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="multiple" className="w-full">
                                <AccordionItem value="strengths">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <Star className="h-5 w-5 text-green-500" />
                                            <span>Strengths ({existingResumeData.strengths?.length || 0})</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2">
                                            {existingResumeData.strengths?.map((strength, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                                    {strength}
                                                </li>
                                            )) || <p className="text-gray-500 text-sm">No strengths identified</p>}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="weaknesses">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                                            <span>Areas for Improvement ({existingResumeData.weaknesses?.length || 0})</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2">
                                            {existingResumeData.weaknesses?.map((weakness, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                                    {weakness}
                                                </li>
                                            )) || <p className="text-gray-500 text-sm">No weaknesses identified</p>}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="suggestions">
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <Lightbulb className="h-5 w-5 text-blue-500" />
                                            <span>Suggestions ({existingResumeData.suggestions?.length || 0})</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-2">
                                            {existingResumeData.suggestions?.map((suggestion, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                    {suggestion}
                                                </li>
                                            )) || <p className="text-gray-500 text-sm">No suggestions available</p>}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {existingResumeData.additionalInsights && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Career Insights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Strongest Area</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {existingResumeData.additionalInsights.strongestArea}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Career Level</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {existingResumeData.experience?.level} - {existingResumeData.additionalInsights.careerReadiness}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
            {!currentPdf || currentPdf?.showUpload ? (
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            {existingResumeData ? 'Update Resume Analysis' : 'AI-Powered Resume Analysis'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                            Instant ATS feedback • Skill analysis • Performance insights
                        </p>

                        {existingResumeData && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    You already have resume data. Uploading a new resume will update your existing analysis.
                                </p>
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 transition-colors hover:border-blue-500">
                            <label className="flex flex-col items-center gap-5 cursor-pointer">
                                <UploadCloud className="h-12 w-12 text-gray-400" />

                                <div className="space-y-2">
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        Drag PDF here or{" "}
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            browse files
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">
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
                                    disabled={isLoading}
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-4 w-4 mr-2" />
                                            {existingResumeData ? 'Update Resume' : 'Upload Resume'}
                                        </>
                                    )}
                                </Button>
                            </label>
                        </div>

                        <div className="mt-4 text-xs text-gray-500">
                            Credits: {aiCredits} | Status: Ready
                        </div>

                        {existingResumeData && (
                            <div className="mt-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => setCurrentPdf(null)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    ← Back to Current Analysis
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        {currentPdf.name}
                                    </CardTitle>
                                    <CardDescription>
                                        Uploaded: {currentPdf.date}
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="icon" onClick={clearData}>
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        </CardHeader>
                    </Card>

                    {isLoading && (
                        <div className="space-y-4">
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                            <Skeleton className="h-24 w-full rounded-lg" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UploadResume;