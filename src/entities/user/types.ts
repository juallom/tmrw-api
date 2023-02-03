import { User } from '@/entities/user/user.entity';

export type UserJwt = Omit<User, 'hash'>;

export enum UserRole {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}
