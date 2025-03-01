import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const getProgressColor = (percentage) => {
    if (percentage > 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-red-500";
};

const JobItem = ({
    company,
    logo,
    position,
    location,
    platformLogo,
    postedTime,
    matchedPercentage,
    salary,
    experienceLevel,
    jobType,
    remoteOption,
}) => {
    return (
        <Card className="relative flex flex-col p-6 border border-muted rounded-lg shadow-md">

            {platformLogo && (
                <Avatar
                    src={platformLogo}
                    alt="Platform Logo"
                    className="absolute top-4 right-4 h-10 w-10 rounded-full border border-gray-300" // 
                />
            )}

            <div className="flex items-center space-x-4">
                <Avatar
                    src={logo || "https://images.pexels.com/photos/170809/pexels-photo-170809.jpeg"}
                    alt={company}
                    className="h-14 w-14 rounded-full border-2 border-gray-200" // Adjusted size and added 
                />
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-foreground">{position}</h3>
                    <p className="text-sm text-muted-foreground">{company}</p>

                    <p className="text-sm text-muted-foreground">
                        🌍 {location}
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">{postedTime}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                {salary && (
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Salary</span>
                        <p className="text-sm text-foreground">{salary}</p>
                    </div>
                )}
                {experienceLevel && (
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Experience Level</span>
                        <p className="text-sm text-foreground">{experienceLevel}</p>
                    </div>
                )}
                {jobType && (
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Job Type</span>
                        <p className="text-sm text-foreground">{jobType}</p>
                    </div>
                )}
                {remoteOption && (
                    <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Remote Option</span>
                        <p className="text-sm text-foreground">{remoteOption ? "Yes" : "No"}</p>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <p className="font-semibold">Match: {matchedPercentage}%</p>
                    <span className="text-xs">
                        {matchedPercentage > 80
                            ? '💚 Great Match!'
                            : matchedPercentage > 50
                                ? '🟡 Good Match'
                                : '🔴 Low Match'}
                    </span>
                </div>
                <Progress
                    value={matchedPercentage}
                    max={100}
                    className={`mt-2 h-2 rounded-full bg-black ${getProgressColor(matchedPercentage)} transition-all ease-in-out duration-300`}
                />
            </div>

        </Card>
    );
};

export default JobItem;
