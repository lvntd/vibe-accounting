import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';

type CustomError = { code?: number; message: string; details?: unknown };

export const serverResponse = {
  sendSuccess: (
    res: Response,
    data: unknown,
    paginationData?: {
      page: number;
      limit: number;
      total: number;
      lastPage: number;
    }
  ) => {
    return res.status(StatusCodes.OK).json({ data, ...paginationData });
  },
  sendError: (res: Response, error: CustomError) => {
    const responseMessage = {
      code: error.code ? error.code : 500,
      success: false,
      message: error.message,
      details: error.details || null,
    };
    return res.status(error.code ? error.code : 500).json(responseMessage);
  },
};
