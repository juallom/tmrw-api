import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UserRole } from './types';
import { User } from './user.entity';
import { UpdateResult } from 'typeorm';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.userService.create(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req): any {
    return { User: req.user, msg: 'User logged in' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/')
  async getUsers(@Request() req): Promise<Omit<User, 'hash'>[]> {
    const user = await this.userService.findOneById(req.user.id);
    if (user.role !== UserRole.ROOT) {
      throw new UnauthorizedException();
    }
    const users = await this.userService.findAll();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash, ...rest } = user;
      return rest;
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/:id')
  async updateUser(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { priority: number },
  ): Promise<UpdateResult> {
    const user = await this.userService.findOneById(req.user.id);
    if (user.role !== UserRole.ROOT) {
      throw new UnauthorizedException();
    }
    return this.userService.updateUserPriority(id, body.priority);
  }
}
