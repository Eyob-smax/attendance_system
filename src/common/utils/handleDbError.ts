import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  PayloadTooLargeException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '../../../prisma/generated/client/client.js';

export function mapPrismaErrorToHttp(error: unknown): Error {
  // Check if the error is already a known NestJS HTTP exception
  if (
    error instanceof BadRequestException ||
    error instanceof ConflictException ||
    error instanceof ForbiddenException ||
    error instanceof GatewayTimeoutException ||
    error instanceof NotFoundException ||
    error instanceof ServiceUnavailableException ||
    error instanceof UnauthorizedException ||
    error instanceof NotAcceptableException ||
    error instanceof UnprocessableEntityException ||
    error instanceof InternalServerErrorException ||
    error instanceof PayloadTooLargeException ||
    error instanceof ServiceUnavailableException ||
    error instanceof ForbiddenException
  ) {
    return error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const meta = error.meta || {};
    const target = Array.isArray(meta.target)
      ? meta.target.join(', ')
      : meta.target;

    switch (error.code) {
      case 'P1000':
        return new UnauthorizedException(
          'Database authentication failed. Please verify your username and password.',
        );

      case 'P1001':
        return new ServiceUnavailableException(
          'Unable to reach the database server. Please ensure it is running and accessible.',
        );

      case 'P1002':
        return new GatewayTimeoutException(
          'Database connection timed out. Try again or check your network connectivity.',
        );

      case 'P1003':
        return new NotFoundException(
          'The specified database does not exist on the connected server.',
        );

      case 'P1010':
        return new ForbiddenException(
          'Access denied to the database. Your credentials might not have sufficient privileges.',
        );

      case 'P1012':
        return new InternalServerErrorException(
          'Invalid Prisma schema. Check your schema.prisma file for errors.',
        );

      case 'P2000':
        return new BadRequestException(
          'One or more input values are too long for the database column type.',
        );

      case 'P2001':
        return new NotFoundException(
          'The record you tried to access does not exist or has been removed.',
        );

      case 'P2002':
        return new ConflictException(
          `Duplicate value detected on unique field${target ? `: ${target}` : ''}. Please use a different value.`,
        );

      case 'P2003':
        return new BadRequestException(
          `Foreign key constraint failed. The related record for ${target || 'a referenced field'} might not exist.`,
        );

      case 'P2004':
        return new BadRequestException(
          'A database constraint was violated. Ensure your data satisfies all relational constraints.',
        );

      case 'P2005':
        return new InternalServerErrorException(
          'The database contains invalid data for one of the fields. Check your data consistency.',
        );

      case 'P2006':
        return new BadRequestException(
          'You provided an invalid value for one or more fields. Check your input data.',
        );

      case 'P2007':
        return new BadRequestException(
          'Data validation failed. Ensure all fields meet required formats or constraints.',
        );

      case 'P2008':
        return new InternalServerErrorException(
          'The Prisma query parser encountered an error. Check your query syntax.',
        );

      case 'P2009':
        return new BadRequestException(
          'Query validation failed. The query structure or parameters might be invalid.',
        );

      case 'P2010':
        return new BadRequestException(
          'A raw query failed. Ensure your SQL syntax and parameters are correct.',
        );

      case 'P2011':
        return new BadRequestException(
          `Null constraint violation${
            target ? ` on field: "${target}"` : ''
          }. This field cannot be null — please provide a valid value.`,
        );

      case 'P2012':
        return new BadRequestException(
          `Missing required value${
            target ? ` for field: "${target}"` : ''
          }. Please provide all mandatory fields.`,
        );

      case 'P2013':
        return new BadRequestException(
          `Missing required argument${
            target ? `: "${target}"` : ''
          }. Check your query or request body.`,
        );

      case 'P2025':
        return new NotFoundException(
          'The record you are trying to update or delete does not exist.',
        );

      case 'P6000':
      case 'P6001':
      case 'P6002':
      case 'P6004':
      case 'P6009':
      case 'P6010':
        return new InternalServerErrorException(
          `Database engine or server error occurred (${error.code}). Please contact the backend administrator.`,
        );

      default:
        return new InternalServerErrorException(
          `Unhandled Prisma error (${error.code}). ${error.message}`,
        );
    }
  }

  // Fallback for non-Prisma, non-NestJS HTTP exceptions
  if (error instanceof Error) {
    return new InternalServerErrorException(
      `Unexpected server error: ${error.message}`,
    );
  }

  return new InternalServerErrorException(
    'An unknown error occurred.' + (error as Error).message,
  );
}
