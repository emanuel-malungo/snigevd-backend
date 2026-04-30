import { prisma } from '../../config/prisma.config.js';
import { hashPassword, comparePassword } from '../../shared/utils/security.utils.js';
import { JwtStrategy } from '../../shared/utils/jwt.strategy.js';
import { RefreshStrategy } from '../../shared/utils/refresh.strategy.js';

import type { 
    LoginInput, 
    SchoolRegisterInput, 
    StudentRegisterInput, 
    RefreshTokenInput 
} from './auth.dto.js';
import type { 
    LoginResponse, 
    AuthUser, 
    JwtPayload,
    RefreshTokenResponse
} from '../../shared/types/auth.types.js';
import { Role, UserStatus } from '../../../generated/prisma/index.js';



export class AuthService {
    /**
     * Authenticate a user
     */
    async login(input: LoginInput): Promise<LoginResponse> {
        const user = await prisma.user.findUnique({
            where: { email: input.email },
            include: {
                school: true,
                studentProfile: true,
                institutionUser: true
            }
        });

        if (!user) {
            throw new Error('Credenciais inválidas');
        }

        if (user.status === UserStatus.BLOCKED) {
            throw new Error('Esta conta foi bloqueada. Por favor, contacte o administrador.');
        }

        if (user.status === UserStatus.PENDING) {
            throw new Error('Esta conta ainda está em aprovação.');
        }

        const isPasswordValid = await comparePassword(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas');
        }

        const payload: JwtPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = JwtStrategy.sign(payload);
        const refreshToken = RefreshStrategy.sign({ sub: user.id }); 

        const authUser: AuthUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            schoolId: user.school?.id,
            institutionId: user.institutionUser?.institutionId
        };


        return {
            accessToken,
            refreshToken,
            user: authUser
        };
    }

    /**
     * Register a new School
     */
    async registerSchool(input: SchoolRegisterInput): Promise<AuthUser> {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email }
        });

        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        const passwordHash = await hashPassword(input.password);

        const user = await prisma.user.create({
            data: {
                fullName: input.fullName,
                email: input.email,
                phone: input.phone,
                passwordHash,
                role: Role.SCHOOL_ADMIN,
                status: UserStatus.PENDING,
                school: {
                    create: {
                        schoolName: input.schoolName,
                        schoolNumber: input.schoolNumber,
                        decree: input.decree,
                        startYear: input.startYear,
                        educationLevel: input.educationLevel,
                        street: input.street,
                        municipality: input.municipality,
                        province: input.province,
                        contact: input.contact,
                        institutionalEmail: input.institutionalEmail,
                        passwordHash: passwordHash,
                        status: 'PENDING'
                    }
                }
            },
            include: {
                school: true
            }
        });

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            schoolId: user.school?.id
        };
    }

    /**
     * Register a new Student
     */
    async registerStudent(input: StudentRegisterInput): Promise<AuthUser> {
        const existingUser = await prisma.user.findUnique({
            where: { email: input.email }
        });

        if (existingUser) {
            throw new Error('Email já está em uso');
        }

        const passwordHash = await hashPassword(input.password);

        const user = await prisma.user.create({
            data: {
                fullName: input.fullName,
                email: input.email,
                phone: input.phone,
                passwordHash,
                role: Role.STUDENT,
                status: UserStatus.ACTIVE,
                studentProfile: {
                    create: {
                        biNumber: input.biNumber,
                        schoolId: input.schoolId
                    }
                }
            },
            include: {
                studentProfile: true
            }
        });

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status
        };
    }

    /**
     * Refresh access token
     */
    async refresh(input: RefreshTokenInput): Promise<RefreshTokenResponse> {
        try {
            const decoded = RefreshStrategy.verify(input.refreshToken);
            
            const user = await prisma.user.findUnique({
                where: { id: decoded.sub }
            });


            if (!user || user.status === UserStatus.BLOCKED) {
                throw new Error('Utilizador não encontrado ou bloqueado');
            }

            const payload: JwtPayload = {
                sub: user.id,
                email: user.email,
                role: user.role
            };

            const accessToken = JwtStrategy.sign(payload);

            return { accessToken };
        } catch (error) {
            throw new Error('Refresh token inválido ou expirado');
        }
    }

    /**
     * Get current user profile
     */
    async getProfile(userId: string): Promise<AuthUser> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                school: true,
                studentProfile: true,
                institutionUser: true
            }
        });

        if (!user) {
            throw new Error('Utilizador não encontrado');
        }

        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            status: user.status,
            schoolId: user.school?.id,
            institutionId: user.institutionUser?.institutionId
        };
    }
}
