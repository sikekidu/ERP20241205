import { z } from 'zod';
import pool from '../config/database.js';

const maintenanceSchema = z.object({
  equipmentId: z.number().positive('设备ID必须为正数'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式必须为YYYY-MM-DD'),
  type: z.enum(['routine', 'repair', 'emergency']),
  description: z.string().min(1, '描述不能为空'),
  technician: z.string().min(1, '技术员不能为空'),
  partsUsed: z.array(z.object({
    partId: z.string(),
    quantity: z.number().positive()
  })).optional(),
  status: z.enum(['scheduled', 'in-progress', 'completed'])
});

// 获取所有维护记录
export const getAllMaintenanceRecords = async (req, res) => {
  try {
    const [records] = await pool.execute(`
      SELECT m.*, e.name as equipment_name 
      FROM maintenance_records m
      JOIN equipment e ON m.equipment_id = e.id
      ORDER BY m.date DESC
    `);
    res.json(records);
  } catch (error) {
    console.error('Get maintenance records error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取单个维护记录
export const getMaintenanceRecordById = async (req, res) => {
  try {
    const [records] = await pool.execute(
      `SELECT m.*, e.name as equipment_name 
       FROM maintenance_records m
       JOIN equipment e ON m.equipment_id = e.id
       WHERE m.id = ?`,
      [req.params.id]
    );
    
    if (records.length === 0) {
      return res.status(404).json({ message: '维护记录不存在' });
    }
    
    res.json(records[0]);
  } catch (error) {
    console.error('Get maintenance record error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 创建维护记录
export const createMaintenanceRecord = async (req, res) => {
  try {
    const data = maintenanceSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `INSERT INTO maintenance_records (equipment_id, date, type, description, 
                                     technician, parts_used, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.equipmentId,
        data.date,
        data.type,
        data.description,
        data.technician,
        JSON.stringify(data.partsUsed || []),
        data.status
      ]
    );
    
    // 如果是完成状态，更新设备的最后维护时间
    if (data.status === 'completed') {
      await pool.execute(
        'UPDATE equipment SET last_maintenance = ? WHERE id = ?',
        [data.date, data.equipmentId]
      );
    }
    
    res.status(201).json({
      id: result.insertId,
      ...data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Create maintenance record error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 更新维护记录
export const updateMaintenanceRecord = async (req, res) => {
  try {
    const data = maintenanceSchema.parse(req.body);
    
    const [result] = await pool.execute(
      `UPDATE maintenance_records 
       SET equipment_id = ?, date = ?, type = ?, description = ?, 
           technician = ?, parts_used = ?, status = ?
       WHERE id = ?`,
      [
        data.equipmentId,
        data.date,
        data.type,
        data.description,
        data.technician,
        JSON.stringify(data.partsUsed || []),
        data.status,
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '维护记录不存在' });
    }
    
    // 如果是完成状态，更新设备的最后维护时间
    if (data.status === 'completed') {
      await pool.execute(
        'UPDATE equipment SET last_maintenance = ? WHERE id = ?',
        [data.date, data.equipmentId]
      );
    }
    
    res.json({
      id: req.params.id,
      ...data
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Update maintenance record error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 删除维护记录
export const deleteMaintenanceRecord = async (req, res) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM maintenance_records WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '维护记录不存在' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete maintenance record error:', error);
    res.status(500).json({ message: '服务器错误' });
  }
};