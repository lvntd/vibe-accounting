import { AccessToken } from '@vibe-accounting/shared-types';
import { Request } from 'express';

import jwt from 'jsonwebtoken';

export const getParsedTokenFromReq = (req: Request) => {
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  const parsedToken = jwt.decode(token) as AccessToken;

  if (parsedToken === null) {
    throw new Error('error_token_not_parsed');
  }

  return parsedToken;
};
