import { User } from './UserType';

export type UserToken = [
  status: number,
  message: string,
  data: { user: Partial<User>; token: string }
];
