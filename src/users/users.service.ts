import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service.js';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: CreateUserDto) {
    const { username, student_id, password_hash, role, email } = createUserDto;

    if (!username || !student_id || !password_hash || !role || !email) {
      throw new BadRequestException('Missing required fields');
    }

    try {
      const existingUser = await this.databaseService.user.findFirst({
        where: {
          OR: [{ student_id }, { email }],
        },
      });

      if (existingUser) {
        throw new ConflictException(
          'User already exists with this ID or email',
        );
      }

      const hashedPassword = await bcrypt.hash(password_hash, 10);

      const newUser = await this.databaseService.user.create({
        data: {
          username,
          student_id,
          password_hash: hashedPassword,
          role,
          email,
        },
      });

      return {
        message: 'User created successfully',
        user: {
          id: newUser.user_id,
          username: newUser.username,
          student_id: newUser.student_id,
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (err) {
      console.error('Error creating user:', err);
      throw (
        mapPrismaErrorToHttp(err) ||
        new InternalServerErrorException('Failed to create user')
      );
    }
  }

  async findAll() {
    try {
      return await this.databaseService.user.findMany({
        select: {
          user_id: true,
          username: true,
          student_id: true,
          email: true,
          role: true,
        },
      });
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async findOne(id: number) {
    const user = await this.databaseService.user.findUnique({
      where: { user_id: id },
      include: {
        student: true,
        attendances: true,
        refreshTokens: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password_hash) {
        updateUserDto.password_hash = await bcrypt.hash(
          updateUserDto.password_hash,
          10,
        );
      }

      const updatedUser = await this.databaseService.user.update({
        where: { user_id: id },
        data: updateUserDto,
      });

      return {
        message: 'User updated successfully',
        user: {
          id: updatedUser.user_id,
          email: updatedUser.email,
          username: updatedUser.username,
          student_id: updatedUser.student_id,
          role: updatedUser.role,
        },
      };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }

  async remove(id: number) {
    try {
      await this.databaseService.user.delete({ where: { user_id: id } });
      return { message: 'User deleted successfully' };
    } catch (err) {
      throw mapPrismaErrorToHttp(err);
    }
  }
}
