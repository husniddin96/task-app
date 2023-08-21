import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { TaskDTO } from './task.dto';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { ApiQuery, ApiParam } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Post()

  @ApiQuery({ name: 'title', required: true, type: String, description: 'Task title' })
  @ApiQuery({ name: 'description', required: true, type: String, description: 'Task description' })
  @ApiQuery({ name: 'order_id', required: true, type: Number, description: 'Task order' })
  @ApiQuery({ name: 'story_points', required: true, type: Number, description: 'Story points' })
  @ApiQuery({ name: 'status', required: true, type: String, description: 'Task status' })

  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('order_id') order_id: number,
    @Body('story_points') story_points: number,
    @Body('status') status: string
  ) {
    return this.taskService.createTask(title, description, order_id, story_points, status);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit the number of results' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset for pagination' })
  @ApiQuery({ name: 'term', required: false, type: String, description: 'search term' })
  @ApiQuery({ name: 'groupBy', required: false, type: String, description: 'group by value' })

  async getTasks(
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
    @Query('groupBy') groupBy: string,
    @Query('term') term: string
  ) {
    if (groupBy === 'status') {
      return this.taskService.getTasksGroupedByStatus();
    }
    if (term) {
      return this.taskService.searchTasks(term);
    }
    return this.taskService.getTasks(Number(limit), Number(offset));
  }


  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Task ID' })
  async getTaskById(@Param('id') id: number) {
    return this.taskService.getTaskById(id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Task ID' })
  @ApiQuery({ name: 'title', required: true, type: String, description: 'Task title' })
  @ApiQuery({ name: 'description', required: true, type: String, description: 'Task description' })
  @ApiQuery({ name: 'order_id', required: true, type: Number, description: 'Task order' })
  @ApiQuery({ name: 'story_points', required: true, type: Number, description: 'Story points' })
  @ApiQuery({ name: 'status', required: true, type: String, description: 'Task status' })
  async updateTask(@Param('id') id: number, @Body() taskData: TaskDTO) {
    return this.taskService.updateTask(id, taskData);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Task ID' })
  @ApiQuery({ name: 'status', required: true, type: String, description: 'Task status' })
  async changeTaskStatus(@Param('id') id: number, @Body('status') status: string) {
    console.log({ id, status })
    return this.taskService.changeTaskStatus(id, status);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, type: Number, description: 'Task ID' })
  @ApiQuery({ name: 'hard', required: false, type: Boolean, description: 'delete flag' })

  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: number, @Query('hard') hard: boolean) {
    if (hard) {
      await this.taskService.hardDeleteTask(id);
    } else {
      await this.taskService.softDeleteTask(id);
    }
    return;
  }
}
