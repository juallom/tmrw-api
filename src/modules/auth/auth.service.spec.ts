import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { User } from '@/entities/user/user.entity';
import { UserService } from '@/entities/user/user.service';
import { UserRole } from '@/entities/user/types';
import { AuthService } from './auth.service';

jest.mock('bcrypt');
const bcryptCompare = bcrypt.compare;

const user: User = {
  id: '1',
  email: 'john.doe@tmrw.com',
  firstName: 'John',
  lastName: 'Doe',
  hash: 'hashedPaSSw0rd',
  role: UserRole.ADMIN,
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    (bcryptCompare as jest.Mock).mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser()', () => {
    it('should return a user object when credentials are valid', () => {
      (bcryptCompare as jest.Mock).mockResolvedValue(true);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash, ...result } = user;
      expect(authService.validateUser(user.email, '111')).resolves.toEqual(
        result,
      );
    });
    it('should return null when credentials are invalid', () => {
      (bcryptCompare as jest.Mock).mockResolvedValue(false);
      expect(authService.validateUser(user.email, '111')).resolves.toBeNull();
    });
  });

  describe('login()', () => {
    it('should return JWT object', async () => {
      const result = await authService.login(user);
      expect(result).toStrictEqual({ access_token: 'access_token' });
    });
  });
});
