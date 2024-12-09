import { z } from 'zod';
import pool from '../config/database.js';

const sparePartSchema = z.object({
  name: z.string().min(1, '备件名称不能为空'),
  partNumber: z.string().min(1, '备件编号不能为空'),
  compatibility: z.array(z.string()).min(1, '至少需要一个兼容型号'),
  quantity: z.number().min(0, '数量不能为负数'),
  minimumStock: z.number().min(0, '最低库存不能为负数'),
  supplier: z.string().optional(),
  location: z.string().optional()
});

// 获取所有备件
export const getAllSpareParts = async (req, res) => {
  try {
    const [spareParts] = await pool.execute('SELECT * FROM spare_parts ORDER BY created_at DESC');
    res.json(spareParts);
  } catch (error) {
    console.error('Get spare parts error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个备件
export const getSparePartById = async (req, res) => {
  try {
    const [spareParts] = await pool.execute(
      'SELECT * FROM spare_parts WHERE id = ?',
      [req.params.id]
    );
    
    if (spareParts.length === 0) {
      return res.status(404).json({ message: '备件不存在' });
    }
    
    res.json(spareParts[0]);
  } catch (error) {
    console.error('Get spare part error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建备件
export const createSparePart = async (req, res) => {
  try {
    const data = sparePartSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `INSERT INTO spare_parts (name, part_number, compatibility, quantity, 
                              minimum_stock, supplier, location)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.partNumber,
        JSON.stringify(data.compatibility),
        data.quantity,
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
    console.error('Create spare part error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新备件
export const updateSparePart = async (req, res) => {
  try {
    const data = sparePartSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `UPDATE spare_parts 
       SET name = ?, part_number = ?, compatibility = ?, quantity = ?, 
           minimum_stock = ?, supplier = ?, location = ?
       WHERE id = ?`,
      [
        data.name,
        data.partNumber,
        JSON.stringify(data.compatibility),
        data.quantity,
        data.minimumStock,
        data.supplier,
        data.location,
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '备件不存在' });
    }
    
    res.json({
      id: req.params.id,
      ...data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Update spare part error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除备件
export const deleteSparePart = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM spare_parts WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '备件不存在' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete spare part error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};