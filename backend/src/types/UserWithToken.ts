import { User } from '@prisma/client';

export type UserWithToken = { data: { user: Partial<User>; token: string } };
