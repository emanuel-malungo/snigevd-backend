import { prisma } from '../../config/prisma.config.js';
import { UserStatus } from '../../../generated/prisma/client.js';

export class StudentSupervisionService {
	/**
	 * List all students globally
	 */
	async listAllStudents() {
		return await prisma.studentProfile.findMany({
			include: {
				user: true,
				school: true
			},
			orderBy: { createdAt: 'desc' }
		});
	}

	/**
	 * Get student academic data and details
	 */
	async getStudentDetails(studentId: string) {
		const student = await prisma.studentProfile.findUnique({
			where: { id: studentId },
			include: {
				user: true,
				school: true,
				// Academic data relations would go here
			}
		});

		if (!student) throw new Error('Estudante não encontrado');
		return student;
	}

	/**
	 * Block fraudulent accounts
	 */
	async blockStudent(studentId: string, reason: string) {
		const student = await prisma.studentProfile.findUnique({
			where: { id: studentId }
		});

		if (!student) throw new Error('Estudante não encontrado');

		return await prisma.user.update({
			where: { id: student.userId },
			data: {
				status: UserStatus.BLOCKED,
				isActive: false
			}
		});
	}
}
