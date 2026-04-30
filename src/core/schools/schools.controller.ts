import type { Request, Response } from 'express';
import { SchoolManagementService } from './schools.services.js';
import { updateSchoolStatusSchema } from './schools.dto.js';
import { SchoolStatus } from '../../../generated/prisma/client.js';

const schoolService = new SchoolManagementService();

export class SchoolController {
	async listSchools(req: Request, res: Response) {
		try {
			const { status } = req.query;
			const schools = await schoolService.listSchools(status as SchoolStatus);

			return res.status(200).json({
				status: 'success',
				data: schools
			});
		} catch (error: any) {
			return res.status(500).json({
				status: 'error',
				message: error.message || 'Erro ao listar escolas'
			});
		}
	}

	async listPublic(req: Request, res: Response) {
		try {
			const schools = await schoolService.listPublicSchools();

			return res.status(200).json({
				status: 'success',
				data: schools
			});
		} catch (error: any) {
			return res.status(500).json({
				status: 'error',
				message: error.message || 'Erro ao listar escolas públicas'
			});
		}
	}

	async updateStatus(req: Request, res: Response) {
		try {
			const id = req.params.id as string;
			const validatedData = updateSchoolStatusSchema.parse(req.body);
			const school = await schoolService.updateStatus(id, validatedData);

			return res.status(200).json({
				status: 'success',
				message: `Escola atualizada para ${validatedData.status}`,
				data: school
			});
		} catch (error: any) {
			return res.status(400).json({
				status: 'error',
				message: error.message || 'Erro ao atualizar estado da escola'
			});
		}
	}

	async getSchoolDetails(req: Request, res: Response) {
		try {
			const id = req.params.id as string;
			const school = await schoolService.getSchoolDetails(id);

			return res.status(200).json({
				status: 'success',
				data: school
			});
		} catch (error: any) {
			return res.status(404).json({
				status: 'error',
				message: error.message || 'Escola não encontrada'
			});
		}
	}
}
