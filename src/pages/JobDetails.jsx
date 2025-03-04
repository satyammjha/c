import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Building,
    MapPin,
    Calendar,
    Wallet,
    CheckCircle,
    ArrowUpRight,
    Bookmark,
    Code,
    Users,
    BookOpen,
    Rocket,
} from "lucide-react"
import { Toaster } from "../components/ui/sonner"
import { toast } from 'sonner'
import naukri from '../assets/naukri.png'

const JobDetails = () => {
    const skills = ["React", "TypeScript", "Node.js", "AWS", "GraphQL"];
    const similarJobs = [
        { title: "Senior Frontend Engineer", company: "Tech Corp", location: "Remote", salary: "$120k - $150k" },
        { title: "Full Stack Developer", company: "StartUp Inc", location: "New York", salary: "$100k - $130k" },
        { title: "Backend Engineer", company: "Cloud Solutions", location: "London", salary: "£80k - £100k" },
        { title: "Mobile Developer", company: "App Masters", location: "Singapore", salary: "S$90k - S$120k" },
        { title: "DevOps Engineer", company: "Infra Corp", location: "Berlin", salary: "€70k - €90k" },
    ];

    const preparationMaterials = [
        {
            title: "Technical Interview Prep",
            icon: <Code className="h-6 w-6" />,
            items: ["50+ React Questions", "System Design Patterns", "Live Coding Exercises"],
            progress: 30
        },
        {
            title: "Behavioral Guide",
            icon: <Users className="h-6 w-6" />,
            items: ["STAR Method Guide", "Leadership Scenarios", "Cultural Fit Assessment"],
            progress: 45
        },
        {
            title: "Study Materials",
            icon: <BookOpen className="h-6 w-6" />,
            items: ["AWS Certification Guide", "TypeScript Handbook", "GraphQL Best Practices"],
            progress: 65
        },
        {
            title: "Pro Tips",
            icon: <Rocket className="h-6 w-6" />,
            items: ["Salary Negotiation Scripts", "Portfolio Presentation", "Follow-up Templates"],
            progress: 20
        }
    ];

    return (
        <>
            <Toaster position={"top-center"} />
            <div className="container mx-auto p-4 md:p-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-col md:flex-row md:items-start gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <img
                                        src="/company-logo.png"
                                        alt="Company Logo"
                                        className="h-12 w-12 rounded-lg object-contain"
                                    />
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl">Senior Software Engineer</CardTitle>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Building className="h-4 w-4" />
                                            <span>Tech Company Inc.</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>Remote (Global)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>Posted 2d ago</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-muted-foreground">Found on:</span>
                                            <img
                                                src={naukri}
                                                alt="Naukri"
                                                className="h-10 object-contain"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full md:w-40">
                                    <Button size="lg" className="w-full">
                                        Apply Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                        onClick={() => toast("Job saved to your profile")}
                                    >
                                        <Bookmark className="mr-2 h-4 w-4" />
                                        Save Job
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardContent className="pt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Wallet className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-medium mb-1">Salary Range</h3>
                                            <p className="text-muted-foreground">$100,000 - $150,000 USD</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-medium mb-1">Experience</h3>
                                            <p className="text-muted-foreground">5+ years</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.map((skill) => (
                                            <Badge
                                                variant="outline"
                                                className="px-4 py-1.5 text-sm rounded-lg bg-black text-white"
                                                key={skill}
                                            >
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                                    <div className="text-muted-foreground space-y-4">
                                        <p>
                                            We're looking for a Senior Software Engineer to join our global team building
                                            next-generation web applications. You'll work with modern technologies like
                                            React, TypeScript, and Node.js to deliver high-quality solutions.
                                        </p>
                                        <p>
                                            Key responsibilities include leading feature development, optimizing
                                            application performance, and collaborating with cross-functional teams.
                                            The ideal candidate will have 5+ years of experience with modern web
                                            development stack and cloud technologies.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Interview Preparation Guide</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {preparationMaterials.map((section, index) => (
                                    <Card key={index} className="hover:border-primary transition-colors">
                                        <CardContent className="p-4 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    {section.icon}
                                                </div>
                                                <h4 className="font-semibold">{section.title}</h4>
                                            </div>

                                            <div className="space-y-2">
                                                <Progress value={section.progress} className="h-2" />
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        {section.progress}% Completed
                                                    </span>
                                                    <span className="text-primary">
                                                        {Math.floor(section.progress / 20)}/5 Sections
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {section.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm">{item}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button variant="outline" className="w-full mt-2">
                                                View Materials
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl">Resume Match Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-40 h-40">
                                        <Progress
                                            value={75}
                                            className="h-40 w-40 [&>div]:stroke-primary [&>div]:stroke-2"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-3xl font-bold">75%</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-muted-foreground">
                                        Your resume matches 75% of the job requirements
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-lg">Improvement Suggestions</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-muted-foreground">
                                                Highlight more experience with TypeScript in your projects section
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-muted-foreground">
                                                Add AWS certification details if available
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span className="text-muted-foreground">
                                                Include metrics quantifying impact in previous roles
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="h-[calc(100vh-140px)] overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl">Similar Jobs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 h-[calc(100%-64px)] overflow-y-auto no-scrollbar">
                                {similarJobs.map((job, index) => (
                                    <Card
                                        key={index}
                                        className="hover:bg-accent/50 transition-colors cursor-pointer"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium">{job.title}</h4>
                                                    <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
                                                </div>
                                                <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            </div>
                                            <div className="mt-3 text-sm space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                                    <span>{job.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Wallet className="h-4 w-4 flex-shrink-0" />
                                                    <span>{job.salary}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobDetails;