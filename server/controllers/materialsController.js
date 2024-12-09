import { z } from 'zod';
import pool from '../config/database.js';

const materialSchema = z.object({
  name: z.string().min(1, '材料名称不能为空'),
  category: z.string().min(1, '类别不能为空'),
  quantity: z.number().min(0, '数量不能为负数'),
  unit: z.string().min(1, '单位不能为空'),
  minimumStock: z.number().min(0, '最低库存不能为负数'),
  supplier: z.string().optional(),
  location: z.string().optional()
});

// 获取所有材料
export const getAllMaterials = async (req, res) => {
  try {
    const [materials] = await pool.execute('SELECT * FROM materials ORDER BY created_at DESC');
    res.json(materials);
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个材料
export const getMaterialById = async (req, res) => {
  try {
    const [materials] = await pool.execute(
      'SELECT * FROM materials WHERE id = ?',
      [req.params.id]
    );
    
    if (materials.length === 0) {
      return res.status(404).json({ message: '材料不存在' });
    }
    
    res.json(materials[0]);
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建材料
export const createMaterial = async (req, res) => {
  try {
    const data = materialSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `INSERT INTO materials (name, category, quantity, unit, minimum_stock, supplier, location)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.category,
        data.quantity,
        data.unit,
        data.minimumStock,
        data.supplier,
        data.location
      ]
    );
    
    res.status(201).json({
      id: result.insertId,
      ...data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Create material error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新材料
export const updateMaterial = async (req, res) => {
  try {
    const data = materialSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `UPDATE materials 
       SET name = ?, category = ?, quantity = ?, unit = ?, 
           minimum_stock = ?, supplier = ?, location = ?
       WHERE id = ?`,
      [
        data.name,
        data.category,
        data.quantity,
        data.unit,
        data.minimumStock,
        data.supplier,
        data.location,
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '材料不存在' });
    }
    
    res.json({
      id: req.params.id,
      ...data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Update material error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除材料
export const deleteMaterial = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM materials WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '材料不存在' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};