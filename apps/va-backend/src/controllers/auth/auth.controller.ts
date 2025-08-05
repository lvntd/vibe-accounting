import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { jwtSecret, maxAge } from '@/configs';
import { IUser, User } from '@/models';
import { getParsedTokenFromReq, serverResponse } from '@/util';
import { AccessToken } from '@vibe-accounting/shared-types';

const createToken = (user: IUser) => {
  const jwtValue: AccessToken = {
    userId: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(jwtValue, jwtSecret, {
    expiresIn: maxAge,
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return serverResponse.sendError(res, {
        message: 'error_user_already_exists',
        code: StatusCodes.BAD_REQUEST,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = createToken(user);

    res.cookie('accessToken', token, {
      httpOnly: false,
      maxAge: maxAge * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    serverResponse.sendSuccess(res, user);
  } catch (error) {
    next(error);
  }

  return null;
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (!auth) {
        return serverResponse.sendError(res, {
          code: StatusCodes.BAD_REQUEST,
          message: 'error_wrong_credentials',
        });
      }

      const accessToken = createToken(user);

      res.cookie('accessToken', accessToken, {
        httpOnly: false, // TODO. Vulnerability (should be true)
        maxAge: maxAge * 1000,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      serverResponse.sendSuccess(res, user);
    } else {
      return serverResponse.sendError(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'error_user_not_found',
      });
    }
  } catch (error) {
    next(error);
  }

  return null;
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedToken = getParsedTokenFromReq(req);

    const user = await User.findById(parsedToken.userId, { password: 0 });

    if (user) {
      serverResponse.sendSuccess(res, user);
    } else {
      serverResponse.sendError(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'error_user_not_found',
        details: null,
      });
    }
  } catch (error) {
    next(error);
  }

  return null;
};
