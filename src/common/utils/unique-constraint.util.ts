import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

type PgError = QueryFailedError & { driverError?: { code?: string } };

export function handleUniqueConstraint(error: unknown, message: string): void {
  if (!(error instanceof QueryFailedError)) return;
  const driverError = (error as PgError).driverError;
  if (driverError?.code === '23505') {
    throw new ConflictException(message);
  }
}
