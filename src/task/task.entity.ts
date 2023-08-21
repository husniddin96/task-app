export enum TaskStatus {
    todo = 'todo',
    inProgress = 'in-progress',
    done = 'done'
}

export interface Task {
    id?: number;
    title: string;
    description: string;
    order_id: number;
    status: TaskStatus;
    estimate: number;
    created_at: Date;
    soft_delete: boolean;
}
