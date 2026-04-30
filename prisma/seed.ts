import { PrismaClient, Role, UserStatus, SchoolStatus, InstitutionType, InstitutionLevel } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
    console.log('🌱 Iniciando seeding...');

    // Limpar banco de dados (Opcional - cuidado em produção)
    // await prisma.userPermission.deleteMany();
    // await prisma.rolePermission.deleteMany();
    // await prisma.permission.deleteMany();
    // await prisma.studentProfile.deleteMany();
    // await prisma.school.deleteMany();
    // await prisma.institutionUser.deleteMany();
    // await prisma.institution.deleteMany();
    // await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('admin123', 10);

    // 1. Criar Super Admin
    console.log('👤 Criando Super Admin...');
    const superAdmin = await prisma.user.upsert({
        where: { email: 'admin@snigevd.gov.ao' },
        update: {},
        create: {
            fullName: 'Super Administrador SNIGEVD',
            email: 'admin@snigevd.gov.ao',
            passwordHash,
            role: Role.SUPER_ADMIN,
            status: UserStatus.ACTIVE,
        }
    });

    // 2. Criar Instituições
    console.log('🏛️ Criando Instituições...');
    const med = await prisma.institution.upsert({
        where: { id: 'med-id-001' }, // Usando ID fixo para o seed facilitar relações
        update: {},
        create: {
            id: 'med-id-001',
            name: InstitutionType.MED,
            level: InstitutionLevel.NATIONAL,
            isActive: true,
        }
    });

    const mirex = await prisma.institution.upsert({
        where: { id: 'mirex-id-001' },
        update: {},
        create: {
            id: 'mirex-id-001',
            name: InstitutionType.MIREX,
            level: InstitutionLevel.NATIONAL,
            isActive: true,
        }
    });

    const gpel = await prisma.institution.upsert({
        where: { id: 'gpel-id-001' },
        update: {},
        create: {
            id: 'gpel-id-001',
            name: InstitutionType.GPEL,
            level: InstitutionLevel.PROVINCIAL,
            isActive: true,
        }
    });

    // 3. Criar Utilizadores Institucionais
    console.log('👥 Criando Utilizadores Institucionais...');
    await prisma.user.upsert({
        where: { email: 'diretor.med@snigevd.gov.ao' },
        update: {},
        create: {
            fullName: 'Diretor Nacional do MED',
            email: 'diretor.med@snigevd.gov.ao',
            passwordHash,
            role: Role.MED,
            status: UserStatus.ACTIVE,
            institutionUser: {
                create: {
                    institutionId: med.id,
                    position: 'Diretor Nacional',
                    department: 'Equivalências'
                }
            }
        }
    });

    await prisma.user.upsert({
        where: { email: 'consul.mirex@snigevd.gov.ao' },
        update: {},
        create: {
            fullName: 'Consul MIREX',
            email: 'consul.mirex@snigevd.gov.ao',
            passwordHash,
            role: Role.MIREX,
            status: UserStatus.ACTIVE,
            institutionUser: {
                create: {
                    institutionId: mirex.id,
                    position: 'Consul',
                    department: 'Assuntos Académicos'
                }
            }
        }
    });

    // 4. Criar Escolas (Aprovada e Pendente)
    console.log('🏫 Criando Escolas de Teste...');
    const schoolUser1 = await prisma.user.upsert({
        where: { email: 'admin.escola1@gmail.com' },
        update: {},
        create: {
            fullName: 'Admin Escola 01',
            email: 'admin.escola1@gmail.com',
            passwordHash,
            role: Role.SCHOOL_ADMIN,
            status: UserStatus.ACTIVE,
            school: {
                create: {
                    schoolName: 'Escola Secundária de Luanda',
                    schoolNumber: 'SCH-001',
                    decree: 'Dec. 45/2020',
                    startYear: 2000,
                    educationLevel: 'Secundário',
                    street: 'Rua Principal',
                    municipality: 'Luanda',
                    province: 'Luanda',
                    contact: '+244923000001',
                    institutionalEmail: 'geral@escola1.edu.ao',
                    passwordHash,
                    status: SchoolStatus.APPROVED
                }
            }
        },
        include: { school: true }
    });

    await prisma.user.upsert({
        where: { email: 'admin.escola2@gmail.com' },
        update: {},
        create: {
            fullName: 'Admin Escola 02',
            email: 'admin.escola2@gmail.com',
            passwordHash,
            role: Role.SCHOOL_ADMIN,
            status: UserStatus.PENDING,
            school: {
                create: {
                    schoolName: 'Colégio Nova Vida',
                    schoolNumber: 'SCH-002',
                    decree: 'Dec. 12/2022',
                    startYear: 2015,
                    educationLevel: 'Primário/Secundário',
                    street: 'Av. Brasil',
                    municipality: 'Belas',
                    province: 'Luanda',
                    contact: '+244923000002',
                    institutionalEmail: 'direcao@novavida.edu.ao',
                    passwordHash,
                    status: SchoolStatus.PENDING
                }
            }
        }
    });

    // 5. Criar Estudantes
    console.log('👨‍🎓 Criando Estudantes de Teste...');
    if (schoolUser1.school) {
        await prisma.user.upsert({
            where: { email: 'estudante1@gmail.com' },
            update: {},
            create: {
                fullName: 'António Manuel',
                email: 'estudante1@gmail.com',
                passwordHash,
                role: Role.STUDENT,
                status: UserStatus.ACTIVE,
                studentProfile: {
                    create: {
                        biNumber: '001234567LA041',
                        schoolId: schoolUser1.school.id
                    }
                }
            }
        });

        await prisma.user.upsert({
            where: { email: 'estudante2@gmail.com' },
            update: {},
            create: {
                fullName: 'Maria Isabel',
                email: 'estudante2@gmail.com',
                passwordHash,
                role: Role.STUDENT,
                status: UserStatus.ACTIVE,
                studentProfile: {
                    create: {
                        biNumber: '001234567LA042',
                        schoolId: schoolUser1.school.id
                    }
                }
            }
        });
    }

    // 6. Criar Permissões Padrão
    console.log('🔑 Criando Permissões Padrão...');
    const permissionsData = [
        { name: 'school:approve', module: 'Schools', action: 'APPROVE', description: 'Permite aprovar escolas' },
        { name: 'school:view', module: 'Schools', action: 'VIEW', description: 'Permite visualizar escolas' },
        { name: 'student:block', module: 'Students', action: 'BLOCK', description: 'Permite bloquear estudantes' },
        { name: 'student:view', module: 'Students', action: 'VIEW', description: 'Permite visualizar estudantes' },
        { name: 'user:manage', module: 'Users', action: 'MANAGE', description: 'Gestão completa de utilizadores' },
        { name: 'report:view', module: 'Reports', action: 'VIEW', description: 'Ver relatórios estatísticos' },
    ];

    for (const p of permissionsData) {
        await prisma.permission.upsert({
            where: { name: p.name },
            update: {},
            create: p
        });
    }

    // 7. Associar Permissões a Roles (Exemplo para Super Admin e MED)
    console.log('🔗 Associando Permissões...');
    const allPermissions = await prisma.permission.findMany();
    
    // Super Admin recebe tudo
    for (const p of allPermissions) {
        await prisma.rolePermission.upsert({
            where: { role_permissionId: { role: Role.SUPER_ADMIN, permissionId: p.id } },
            update: {},
            create: { role: Role.SUPER_ADMIN, permissionId: p.id }
        });
    }

    // MED recebe permissões de escola e estudante
    const medPermissions = allPermissions.filter(p => p.name.startsWith('school:') || p.name.startsWith('student:') || p.name === 'report:view');
    for (const p of medPermissions) {
        await prisma.rolePermission.upsert({
            where: { role_permissionId: { role: Role.MED, permissionId: p.id } },
            update: {},
            create: { role: Role.MED, permissionId: p.id }
        });
    }

    console.log('✅ Seeding concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
