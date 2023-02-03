import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { UserRole } from '@/entities/user/types';
import { SignUpDto } from '@/entities/user/dto/sign-up.dto';

jest.mock('bcrypt');
const bcryptGenSalt = bcrypt.genSalt;
const bcryptHash = bcrypt.hash;

const users: User[] = [
  {
    id: '1',
    email: 'john.doe@tmrw.com',
    firstName: 'John',
    lastName: 'Doe',
    hash: 'hashedPaSSw0rd',
    role: UserRole.ADMIN,
  },
  {
    id: '2',
    email: 'jane.doe@tmrw.com',
    firstName: 'Jane',
    lastName: 'Doe',
    hash: 'hashedPaSSw0rd',
    role: UserRole.DEFAULT,
  },
];

const signUp: SignUpDto = {
  email: 'john.roe@tmrw.com',
  firstName: 'John',
  lastName: 'Roe',
  password: 'grumpyCat675bh$o',
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    (bcryptGenSalt as jest.Mock).mockReset();
    (bcryptHash as jest.Mock).mockReset();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(users[0]),
            save: jest.fn().mockResolvedValue(users[0]),
          },
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('create()', () => {
    (bcryptGenSalt as jest.Mock).mockResolvedValue('randomSalt');
    (bcryptHash as jest.Mock).mockResolvedValue('hashedPaSSw0rd');
    expect(userService.create(signUp)).resolves.toStrictEqual(users[0]);
  });

  it('findOneByEmail()', () => {
    expect(userService.findOneByEmail(users[0].email)).resolves.toEqual(
      users[0],
    );
  });
});
