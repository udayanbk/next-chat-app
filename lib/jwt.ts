import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

/** Sign JWT */
export function signJWT(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/** Verify JWT */
export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
