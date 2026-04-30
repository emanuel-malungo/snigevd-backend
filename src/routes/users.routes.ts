import { Router } from 'express';
import { UserController } from '../core/users/users.controller.js';
import { authMiddleware, roleMiddleware } from '../shared/middlewares/auth.middleware.js';
import { Role } from '../../generated/prisma/index.js';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * tags:
 *   name: Utilizadores
 *   description: Gestão de utilizadores e perfis
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Listar todos os utilizadores
 *     tags: [Utilizadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filtrar por perfil (ex: STUDENT, SCHOOL_ADMIN, MIREX)
 *     responses:
 *       200:
 *         description: Lista de utilizadores obtida com sucesso
 */
router.get('/', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED, Role.MIREX]), userController.listUsers);

/**
 * @swagger
 * /users/institutional:
 *   post:
 *     summary: Criar utilizador institucional (MIREX, MED, GPEL, etc)
 *     tags: [Utilizadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, role, institutionId]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [MIREX, MED, GPEL, EMBASSY, DME] }
 *               institutionId: { type: string, format: uuid }
 *               position: { type: string }
 *               department: { type: string }
 *     responses:
 *       201:
 *         description: Utilizador criado com sucesso
 */
router.post('/institutional', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), userController.createInstitutionalUser);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obter detalhes de um utilizador
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
 *         description: Detalhes do utilizador
 */
router.get('/:id', authMiddleware, userController.getUserDetails);

/**
 * @swagger
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
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [ACTIVE, PENDING, BLOCKED] }
 *     responses:
 *       200:
 *         description: Estado atualizado com sucesso
 */
router.patch('/:id/status', authMiddleware, roleMiddleware([Role.SUPER_ADMIN, Role.MED]), userController.updateStatus);

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Alterar perfil (role) do utilizador
 *     description: Apenas Super Admins podem alterar perfis de outros utilizadores.
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
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [STUDENT, SCHOOL_ADMIN, MIREX, MED, GPEL, EMBASSY, DME, SUPER_ADMIN] }
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.patch('/:id/role', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), userController.updateRole);

/**
 * @swagger
 * /users/{id}/reset-password:
 *   post:
 *     summary: Redefinir senha de um utilizador
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
 *             type: object
 *             required: [newPassword]
 *             properties:
 *               newPassword: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 */
router.post('/:id/reset-password', authMiddleware, roleMiddleware([Role.SUPER_ADMIN]), userController.resetPassword);

export default router;
