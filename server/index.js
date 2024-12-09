import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import equipmentRoutes from './routes/equipment.js';
import customerRoutes from './routes/customer.js';
import materialsRoutes from './routes/materials.js';
import sparePartsRoutes from './routes/spareParts.js';
import maintenanceRoutes from './routes/maintenance.js';
import quotationRoutes from './routes/quotation.js';
import databaseManagementRoutes from './routes/databaseManagement.js'; // 导入数据库管理路由

dotenv.config();

const app = express();
const port = process.env.PORT;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码的请求体

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/spare-parts', sparePartsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/quotation', quotationRoutes);
app.use('/api/database', databaseManagementRoutes); // 注册数据库管理路由

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器错误' });
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
