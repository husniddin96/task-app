import * as knex from 'knex';
import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Injectable()
export class TaskRepository {

    constructor(private configService: ConfigService) {
        this.configService = configService;
    }

    // @ts-ignore
    private db = knex({
        client: 'pg',
        connection: {
            host: this.configService.get('DB_HOST'), // Assuming Docker Compose service name
            port: this.configService.get('DB_PORT'),
            user: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
        }
    });

    async getTasks(limit: number, offset: number) {
        return this.db('tasks')
            .where({ soft_delete: false })
            .limit(limit)
            .offset(offset);
    }

    async getTaskById(id: number) {
        return this.db('tasks').where({ id }).first();
    }

    async createTask(task) {
        return this.db('tasks').insert(task);
    }

    async updateTask(id: number, updatedTask) {
        const result = await this.db('tasks')
            .where({ id })
            .update(updatedTask)
            .returning('*');
        return result[0];
    }

    async softDeleteTask(id: number) {
        return this.db('tasks').where({ id }).update({ soft_delete: true });
    }

    async hardDeleteTask(id: number) {
        return this.db('tasks').where({ id }).del();
    }

    async getTasksGroupedByStatus() {
        return this.db('tasks').select('status').count('id as count').groupBy('status');
    }

    async searchTasks(term: string) {
        return this.db('tasks').where('title', 'like', `%${term}%`).orWhere('description', 'like', `%${term}%`);
    }
}
