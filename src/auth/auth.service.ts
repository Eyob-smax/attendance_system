// auth.service.ts
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
import jwt from 'jsonwebtoken';
import { mapPrismaErrorToHttp } from '../common/utils/handleDbError.js';
import {
  ACCESS_TOKEN_EX_STR,
  REFRESH_TOKEN_EX_NUM,
  REFRESH_TOKEN_EX_STR,
} from '../common/constants/constants.js';

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

      if (!user)
        throw new UnauthorizedException('Invalid student ID or password');

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid)
        throw new UnauthorizedException('Invalid student ID or password');

      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
      if (!accessSecret || !refreshSecret)
        throw new InternalServerErrorException('JWT secrets not configured');

      const payload = {
        id: user.user_id,
        student_id: user.student_id,
        role: user.role,
      };

      const accessToken = jwt.sign(payload, accessSecret, {
        expiresIn: ACCESS_TOKEN_EX_STR,
      });

      const refreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: REFRESH_TOKEN_EX_STR,
      });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EX_NUM);

      await this.databaseService.refreshToken.create({
        data: {
          user_id: user.user_id,
          token: hashedRefreshToken,
          expires_at: expiresAt,
        },
      });

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.user_id,
          student_id: user.student_id,
          username: user.username,
          role: user.role,
        },
      };
    } catch (err) {
      console.error('Login error:', err);
      throw mapPrismaErrorToHttp(err);
    }
  }

  async refreshTokens(refreshToken: string) {
    if (!refreshToken)
      throw new UnauthorizedException('No refresh token found');

    try {
      const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET');
      const decoded = jwt.verify(refreshToken, refreshSecret) as any;

      const userTokens = await this.databaseService.refreshToken.findMany({
        where: { user_id: decoded.id, revoked: false },
      });

      const validToken = await Promise.any(
        userTokens.map(async (t) => {
          const match = await bcrypt.compare(refreshToken, t.token);
          if (match && t.expires_at > new Date()) return t;
          return null;
        }),
      ).catch(() => null);

      if (!validToken)
        throw new UnauthorizedException('Invalid or expired token');

      await this.databaseService.refreshToken.update({
        where: { token_id: validToken.token_id },
        data: { revoked: true },
      });
      const user = await this.databaseService.user.findUnique({
        where: { user_id: decoded.id },
      });
      const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET');
      const payload = {
        id: user.user_id,
        student_id: user.student_id,
        role: user.role,
      };

      const newAccessToken = jwt.sign(payload, accessSecret, {
        expiresIn: ACCESS_TOKEN_EX_STR,
      });
      const newRefreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: REFRESH_TOKEN_EX_NUM,
      });
      const hashedNewToken = await bcrypt.hash(newRefreshToken, 10);

      await this.databaseService.refreshToken.create({
        data: {
          user_id: user.user_id,
          token: hashedNewToken,
          expires_at: new Date(Date.now() + REFRESH_TOKEN_EX_NUM),
        },
      });

      return { newAccessToken, newRefreshToken };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('REFRESH_TOKEN_EXPIRED');
      }
      throw mapPrismaErrorToHttp(err);
    }
  }

  async logout(refreshToken: string) {
    try {
      if (refreshToken) {
        const decoded = jwt.decode(refreshToken) as any;
        await this.databaseService.refreshToken.updateMany({
          where: { user_id: decoded?.id },
          data: { revoked: true },
        });
      }

      return { message: 'Logout successful' };
    } catch (error) {
      throw mapPrismaErrorToHttp(error);
    }
  }
}
