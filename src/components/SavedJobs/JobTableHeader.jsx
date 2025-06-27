import { TableHeader, TableRow, TableHead } from "../../components/ui/table";

export const JobTableHeader = ({ filteredJobs, selectedJobs, handleSelectAll }) => (
  <TableHeader className="bg-muted/50 sticky top-0 z-10">
    <TableRow>
      <TableHead className="w-[40px]">
        <input
          type="checkbox"
          checked={filteredJobs.length > 0 && filteredJobs.every((job) => selectedJobs.has(job.jobId))}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="w-4 h-4 accent-primary translate-y-[2px]"
        />
      </TableHead>
      <TableHead className="w-[60px]"></TableHead>
      <TableHead>Position</TableHead>
      <TableHead>Company</TableHead>
      <TableHead className="text-right">Salary</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHeader>
);