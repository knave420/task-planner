import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Department, type Task, TaskMode, TaskStatus } from "../backend.d";
import { useActor } from "./useActor";

export { Department, TaskMode, TaskStatus };
export type { Task };

export function useGetTasks(department: string | null, mode: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Task[]>({
    queryKey: ["tasks", department, mode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTasks(department, mode);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      department,
      mode,
    }: {
      title: string;
      description: string;
      department: Department;
      mode: TaskMode;
    }) => {
      if (!actor) throw new Error("No actor");
      const id = BigInt(Date.now());
      await actor.addTask(id, title, description, department, mode);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useUpdateTaskStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: TaskStatus }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateTaskStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      await actor.deleteTask(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}
