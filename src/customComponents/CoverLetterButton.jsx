import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

const CoverLetterButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [coverLetters, setCoverLetters] = useState([]);

    const fetchCoverLetters = () => {
        setIsLoading(true);
        setTimeout(() => {
            setCoverLetters([
                {
                    id: 1,
                    title: "Cover Letter for Software Engineer",
                    content: "Dear Hiring Manager, I am excited to apply for the Software Engineer position at your company...",
                },
                {
                    id: 2,
                    title: "Cover Letter for Product Manager",
                    content: "Dear Hiring Manager, I am writing to express my interest in the Product Manager role...",
                },
            ]);
            setIsLoading(false);
        }, 2000);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        fetchCoverLetters();
    };

    const handleCopy = (content) => {
        navigator.clipboard.writeText(content).then(() => {

        });
    };

    return (
        <>
            <Button variant="secondary" className="w-full sm:w-auto" onClick={handleOpenModal}>
                Generate Cover Letter
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Generated Cover Letters</DialogTitle>
                    </DialogHeader>
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Accordion type="single" collapsible>
                            {coverLetters.map((letter) => (
                                <AccordionItem key={letter.id} value={letter.id.toString()}>
                                    <AccordionTrigger className="flex items-center justify-between">
                                        <span>{letter.title}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-muted/50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(letter.content);
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <Card className="p-4 bg-muted/10">
                                            <p className="text-muted-foreground">{letter.content}</p>
                                        </Card>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CoverLetterButton;