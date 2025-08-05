import { UserRole } from './user-role.js';

export type AccessToken = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};
