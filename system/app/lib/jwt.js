import jwt from "jsonwebtoken";

export function signJwt(user, expiresIn = "1d") {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    return null;
  }
}
