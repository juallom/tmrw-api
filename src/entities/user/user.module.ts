import { Module } from '@nestjs/common';
import { UserService } from '@/entities/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
