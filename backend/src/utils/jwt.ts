import 'dotenv/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import authConfig from './authConfig';

export default class JsonWebToken {
  public static generate(obj: string | object | Buffer): string {
    return sign(obj, authConfig.secret, {
      algorithm: 'HS512',
    });
  }

  public static decode(token: string): string | JwtPayload {
    return verify(token, authConfig.secret);
  }
}
