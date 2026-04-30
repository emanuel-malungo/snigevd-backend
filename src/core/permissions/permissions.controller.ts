import type { Request, Response } from 'express';
import { PermissionService } from './permissions.services.js';
import { 
    createPermissionSchema, 
    assignRolePermissionSchema, 
    assignUserPermissionSchema 
} from './permissions.dto.js';

const permissionService = new PermissionService();

export class PermissionController {
    async create(req: Request, res: Response) {
        try {
            const validatedData = createPermissionSchema.parse(req.body);
            const permission = await permissionService.createPermission(validatedData);
            return res.status(201).json({ status: 'success', data: permission });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async list(req: Request, res: Response) {
        try {
            const permissions = await permissionService.listPermissions();
            return res.status(200).json({ status: 'success', data: permissions });
        } catch (error: any) {
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async assignToRole(req: Request, res: Response) {
        try {
            const validatedData = assignRolePermissionSchema.parse(req.body);
            await permissionService.assignToRole(validatedData);
            return res.status(200).json({ status: 'success', message: 'Permissão atribuída ao perfil' });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async assignToUser(req: Request, res: Response) {
        try {
            const validatedData = assignUserPermissionSchema.parse(req.body);
            await permissionService.assignToUser(validatedData);
            return res.status(200).json({ status: 'success', message: 'Permissão atribuída ao utilizador' });
        } catch (error: any) {
            return res.status(400).json({ status: 'error', message: error.message });
        }
    }
}
