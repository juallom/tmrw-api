import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TaskGateway implements OnGatewayConnection {
  constructor(@InjectQueue('task') private readonly taskQueue: Queue) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client) {
    await this.emitCompleted(client);
    await this.emitActive(client);
    await this.emitWaiting(client);
  }

  @OnEvent('OnQueueCompleted', { async: true })
  async onQueueCompleted() {
    await this.emitCompleted(this.server);
    await this.emitActive(this.server);
  }

  @OnEvent('OnQueueRemoved', { async: true })
  async onQueueRemoved() {
    await this.emitCompleted(this.server);
  }

  @OnEvent('OnQueueActive', { async: true })
  async onQueueActive() {
    await this.emitActive(this.server);
    await this.emitWaiting(this.server);
  }

  @OnEvent('OnQueueProgress', { async: true })
  async onQueueProgress() {
    await this.emitActive(this.server);
  }

  @OnEvent('OnQueueWaiting', { async: true })
  async onQueueWaiting() {
    await this.emitWaiting(this.server);
  }

  async emitCompleted(client) {
    const completed = await this.taskQueue.getCompleted();
    client.emit('completedTasks', { completed });
  }

  async emitActive(client) {
    const active = await this.taskQueue.getActive();
    client.emit('activeTasks', { active });
  }

  async emitWaiting(client) {
    const waiting = await this.taskQueue.getWaiting();
    client.emit('waitingTasks', { waiting });
  }
}
