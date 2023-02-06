import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueWaiting,
  OnQueueRemoved,
} from '@nestjs/bull';
import { Job } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

@Processor('task')
export class TaskProcessor {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Process({
    name: 'execute',
    concurrency: 1,
  })
  async process(job: Job) {
    const duration = job.data.duration;
    await sleep(duration);
  }

  @OnQueueActive()
  onActive() {
    this.eventEmitter.emit('tasksUpdate');
  }

  @OnQueueCompleted()
  onCompleted() {
    this.eventEmitter.emit('tasksUpdate');
  }

  @OnQueueWaiting()
  onWaiting() {
    this.eventEmitter.emit('tasksUpdate');
  }

  @OnQueueRemoved()
  onRemoved() {
    this.eventEmitter.emit('tasksUpdate');
  }
}
