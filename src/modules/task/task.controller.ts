import {
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UseGuards,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('tasks')
export class TaskController {
  constructor(@InjectQueue('task') private readonly taskQueue: Queue) {}

  @UseGuards(AuthenticatedGuard)
  @Post('/')
  async addTask(@Req() req, @Body() task: CreateTaskDto) {
    console.log(req.user);
    const data = {
      name: task.name,
      createdBy: req.user.id,
      createdByDisplay: `${req.user.firstName} ${req.user.lastName}`,
      createdDate: new Date().getTime(),
      // a random duration between 10000 and 30000 milliseconds
      duration: Math.floor(Math.random() * (30000 - 10000 + 1) + 10000),
    };
    return this.taskQueue.add('execute', data, { priority: req.user.priority });
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('/:id')
  async deleteTask(@Param() param, @Req() req) {
    const job = await this.taskQueue.getJob(param.id);
    if (req.user.id !== job.data.createdBy) {
      throw new UnauthorizedException();
    }
    return await job.remove();
  }
}
