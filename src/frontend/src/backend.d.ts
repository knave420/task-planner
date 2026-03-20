import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Task {
    id: TaskId;
    status: TaskStatus;
    title: string;
    mode: TaskMode;
    description: TaskDescription;
    department: Department;
}
export type TaskDescription = string;
export type TaskId = bigint;
export enum Department {
    marketing = "marketing",
    store = "store",
    purchase = "purchase"
}
export enum TaskMode {
    onSite = "onSite",
    online = "online"
}
export enum TaskStatus {
    pending = "pending",
    done = "done",
    inProgress = "inProgress"
}
export interface backendInterface {
    addTask(taskId: TaskId, title: string, description: string, departmentBalloon: Department, modeBalloon: TaskMode): Promise<void>;
    deleteTask(taskId: TaskId): Promise<void>;
    getDepartmentMap(): Promise<Array<[string, Department]>>;
    getModeMap(): Promise<Array<[string, TaskMode]>>;
    getStatusMap(): Promise<Array<[string, TaskStatus]>>;
    getTasks(departmentText: string | null, modeText: string | null): Promise<Array<Task>>;
    updateTaskStatus(taskId: TaskId, newStatus: TaskStatus): Promise<void>;
}
