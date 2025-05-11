import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET_KEY || "dn3r43ir439r349r"

export function signJwt(user) {
  return jwt.sign(user, SECRET, { expiresIn: '1h' });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
