import { Router } from 'express';
import { PermissionController } from '../core/permissions/permissions.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/client.js';

const router = Router();
const permissionController = new PermissionController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePermissionRequest:
 *       type: object
 *       required: [name, module, action]
 *       properties:
 *         name: { type: string, example: "school:approve" }
 *         description: { type: string, example: "Permitir aprovação de novas escolas" }
 *         module: { type: string, example: "Schools" }
 *         action: { type: string, example: "APPROVE" }
 * 
 *     AssignRolePermissionRequest:
 *       type: object
 *       required: [role, permissionId]
 *       properties:
 *         role: { type: string, enum: [STUDENT, SCHOOL_ADMIN, MIREX, MED, GPEL, EMBASSY, DME, SUPER_ADMIN], example: "MED" }
 *         permissionId: { type: string, format: uuid, example: "550e8400-e29b-41d4-a716-446655440000" }
 * 
 *     AssignUserPermissionRequest:
 *       type: object
 *       required: [userId, permissionId]
 *       properties:
 *         userId: { type: string, format: uuid, example: "550e8400-e29b-41d4-a716-446655440000" }
 *         permissionId: { type: string, format: uuid, example: "550e8400-e29b-41d4-a716-446655440000" }
 * 
 * /permissions:
 *   get:
 *     summary: Listar todas as permissões
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de permissões cadastradas
 *   post:
 *     summary: Criar nova permissão
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermissionRequest'
 *     responses:
 *       201:
 *         description: Criada com sucesso
 * 
 * /permissions/assign-role:
 *   post:
 *     summary: Atribuir permissão a um perfil (Role)
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignRolePermissionRequest'
 *     responses:
 *       200:
 *         description: Atribuída com sucesso
 * 
 * /permissions/assign-user:
 *   post:
 *     summary: Atribuir permissão direta a um utilizador
 *     tags: [Permissões]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignUserPermissionRequest'
 *     responses:
 *       200:
 *         description: Atribuída com sucesso
 */
router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.list);
router.post('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.create);
router.post('/assign-role', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.assignToRole);
router.post('/assign-user', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), permissionController.assignToUser);


export default router;
