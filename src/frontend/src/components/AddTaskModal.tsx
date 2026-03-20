import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Department, TaskMode, TaskStatus } from "../hooks/useQueries";
import { useAddTask } from "../hooks/useQueries";

export function AddTaskModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<Department>(Department.purchase);
  const [mode, setMode] = useState<TaskMode>(TaskMode.onSite);
  const addTask = useAddTask();

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addTask.mutateAsync({ title, description, department, mode });
      toast.success("Task added successfully");
      setOpen(false);
      setTitle("");
      setDescription("");
      setDepartment(Department.purchase);
      setMode(TaskMode.onSite);
    } catch {
      toast.error("Failed to add task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 rounded-full px-5 font-semibold shadow-md"
          data-ocid="task.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-ocid="task.dialog">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Short task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="task.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Task description…"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="task.textarea"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select
                value={department}
                onValueChange={(v) => setDepartment(v as Department)}
              >
                <SelectTrigger data-ocid="task.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Department.purchase}>Purchase</SelectItem>
                  <SelectItem value={Department.marketing}>
                    Marketing
                  </SelectItem>
                  <SelectItem value={Department.store}>Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Mode</Label>
              <Select
                value={mode}
                onValueChange={(v) => setMode(v as TaskMode)}
              >
                <SelectTrigger data-ocid="task.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskMode.onSite}>On Site</SelectItem>
                  <SelectItem value={TaskMode.online}>Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            data-ocid="task.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={addTask.isPending}
            data-ocid="task.submit_button"
          >
            {addTask.isPending ? "Adding…" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
