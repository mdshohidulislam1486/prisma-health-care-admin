import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export const generateToken = (
  paylod: any,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(paylod, secret, {
    algorithm: 'HS256',
    expiresIn,
  });
  return token;
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
