import jwt from 'jsonwebtoken';

export function createToken(payload: object) {
  const secret = process.env.JWT_SECRET!;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}
