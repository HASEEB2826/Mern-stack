import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";



export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) next(errorHandler(401, "Forbidden"));
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      next(errorHandler(401, "Unauthrorized"));
    }
    req.user = user;
    next();
  });
};
 