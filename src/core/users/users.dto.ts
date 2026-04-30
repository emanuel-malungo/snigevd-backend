import { z } from 'zod';
import { Role, UserStatus } from '../../../generated/prisma/index.js';

export const createInstitutionalUserSchema = z.object({
    fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    role: z.nativeEnum(Role),
    institutionId: z.string().min(1, 'ID da instituição inválido'),
    position: z.string().optional(),
    department: z.string().optional(),
});

export const updateUserStatusSchema = z.object({
    status: z.nativeEnum(UserStatus),
});

export const updateUserRoleSchema = z.object({
    role: z.nativeEnum(Role),
});

export const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
});

export type CreateInstitutionalUserInput = z.infer<typeof createInstitutionalUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
