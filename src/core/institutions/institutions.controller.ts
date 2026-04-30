import type { Request, Response } from 'express';
import { InstitutionService } from './institutions.services.js';
import { createInstitutionSchema, assignUserToInstitutionSchema } from './institutions.dto.js';

const institutionService = new InstitutionService();

export class InstitutionController {
    async create(req: Request, res: Response) {
        try {
            const validatedData = createInstitutionSchema.parse(req.body);
            const institution = await institutionService.createInstitution(validatedData);
            
            return res.status(201).json({
                status: 'success',
                data: institution
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao criar instituição'
            });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const institutions = await institutionService.listInstitutions();
            return res.status(200).json({
                status: 'success',
                data: institutions
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Erro ao listar instituições'
            });
        }
    }

    async getDetails(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const institution = await institutionService.getInstitutionDetails(id);
            return res.status(200).json({
                status: 'success',
                data: institution
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message || 'Instituição não encontrada'
            });
        }
    }

    async assignUser(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const validatedData = assignUserToInstitutionSchema.parse(req.body);
            const assignment = await institutionService.assignUser(id, validatedData);
            
            return res.status(200).json({
                status: 'success',
                message: 'Utilizador atribuído com sucesso',
                data: assignment
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao atribuir utilizador'
            });
        }
    }

    async removeUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            await institutionService.removeUser(userId as string);
            
            return res.status(200).json({
                status: 'success',
                message: 'Utilizador removido da instituição'
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao remover utilizador'
            });
        }
    }
}
