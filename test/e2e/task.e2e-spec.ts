import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('TaskController (e2e)', () => {
    let app: INestApplication;
    let server: any;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        server = app.getHttpServer();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/tasks (POST)', () => {
        it('should create a task and return it', () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                order_id: 1,
                story_points: 5,
                status: 'todo',
            };

            return request(server)
                .post('/tasks')
                .send(taskData)
                .expect(201)
                .expect((res) => {
                    expect(res.body.title).toEqual(taskData.title);
                    expect(res.body.description).toEqual(taskData.description);
                    expect(res.body.order_id).toEqual(taskData.order_id);
                    expect(res.body.story_points).toEqual(taskData.story_points);
                    expect(res.body.status).toEqual(taskData.status);
                });
        });
    });

    describe('/tasks (GET)', () => {
        it('should retrieve tasks with given limit and offset', () => {
            return request(server)
                .get('/tasks?limit=10&offset=0')
                .expect(200)
                .expect((res) => {
                    const task = res.body[0];
                    expect(task).toHaveProperty('title');
                    expect(task).toHaveProperty('description');
                    expect(task).toHaveProperty('order_id');
                    expect(task).toHaveProperty('story_points');
                    expect(task).toHaveProperty('status');
                });
        });
    });

    describe('/tasks/:id (GET)', () => {
        it('should retrieve a task by its ID', () => {
            const taskId = 8;

            return request(server)
                .get(`/tasks/${taskId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('title');
                    expect(res.body).toHaveProperty('description');
                    expect(res.body).toHaveProperty('order_id');
                    expect(res.body).toHaveProperty('story_points');
                    expect(res.body).toHaveProperty('status');
                });
        });
    });

    describe('/tasks/:id (PUT)', () => {
        it('should update a task and return the updated task', () => {
            const taskId = 1;
            const updatedTask = {
                title: 'Updated Task',
                description: 'Updated Description',
            };

            return request(server)
                .put(`/tasks/${taskId}`)
                .send(updatedTask)
                .expect(200)
                .expect((res) => {
                    expect(res.body.title).toEqual(updatedTask.title);
                    expect(res.body.description).toEqual(updatedTask.description);
                });
        });
    });

    describe('/tasks/:id/status (PATCH)', () => {
        it('should update the status of a task', () => {
            const taskId = 8;
            const newStatus = 'done';

            return request(server)
                .patch(`/tasks/${taskId}`)
                .send({ status: newStatus })
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toEqual(newStatus);
                });
        });
    });

    describe('/tasks/:id (DELETE)', () => {
        it('should soft delete a task', () => {
            const taskId = 5;

            return request(server)
                .delete(`/tasks/${taskId}`)
                .expect(204);
        });
    });

    describe('/tasks/:id (DELETE)', () => {
        it('should hard delete a task', () => {
            const taskId = 6;

            return request(server)
                .delete(`/tasks/${taskId}?hard=true`)
                .expect(204);
        });
    });

});
