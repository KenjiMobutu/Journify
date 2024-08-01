import jwt from 'jsonwebtoken';
import { errorResponse } from './error.js';
import e from 'express';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorResponse(401, 'Access denied...'));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(errorResponse(403, 'Invalid token...'));
    req.user = user;
    next();
  });

}

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(errorResponse(403, 'You are not allowed to do this...'));
    }
  });
}

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(errorResponse(403, 'Only ADMIN is allowed to do this...'));
    }
  });
}
