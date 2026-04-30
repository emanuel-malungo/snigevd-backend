import { Router } from 'express';
import { UserController } from '../core/users/users.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/client.js';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *   schemas:
 *     InstitutionalUserRequest:
 *       type: object
 *       required: [fullName, email, password, role, institutionId]
 *       properties:
 *         fullName: { type: string, example: "Bernardo Costa" }
 *         email: { type: string, format: email, example: "b.costa@mirex.gov.ao" }
 *         password: { type: string, minLength: 6, example: "admin@2024" }
 *         role: { type: string, enum: [MIREX, MED, GPEL, EMBASSY, DME], example: "MIREX" }
 *         institutionId: { type: string, format: uuid, example: "550e8400-e29b-41d4-a716-446655440000" }
 *         position: { type: string, example: "Chefe de Departamento" }
 *         department: { type: string, example: "Equivalências" }
 * 
 *     UpdateUserStatusRequest:
 *       type: object
 *       required: [status]
 *       properties:
 *         status: { type: string, enum: [ACTIVE, PENDING, BLOCKED], example: "BLOCKED" }
 * 
 *     UpdateUserRoleRequest:
 *       type: object
 *       required: [role]
 *       properties:
 *         role: { type: string, enum: [STUDENT, SCHOOL_ADMIN, MIREX, MED, GPEL, EMBASSY, DME, SUPER_ADMIN], example: "SUPER_ADMIN" }
 * 
 *     ResetPasswordRequest:
 *       type: object
 *       required: [newPassword]
 *       properties:
 *         newPassword: { type: string, minLength: 6, example: "novaSenha123!" }
 * 
 * /users:
 *   get:
 *     summary: Listar todos os utilizadores
 *     description: Retorna uma lista de todos os utilizadores do sistema com filtros opcionais.
 *     tags: [Utilizadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [STUDENT, SCHOOL_ADMIN, MIREX, MED, GPEL, EMBASSY, DME, SUPER_ADMIN]
 *         description: Filtrar por perfil
 *     responses:
 *       200:
 *         description: Lista de utilizadores
 * 
 * /users/institutional:
 *   post:
 *     summary: Criar utilizador institucional
 *     description: Cria uma conta para funcionários de entidades governamentais.
 *     tags: [Utilizadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstitutionalUserRequest'
 *     responses:
 *       201:
 *         description: Criado com sucesso
 * 
 * /users/{id}:
 *   get:
 *     summary: Obter detalhes do utilizador
 *     tags: [Utilizadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Detalhes do utilizador e suas relações
 * 
 * /users/{id}/status:
 *   patch:
 *     summary: Ativar ou bloquear conta
 *     tags: [Utilizadores]
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
 *             $ref: '#/components/schemas/UpdateUserStatusRequest'
 *     responses:
 *       200:
 *         description: Estado atualizado
 * 
 * /users/{id}/role:
 *   patch:
 *     summary: Alterar perfil (role)
 *     tags: [Utilizadores]
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
 *             $ref: '#/components/schemas/UpdateUserRoleRequest'
 *     responses:
 *       200:
 *         description: Perfil alterado
 * 
 * /users/{id}/reset-password:
 *   post:
 *     summary: Redefinir senha
 *     tags: [Utilizadores]
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
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Senha redefinida
 */
router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED, Role.MIREX]), userController.listUsers);
router.post('/institutional', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), userController.createInstitutionalUser);
router.get('/:id', authMiddleware, userController.getUserDetails);
router.patch('/:id/status', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), userController.updateStatus);
router.patch('/:id/role', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), userController.updateRole);
router.post('/:id/reset-password', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), userController.resetPassword);


export default router;
