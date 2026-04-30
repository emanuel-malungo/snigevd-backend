import ENV from '../../shared/utils/env.utils.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { generateJti } from '../utils/security.utils.js';
import type { JwtPayload } from '../../shared/types/auth.types.js';

export class JwtStrategy {
    private static initialized = false;

    static sign(payload: JwtPayload): string {

        if (!ENV.JWT_SECRET) {
            throw new Error('JWT_SECRET não configurado');
        }

        const enhancedPayload = {
            ...payload,
            jti: generateJti(),
            iat: Math.floor(Date.now() / 1000),
        };

        const options: SignOptions = {
            expiresIn: ENV.JWT_EXPIRES_IN as any || '15m',
            algorithm: 'HS256',
            issuer: 'mpamba-api',
            audience: 'mpamba-client',
        };

        return jwt.sign(enhancedPayload, ENV.JWT_SECRET, options);
    }

    static verify(token: string): JwtPayload {

        if (!ENV.JWT_SECRET) {
            throw new Error('JWT_SECRET não configurado');
        }

        try {
            return jwt.verify(token, ENV.JWT_SECRET, {
                algorithms: ['HS256'],
                issuer: 'mpamba-api',
                audience: 'mpamba-client',
            }) as JwtPayload;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token expirado. Por favor, faça login novamente.');
            }
            throw new Error('Token inválido ou expirado');
        }
    }
}