import React, { useContext } from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { Link } from "react-router-dom";
import CoverLetterButton from './CoverLetterButton';
import { SkillsContext } from '../Context/SkillsContext';
import SkillResources from './Dashboard/SkillResources';

const calculateMatchPercentage = (jobSkills, userSkills) => {
    if (!jobSkills || jobSkills.length === 0) return 0;
    const matchingSkills = jobSkills.filter(skill => userSkills.includes(skill));
    return Math.round((matchingSkills.length / jobSkills.length) * 100);
};

const JobDetails = ({ job }) => {
    const { globalSkills } = useContext(SkillsContext);
    const hasGlobalSkills = globalSkills && globalSkills.length > 0;

    const matchedPercentage = hasGlobalSkills
        ? calculateMatchPercentage(job?.tags, globalSkills)
        : 0;

    const skillGap = hasGlobalSkills && job?.tags
        ? job.tags.filter(skill => !globalSkills.includes(skill))
        : [];

    if (!job) {
        return (
            <p className="text-muted-foreground p-6" role="status">
                No job selected
            </p>
        );
    }

    return (
        <div className="p-4 md:p-6 overflow-hidden">
            <article className="max-w-4xl mx-auto space-y-6" aria-labelledby="job-title">

                <section aria-labelledby="compatibility-heading">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                        <div className="w-full md:w-1/2">
                            <Progress
                                value={matchedPercentage}
                                className="h-2"
                                aria-label="Job compatibility percentage"
                            />
                            <div className="flex justify-between mt-2">
                                <span
                                    className="text-sm text-muted-foreground"
                                    id="compatibility-heading"
                                >
                                    {hasGlobalSkills ? 'Compatibility' : 'Upload resume to see compatibility'}
                                </span>
                                <span className="font-semibold" aria-live="polite">
                                    {hasGlobalSkills ? `${matchedPercentage}%` : 'NA'}
                                </span>
                            </div>
                        </div>
                        {!hasGlobalSkills && (
                            <nav aria-label="Resume upload navigation">
                                <Link to="/reviewresume" className="w-full md:w-auto">
                                    <Button className="w-full" role="button">
                                        Upload Resume to Get Started
                                    </Button>
                                </Link>
                            </nav>
                        )}
                    </div>
                </section>

                <header className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                        <h1
                            id="job-title"
                            className="text-2xl md:text-3xl font-bold"
                            itemProp="title"
                        >
                            {job.title || 'NA'}
                        </h1>
                        <p
                            className="text-lg text-muted-foreground"
                            itemProp="hiringOrganization"
                        >
                            {job.company || 'NA'}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Link
                            to={job.link}
                            target="_blank"
                            className="w-full md:w-auto"
                            aria-label="Apply for this job"
                        >
                            <Button className="w-full" role="button">
                                Apply Now <ArrowUpRight className="ml-2" />
                            </Button>
                        </Link>
                        {hasGlobalSkills && <CoverLetterButton />}
                    </div>
                </header>

                <Card className="hover:shadow-sm transition-shadow" itemScope itemType="https://schema.org/Organization">
                    <CardContent className="flex items-center gap-4 p-4 md:p-6">
                        <Avatar className="h-14 w-14 md:h-16 md:w-16" itemProp="image">
                            <AvatarImage
                                src={job.logo}
                                alt={job.company ? `${job.company} logo` : "Company logo"}
                            />
                            <AvatarFallback aria-hidden="true">
                                {job.company?.[0] || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2
                                className="text-xl font-semibold"
                                itemProp="name"
                            >
                                {job.company || 'NA'}
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge
                                    variant="secondary"
                                    className="gap-1"
                                    itemProp="jobLocation"
                                >
                                    🌍 {job.location || 'Remote'}
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="gap-1"
                                    itemProp="baseSalary"
                                >
                                    💰 {job.salary || 'Competitive'}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <section aria-labelledby="job-description-heading">
                        <Card className="h-full flex-1">
                            <CardHeader>
                                <CardTitle id="job-description-heading">
                                    Job Description
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="text-muted-foreground whitespace-pre-line"
                                    itemProp="description"
                                    role="article"
                                >
                                    {job.description || 'No description available'}
                                </div>
                            </CardContent>
                        </Card>
                    </section>

                    <section aria-labelledby="required-skills-heading">
                        <div className="space-y-6 flex-1">
                            <Card className="h-fit">
                                <CardHeader>
                                    <CardTitle id="required-skills-heading">
                                        Required Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2" role="list">
                                        {job.tags?.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant={
                                                    globalSkills?.includes(skill)
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className={
                                                    globalSkills?.includes(skill)
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                                                }
                                                role="listitem"
                                                aria-label={`${skill} - ${globalSkills?.includes(skill) ? 'matched' : 'missing'}`}
                                            >
                                                {skill}
                                            </Badge>
                                        )) || 'No skills listed'}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>

                {hasGlobalSkills && skillGap.length > 0 && (
                    <section aria-labelledby="skill-resources-heading">
                        <SkillResources skills={skillGap} />
                    </section>
                )}
            </article>
        </div>
    );
};

export default JobDetails;