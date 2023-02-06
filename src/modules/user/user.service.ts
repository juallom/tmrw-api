import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    user.email = createUserDto.email;
    const salt = await bcrypt.genSalt(12);
    user.hash = await bcrypt.hash(createUserDto.password, salt);
    user.role = (await this.doesRootExist()) ? UserRole.DEFAULT : UserRole.ROOT;
    return this.userRepository.save(user);
  }

  async doesRootExist(): Promise<boolean> {
    const root = await this.userRepository.findOneBy({ role: UserRole.ROOT });
    return root !== null;
  }

  findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
}
