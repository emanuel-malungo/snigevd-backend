import { Router } from 'express';
import { PermissionController } from '../core/permissions/permissions.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const permissionController = new PermissionController();

/**
 * @swagger
 * tags:
 *   name: Permissões
 *   description: Gestão de permissões e ACL
 */

router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.list);
router.post('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.create);
router.post('/assign-role', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.assignToRole);
router.post('/assign-user', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.assignToUser);

export default router;
