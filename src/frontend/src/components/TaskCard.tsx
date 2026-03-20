import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Department,
  type Task,
  TaskMode,
  TaskStatus,
} from "../hooks/useQueries";
import { useDeleteTask, useUpdateTaskStatus } from "../hooks/useQueries";

const DEPT_LABELS: Record<Department, string> = {
  [Department.purchase]: "Purchase",
  [Department.marketing]: "Marketing",
  [Department.store]: "Store",
};

const MODE_LABELS: Record<TaskMode, string> = {
  [TaskMode.onSite]: "On Site",
  [TaskMode.online]: "Online",
};

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();

  const deptClass = `task-card-${task.department}`;
  const modeClass =
    task.mode === TaskMode.onSite ? "chip-onsite" : "chip-online";
  const deptChipClass = `chip-${task.department}`;
  const statusChipClass =
    task.status === TaskStatus.pending
      ? "chip-pending"
      : task.status === TaskStatus.inProgress
        ? "chip-inprogress"
        : "chip-done";

  const statusLabel =
    task.status === TaskStatus.pending
      ? "Pending"
      : task.status === TaskStatus.inProgress
        ? "In Progress"
        : "Done";

  const isLong = task.description.length > 100;
  const displayText =
    !expanded && isLong
      ? `${task.description.slice(0, 100)}…`
      : task.description;

  return (
    <div
      className={`bg-card rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden ${deptClass}`}
      data-ocid={`task.item.${index}`}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm font-medium text-foreground leading-snug flex-1">
            {displayText}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Task options"
                  data-ocid={`task.dropdown_menu.${index}`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => deleteTask.mutate(task.id)}
                  data-ocid={`task.delete_button.${index}`}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chips row */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${deptChipClass}`}
          >
            {DEPT_LABELS[task.department]}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${modeClass}`}
          >
            {MODE_LABELS[task.mode]}
          </span>
        </div>

        {/* Status row */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <Select
            value={task.status}
            onValueChange={(val) =>
              updateStatus.mutate({ id: task.id, status: val as TaskStatus })
            }
          >
            <SelectTrigger
              className="h-7 text-xs border-0 p-0 w-auto gap-1 focus:ring-0 shadow-none"
              data-ocid={`task.select.${index}`}
            >
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusChipClass}`}
              >
                {statusLabel}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskStatus.pending}>Pending</SelectItem>
              <SelectItem value={TaskStatus.inProgress}>In Progress</SelectItem>
              <SelectItem value={TaskStatus.done}>Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
