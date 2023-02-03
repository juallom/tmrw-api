import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/modules/auth/auth.controller';
import { UserService } from '@/entities/user/user.service';
import { AuthService } from '@/modules/auth/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  const createUserMock = jest.fn();
  const authLogin = jest.fn();

  beforeEach(async () => {
    createUserMock.mockReset();
    authLogin.mockReset();
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: createUserMock,
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: authLogin,
          },
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup()', () => {
    it('should return created user', () => {
      const user = {
        email: 'fake@email.com',
        password: 'passW0rd',
        firstName: 'John',
        lastName: 'Doe',
      };
      createUserMock.mockResolvedValue(user);
      expect(authController.signup(user)).resolves.toStrictEqual(user);
    });
  });

  describe('login()', () => {
    it('should return access token', () => {
      const accessToken = { access_token: '28y23rh2u32u3hr89' };
      authLogin.mockResolvedValue(accessToken);
      expect(authController.login(accessToken)).resolves.toStrictEqual(
        accessToken,
      );
    });
  });
});
