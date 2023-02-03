import { Module } from '@nestjs/common';
import { PostgresModule } from './resources/postgres.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/entities/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), PostgresModule, UserModule, AuthModule],
})
export class AppModule {}
