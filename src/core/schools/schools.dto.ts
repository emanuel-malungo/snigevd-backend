import { z } from 'zod';
import { SchoolStatus } from '../../../generated/prisma/client.js';

export const updateSchoolStatusSchema = z.object({
	status: z.nativeEnum(SchoolStatus),
});

export type UpdateSchoolStatusInput = z.infer<typeof updateSchoolStatusSchema>;
