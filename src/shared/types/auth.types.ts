import type { Role, UserStatus } from '../../../generated/prisma/client.js';


/**
 * JWT Access Token Payload
 */
export interface JwtPayload {
	sub: string;
	email: string;
	role: Role;
}

/**
 * JWT Refresh Token Payload
 */
export interface RefreshPayload {
	sub: string;
}

/**
 * Login Response Structure
 */
export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	user: AuthUser;
}

/**
 * Authenticated User Information
 */
export interface AuthUser {
	id: string;
	fullName: string;
	email: string;
	role: Role;
	status: UserStatus;
	schoolId?: string | null;
	institutionId?: string | null;
}

/**
 * Refresh Token Response
 */
export interface RefreshTokenResponse {
	accessToken: string;
}
