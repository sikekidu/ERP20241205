import { z } from 'zod';
import pool from '../config/database.js';

const quotationSchema = z.object({
  projectName: z.string().min(1, '项目名称不能为空'),
  projectTypeId: z.number().positive('必须选择项目类型'),
  diameter: z.number().positive('直径必须为正数'),
  items: z.array(z.object({
    itemType: z.enum(['equipment', 'material', 'spare_part']),
    itemId: z.number().positive(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    notes: z.string().optional()
  }))
});

// 获取项目类型列表
export const getProjectTypes = async (req, res) => {
  try {
    const [types] = await pool.execute('SELECT * FROM project_types');
    res.json(types);
  } catch (error) {
    console.error('Get project types error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 根据项目类型和直径获取推荐配置
export const getRecommendedItems = async (req, res) => {
  try {
    const { projectTypeId, diameter } = req.query;
    
    const [items] = await pool.execute(
      `SELECT pc.*, 
              CASE pc.item_type
                WHEN 'equipment' THEN e.name
                WHEN 'material' THEN m.name
                WHEN 'spare_part' THEN sp.name
              END as item_name
       FROM preset_configurations pc
       LEFT JOIN equipment e ON pc.item_type = 'equipment' AND pc.item_id = e.id
       LEFT JOIN materials m ON pc.item_type = 'material' AND pc.item_id = m.id
       LEFT JOIN spare_parts sp ON pc.item_type = 'spare_part' AND pc.item_id = sp.id
       WHERE pc.project_type_id = ?
       AND ? BETWEEN pc.diameter_range_min AND pc.diameter_range_max`,
      [projectTypeId, diameter]
    );
    
    res.json(items);
  } catch (error) {
    console.error('Get recommended items error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建报价单
export const createQuotation = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const data = quotationSchema.parse(req.body);
    
    // 计算总金额
    const totalAmount = data.items.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );
    
    // 创建报价单
    const [quotationResult] = await connection.execute(
      `INSERT INTO quotations (project_name, project_type_id, diameter, 
                             total_amount, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.projectName,
        data.projectTypeId,
        data.diameter,
        totalAmount,
        req.user.id
      ]
    );
    
    const quotationId = quotationResult.insertId;
    
    // 创建报价单明细
    for (const item of data.items) {
      await connection.execute(
        `INSERT INTO quotation_items (quotation_id, item_type, item_id, 
                                    quantity, unit_price, total_price, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          quotationId,
          item.itemType,
          item.itemId,
          item.quantity,
          item.unitPrice,
          item.quantity * item.unitPrice,
          item.notes || null
        ]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({
      id: quotationId,
      ...data,
      totalAmount
    });
  } catch (error) {
    await connection.rollback();
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Create quotation error:', error);
    res.status(500).json({ message: '服务器错误' });
  } finally {
    connection.release();
  }
};

// 获取报价单列表
export const getQuotations = async (req, res) => {
  try {
    const [quotations] = await pool.execute(`
      SELECT q.*, pt.name as project_type_name, u.username as created_by_name
      FROM quotations q
      JOIN project_types pt ON q.project_type_id = pt.id
      JOIN users u ON q.created_by = u.id
      ORDER BY q.created_at DESC
    `);
    res.json(quotations);
  } catch (error) {
    console.error('Get quotations error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取报价单详情
export const getQuotationById = async (req, res) => {
  try {
    const [quotations] = await pool.execute(
      `SELECT q.*, pt.name as project_type_name, u.username as created_by_name
       FROM quotations q
       JOIN project_types pt ON q.project_type_id = pt.id
       JOIN users u ON q.created_by = u.id
       WHERE q.id = ?`,
      [req.params.id]
    );
    
    if (quotations.length === 0) {
      return res.status(404).json({ message: '报价单不存在' });
    }
    
    const quotation = quotations[0];
    
    // 获取报价单明细
    const [items] = await pool.execute(
      `SELECT qi.*, 
              CASE qi.item_type
                WHEN 'equipment' THEN e.name
                WHEN 'material' THEN m.name
                WHEN 'spare_part' THEN sp.name
              END as item_name
       FROM quotation_items qi
       LEFT JOIN equipment e ON qi.item_type = 'equipment' AND qi.item_id = e.id
       LEFT JOIN materials m ON qi.item_type = 'material' AND qi.item_id = m.id
       LEFT JOIN spare_parts sp ON qi.item_type = 'spare_part' AND qi.item_id = sp.id
       WHERE qi.quotation_id = ?`,
      [req.params.id]
    );
    
    res.json({
      ...quotation,
      items
    });
  } catch (error) {
    console.error('Get quotation error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};