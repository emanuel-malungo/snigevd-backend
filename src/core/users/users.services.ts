import { prisma } from '../../config/prisma.config.js';
import { hashPassword } from '../../shared/utils/security.utils.js';
import { UserStatus, Role } from '../../../generated/prisma/index.js';
import type { 
    CreateInstitutionalUserInput, 
    UpdateUserStatusInput, 
    UpdateUserRoleInput, 
    ResetPasswordInput 
} from './users.dto.js';

export class UserManagementService {
    /**
     * Create an institutional user
     */
    async createInstitutionalUser(input: CreateInstitutionalUserInput) {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email }
        });

        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        const passwordHash = await hashPassword(input.password);

        return await prisma.user.create({
            data: {
                fullName: input.fullName,
                email: input.email,
                phone: input.phone,
                passwordHash,
                role: input.role,
                status: UserStatus.ACTIVE,
                institutionUser: {
                    create: {
                        institutionId: input.institutionId,
                        position: input.position,
                        department: input.department
                    }
                }
            },
            include: {
                institutionUser: {
                    include: {
                        institution: true
                    }
                }
            }
        });
    }

    /**
     * Update user status (Active, Blocked, etc.)
     */
    async updateStatus(userId: string, input: UpdateUserStatusInput) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Utilizador não encontrado');

        return await prisma.user.update({
            where: { id: userId },
            data: { status: input.status }
        });
    }

    /**
     * Reset user password
     */
    async resetPassword(userId: string, input: ResetPasswordInput) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Utilizador não encontrado');

        const passwordHash = await hashPassword(input.newPassword);

        return await prisma.user.update({
            where: { id: userId },
            data: { passwordHash }
        });
    }

    /**
     * Update user role (only for Super Admin)
     */
    async updateRole(userId: string, input: UpdateUserRoleInput) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('Utilizador não encontrado');

        return await prisma.user.update({
            where: { id: userId },
            data: { role: input.role }
        });
    }

    /**
     * List all users with optional filters
     */
    async listUsers(role?: Role) {
        return await prisma.user.findMany({
            where: role ? { role } : {},
            include: {
                school: true,
                studentProfile: true,
                institutionUser: {
                    include: {
                        institution: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get user details
     */
    async getUserDetails(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                school: true,
                studentProfile: true,
                institutionUser: {
                    include: {
                        institution: true
                    }
                }
            }
        });

        if (!user) throw new Error('Utilizador não encontrado');
        return user;
    }
}
