import { prisma } from '../src/config/prisma.config.js';

async function testConnection() {
  try {
    console.log('🔗 Testando conexão com o banco de dados...');
    
    // Test raw connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
    
    // Get database info
    const result = await prisma.$queryRaw`
      SELECT version() as postgres_version;
    `;
    console.log('📊 Informações do banco:', result);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();