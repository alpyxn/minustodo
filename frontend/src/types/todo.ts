export interface Todo {
    id: number;
    task: string;
    status: number;
    owner: string;
    createdAt: Date;
}

export interface TaskResponse {
    taskId: number;
}

