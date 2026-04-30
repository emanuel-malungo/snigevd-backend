import { Router } from 'express';
import { SchoolController } from '../core/schools/schools.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/client.js';

const router = Router();
const schoolController = new SchoolController();

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateSchoolStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status: { type: string, enum: [PENDING, APPROVED, REJECTED], example: "APPROVED" }
 * 
 * /schools:
 *   get:
 *     summary: Listar todas as escolas
 *     description: Retorna uma lista de todas as escolas registadas com filtros de estado.
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, APPROVED, REJECTED] }
 *         description: Filtrar por estado da escola
 *     responses:
 *       200:
 *         description: Lista de escolas
 * 
 * /schools/{id}:
 *   get:
 *     summary: Obter detalhes da escola
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Detalhes da escola e administrador
 * 
 * /schools/{id}/status:
 *   patch:
 *     summary: Atualizar estado da escola (Aprovar/Rejeitar)
 *     tags: [Escolas]
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
 *             $ref: '#/components/schemas/UpdateSchoolStatusRequest'
 *     responses:
 *       200:
 *         description: Estado atualizado
 */
router.get('/public', schoolController.listPublic);
router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), schoolController.listSchools);
router.get('/:id', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), schoolController.getSchoolDetails);
router.patch('/:id/status', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), schoolController.updateStatus);


export default router;
