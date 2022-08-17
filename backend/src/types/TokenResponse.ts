import { ResetPassword } from './ResetPassword';

export type TokenResponse = [
  status: number,
  message: string,
  data: ResetPassword
];
