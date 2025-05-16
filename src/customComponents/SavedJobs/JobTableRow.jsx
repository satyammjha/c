import { useState } from "react";
import { formatSalary } from "../../services/formatSalary";
import { statusOptions } from "../../services/formatSalary";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { TableRow, TableCell } from "../../components/ui/table";
import { NotesDialog } from "./NotesDialog";

export const JobTableRow = ({ job, selected, onSelect, onStatusChange }) => {
  const [notes, setNotes] = useState(job.notes || "");

  return (
    <TableRow className="hover:bg-muted/10">
      <TableCell>
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 accent-primary"
        />
      </TableCell>
      <TableCell>
        <Avatar className="h-9 w-9">
          <AvatarImage src={job.logo} alt={job.company} />
          <AvatarFallback>{job.company?.slice(0, 2).toUpperCase() || "JP"}</AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{job.title}</span>
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            View posting
          </a>
        </div>
      </TableCell>
      <TableCell>{job.company}</TableCell>
      <TableCell className="text-right">{formatSalary(job.salary)}</TableCell>
      <TableCell>
        {job.date
          ? new Date(job.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "N/A"}
      </TableCell>
      <TableCell>
        <Select value={job.status || "Saved"} onValueChange={(value) => onStatusChange(job.jobId, value)}>
          <SelectTrigger className="w-[140px]">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: statusOptions.find((s) => s.value === (job.status || "Saved"))?.color,
                }}
              />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                  {status.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-right">
        <NotesDialog job={job} notes={notes} setNotes={setNotes} />
      </TableCell>
    </TableRow>
  );
};