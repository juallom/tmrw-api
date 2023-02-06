import { Module } from '@nestjs/common';
import { PostgresModule } from './resources/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { RedisModule } from './resources/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PostgresModule,
    RedisModule,
    EventEmitterModule.forRoot(),
    UserModule,
    AuthModule,
    TaskModule,
  ],
})
export class AppModule {}
