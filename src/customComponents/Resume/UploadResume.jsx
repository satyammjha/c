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
import useUserData from "../../Context/UserContext";
import consumeCredit from "../../services/consumeCredit";
import { Toaster, toast } from "sonner";

function UploadResume() {
    const { userData } = useUserData();
    const currentUser = userData?.email;
    console.log("currentUser", currentUser);
    const [currentPdf, setCurrentPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [processingSkills, setProcessingSkills] = useState(false);
    const [AIReview, setAIReview] = useState(null);
    const [compatibilityScore, setCompatibilityScore] = useState(null);
    const [suggestions, setSuggestions] = useState({
        strengths: [],
        weaknesses: [],
        suggestions: []
    });
    const { globalSkills, setGlobalSkills } = useContext(SkillsContext);
    const intervalRef = useRef();

    const genAI = new GoogleGenerativeAI("AIzaSyAx4bapGjEdXuwlAgRwpK2jda5Cmklf5rw");

    const getStorageKey = (key) => {
        return currentUser ? `${key}_${currentUser.uid}` : key;
    };

    useEffect(() => {
        if (!currentUser) return;

        const loadPersistedData = () => {
            try {
                const savedPdf = localStorage.getItem(getStorageKey("currentPdf"));
                const savedSkills = localStorage.getItem(getStorageKey("globalSkills"));
                const savedAIReview = localStorage.getItem(getStorageKey("AIReview"));
                const savedScore = localStorage.getItem(getStorageKey("compatibilityScore"));
                const savedSuggestions = localStorage.getItem(getStorageKey("suggestions"));

                if (savedPdf) setCurrentPdf(JSON.parse(savedPdf));
                if (savedSkills) setGlobalSkills(JSON.parse(savedSkills));
                if (savedAIReview) setAIReview(JSON.parse(savedAIReview));
                if (savedScore) setCompatibilityScore(JSON.parse(savedScore));
                if (savedSuggestions) setSuggestions(JSON.parse(savedSuggestions));
            } catch (error) {
                console.error("Error loading persisted data:", error);
                clearUserData();
            }
        };

        loadPersistedData();
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && currentPdf) {
            localStorage.setItem(getStorageKey("currentPdf"), JSON.stringify(currentPdf));
        }
    }, [currentPdf, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(getStorageKey("globalSkills"), JSON.stringify(globalSkills));
        }
    }, [globalSkills, currentUser]);

    useEffect(() => {
        if (currentUser && AIReview) {
            localStorage.setItem(getStorageKey("AIReview"), JSON.stringify(AIReview));
        }
    }, [AIReview, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(getStorageKey("compatibilityScore"), JSON.stringify(compatibilityScore));
        }
    }, [compatibilityScore, currentUser]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(getStorageKey("suggestions"), JSON.stringify(suggestions));
        }
    }, [suggestions, currentUser]);

    const clearUserData = () => {
        setCurrentPdf(null);
        setGlobalSkills([]);
        setAIReview(null);
        setCompatibilityScore(null);
        setSuggestions({
            strengths: [],
            weaknesses: [],
            suggestions: []
        });

        if (currentUser) {
            localStorage.removeItem(getStorageKey("currentPdf"));
            localStorage.removeItem(getStorageKey("globalSkills"));
            localStorage.removeItem(getStorageKey("AIReview"));
            localStorage.removeItem(getStorageKey("compatibilityScore"));
            localStorage.removeItem(getStorageKey("suggestions"));
        }
    };

 const extractText = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Quick credit‑check before anything else
  if (userData.aiCredits <= 0 || userData.aiCredits < 20) {
    if (userData.aiCredits <= 0) {
  toast(
    "😬 Oops! You’re out of AI credits. No worries—your credits will auto‑refill in an hour. Or earn extra credits instantly by referring a friend! 🚀"
  );
} else {
  toast(
    "🔔 Heads up! Your AI credits are running low. They’ll auto‑refill in an hour, or you can boost your balance by referring a friend. 👍"
  );
}
    event.target.value = "";
    return;
  }

  setIsLoading(true);
  setProcessingSkills(true);
  clearUserData();

  const creditResponse = await consumeCredit("resumeAnalysis", currentUser);
  if (creditResponse?.response?.status === 400) {
    toast(creditResponse.response.data.message);
    setIsLoading(false);
    setProcessingSkills(false);
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    try {
      const typedArray = new Uint8Array(reader.result);
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
      const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item) => item.str).join(" ") + "\n";
      }

      const newPdf = {
        id: Date.now(),
        name: file.name,
        text: fullText || "No text found in the PDF",
        date: new Date().toLocaleString(),
      };
      setCurrentPdf(newPdf);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `Extract relevant skills from this resume (max 10): ${fullText} and give response like skill1, skill2, skill3, .... the response should only include skills nothing paragraphs or anything only skills in words !!!most important`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const skillsList = response.text().split(',').map(skill => skill.trim());

      setGlobalSkills(skillsList);
      await generateAIReview(fullText);
    } catch (error) {
      console.error("Error processing PDF:", error);
      clearUserData();
    } finally {
      setIsLoading(false);
      setProcessingSkills(false);
      event.target.value = "";
    }
  };

  reader.readAsArrayBuffer(file);
};


    const generateAIReview = async (text) => {
        if (!text) {
            setAIReview({ error: "No text found in the resume" });
            return;
        }

        setIsLoading(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `Analyze this resume and provide:
                1. Compatibility score/100
                2. Strengths
                3. Weaknesses
                4. Suggestions
                Resume: ${text}
                Respond in this exact JSON format:
                {
                    "score": 85,
                    "strengths": ["..."],
                    "weaknesses": ["..."],
                    "suggestions": ["..."]
                }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                const reviewData = JSON.parse(responseText);
                setAIReview(reviewData);
                setCompatibilityScore(reviewData.score);
                setSuggestions({
                    strengths: reviewData.strengths,
                    weaknesses: reviewData.weaknesses,
                    suggestions: reviewData.suggestions
                });
            } catch (parseError) {
                console.error("Error parsing AI response:", parseError);
                setAIReview({ error: "Failed to analyze resume" });
            }
        } catch (error) {
            console.error("Error generating review:", error);
            setAIReview({ error: "Analysis failed" });
        } finally {
            setIsLoading(false);
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
                            Instant ATS feedback • Skill analysis • Persistent storage
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
                                <CardDescription>
                                    Uploaded: {currentPdf.date}
                                    {currentUser && (
                                        <span className="block text-xs mt-1 text-green-600">
                                            Saved to your account
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearUserData}
                                aria-label="Delete PDF"
                            >
                                <Trash2 className="h-4 w-4 text-red-600 rounded-sm" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <h3 className="text-md font-semibold mb-2">Extracted Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                            {processingSkills ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-8 w-20 rounded-md" />
                                ))
                            ) : (
                                globalSkills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-blue-100 rounded-md text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    >
                                        {skill}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </CardContent>

                    <CardContent>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                            AI Analysis Report
                        </h3>
                        {AIReview ? (
                            AIReview.error ? (
                                <div className="text-red-500 text-sm p-4 bg-red-50 rounded-lg">
                                    {AIReview.error}
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/30">
                                        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                            Overall Compatibility Score
                                        </h3>
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {compatibilityScore}/100
                                        </div>
                                    </div>

                                    <Accordion type="multiple" className="w-full space-y-4">
                                        {['strengths', 'weaknesses', 'suggestions'].map((section) => {
                                            const title = section.charAt(0).toUpperCase() + section.slice(1);
                                            const isStrength = section === 'strengths';
                                            const isWeakness = section === 'weaknesses';
                                            const content = AIReview[section] || [];

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
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default UploadResume;