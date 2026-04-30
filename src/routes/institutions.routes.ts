import { Router } from 'express';
import { InstitutionController } from '../core/institutions/institutions.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const institutionController = new InstitutionController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInstitutionRequest:
 *       type: object
 *       required: [name, level]
 *       properties:
 *         name: { type: string, enum: [MIREX, MED, GPEL, EMBASSY, DME], example: "MED" }
 *         level: { type: string, enum: [NATIONAL, PROVINCIAL, MUNICIPAL, LOCAL], example: "NATIONAL" }
 * 
 *     AssignUserRequest:
 *       type: object
 *       required: [userId]
 *       properties:
 *         userId: { type: string, format: uuid, example: "550e8400-e29b-41d4-a716-446655440000" }
 *         position: { type: string, example: "Diretor Nacional" }
 *         department: { type: string, example: "Recursos Humanos" }
 * 
 * /institutions:
 *   get:
 *     summary: Listar instituições
 *     tags: [Instituições]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de instituições
 *   post:
 *     summary: Criar instituição
 *     tags: [Instituições]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInstitutionRequest'
 *     responses:
 *       201:
 *         description: Criada com sucesso
 * 
 * /institutions/{id}:
 *   get:
 *     summary: Detalhes da instituição
 *     tags: [Instituições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Detalhes e lista de utilizadores vinculados
 * 
 * /institutions/{id}/users:
 *   post:
 *     summary: Atribuir utilizador à instituição
 *     tags: [Instituições]
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
 *             $ref: '#/components/schemas/AssignUserRequest'
 *     responses:
 *       200:
 *         description: Atribuído com sucesso
 * 
 * /institutions/users/{userId}:
 *   delete:
 *     summary: Remover utilizador da instituição
 *     tags: [Instituições]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Removido com sucesso
 */
router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), institutionController.list);
router.post('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), institutionController.create);
router.get('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), institutionController.getDetails);
router.post('/:id/users', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), institutionController.assignUser);
router.delete('/users/:userId', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), institutionController.removeUser);


export default router;
