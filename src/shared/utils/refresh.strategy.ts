import ENV from '../../shared/utils/env.utils.js';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { RefreshPayload } from '../../shared/types/auth.types.js';

export class RefreshStrategy {
	static sign(payload: RefreshPayload): string {
		if (!ENV.JWT_REFRESH_SECRET) {
			throw new Error('JWT_REFRESH_SECRET não configurado');
		}

		const options: SignOptions = {
			expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as any,
		};

		return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, options);
	}

	static verify(token: string): RefreshPayload {
		if (!ENV.JWT_REFRESH_SECRET) {
			throw new Error('JWT_REFRESH_SECRET não configurado');
		}

		try {
			return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as RefreshPayload;
		} catch (error) {
			throw new Error('Refresh token inválido ou expirado');
		}
	}
}