import jwt from 'jsonwebtoken';

export function createToken(
  data: any,
  secret: jwt.Secret,
  expiredIn: string | number = '30d'
): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { ...data },
      secret,
      {
        algorithm: 'HS256',
        expiresIn: expiredIn,
      },
      (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      }
    );
  });
}
