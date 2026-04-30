import { Router } from 'express';
import { StudentController } from '../core/students/students.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const studentController = new StudentController();

/**
 * @swagger
 * tags:
 *   name: Estudantes
 *   description: Supervisão global de estudantes
 */

router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED, Role.MIREX]), studentController.listStudents);
router.get('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED, Role.MIREX]), studentController.getDetails);
router.post('/:id/block', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), studentController.blockStudent);

export default router;
