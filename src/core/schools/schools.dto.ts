import { z } from 'zod';
import { SchoolStatus } from '../../../generated/prisma/index.js';

export const updateSchoolStatusSchema = z.object({
    status: z.nativeEnum(SchoolStatus),
});

export type UpdateSchoolStatusInput = z.infer<typeof updateSchoolStatusSchema>;
