import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { JdContext } from '../../Context/JdContext';
import { SkillsContext } from '../../Context/SkillsContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion';
import useUserData from '../../Context/UserContext';
import { toast } from "sonner";
import axios from 'axios';

const HandleJobDescription = () => {
    const [jdText, setJdText] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [coverLetters, setCoverLetters] = useState([]);
    const { Jd, setJd } = useContext(JdContext);
    const { globalSkills } = useContext(SkillsContext);
    const { userData, fetchUserData } = useUserData();

    // Bearer token - move to environment variables in production
    const bearerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ODQ3NTc4YTIxNmYzODdlNjc5ODcyY2MiLCJlbWFpbCI6InNhdHlhbUBqaGFqaS5jb20iLCJpYXQiOjE3NTA1NDAyMTcsImV4cCI6MTc1MDYyNjYxN30.fSsCetNk3sqToZu12B7E1nVTwC4mQGaueJrVMRP8qEU";

    useEffect(() => {
        const storedCoverLetters = localStorage.getItem("coverLetters");
        if (storedCoverLetters) {
            setCoverLetters(JSON.parse(storedCoverLetters));
        }
    }, []);

    const handleJdUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setJdFile(file);

        try {
            // Create FormData for PDF upload
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('https://satyamjha.me/health', formData, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000,
            });

            const extractedText = response.data.text || response.data.extractedText || '';
            setJdText(extractedText);
            setJd(extractedText);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);

            if (error.response) {
                const status = error.response.status;
                if (status === 401) {
                    toast.error("Authentication failed. Please check your credentials.");
                } else if (status === 413) {
                    toast.error("File too large. Please upload a smaller file.");
                } else {
                    toast.error("Failed to extract text from the PDF.");
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error("Failed to extract text from the PDF.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleJdTextChange = (e) => {
        setJdText(e.target.value);
    };

    const handleGenerateCoverLetter = async () => {
        if (!jdText) {
            toast.error("Please upload a PDF or paste a job description.");
            return;
        }
        if (userData.aiCredits <= 0) {
            toast.error("You have no AI credits left. Please wait for your credits to get refilled within 1 hrs.");
            return;
        }

        setIsLoading(true);
        localStorage.setItem("jobDescription", jdText);

        try {
            const requestData = {
                jobDescription: jdText,
                skills: globalSkills,
                email: userData.email
            };

            const response = await axios.post('https://satyamjha.me/health', requestData, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                },
                timeout: 60000,
            });

            const parsedData = response.data;

            if (parsedData.cover_letters && Array.isArray(parsedData.cover_letters)) {
                // Refresh the userData so UI shows new aiCredits
                await fetchUserData();

                // Update cover letters state
                setCoverLetters(parsedData.cover_letters);
                localStorage.setItem(
                    "coverLetters",
                    JSON.stringify(parsedData.cover_letters)
                );

                toast.success("Cover letters generated successfully!");
            } else {
                console.error("Unexpected response format:", response.data);
                toast.error("Unexpected response format. Please try again.");
            }
        } catch (error) {
            console.error("Error generating cover letters:", error);

            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.response.data?.error || 'Server error';

                if (status === 401) {
                    toast.error("Authentication failed. Please check your credentials.");
                } else if (status === 429) {
                    toast.error("Too many requests. Please try again later.");
                } else if (status === 400) {
                    toast.error("Invalid request. Please check your job description.");
                } else {
                    toast.error(`Error: ${message}`);
                }
            } else if (error.request) {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error("Failed to generate cover letters. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (letter) => {
        const fullLetter = `
[Your Name]
[Your Address]
[City, Postal Code]
[Email Address]
[Phone Number]

${new Date().toLocaleDateString()}

[Hiring Manager Name]
[Company Name]
[Company Address]
[City, Postal Code]

Dear [Hiring Manager Name],

${letter}

Sincerely,
[Your Name]
        `.trim();

        navigator.clipboard.writeText(fullLetter).then(() => {
            toast.success('Copied to clipboard!');
        });
    };

    return (
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                    Job Description
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center transition-colors group-hover:border-emerald-200">
                            <p className="text-sm text-slate-600 mb-2">
                                Upload Job Description or{" "}
                                <span className="text-emerald-600 cursor-pointer">paste text</span>
                            </p>
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleJdUpload}
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-2 bg-white text-sm text-slate-500">OR</span>
                        </div>
                    </div>

                    <textarea
                        placeholder="Paste job description here..."
                        value={jdText}
                        onChange={handleJdTextChange}
                        className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-4">
                    <Button
                        onClick={handleGenerateCoverLetter}
                        className="w-full bg-black gap-2"
                        disabled={isLoading || !jdText}
                    >
                        {isLoading ? "Generating..." : "Generate Cover Letter"}
                    </Button>

                    {coverLetters.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {coverLetters.map((letter, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left no-underline hover:no-underline p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-medium text-slate-800">Cover Letter {index + 1}</span>
                                            <Button
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyToClipboard(letter);
                                                }}
                                                className="text-slate-500 hover:text-emerald-600"
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm mt-2">
                                        <div className="space-y-6">
                                            <div className="text-sm text-slate-600">
                                                <p className="font-semibold">[Your Name]</p>
                                                <p>[Your Address]</p>
                                                <p>[City, Postal Code]</p>
                                                <p>[Email Address]</p>
                                                <p>[Phone Number]</p>
                                            </div>

                                            <div className="text-sm text-slate-600">
                                                <p>{new Date().toLocaleDateString()}</p>
                                            </div>

                                            <div className="text-sm text-slate-600">
                                                <p className="font-semibold">[Hiring Manager Name]</p>
                                                <p>[Company Name]</p>
                                                <p>[Company Address]</p>
                                                <p>[City, Postal Code]</p>
                                            </div>

                                            <div className="text-sm text-slate-600">
                                                <p>Dear [Hiring Manager Name],</p>
                                            </div>

                                            <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                                                <p>{letter}</p>
                                            </div>

                                            <div className="text-sm text-slate-600">
                                                <p>Sincerely,</p>
                                                <p className="font-semibold">[Your Name]</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default HandleJobDescription;