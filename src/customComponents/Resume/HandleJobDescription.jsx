import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { JdContext } from '../../Context/JdContext';
import { SkillsContext } from '../../Context/SkillsContext';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../../components/ui/accordion';

const HandleJobDescription = () => {
    const [jdText, setJdText] = useState('');
    const [jdFile, setJdFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [coverLetters, setCoverLetters] = useState([]);
    const { Jd, setJd } = useContext(JdContext);
    const { globalSkills } = useContext(SkillsContext);

    useEffect(() => {
        const storedCoverLetters = localStorage.getItem("coverLetters");
        if (storedCoverLetters) {
            setCoverLetters(JSON.parse(storedCoverLetters));
        }
    }, []);

    const genAI = new GoogleGenerativeAI("AIzaSyAx4bapGjEdXuwlAgRwpK2jda5Cmklf5rw");

    const handleJdUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setJdFile(file);

        try {
            const extractedText = await extractTextFromPDF(file);
            setJdText(extractedText);
            setJd(extractedText);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
            alert("Failed to extract text from the PDF.");
        } finally {
            setIsLoading(false);
        }
    };

    const extractTextFromPDF = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
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
                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleJdTextChange = (e) => {
        setJdText(e.target.value);
    };

    const handleGenerateCoverLetter = async () => {
        if (!jdText) {
            alert("Please upload a PDF or paste a job description.");
            return;
        }

        setIsLoading(true);
        localStorage.setItem("jobDescription", jdText);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `
                Generate exactly 3 professional cover letters within 180 words each aligning to the ${jdText} and ${globalSkills} also check the company name if available in ${jdText} and personalize it accordingly in valid JSON format.
                The response should be a JSON object with the strictly following structure:
                {
                    "cover_letters": ["cover letter 1", "cover letter 2", "cover letter 3"]
                }
                Do not include Markdown or extra formatting—return only a valid JSON object.
            `;

            const result = await model.generateContent(prompt);
            const response = result.response;
            let textResponse = response.text();

            textResponse = textResponse.replace(/```json|```/g, "").trim();
            textResponse = textResponse.replace(/[\x00-\x1F\x7F]/g, "");

            const parsedData = JSON.parse(textResponse);

            if (parsedData.cover_letters && Array.isArray(parsedData.cover_letters)) {
                setCoverLetters(parsedData.cover_letters);
                localStorage.setItem("coverLetters", JSON.stringify(parsedData.cover_letters));
            } else {
                console.error("Unexpected response format:", textResponse);
                alert("Unexpected response format. Please try again.");
            }
        } catch (error) {
            console.error("Error generating cover letters:", error);
            alert("Failed to generate cover letters. Please check the job description and try again.");
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
            alert('Copied to clipboard!');
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