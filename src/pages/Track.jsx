
import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, Search } from "lucide-react";

// Dummy Data
const applications = [
    {
        id: 1,
        company: "Google",
        role: "Software Engineer",
        appliedDate: "2023-10-15",
        status: "Pending",
        location: "Mountain View, CA",
    },
    {
        id: 2,
        company: "Microsoft",
        role: "Product Manager",
        appliedDate: "2023-09-20",
        status: "Rejected",
        location: "Redmond, WA",
    },
    {
        id: 3,
        company: "Amazon",
        role: "Data Scientist",
        appliedDate: "2023-11-01",
        status: "Selected",
        location: "Seattle, WA",
    },
];

export default function TrackerPage() {
    const [filters, setFilters] = useState({
        status: "",
        date: null,
        search: "",
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const filteredApplications = applications.filter((app) => {
        return (
            (filters.status === "" || app.status === filters.status) &&
            (filters.date === null || app.appliedDate === filters.date.toISOString().split("T")[0]) &&
            (filters.search === "" ||
                app.company.toLowerCase().includes(filters.search.toLowerCase()) ||
                app.role.toLowerCase().includes(filters.search.toLowerCase()))
        );
    });

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Job Application Tracker</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Track all your job applications in one place.
                    </p>
                </CardHeader>
                <CardContent>
                    {/* Filters Section */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by company or role..."
                                className="pl-10"
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                            />
                        </div>
                        {/* <Select onValueChange={(value) => handleFilterChange("status", value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All</SelectItem>
                                <SelectItem value=""></SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                                <SelectItem value="Selected">Selected</SelectItem>
                            </SelectContent>
                        </Select> */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-[180px] justify-start">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {filters.date ? filters.date.toLocaleDateString() : "Filter by date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={filters.date}
                                    onSelect={(date) => handleFilterChange("date", date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button variant="outline" onClick={() => setFilters({ status: "", date: null, search: "" })}>
                            <Filter className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>

                    {/* Applications Table */}
                    <Table>
                        <TableCaption>A list of your recent job applications.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Applied Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApplications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.company}</TableCell>
                                    <TableCell>{app.role}</TableCell>
                                    <TableCell>{app.appliedDate}</TableCell>
                                    <TableCell>{app.location}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                app.status === "Pending"
                                                    ? "secondary"
                                                    : app.status === "Rejected"
                                                        ? "destructive"
                                                        : "default"
                                            }
                                        >
                                            {app.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}