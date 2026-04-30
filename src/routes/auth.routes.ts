import { Router } from 'express';
import { AuthController } from '../core/auth/auth.controller.js';
import { authMiddleware } from '../shared/middlewares/auth.middleware.js';
import { authRateLimiter } from '../shared/utils/security.utils.js';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "admin@snigevd.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "senha123"
 * 
 *     SchoolRegisterRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - schoolName
 *         - schoolNumber
 *         - decree
 *         - startYear
 *         - educationLevel
 *         - street
 *         - municipality
 *         - province
 *         - contact
 *         - institutionalEmail
 *       properties:
 *         fullName:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           format: email
 *           example: "joao.silva@escola.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "senha123"
 *         phone:
 *           type: string
 *           example: "+244923000000"
 *         schoolName:
 *           type: string
 *           example: "Escola Primária 123"
 *         schoolNumber:
 *           type: string
 *           example: "SCH-001"
 *         decree:
 *           type: string
 *           example: "Dec-2024-001"
 *         startYear:
 *           type: integer
 *           example: 1995
 *         educationLevel:
 *           type: string
 *           example: "Primário e Secundário"
 *         street:
 *           type: string
 *           example: "Rua Direita do Luanda"
 *         municipality:
 *           type: string
 *           example: "Belas"
 *         province:
 *           type: string
 *           example: "Luanda"
 *         contact:
 *           type: string
 *           example: "+244222000000"
 *         institutionalEmail:
 *           type: string
 *           format: email
 *           example: "geral@escola123.edu.ao"
 * 
 *     StudentRegisterRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - password
 *         - biNumber
 *         - schoolId
 *       properties:
 *         fullName:
 *           type: string
 *           example: "Maria Santos"
 *         email:
 *           type: string
 *           format: email
 *           example: "maria.santos@gmail.com"
 *         password:
 *           type: string
 *           minLength: 6
 *           example: "senha123"
 *         phone:
 *           type: string
 *           example: "+244912000000"
 *         biNumber:
 *           type: string
 *           example: "001234567LA045"
 *         schoolId:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 * 
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1Ni..."
 *             refreshToken:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1Ni..."
 *             user:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 schoolId:
 *                   type: string
 *                   nullable: true
 *                 institutionId:
 *                   type: string
 *                   nullable: true
 * 
 * /auth/login:
 *   post:
 *     summary: Autenticar utilizador
 *     description: Inicia sessão no sistema SNIGEVD e obtém tokens de acesso.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciais inválidas ou conta bloqueada
 * 
 * /auth/register/school:
 *   post:
 *     summary: Registar nova escola
 *     description: Cria uma nova conta de administrador de escola. A conta ficará com status PENDING até aprovação.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SchoolRegisterRequest'
 *     responses:
 *       201:
 *         description: Escola registada com sucesso
 *       400:
 *         description: Dados inválidos ou email já em uso
 * 
 * /auth/register/student:
 *   post:
 *     summary: Registar novo estudante
 *     description: Cria uma nova conta de estudante vinculada a uma escola.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRegisterRequest'
 *     responses:
 *       201:
 *         description: Estudante registado com sucesso
 *       400:
 *         description: Dados inválidos ou email já em uso
 * 
 * /auth/refresh:
 *   post:
 *     summary: Atualizar token de acesso
 *     description: Gera um novo accessToken usando um refreshToken válido.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: Token atualizado com sucesso
 *       401:
 *         description: Refresh token inválido ou expirado
 * 
 * /auth/me:
 *   get:
 *     summary: Obter perfil do utilizador
 *     description: Retorna os dados do utilizador autenticado através do token Bearer.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtido com sucesso
 *       401:
 *         description: Não autenticado
 */

router.post('/login', authRateLimiter, authController.login);
router.post('/register/school', authController.registerSchool);
router.post('/register/student', authController.registerStudent);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.getProfile);


export default router;
