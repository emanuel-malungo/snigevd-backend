import { z } from 'zod';
import { InstitutionType, InstitutionLevel } from '../../../generated/prisma/client.js';

export const createInstitutionSchema = z.object({
	name: z.nativeEnum(InstitutionType),
	level: z.nativeEnum(InstitutionLevel),
	isActive: z.boolean().default(true),
});

export const assignUserToInstitutionSchema = z.object({
	userId: z.string().min(1),
	position: z.string().optional(),
	department: z.string().optional(),
});

export type CreateInstitutionInput = z.infer<typeof createInstitutionSchema>;
export type AssignUserToInstitutionInput = z.infer<typeof assignUserToInstitutionSchema>;
