import jwt from 'jsonwebtoken';
import { z } from 'zod';
import pool from '../config/database.js';

// 验证登录数据
const loginSchema = z.object({
  username: z.string().min(1, '用户名不能为空'),
  password: z.string().min(6, '密码至少6个字符')
});

export const login = async (req, res) => {
  try {
    // 详细请求日志
    console.log('Login Request:', {
      body: req.body,
      headers: req.headers
    });

    // 验证请求数据
    const { username, password } = loginSchema.parse(req.body);

    console.log(`Attempting login for username: ${username}`);

    // 查询用户 - 添加更多异常处理
    let rows;
    try {
      // 使用连接池进行查询
      const [queryRows, queryFields] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      rows = queryRows;

      console.log('Raw Query Result:', {
        rows: queryRows,
        fields: queryFields,
        rowType: typeof queryRows,
        isArray: Array.isArray(queryRows)
      });
    } catch (queryError) {
      console.error('Database Query Error:', {
        message: queryError.message,
        stack: queryError.stack,
        sqlMessage: queryError.sqlMessage,
        sql: queryError.sql
      });
      return res.status(500).json({
        message: '数据库查询失败',
        details: queryError.message
      });
    }

    // 详细检查查询结果
    if (!rows) {
      console.error('Unexpected query result: rows is undefined or null');
      return res.status(500).json({
        message: '服务器错误',
        details: '查询结果未定义'
      });
    }

    // 确保 rows 是数组
    if (!Array.isArray(rows)) {
      console.error("Expected rows to be an array, but got:", {
        type: typeof rows,
        constructor: rows.constructor.name,
        keys: Object.keys(rows),
        stringRepresentation: String(rows)
      });
      return res.status(500).json({
        message: '服务器错误',
        details: '查询结果不是数组'
      });
    }

    // 如果没有找到用户，返回 401
    if (rows.length === 0) {
      console.warn(`Login attempt failed: User not found - ${username}`);
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    const user = rows[0]; // 获取查询到的用户

    // 详细用户查询日志
    console.log('User Query Result:', {
      userCount: rows.length,
      userData: {
        id: user.id,
        username: user.username,
        // 注意：不要在日志中打印敏感信息如密码
        role: user.role
      }
    });

    // 验证密码
    if (user.password !== password) {
      console.warn(`Login failed: Invalid password for user - ${username}`);
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 生成 JWT token
    let token;
    try {
      // 检查 JWT_SECRET 是否存在
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not定义');
      }

      token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
    } catch (tokenError) {
      console.error('Token generation error:', {
        message: tokenError.message,
        stack: tokenError.stack
      });
      return res.status(500).json({
        message: 'Token生成失败',
        details: tokenError.message
      });
    }

    console.log(`Successful login for user: ${username}`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    // 详细错误处理和日志
    console.error('Login Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: typeof error,
      keys: Object.keys(error)
    });

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
        details: error.errors
      });
    }

    res.status(500).json({
      message: '服务器错误',
      details: error.message
    });
  }
};
