import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  jsonData: {
    statsuCode: number;
    success: boolean;
    message: string;
    meta?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | null | undefined;
  }
) => {
  res.status(jsonData.statsuCode).json({
    success: jsonData.success,
    message: jsonData.message,
    data: jsonData.data || null || undefined,
    meta: jsonData.meta || null || undefined,
  });
};
