import pool from '../config/database.js';

export const getCustomerProjects = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT col_2_2 FROM shield_tunnel_erp.customer_info WHERE col_2_2 IS NOT NULL ORDER BY col_1_1'
    );
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: '获取客户项目失败' });
  }
};
