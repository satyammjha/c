import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { MoveUpRight } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { IconArrowWaveRightUp } from '@tabler/icons-react';

const HeroUploadBtn = () => {
    const navigate = useNavigate();
    const features = [
        "AI-powered analysis of your resume content",
        "Smart job matching across multiple platforms",
        "Personalized job match scoring system",
        "Time-saving application recommendations",
        "Competency gap analysis with improvement tips"
    ];

    return (
        <>
            <SignedIn>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => navigate('/reviewresume')}
                    aria-label="Upload and analyze your resume"
                >
                    <span itemProp="name">Analyze My Resume</span>
                    <IconArrowWaveRightUp aria-hidden="true" className="h-5 w-5" />
                </Button>
            </SignedIn>

            <SignedOut>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="flex items-center gap-2"
                            aria-label="Get started with resume analysis"
                        >
                            <span itemProp="name">Get Started</span>
                            <MoveUpRight aria-hidden="true" className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>

                    <DialogContent role="document" aria-labelledby="seoModalTitle">
                        <DialogHeader>
                            <DialogTitle id="seoModalTitle" className="text-2xl font-bold">
                                AI-Powered Career Optimization
                            </DialogTitle>
                        </DialogHeader>

                        <section aria-labelledby="benefitsHeading">
                            <h2 id="benefitsHeading" className="sr-only">Key Benefits</h2>
                            <div className="space-y-4 text-gray-800 dark:text-gray-200">
                                <p className="text-lg font-medium">
                                    Get 360° resume analysis and smart job matching across platforms including:
                                </p>
                                <ul className="list-disc space-y-2 pl-6 marker:text-primary">
                                    {features.map((feature, index) => (
                                        <li key={index} itemProp="feature">
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm font-medium mt-4">
                                    Start your optimized job search in just 2 minutes
                                </p>
                            </div>
                        </section>

                        <SignInButton mode="modal" afterSignInUrl="/reviewresume">
                            <Button
                                variant="default"
                                size="lg"
                                className="w-full mt-4 py-6 text-lg"
                                aria-label="Sign in to start AI-powered job search"
                            >
                                🚀 Start Free Analysis Now
                            </Button>
                        </SignInButton>
                    </DialogContent>
                </Dialog>
            </SignedOut>
        </>
    );
};

export default HeroUploadBtn;