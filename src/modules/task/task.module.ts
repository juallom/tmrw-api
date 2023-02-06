import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TaskController } from './task.controller';
import { TaskProcessor } from './task.processor';
import { TaskGateway } from './task.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'task',
    }),
  ],
  controllers: [TaskController],
  providers: [TaskProcessor, TaskGateway],
})
export class TaskModule {}
