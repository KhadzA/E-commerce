export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  const user = verifyToken(token); // imagine this returns { id: 42, email: "test@example.com" }
  req.user = user;
  next();
}
