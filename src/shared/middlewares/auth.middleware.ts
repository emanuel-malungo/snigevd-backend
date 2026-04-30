import type { Request, Response, NextFunction } from 'express';
import { JwtStrategy } from '../utils/jwt.strategy.js';

/**
 * Middleware to protect routes that require authentication
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 'error',
                message: 'Token de autorização não fornecido'
            });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({
                status: 'error',
                message: 'Erro no token'
            });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme || '')) {
            return res.status(401).json({
                status: 'error',
                message: 'Token malformatado'
            });
        }

        const decoded = JwtStrategy.verify(token || '');
        (req as any).user = decoded;

        return next();
    } catch (error: any) {
        return res.status(401).json({
            status: 'error',
            message: error.message || 'Token inválido'
        });
    }
};

/**
 * Middleware to check user roles
 */
export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Não autenticado'
            });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({
                status: 'error',
                message: 'Não tem permissão para aceder a este recurso'
            });
        }

        return next();
    };
};
