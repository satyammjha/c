
import { Table, TableBody } from "../../components/ui/table";
import { JobTableHeader } from "./JobTableHeader";
import { JobTableRow } from "./JobTableRow";

export const JobTable = ({
  filteredJobs,
  selectedJobs,
  handleSelectAll,
  handleStatusChange,
  setSelectedJobs,
  notes,
  setNotes,
}) => (
  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
    <Table className="min-w-[1000px]">
      <JobTableHeader
        filteredJobs={filteredJobs}
        selectedJobs={selectedJobs}
        handleSelectAll={handleSelectAll}
      />
      <TableBody className="scrollbar-hide">
        {filteredJobs.map((job) => (
          <JobTableRow
            key={job.jobId || job._id}
            job={job}
            selected={selectedJobs.has(job.jobId)}
            onSelect={(checked) => {
              setSelectedJobs((prev) => {
                const next = new Set(prev);
                checked ? next.add(job.jobId) : next.delete(job.jobId);
                return next;
              });
            }}
            onStatusChange={handleStatusChange}
            notes={notes}
            setNotes={setNotes}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);