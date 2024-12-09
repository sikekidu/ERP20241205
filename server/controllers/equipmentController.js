import { z } from 'zod';
import pool from '../config/database.js';

const equipmentSchema = z.object({
  name: z.string().min(1, '设备名称不能为空'),
  model: z.string().min(1, '型号不能为空'),
  serialNumber: z.string().min(1, '序列号不能为空'),
  status: z.enum(['operational', 'maintenance', 'repair', 'idle']),
  location: z.string().optional(),
  specifications: z.record(z.string()).optional()
});

// 获取所有设备
export const getAllEquipment = async (req, res) => {
  try {
    const [equipment] = await pool.execute('SELECT * FROM equipment ORDER BY created_at DESC');
    res.json(equipment);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个设备
export const getEquipmentById = async (req, res) => {
  try {
    const [equipment] = await pool.execute(
      'SELECT * FROM equipment WHERE id = ?',
      [req.params.id]
    );
    
    if (equipment.length === 0) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    res.json(equipment[0]);
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建设备
export const createEquipment = async (req, res) => {
  try {
    const data = equipmentSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `INSERT INTO equipment (name, model, serial_number, status, location, specifications)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.model,
        data.serialNumber,
        data.status,
        data.location,
        JSON.stringify(data.specifications || {})
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
    console.error('Create equipment error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新设备
export const updateEquipment = async (req, res) => {
  try {
    const data = equipmentSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `UPDATE equipment 
       SET name = ?, model = ?, serial_number = ?, status = ?, 
           location = ?, specifications = ?
       WHERE id = ?`,
      [
        data.name,
        data.model,
        data.serialNumber,
        data.status,
        data.location,
        JSON.stringify(data.specifications || {}),
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    res.json({
      id: req.params.id,
      ...data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Update equipment error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除设备
export const deleteEquipment = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM equipment WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};