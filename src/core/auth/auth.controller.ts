import type { Request, Response } from 'express';
import { AuthService } from './auth.services.js';
import { 
    loginSchema, 
    schoolRegisterSchema, 
    studentRegisterSchema, 
    refreshTokenSchema 
} from './auth.dto.js';

const authService = new AuthService();

export class AuthController {
    /**
     * Login handler
     */
    async login(req: Request, res: Response) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);
            
            return res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error: any) {
            return res.status(401).json({
                status: 'error',
                message: error.message || 'Erro na autenticação'
            });
        }
    }

    /**
     * Register School handler
     */
    async registerSchool(req: Request, res: Response) {
        try {
            const validatedData = schoolRegisterSchema.parse(req.body);
            const result = await authService.registerSchool(validatedData);
            
            return res.status(201).json({
                status: 'success',
                message: 'Escola registada com sucesso. Aguarde a aprovação.',
                data: result
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao registar escola'
            });
        }
    }

    /**
     * Register Student handler
     */
    async registerStudent(req: Request, res: Response) {
        try {
            const validatedData = studentRegisterSchema.parse(req.body);
            const result = await authService.registerStudent(validatedData);
            
            return res.status(201).json({
                status: 'success',
                message: 'Estudante registado com sucesso.',
                data: result
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao registar estudante'
            });
        }
    }

    /**
     * Refresh token handler
     */
    async refresh(req: Request, res: Response) {
        try {
            const validatedData = refreshTokenSchema.parse(req.body);
            const result = await authService.refresh(validatedData);
            
            return res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error: any) {
            return res.status(401).json({
                status: 'error',
                message: error.message || 'Token de atualização inválido'
            });
        }
    }

    /**
     * Get profile handler
     */
    async getProfile(req: Request, res: Response) {
        try {
            // userId will be attached by auth middleware
            const userId = (req as any).user?.sub;
            if (!userId) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Não autenticado'
                });
            }

            const result = await authService.getProfile(userId);
            
            return res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message || 'Utilizador não encontrado'
            });
        }
    }
}
