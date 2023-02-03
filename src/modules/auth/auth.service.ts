import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { UserService } from '@/entities/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entities/user/user.entity';
import { UserJwt } from '@/entities/user/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserJwt> {
    const user = await this.userService.findOneByEmail(email);
    const isAuthenticated = user && (await bcrypt.compare(password, user.hash));
    if (isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
