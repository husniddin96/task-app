import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
    let controller: TaskController;
    let mockTaskService: jest.Mocked<TaskService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TaskController],
            providers: [
                {
                    provide: TaskService,
                    useValue: {
                        createTask: jest.fn(),
                        getTasks: jest.fn(),
                        getTaskById: jest.fn(),
                        updateTask: jest.fn(),
                        softDeleteTask: jest.fn(),
                        hardDeleteTask: jest.fn(),
                        changeTaskStatus: jest.fn(),
                        getTasksGroupedByStatus: jest.fn(),
                        searchTasks: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TaskController>(TaskController);
        mockTaskService = module.get(TaskService);
    });

    // ... tests will go here

    describe('createTask', () => {
        it('should create a task and return it', async () => {
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                order_id: 1,
                story_points: 5,
                status: 'todo',
            };

            mockTaskService.createTask.mockResolvedValue(taskData);

            const result = await controller.createTask(taskData.title, taskData.description, taskData.order_id, taskData.story_points, taskData.status);

            expect(result).toEqual(taskData);
        });
    });

    describe('getTasks', () => {
        it('should retrieve tasks with given limit and offset', async () => {
            const mockTasks = [
                { id: 1, title: 'Task 1' },
                { id: 2, title: 'Task 2' },
            ];

            mockTaskService.getTasks.mockResolvedValue(mockTasks);

            const result = await controller.getTasks(10, 0, '', '');

            expect(result).toEqual(mockTasks);
        });

        it('should retrieve tasks grouped by status', async () => {
            const mockGroupedTasks = [
                {
                    status: 'todo',
                    count: 8
                },
                {
                    status: 'done',
                    count: 1
                }
            ];;

            mockTaskService.getTasksGroupedByStatus.mockResolvedValue(mockGroupedTasks);

            const result = await controller.getTasks(10, 0, 'status', '');

            expect(result).toEqual(mockGroupedTasks);
        });

        it('should search tasks based on a term', async () => {
            const term = 'Task 1';
            const mockTasks = [{ id: 1, title: 'Task 1' }];

            mockTaskService.searchTasks.mockResolvedValue(mockTasks);

            const result = await controller.getTasks(10, 0, undefined, term);

            expect(result).toEqual(mockTasks);
        });
    });
    describe('getTaskById', () => {
        it('should retrieve a task by its ID', async () => {
            const mockTask = { id: 1, title: 'Task 1' };

            mockTaskService.getTaskById.mockResolvedValue(mockTask);

            const result = await controller.getTaskById(1);

            expect(result).toEqual(mockTask);
        });
    });
    describe('updateTask', () => {
        it('should update a task and return the updated task', async () => {
            const updatedTask = { title: 'Updated Task', description: 'Updated Description' };

            mockTaskService.updateTask.mockResolvedValue(updatedTask);

            const result = await controller.updateTask(1, updatedTask);

            expect(result).toEqual(updatedTask);
        });
    });
    describe('changeTaskStatus', () => {
        it('should change the status of a task', async () => {
            const status = 'done';

            mockTaskService.changeTaskStatus.mockResolvedValue({ status });

            const result = await controller.changeTaskStatus(1, status);

            expect(result).toEqual({ status });
        });
    });
    describe('deleteTask', () => {
        it('should soft delete a task', async () => {
            mockTaskService.softDeleteTask.mockResolvedValue(true);

            await controller.deleteTask(1, false);

            expect(mockTaskService.softDeleteTask).toHaveBeenCalledWith(1);
        });

        it('should hard delete a task', async () => {
            mockTaskService.hardDeleteTask.mockResolvedValue(true);

            await controller.deleteTask(1, true);

            expect(mockTaskService.hardDeleteTask).toHaveBeenCalledWith(1);
        });
    });

});
