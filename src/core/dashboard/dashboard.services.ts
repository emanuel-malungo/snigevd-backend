import { prisma } from '../../config/prisma.config.js';
import { SchoolStatus, UserStatus, Role } from '../../../generated/prisma/index.js';

export class DashboardService {
    /**
     * Get aggregate statistics for Super Admin
     */
    async getSuperAdminStats() {
        const [
            totalUsers,
            totalSchools,
            totalStudents,
            totalInstitutions,
            pendingSchools,
            activeStudents,
            usersByRole,
            schoolsByStatus
        ] = await Promise.all([
            prisma.user.count(),
            prisma.school.count(),
            prisma.studentProfile.count(),
            prisma.institution.count(),
            prisma.school.count({ where: { status: SchoolStatus.PENDING } }),
            prisma.studentProfile.count({ where: { isActive: true } }),
            this.getUsersByRole(),
            this.getSchoolsByStatus()
        ]);

        return {
            counters: {
                totalUsers,
                totalSchools,
                totalStudents,
                totalInstitutions,
                pendingSchools,
                activeStudents
            },
            charts: {
                usersByRole,
                schoolsByStatus
            }
        };
    }

    private async getUsersByRole() {
        const roles = Object.values(Role);
        const stats = await Promise.all(
            roles.map(async (role) => ({
                role,
                count: await prisma.user.count({ where: { role } })
            }))
        );
        return stats;
    }

    private async getSchoolsByStatus() {
        const statuses = Object.values(SchoolStatus);
        const stats = await Promise.all(
            statuses.map(async (status) => ({
                status,
                count: await prisma.school.count({ where: { status } })
            }))
        );
        return stats;
    }

    /**
     * Get recent activity (last 10 events)
     */
    async getRecentActivity() {
        // Since we don't have a Logs model yet, we can return recent registrations
        const [recentSchools, recentUsers] = await Promise.all([
            prisma.school.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prisma.user.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return {
            recentSchools,
            recentUsers
        };
    }
}
