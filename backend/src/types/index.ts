export * from './express';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type AsyncHandler<T = void> = (
  req: import('express').Request,
  res: import('express').Response,
  next: import('express').NextFunction,
) => Promise<T>;
