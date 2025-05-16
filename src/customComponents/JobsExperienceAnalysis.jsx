import React from 'react'
import { Card } from '../components/ui/card'
import { TrendingUp } from 'lucide-react'
import { useSavedJobs } from '../Context/SavedJobContext'
const JobsExperienceAnalysis = () => {
    const {savedJobs} = useSavedJobs();
    return (
        <>
            <Card className="p-6">
                <div className="mb-4 font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Experience Analysis
                </div>
                <div className="space-y-4">
                    <div className="text-3xl font-bold text-center">{avgExperience} years</div>
                    <div className="text-center text-muted-foreground">Average Required Experience</div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-muted/10 rounded-lg">
                            <div className="text-xl font-bold">
                                {Math.min(...jobsData.map(job => job.experience))}
                            </div>
                            <div className="text-sm">Min Experience</div>
                        </div>
                        <div className="text-center p-3 bg-muted/10 rounded-lg">
                            <div className="text-xl font-bold">
                                {Math.max(...jobsData.map(job => job.experience))}
                            </div>
                            <div className="text-sm">Max Experience</div>
                        </div>
                    </div>
                </div>
            </Card>

        </>
    )
}

export default JobsExperienceAnalysis
