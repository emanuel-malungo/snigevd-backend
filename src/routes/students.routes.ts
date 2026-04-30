import { Router } from 'express';
import { StudentController } from '../core/students/students.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/client.js';

const router = Router();
const studentController = new StudentController();

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Listar todos os estudantes
 *     description: Acesso global à lista de estudantes registados no sistema.
 *     tags: [Estudantes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estudantes
 * 
 * /students/{id}:
 *   get:
 *     summary: Obter detalhes do estudante
 *     tags: [Estudantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Detalhes académicos e pessoais do aluno
 * 
 * /students/{id}/block:
 *   post:
 *     summary: Bloquear conta de estudante
 *     description: Bloqueia o acesso de um estudante por motivos de fraude ou irregularidade.
 *     tags: [Estudantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason: { type: string, example: "Documentação falsa detetada" }
 *     responses:
 *       200:
 *         description: Estudante bloqueado com sucesso
 */
router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED, Role.MIREX]), studentController.listStudents);
router.get('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED, Role.MIREX]), studentController.getDetails);
router.post('/:id/block', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), studentController.blockStudent);


export default router;
