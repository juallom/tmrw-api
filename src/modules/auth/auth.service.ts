import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const passwordValid = await bcrypt.compare(password, user.hash);

    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }

    if (user && passwordValid) {
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        priority: user.priority,
      };
    }

    return null;
  }
}
