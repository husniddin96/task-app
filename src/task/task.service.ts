import { Injectable } from '@nestjs/common';
import { TaskDTO } from './task.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) { }

  async createTask(title: string, description: string, order_id: number, story_points: number, status: string) {
    const task = {
      title,
      description,
      order_id,
      story_points,
      status
    };
    await this.taskRepository.createTask(task);
    return task;
  }

  async getTasks(limit: number, offset: number) {
    return this.taskRepository.getTasks(limit, offset);
  }

  async getTaskById(id: number) {
    return this.taskRepository.getTaskById(id);
  }

  async updateTask(id: number, taskData: TaskDTO ) {
    await this.taskRepository.updateTask(id, taskData);
    return taskData;
  }

  async softDeleteTask(id: number) {
    return this.taskRepository.softDeleteTask(id);
  }

  async hardDeleteTask(id: number) {
    return this.taskRepository.hardDeleteTask(id);
  }

  async changeTaskStatus(id: number, status: string) {
    return this.taskRepository.updateTask(id, { status });
  }

  async getTasksGroupedByStatus() {
    return this.taskRepository.getTasksGroupedByStatus();
  }

  async searchTasks(term: string) {
    return this.taskRepository.searchTasks(term);
  }
}
