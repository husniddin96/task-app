import { TaskStatus } from "./task.entity";

export interface TaskDTO {
    id?: number;
    title: string;
    description: string;
    order_id: number;
    status: TaskStatus;
    estimate?: number;
}
