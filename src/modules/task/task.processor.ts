import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueWaiting,
  OnQueueRemoved,
  OnQueueProgress,
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
    const time = 500;
    const duration = job.data.duration;
    const steps = Math.floor(duration / time);
    const rest = duration % time;
    for (let i = 0; i < steps; i++) {
      await sleep(time);
      const progress = Math.floor(((i + 1) * time * 100) / duration);
      await job.progress(progress);
    }
    await sleep(rest);
  }

  @OnQueueCompleted()
  onCompleted() {
    this.eventEmitter.emit('OnQueueCompleted');
  }

  @OnQueueRemoved()
  onRemoved() {
    this.eventEmitter.emit('OnQueueRemoved');
  }

  @OnQueueActive()
  onActive() {
    this.eventEmitter.emit('OnQueueActive');
  }

  @OnQueueProgress()
  onProgress() {
    this.eventEmitter.emit('OnQueueProgress');
  }

  @OnQueueWaiting()
  onWaiting() {
    this.eventEmitter.emit('OnQueueWaiting');
  }
}
