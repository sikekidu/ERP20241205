import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import pool from '../config/database.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 生成唯一的列名
function generateUniqueColumnName(originalName, index) {
  const baseColumnName = originalName
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '');
  
  const safeName = baseColumnName.replace(/_+/g, '_') || `col_${index + 1}`;
  
  return `${safeName}_${index + 1}`;
}

// 验证表名
function validateTableName(tableName) {
const validTables = [
  'goods_info',
  'supplier_info',
  'customer_info',
  'order_info',
  'inventory_info',
  '后配套报价', // 添加后配套报价表名
  'project_requirements', // 添加项目需求表名
  'slurry_project_requirements' // 添加泥水平衡盾构项目需求表名
];
  return validTables.includes(tableName);
}

// 处理文件上传
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '没有上传文件' });
  }

  const tableName = req.body.tableName;
  const projectType = req.body.projectType; // 获取项目类型
  if (!tableName) {
    return res.status(400).json({ message: '未指定表名' });
  }

  if (!validateTableName(tableName)) {
    return res.status(400).json({ message: '无效的表名' });
  }

  console.log('上传的文件:', req.file);
  console.log('目标表名:', tableName);
  
  const fileExtension = req.file.originalname.toLowerCase().slice(req.file.originalname.lastIndexOf('.'));
  
  try {
    let results = [];
    
    // 根据文件类型选择不同的处理方法
    if (fileExtension === '.csv') {
      results = await new Promise((resolve, reject) => {
        const data = [];
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => data.push(row))
          .on('end', () => resolve(data))
          .on('error', reject);
      });
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      results = xlsx.utils.sheet_to_json(worksheet);
    } else {
      throw new Error('不支持的文件类型');
    }

    if (results.length === 0) {
      throw new Error('文件中没有数据');
    }

    const originalColumns = Object.keys(results[0]);
    const columnMapping = {};
    const sqlColumns = originalColumns.map((col, index) => {
      const sqlColumnName = generateUniqueColumnName(col, index);
      columnMapping[col] = sqlColumnName;
      return sqlColumnName;
    });

    console.log('列名映射:', columnMapping);

    try {
      await pool.execute(`DROP TABLE IF EXISTS ${tableName}`);
    } catch (error) {
      console.log('删除表失败:', error);
    }

    const createTableSQL = `
      CREATE TABLE ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ${sqlColumns.map(col => `${col} TEXT`).join(', ')}
      )
    `;
    
    console.log('创建表 SQL:', createTableSQL);
    
    await pool.execute(createTableSQL);
    
    for (const row of results) {
      const values = originalColumns.map(col => {
        const value = row[col];
        return value === null || value === undefined ? null : String(value);
      });
      const placeholders = originalColumns.map(() => '?').join(', ');
      
      console.log('插入数据:', values);
      await pool.execute(
        `INSERT INTO ${tableName} (${sqlColumns.join(', ')}) VALUES (${placeholders})`,
        values
      );
    }

    fs.unlinkSync(req.file.path);
    
    res.status(200).json({ 
      message: '数据成功上传到数据库',
      rowCount: results.length,
      columnMapping,
      tableName
    });
  } catch (error) {
    console.error('处理文件错误:', error);
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      message: '处理文件失败', 
      details: error.message 
    });
  }
});

export default router;
