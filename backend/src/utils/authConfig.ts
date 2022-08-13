import 'dotenv/config';
import { hashSync } from 'bcryptjs';

const hashSecret = (secret: string, salts: number = 10) =>
  hashSync(secret, salts);

const secret = '759b74ce43947f5f4c91aeddc3e5bad3';

const SECRET = process.env.SECRET || hashSecret(secret);

const authConfig = {
  secret: SECRET,
  expiresIn: '24h',
};

export default authConfig;
