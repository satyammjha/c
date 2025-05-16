import { Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { statusOptions } from "../../services/formatSalary";
export const FilterControls = ({ 
  searchQuery, 
  setSearchQuery,
  statusFilter, 
  setStatusFilter 
}) => (
  <div className="flex flex-col md:flex-row gap-4 items-stretch">
   <div className="relative flex-1 min-w-[50%]">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Search positions or companies..."
    className="pl-10 w-full"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="min-w-[140px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        {statusOptions.map(status => (
          <SelectItem key={status.value} value={status.value}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
              {status.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);