import type { Request, Response } from 'express';
import { UserManagementService } from './users.services.js';
import { 
    createInstitutionalUserSchema, 
    updateUserStatusSchema, 
    updateUserRoleSchema, 
    resetPasswordSchema 
} from './users.dto.js';
import { Role } from '../../../generated/prisma/index.js';

const userService = new UserManagementService();

export class UserController {
    /**
     * Create institutional user
     */
    async createInstitutionalUser(req: Request, res: Response) {
        try {
            const validatedData = createInstitutionalUserSchema.parse(req.body);
            const user = await userService.createInstitutionalUser(validatedData);
            
            return res.status(201).json({
                status: 'success',
                data: user
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao criar utilizador institucional'
            });
        }
    }

    /**
     * Update user status
     */
    async updateStatus(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const validatedData = updateUserStatusSchema.parse(req.body);
            const user = await userService.updateStatus(id, validatedData);
            
            return res.status(200).json({
                status: 'success',
                message: 'Estado do utilizador atualizado',
                data: user
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao atualizar estado'
            });
        }
    }

    /**
     * Reset password
     */
    async resetPassword(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const validatedData = resetPasswordSchema.parse(req.body);
            await userService.resetPassword(id, validatedData);
            
            return res.status(200).json({
                status: 'success',
                message: 'Senha redefinida com sucesso'
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao redefinir senha'
            });
        }
    }

    /**
     * Update user role
     */
    async updateRole(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const validatedData = updateUserRoleSchema.parse(req.body);
            const user = await userService.updateRole(id, validatedData);
            
            return res.status(200).json({
                status: 'success',
                message: 'Perfil do utilizador atualizado',
                data: user
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao atualizar perfil'
            });
        }
    }

    /**
     * List all users
     */
    async listUsers(req: Request, res: Response) {
        try {
            const { role } = req.query;
            const users = await userService.listUsers(role as Role);
            
            return res.status(200).json({
                status: 'success',
                data: users
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Erro ao listar utilizadores'
            });
        }
    }

    /**
     * Get user details
     */
    async getUserDetails(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const user = await userService.getUserDetails(id);
            
            return res.status(200).json({
                status: 'success',
                data: user
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message || 'Utilizador não encontrado'
            });
        }
    }
}
