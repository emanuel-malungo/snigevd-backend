import { Router } from 'express';
import { SchoolController } from '../core/schools/schools.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const schoolController = new SchoolController();

/**
 * @swagger
 * tags:
 *   name: Escolas
 *   description: Gestão administrativa de escolas
 */

router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), schoolController.listSchools);
router.get('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), schoolController.getSchoolDetails);
router.patch('/:id/status', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), schoolController.updateStatus);

export default router;
