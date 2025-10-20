import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database/database.service.js';
import { CreateAuthDto } from './dto/auth.dto';
import bcrypt from 'bcrypt';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import jwt from 'jsonwebtoken';
import { hashPassword } from '../common/utils/authUtil.js';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly config: ConfigService,
  ) {}

  async login(authDto: CreateAuthDto) {
    const { student_id, password } = authDto;

    if (!student_id || !password) {
      throw new BadRequestException('Missing required fields');
    }

    try {
      const user = await this.databaseService.user.findUnique({
        where: { student_id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid student ID or password');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid student ID or password');
      }

      const jwtSecret = this.config.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        throw new InternalServerErrorException('JWT secret not configured');
      }

      const token = jwt.sign(
        { id: user.user_id, student_id: user.student_id, role: user.role },
        jwtSecret,
        { expiresIn: '7d' },
      );

      return {
        message: 'Login successful',
        token,
        user: {
          id: user.user_id,
          student_id: user.student_id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (err) {
      console.error('Login error:', err);
      throw (
        mapPrismaErrorToHttp(err) ||
        new InternalServerErrorException('Login failed')
      );
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
      });

      return { message: 'Logout successful' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to logout');
    }
  }
}
