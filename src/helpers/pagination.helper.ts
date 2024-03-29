import { TPagination } from '../app/interfaces/pagination';

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};
export const calculagePagination = (options: TPagination): IOptionsResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 2;
  const skip: number = (Number(page) - 1) * Number(limit);
  const sortBy: string = options.sortBy || 'createdAt';
  const sortOrder: string = options.sortOrder || 'desc';
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
