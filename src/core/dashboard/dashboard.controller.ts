import type { Request, Response } from 'express';
import { DashboardService } from './dashboard.services.js';

const dashboardService = new DashboardService();

export class DashboardController {
    async getStats(req: Request, res: Response) {
        try {
            const stats = await dashboardService.getSuperAdminStats();
            return res.status(200).json({
                status: 'success',
                data: stats
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Erro ao carregar estatísticas'
            });
        }
    }

    async getActivity(req: Request, res: Response) {
        try {
            const activity = await dashboardService.getRecentActivity();
            return res.status(200).json({
                status: 'success',
                data: activity
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Erro ao carregar atividade'
            });
        }
    }
}
