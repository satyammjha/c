import { React, useEffect } from "react";
import JobDetails from "../customComponents/JobDetails";
import JobItem from "../customComponents/JobItem";
import { Card } from "../components/ui/card";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

const Dashboard = () => {

    const jobData = [
        {
            company: "TechCorp",
            logo: "https://placehold.co/600x400.png",
            position: "Software Engineer",
            location: "San Francisco, CA",
            platformLogo: "https://images.pexels.com/photos/170809/pexels-photo-170809.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            postedTime: "2 days ago",
            matchedPercentage: 85,
            salary: "$80,000 - $100,000/year",
            experienceLevel: "Mid-Level",
            jobType: "Full-time",
            remoteOption: true,
        },
        {
            company: "DataMinds",
            logo: "https://example.com/logo2.png",
            position: "Data Scientist",
            location: "New York, NY",
            platformLogo: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Indeed_logo.png",
            postedTime: "1 week ago",
            matchedPercentage: 78,
            salary: "$90,000 - $110,000/year",
            experienceLevel: "Senior",
            jobType: "Full-time",
            remoteOption: false,
        },
    ];

    return (
        <>

            <SignedIn>
                <div className="flex h-[88vh] bg-background p-1">
                    <Card className="w-1/3 p-4 overflow-auto border-none hide-scrollbar cursor-pointer :hover:bg-[black]">
                        <div className="space-y-6">
                            {jobData.map((job, index) => (
                                <JobItem key={index} {...job} />
                            ))}
                        </div>
                    </Card>


                    <div className="w-[2px] bg-muted mx-2"></div>
                    <Card className="flex-1 p-6 border-none ">
                        <h2 className="text-xl font-bold mb-4">Job Details</h2>
                        <JobDetails />
                    </Card>
                </div>
            </SignedIn>

            <SignedOut>

                <h1>SignInToSeeDashboard</h1>

            </SignedOut>
        </>
    );
};

export default Dashboard;
