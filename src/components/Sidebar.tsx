import React from 'react';
import {
  LayoutDashboard,
  Wrench,
  Package,
  Component,
  ClipboardList,
  Settings,
  FileText
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/' },
  { icon: Wrench, label: '设备管理', path: '/equipment' },
  { icon: Package, label: '材料管理', path: '/materials' },
  { icon: Component, label: '备品备件', path: '/spare-parts' },
  { icon: ClipboardList, label: '维护记录', path: '/maintenance' },
  { icon: FileText, label: '后配套报价', path: '/quotation' },
  { icon: Settings, label: '系统设置', path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold mb-8">盾构机ERP系统</h1>
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}