import { Router } from 'express';
import { InstitutionController } from '../core/institutions/institutions.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const institutionController = new InstitutionController();

/**
 * @swagger
 * tags:
 *   name: Instituições
 *   description: Gestão de entidades governamentais e internacionais
 */

router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), institutionController.list);
router.post('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), institutionController.create);
router.get('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), institutionController.getDetails);
router.post('/:id/users', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), institutionController.assignUser);
router.delete('/users/:userId', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), institutionController.removeUser);

export default router;
