import { Router } from 'express';
import { DashboardController } from '../core/dashboard/dashboard.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/client.js';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Obter estatísticas globais
 *     description: Retorna contadores agregados e dados para gráficos (utilizadores por perfil, escolas por estado).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas carregadas com sucesso
 * 
 * /dashboard/activity:
 *   get:
 *     summary: Obter atividade recente
 *     description: Retorna as últimas escolas e utilizadores registados no sistema.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de atividade recente
 */
router.get('/stats', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), dashboardController.getStats);
router.get('/activity', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), dashboardController.getActivity);


export default router;
