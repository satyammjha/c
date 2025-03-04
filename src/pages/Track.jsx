import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, NotebookPen, X, TrendingUp, Clock, Star, CalendarDays, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Calendar } from "../components/ui/calendar";

const jobs = [
  {
    _id: '1',
    title: 'Senior Frontend Engineer',
    company: "TechNova",
    status: "Interviewing",
    savedDate: "2024-03-15",
    salary: "$120K",
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js'],
    responseTime: 3,
    matchPercentage: 85
  },
  {
    _id: '2',
    title: 'Product Director',
    company: "FutureLabs",
    status: "Offered",
    savedDate: "2024-03-10",
    salary: "$150K",
    experience: 8,
    skills: ['Product Strategy', 'Team Leadership', 'Roadmapping'],
    responseTime: 5,
    matchPercentage: 76
  },
];

const statusOptions = [
  { value: "Saved", label: "Saved", color: "#64748b" },
  { value: "Applied", label: "Applied", color: "#3b82f6" },
  { value: "Interviewing", label: "Interviewing", color: "#8b5cf6" },
  { value: "Offered", label: "Offered", color: "#10b981" },
  { value: "Rejected", label: "Rejected", color: "#ef4444" },
];

export default function JobDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    date: null
  });
  const [jobsData, setJobsData] = useState(jobs);
  const [notes, setNotes] = useState({});

  // Calculate metrics
  const statusCounts = jobsData.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const skillsAnalysis = jobsData.flatMap(job => job.skills).reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {});

  const experienceData = jobsData.reduce((acc, job) => {
    acc.total += job.experience;
    acc.count += 1;
    return acc;
  }, { total: 0, count: 0 });

  const processMetrics = () => {
    const filtered = jobsData.filter(job =>
      (filters.status === "all" || job.status === filters.status) &&
      (job.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.title.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.date || job.savedDate === filters.date.toISOString().split('T')[0])
    );

    return {
      filteredJobs: filtered,
      skillsChart: Object.entries(skillsAnalysis)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skill, count]) => ({ skill, count })),
      avgExperience: experienceData.count > 0
        ? (experienceData.total / experienceData.count).toFixed(1)
        : 0
    };
  };

  const { filteredJobs, skillsChart, avgExperience } = processMetrics();

  const handleStatusChange = (jobId, newStatus) => {
    setJobsData(prev =>
      prev.map(job =>
        job._id === jobId
          ? {
              ...job,
              status: newStatus,
              statusHistory: [...(job.statusHistory || []), { status: newStatus, date: new Date().toISOString().split('T')[0] }]
            }
          : job
      )
    );
  };
  const resetFilters = () => {
    setFilters({ search: "", status: "all", date: null });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Status Navbar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {statusOptions.map(status => (
          <Card key={status.value} className="p-4 text-center transition-all hover:scale-[1.02]">
            <div className="text-2xl font-bold">{statusCounts[status.value] || 0}</div>
            <div className="text-sm flex items-center justify-center gap-2" style={{ color: status.color }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
              {status.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Job List */}
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead colSpan={4}>
                    <div className="flex items-center gap-4 p-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search jobs..."
                          className="pl-10"
                          value={filters.search}
                          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {filters.date && <X className="h-3 w-3" onClick={() => setFilters(prev => ({ ...prev, date: null }))} />}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.date}
                            onSelect={(date) => setFilters(prev => ({ ...prev, date }))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Button variant="ghost" onClick={resetFilters} className="gap-2">
                        <X className="h-4 w-4" />
                        Reset Filters
                      </Button>
                    </div>
                  </TableHead>
                </TableRow>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map(job => (
                  <TableRow key={job._id} className="group hover:bg-muted/50">
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>
                      <Select value={job.status} onValueChange={(value) => handleStatusChange(job._id, value)}>
                        <SelectTrigger className="w-[120px] group-hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="group-hover:text-primary">
                            <NotebookPen className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                 

                        <DialogContent>
  <DialogHeader>
    <DialogTitle>{job.company} - Notes</DialogTitle>
  </DialogHeader>

  <Input
    value={notes[job._id] ?? job.notes ?? ""} // Ensuring a default empty value
    onChange={(e) =>
      setNotes((prev) => ({
        ...prev,
        [job._id]: e.target.value, // Correct way to update specific job note
      }))
    }
    placeholder="Enter notes..."
  />

  <Button
    onClick={() => {
      setJobsData((prev) =>
        prev.map((p) =>
          p._id === job._id
            ? { ...p, notes: notes[job._id] ?? "" } // Ensure notes is correctly assigned
            : p
        )
      );
    }}
  >
    Save Notes
  </Button>
</DialogContent>

                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Analytics Panel */}
        <div className="space-y-6">
          {/* Skills Chart */}
          <Card className="p-6">
            <div className="mb-4 font-semibold flex items-center gap-2">
              <Star className="h-4 w-4" /> Top Required Skills
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Experience Chart */}
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
        </div>
      </div>
    </div>
  );
}