import { prisma } from '../../config/prisma.config.js';
import type { CreateInstitutionInput, AssignUserToInstitutionInput } from './institutions.dto.js';

export class InstitutionService {
    /**
     * Create a new institution entity
     */
    async createInstitution(input: CreateInstitutionInput) {
        return await prisma.institution.create({
            data: {
                name: input.name,
                level: input.level,
                isActive: input.isActive
            }
        });
    }

    /**
     * List all institutions
     */
    async listInstitutions() {
        return await prisma.institution.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            },
            orderBy: { name: 'asc' }
        });
    }

    /**
     * Get institution details with users
     */
    async getInstitutionDetails(id: string) {
        const institution = await prisma.institution.findUnique({
            where: { id },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        });

        if (!institution) throw new Error('Instituição não encontrada');
        return institution;
    }

    /**
     * Assign a user to an institution
     */
    async assignUser(institutionId: string, input: AssignUserToInstitutionInput) {
        const institution = await prisma.institution.findUnique({ where: { id: institutionId } });
        if (!institution) throw new Error('Instituição não encontrada');

        const user = await prisma.user.findUnique({ where: { id: input.userId } });
        if (!user) throw new Error('Utilizador não encontrado');

        // Check if user is already assigned to an institution
        const existingAssignment = await prisma.institutionUser.findUnique({
            where: { userId: input.userId }
        });

        if (existingAssignment) {
            // Update assignment
            return await prisma.institutionUser.update({
                where: { userId: input.userId },
                data: {
                    institutionId,
                    position: input.position,
                    department: input.department
                }
            });
        }

        // Create new assignment
        return await prisma.institutionUser.create({
            data: {
                userId: input.userId,
                institutionId,
                position: input.position,
                department: input.department
            }
        });
    }

    /**
     * Remove user from institution
     */
    async removeUser(userId: string) {
        return await prisma.institutionUser.delete({
            where: { userId }
        });
    }
}
