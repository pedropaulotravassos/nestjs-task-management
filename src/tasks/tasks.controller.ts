import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskControler');
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" .Getting all tasks with filter ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User ${user.username} is creating a task ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
}
