import { useState, useEffect, useContext, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Trash2, UploadCloud } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { Badge } from "../../components/ui/badge";
import { SkillsContext } from "../../Context/SkillsContext";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
import { Loader2, UploadCloudIcon } from "lucide-react";

function UploadResume() {
    const [currentPdf, setCurrentPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [processingSkills, setProcessingSkills] = useState(false);
    const [AIReview, setAIReview] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [compatibilityScore, setCompatibilityScore] = useState(null);
    const [suggestions, setSuggestions] = useState({
        strengths: [],
        weaknesses: [],
        suggestions: []
    });
    const { globalSkills, setGlobalSkills } = useContext(SkillsContext);
    const intervalRef = useRef();

    const genAI = new GoogleGenerativeAI("AIzaSyAx4bapGjEdXuwlAgRwpK2jda5Cmklf5rw");

    useEffect(() => {
        const savedPdf = localStorage.getItem("currentPdf");
        const savedSkills = localStorage.getItem("globalSkills");
        const savedAIReview = localStorage.getItem("AIReview");
        const savedCompatibilityScore = localStorage.getItem("compatibilityScore");
        const savedSuggestions = localStorage.getItem("suggestions");

        if (savedPdf) setCurrentPdf(JSON.parse(savedPdf));
        if (savedSkills) setGlobalSkills(JSON.parse(savedSkills));
        if (savedAIReview) setAIReview(savedAIReview);
        if (savedCompatibilityScore) setCompatibilityScore(JSON.parse(savedCompatibilityScore));
        if (savedSuggestions) setSuggestions(JSON.parse(savedSuggestions));
    }, []);

    useEffect(() => {
        if (currentPdf) localStorage.setItem("currentPdf", JSON.stringify(currentPdf));
    }, [currentPdf]);

    useEffect(() => {
        localStorage.setItem("globalSkills", JSON.stringify(globalSkills));
    }, [globalSkills]);

    useEffect(() => {
        localStorage.setItem("AIReview", AIReview);
        console.log("AI review:", AIReview);
    }, [AIReview]);

    useEffect(() => {
        localStorage.setItem("compatibilityScore", JSON.stringify(compatibilityScore));
    }, [compatibilityScore]);

    useEffect(() => {
        localStorage.setItem("suggestions", JSON.stringify(suggestions));
    }, [suggestions]);

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const extractText = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsLoading(true);
        setProcessingSkills(true);
        setExtractedText('');
        setAIReview('');
        setGlobalSkills([]);
        setCompatibilityScore(null);
        setSuggestions([]);

        const reader = new FileReader();
        reader.onload = async function () {
            try {
                const typedArray = new Uint8Array(reader.result);
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

                let fullText = "";
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
                }
                setExtractedText(fullText);

                const newPdf = {
                    id: Date.now(),
                    name: file.name,
                    text: fullText || "No text found in the PDF",
                    date: new Date().toLocaleString(),
                };
                setCurrentPdf(newPdf);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const prompt = `Extract all relevent skills from this resume text as a comma-separated list (max 10 skills): ${fullText}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const skillsList = response.text().split(',').map(skill => skill.trim());

                setGlobalSkills(skillsList);
                localStorage.setItem("globalSkills", JSON.stringify(skillsList));

                const jdText = localStorage.getItem("jobDescription");
                if (jdText) {
                    await compareResumeWithJD(fullText, jdText);
                } else {
                    intervalRef.current = setInterval(async () => {
                        const newJd = localStorage.getItem("jobDescription");
                        if (newJd) {
                            clearInterval(intervalRef.current);
                            await compareResumeWithJD(fullText, newJd);
                        }
                    }, 2000);
                }

                await generateAIReview(fullText);
            } catch (error) {
                console.error("Error extracting text:", error);
                setGlobalSkills([]);
                setAIReview("Failed to process the PDF.");
            } finally {
                setIsLoading(false);
                setProcessingSkills(false);
                event.target.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const compareResumeWithJD = async (resumeText, jdText) => {
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `
            Compare the following resume and job description. Provide:
            1. Compatibility score out of 100
            2. Categorized suggestions
            Resume:
            ${resumeText}
    
            Job Description:
            ${jdText}
    
            Return response in this EXACT JSON format:
            {
                "score": 85,
                "strengths": ["..."],
                "weaknesses": ["..."],
                "suggestions": ["..."]
            }
            `;

            const result = await model.generateContent(prompt);
            const response = result.response;
            let textResponse = response.text();

            textResponse = textResponse.replace(/```json|```/g, "").trim();
            textResponse = textResponse.replace(/[\x00-\x1F\x7F]/g, "");

            const parsedData = JSON.parse(textResponse);
            if (parsedData.score && parsedData.strengths && parsedData.weaknesses && parsedData.suggestions) {
                setCompatibilityScore(parsedData.score);
                setSuggestions({
                    strengths: parsedData.strengths,
                    weaknesses: parsedData.weaknesses,
                    suggestions: parsedData.suggestions
                });
            } else {
                console.error("Unexpected response format:", textResponse);
                alert("Unexpected response format. Please try again.");
            }
        } catch (error) {
            console.error("Error comparing resume with JD:", error);
            alert("Failed to compare resume with job description.");
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIReview = async (text) => {
        if (!text) {
            setAIReview("No text found in the resume.");
            return;
        }

        setIsLoading(true);

        try {
            const review = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `Analyze this resume text for strengths, weaknesses, and suggestions: ${text}`;
            const result = await review.generateContent(prompt);
            const response = await result.response;
            console.log("AI review response:", response.text());
            setAIReview(response.text());
        } catch (error) {
            console.error("Error generating AI review:", error);
            setAIReview("Failed to generate AI review.");
        } finally {
            setIsLoading(false);
        }
    };

    const deletePdf = () => {
        setCurrentPdf(null);
        setGlobalSkills([]);
        setAIReview('');
        setCompatibilityScore(null);
        setSuggestions([]);
        localStorage.removeItem("currentPdf");
        localStorage.removeItem("globalSkills");
        localStorage.removeItem("AIReview");
        localStorage.removeItem("compatibilityScore");
        localStorage.removeItem("suggestions");
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    return (
        <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">


            {!currentPdf ? (
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            AI-Powered Resume Analysis
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 px-4">
                            Instant ATS feedback • Strengths analysis • Free & secure
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
                                    onChange={extractText}
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
                    </div>
                </div>
            ) : (
                <Card className="transition-shadow">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>{currentPdf.name}</CardTitle>
                                <CardDescription>{currentPdf.date}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={deletePdf} aria-label="Delete PDF">
                                <Trash2 className="h-4 w-4 text-red-600 rounded-sm" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-md font-semibold mb-2">Extracted Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                            {processingSkills ? (
                                <Skeleton className="h-8 w-20 rounded-md" />
                            ) : (
                                globalSkills.map((skill, index) => (
                                    <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">
                                        {skill}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </CardContent>
                    {compatibilityScore !== null && (
                        <CardContent>
                            <h3 className="text-md font-semibold mb-2">Compatibility Score:</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{compatibilityScore}/100</p>
                        </CardContent>
                    )}
                    {suggestions.length > 0 && (
                        <CardContent>
                            <h3 className="text-md font-semibold mb-2">Suggestions:</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                                {suggestions.map((suggestion, index) => (
                                    <li key={index}>{suggestion}</li>
                                ))}
                            </ul>
                        </CardContent>
                    )}
                    <CardContent>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">AI Review</h3>
                        {AIReview ? (
                            <Accordion type="multiple" className="w-full">
                                {AIReview.split('**').map((section, index) => {
                                    const [heading, content] = section.split(':');
                                    const trimmedHeading = heading.trim();
                                    const isStrength = trimmedHeading === 'Strengths';
                                    const isWeakness = trimmedHeading === 'Weaknesses';
                                    const isSuggestion = trimmedHeading === 'Suggestions';

                                    if (!isStrength && !isWeakness && !isSuggestion) return null;

                                    return (
                                        <AccordionItem key={index} value={trimmedHeading}>
                                            <AccordionTrigger className="text-left hover:no-underline px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <span className={`w-2 h-2 rounded-full ${isStrength ? 'bg-green-500' :
                                                        isWeakness ? 'bg-red-500' :
                                                            'bg-blue-500'
                                                        }`}></span>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {trimmedHeading}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 py-3">
                                                <ul className="list-disc list-inside pl-4 space-y-2 text-gray-600 dark:text-gray-400">
                                                    {content.split('*').filter(Boolean).map((item, i) => (
                                                        <li key={i} className="text-sm leading-relaxed">
                                                            {item.trim()}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        ) : (
                            <Skeleton className="h-20 w-full" />
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UploadResume;