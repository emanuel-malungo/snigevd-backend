import { z } from 'zod';
import { InstitutionType, InstitutionLevel } from '../../../generated/prisma/index.js';

export const createInstitutionSchema = z.object({
    name: z.nativeEnum(InstitutionType),
    level: z.nativeEnum(InstitutionLevel),
});

export const assignUserToInstitutionSchema = z.object({
    userId: z.string().uuid('ID do utilizador inválido'),
    institutionId: z.string().uuid('ID da instituição inválido'),
    position: z.string().optional(),
    department: z.string().optional(),
});

export type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;
export type AssignUserInput = z.infer<typeof assignUserToInstitutionSchema>;
