CREATE DATABASE IF NOT EXISTS shield_tunnel_erp;
USE shield_tunnel_erp;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'technician') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 设备表
CREATE TABLE IF NOT EXISTS equipment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  serial_number VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('operational', 'maintenance', 'repair', 'idle') NOT NULL,
  last_maintenance DATE,
  next_maintenance DATE,
  location VARCHAR(100),
  specifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 材料表
CREATE TABLE IF NOT EXISTS materials (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(20) NOT NULL,
  minimum_stock INT NOT NULL,
  supplier VARCHAR(100),
  location VARCHAR(100),
  last_restocked DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 备件表
CREATE TABLE IF NOT EXISTS spare_parts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  part_number VARCHAR(50) UNIQUE NOT NULL,
  compatibility JSON NOT NULL,
  quantity INT NOT NULL,
  minimum_stock INT NOT NULL,
  supplier VARCHAR(100),
  location VARCHAR(100),
  last_used DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 维护记录表
CREATE TABLE IF NOT EXISTS maintenance_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  equipment_id INT NOT NULL,
  date DATE NOT NULL,
  type ENUM('routine', 'repair', 'emergency') NOT NULL,
  description TEXT,
  technician VARCHAR(100) NOT NULL,
  parts_used JSON,
  status ENUM('scheduled', 'in-progress', 'completed') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

-- 插入测试用户
INSERT INTO users (username, password, role) VALUES
('admin', '$2a$10$your_hashed_password', 'admin');