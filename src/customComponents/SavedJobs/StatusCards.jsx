import { Card } from "../../components/ui/card";
import { statusOptions } from "../../services/formatSalary";

export const StatusCards = ({ setStatusFilter, savedJobs, jobsData }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
    {statusOptions.map(status => (
      <Card
        key={status.value}
        className="p-4 text-center transition-all hover:scale-[1.02] cursor-pointer"
        style={{ background: `linear-gradient(45deg, ${status.color}10, transparent)` }}
        onClick={() => setStatusFilter(status.value === "Saved" ? "all" : status.value)}
      >
        <div className="text-2xl font-bold text-foreground">
          {status.value === "Saved"
            ? savedJobs.length
            : jobsData.filter(job => job.status === status.value).length}
        </div>
        <div className="text-sm flex items-center justify-center gap-2" style={{ color: status.color }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
          {status.label}
        </div>
      </Card>
    ))}
  </div>
);