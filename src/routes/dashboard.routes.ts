import { Router } from 'express';
import { DashboardController } from '../core/dashboard/dashboard.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Estatísticas e métricas globais
 */

router.get('/stats', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), dashboardController.getStats);
router.get('/activity', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), dashboardController.getActivity);

export default router;
