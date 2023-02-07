import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { UserRole } from './types';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: SignUpDto): Promise<User> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email.toLowerCase();
    const salt = await bcrypt.genSalt(12);
    user.hash = await bcrypt.hash(createUserDto.password, salt);
    user.role = (await this.doesRootExist()) ? UserRole.DEFAULT : UserRole.ROOT;
    return this.userRepository.save(user);
  }

  doesRootExist(): Promise<boolean> {
    return this.userRepository.exist({
      where: { role: UserRole.ROOT },
    });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  findOneById(id: string): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async updateUserPriority(
    id: string,
    priority: number,
  ): Promise<UpdateResult> {
    return this.userRepository.update({ id }, { priority });
  }
}
