import { prisma } from '../../config/prisma.config.js';
import type { 
    CreatePermissionInput, 
    AssignRolePermissionInput, 
    AssignUserPermissionInput 
} from './permissions.dto.js';

export class PermissionService {
    async createPermission(input: CreatePermissionInput) {
        return await prisma.permission.create({
            data: input
        });
    }

    async listPermissions() {
        return await prisma.permission.findMany({
            include: {
                _count: {
                    select: { rolePermissions: true, userPermissions: true }
                }
            }
        });
    }

    async assignToRole(input: AssignRolePermissionInput) {
        return await prisma.rolePermission.upsert({
            where: {
                role_permissionId: {
                    role: input.role,
                    permissionId: input.permissionId
                }
            },
            update: {},
            create: input
        });
    }

    async assignToUser(input: AssignUserPermissionInput) {
        return await prisma.userPermission.upsert({
            where: {
                userId_permissionId: {
                    userId: input.userId,
                    permissionId: input.permissionId
                }
            },
            update: {},
            create: input
        });
    }

    async getUserPermissions(userId: string) {
        const [userSpecific, roleSpecific] = await Promise.all([
            prisma.userPermission.findMany({
                where: { userId },
                include: { permission: true }
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            }).then(user => user ? prisma.rolePermission.findMany({
                where: { role: user.role },
                include: { permission: true }
            }) : [])
        ]);

        const permissions = new Set([
            ...userSpecific.map(p => p.permission.name),
            ...roleSpecific.map(p => p.permission.name)
        ]);

        return Array.from(permissions);
    }
}
