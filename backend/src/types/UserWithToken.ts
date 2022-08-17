import { User } from '@prisma/client';

export type UserWithToken = [
  status: number,
  message: string,
  data: { user: Partial<User>; token: string }
];
