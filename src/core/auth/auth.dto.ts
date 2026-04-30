import { z } from 'zod';
import { Role } from '../../../generated/prisma/index.js';


// Login request schema
export const loginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Refresh token request schema
export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

// Generic Registration request schema (for initial implementation)
export const registerSchema = z.object({
	fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
	phone: z.string().optional(),
	role: z.nativeEnum(Role).default(Role.STUDENT),
});

// School Registration schema
export const schoolRegisterSchema = z.object({
	fullName: z.string().min(3, 'Nome do administrador deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email pessoal inválido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
	phone: z.string().optional(),
	schoolName: z.string().min(3, 'Nome da escola deve ter no mínimo 3 caracteres'),
	schoolNumber: z.string().min(1, 'Número da escola é obrigatório'),
	decree: z.string().min(1, 'Decreto é obrigatório'),
	startYear: z.number().int(),
	educationLevel: z.string(),
	street: z.string(),
	municipality: z.string(),
	province: z.string(),
	contact: z.string(),
	institutionalEmail: z.string().email('Email institucional inválido'),
});

// Student Registration schema
export const studentRegisterSchema = z.object({
	fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
	phone: z.string().optional(),
	biNumber: z.string().min(1, 'Número do BI é obrigatório'),
	schoolId: z.string().uuid('ID da escola inválido'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type SchoolRegisterInput = z.infer<typeof schoolRegisterSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
