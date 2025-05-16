import React, { useMemo } from "react";
import { Card } from "../components/ui/card";
import { Star } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopSkills = ({ jobs = [] }) => {
  console.log("Jobs for skills:", jobs);

  const skillsChart = useMemo(() => {
    if (!Array.isArray(jobs) || jobs.length === 0) {
      return [];
    }

    const skillCounts = {};

    jobs.forEach((job) => {
      if (Array.isArray(job.tags)) {
        job.tags.forEach((tag) => {
          const normalizedSkill = tag.trim().toLowerCase();
          skillCounts[normalizedSkill] = (skillCounts[normalizedSkill] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [jobs]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 font-semibold flex items-center gap-2">
          <Star className="h-4 w-4" /> Top Required Skills
        </div>
        <div className="h-64">
          {skillsChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsChart} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="skill" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center">No skill data available</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TopSkills;