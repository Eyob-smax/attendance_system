// auth.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  ValidationPipe,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/auth.dto.js';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body(ValidationPipe) authDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(authDto);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure:
        this.config.get<'production' | 'development'>('NODE_ENV') ===
        'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 5,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure:
        this.config.get<'production' | 'development'>('NODE_ENV') ===
        'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      message: 'Login successful',
      user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const { newAccessToken, newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    if (!newAccessToken)
      throw new UnauthorizedException('Invalid or expired refresh token');

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure:
        this.config.get<'production' | 'development'>('NODE_ENV') ===
        'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 5,
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure:
        this.config.get<'production' | 'development'>('NODE_ENV') ===
        'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { message: 'Tokens refreshed successfully' };
  }

  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const result = await this.authService.logout(refreshToken);

    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'strict',
    });

    return res.status(200).json(result);
  }
}
