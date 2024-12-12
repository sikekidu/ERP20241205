import mysql from 'mysql2/promise'; // 使用 promise 版本
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize'; // 导入 Sequelize

// 加载环境变量
dotenv.config();

// 检查必要的环境变量
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`Environment variable ${varName} is not defined`);
    process.exit(1);
  }
});

// 创建 Sequelize 实例
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql' // 添加方言信息
});

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to database.');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
}

// 在应用程序启动时测试数据库连接
testDatabaseConnection();

// 导出连接池对象，以便在其他模块中使用
export default pool;
