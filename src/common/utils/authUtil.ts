import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export function verify(token: string, secretKey: string) {
  const decoded = jwt.verify(token, secretKey);
  if (decoded) {
    return decoded;
  }
  return null;
}

export async function hashPassword(password: string) {
  if (password) {
    return await bcrypt.hash(password, 10);
  }
}
