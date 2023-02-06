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
    await this.emitProgress(client);
  }

  @OnEvent('tasksUpdate', { async: true })
  async onTasksUpdate() {
    await this.emitProgress(this.server);
  }

  async emitProgress(client) {
    const completed = await this.taskQueue.getCompleted();
    const active = await this.taskQueue.getActive();
    const waiting = await this.taskQueue.getWaiting();
    client.emit('tasks', { completed, active, waiting });
  }
}
