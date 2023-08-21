import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskRepository,
          useValue: {
            createTask: jest.fn(),
            getTasks: jest.fn(),
            getTaskById: jest.fn(),
            updateTask: jest.fn(),
            softDeleteTask: jest.fn(),
            hardDeleteTask: jest.fn(),
            getTasksGroupedByStatus: jest.fn(),
            searchTasks: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    mockTaskRepository = module.get(TaskRepository);
  });

  describe('createTask', () => {
    it('should create a task and return it', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        order_id: 1,
        story_points: 5,
        status: 'todo',
      };

      mockTaskRepository.createTask.mockResolvedValue(taskData);

      const result = await service.createTask(taskData.title, taskData.description, taskData.order_id, taskData.story_points, taskData.status);

      expect(result).toEqual(taskData);
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(taskData);
    });
  });

  describe('getTasks', () => {
    it('should retrieve tasks with given limit and offset', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1' },
        { id: 2, title: 'Task 2' },
      ];

      mockTaskRepository.getTasks.mockResolvedValue(mockTasks);

      const result = await service.getTasks(2, 0);

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.getTasks).toHaveBeenCalledWith(2, 0);
    });
  });

  describe('getTasksGroupedByStatus', () => {
    it('should retrieve tasks grouped by their status', async () => {
      const mockGroupedTasks = [
        {
          status: 'todo',
          count: 8
        },
        {
          status: 'done',
          count: 1
        }
      ];

      mockTaskRepository.getTasksGroupedByStatus.mockResolvedValue(mockGroupedTasks);

      const result = await service.getTasksGroupedByStatus();

      expect(result).toEqual(mockGroupedTasks);
      expect(mockTaskRepository.getTasksGroupedByStatus).toHaveBeenCalled();
    });
  });

  describe('searchTasks', () => {
    it('should search tasks based on a term', async () => {
      const term = 'Task 1';
      const mockTasks = [{ id: 1, title: 'Task 1' }];

      mockTaskRepository.searchTasks.mockResolvedValue(mockTasks);

      const result = await service.searchTasks(term);

      expect(result).toEqual(mockTasks);
      expect(mockTaskRepository.searchTasks).toHaveBeenCalledWith(term);
    });
  });

  describe('changeTaskStatus', () => {
    it('should change the status of a task', async () => {
      const status = 'done';

      mockTaskRepository.updateTask.mockResolvedValue({ status });

      const result = await service.changeTaskStatus(1, status);

      expect(result).toEqual({ status });
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(1, { status });
    });
  });


  describe('updateTask', () => {
    it('should update a task and return the updated task', async () => {
      const updatedTask = { title: 'Updated Task', description: 'Updated Description' };

      mockTaskRepository.updateTask.mockResolvedValue(updatedTask);

      const result = await service.updateTask(1, updatedTask.title, updatedTask.description);

      expect(result).toEqual(updatedTask);
      expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(1, updatedTask);
    });
  });

  describe('softDeleteTask', () => {
    it('should soft delete a task', async () => {
      mockTaskRepository.softDeleteTask.mockResolvedValue(true);

      const result = await service.softDeleteTask(1);

      expect(result).toBeTruthy();
      expect(mockTaskRepository.softDeleteTask).toHaveBeenCalledWith(1);
    });
  });

  describe('hardDeleteTask', () => {
    it('should hard delete a task', async () => {
      mockTaskRepository.hardDeleteTask.mockResolvedValue(true);

      const result = await service.hardDeleteTask(1);

      expect(result).toBeTruthy();
      expect(mockTaskRepository.hardDeleteTask).toHaveBeenCalledWith(1);
    });
  });

});
