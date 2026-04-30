import { z } from 'zod';
import { Role } from '../../../generated/prisma/index.js';

export const createPermissionSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    module: z.string(),
    action: z.string(),
});

export const assignRolePermissionSchema = z.object({
    role: z.nativeEnum(Role),
    permissionId: z.string().uuid(),
});

export const assignUserPermissionSchema = z.object({
    userId: z.string().uuid(),
    permissionId: z.string().uuid(),
});

export type CreatePermissionInput = z.infer<typeof createPermissionSchema>;
export type AssignRolePermissionInput = z.infer<typeof assignRolePermissionSchema>;
export type AssignUserPermissionInput = z.infer<typeof assignUserPermissionSchema>;
