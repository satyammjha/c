import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { NotebookPen } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
export const NotesDialog = ({ job, notes, setNotes }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="hover:bg-muted/20">
        <NotebookPen className="h-4 w-4 mr-2" />
        Notes
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={job.logo} />
              <AvatarFallback>{job.company?.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div>{job.title}</div>
              <div className="text-sm text-muted-foreground">{job.company}</div>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4">
        <Input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add private notes about this opportunity..."
          className="min-h-[100px]"
        />
        <div className="text-sm text-muted-foreground">
          These notes are only visible to you
        </div>
      </div>
    </DialogContent>
  </Dialog>
);