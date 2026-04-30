import { prisma } from '../../config/prisma.config.js';
import { SchoolStatus, UserStatus } from '../../../generated/prisma/index.js';
import type { UpdateSchoolStatusInput } from './schools.dto.js';

export class SchoolManagementService {
    /**
     * List all schools
     */
    async listSchools(status?: SchoolStatus) {
        return await prisma.school.findMany({
            where: status ? { status } : {},
            include: {
                user: true,
                _count: {
                    select: { students: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * List only approved schools for public consumption
     */
    async listPublicSchools() {
        return await prisma.school.findMany({
            where: { status: SchoolStatus.APPROVED },
            select: {
                id: true,
                schoolName: true
            },
            orderBy: { schoolName: 'asc' }
        });
    }

    /**
     * Update school status (Approve, Reject, Suspend)
     */
    async updateStatus(schoolId: string, input: UpdateSchoolStatusInput) {
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            include: { user: true }
        });

        if (!school) throw new Error('Escola não encontrada');

        // Update school status
        const updatedSchool = await prisma.school.update({
            where: { id: schoolId },
            data: { status: input.status }
        });

        // If school is approved, activate the user. If rejected/suspended, block or pend.
        let userStatus: UserStatus = UserStatus.PENDING;
        if (input.status === SchoolStatus.APPROVED) {
            userStatus = UserStatus.ACTIVE;
        } else if (input.status === SchoolStatus.REJECTED) {
            userStatus = UserStatus.BLOCKED;
        }

        await prisma.user.update({
            where: { id: school.userId },
            data: { status: userStatus }
        });

        return updatedSchool;
    }

    /**
     * Get school details
     */
    async getSchoolDetails(schoolId: string) {
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            include: {
                user: true,
                students: {
                    include: {
                        user: true
                    },
                    take: 10 // Last 10 students for preview
                }
            }
        });

        if (!school) throw new Error('Escola não encontrada');
        return school;
    }
}
