-- 项目类型表
CREATE TABLE IF NOT EXISTS project_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 预设配置表
CREATE TABLE IF NOT EXISTS preset_configurations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_type_id INT NOT NULL,
  diameter_range_min DECIMAL(10,2) NOT NULL,
  diameter_range_max DECIMAL(10,2) NOT NULL,
  item_type ENUM('equipment', 'material', 'spare_part') NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  is_required BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_type_id) REFERENCES project_types(id)
);

-- 报价单表
CREATE TABLE IF NOT EXISTS quotations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  project_name VARCHAR(200) NOT NULL,
  project_type_id INT NOT NULL,
  diameter DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_type_id) REFERENCES project_types(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- 报价单明细表
CREATE TABLE IF NOT EXISTS quotation_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quotation_id INT NOT NULL,
  item_type ENUM('equipment', 'material', 'spare_part') NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quotation_id) REFERENCES quotations(id)
);

-- 插入基础项目类型数据
INSERT INTO project_types (name, description) VALUES
('泥水盾构', '适用于软土地层的泥水平衡盾构机项目'),
('土压平衡盾构', '适用于各类地层的土压平衡盾构机项目');