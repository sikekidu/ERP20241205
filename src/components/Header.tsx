import React from 'react';
import { Bell, User } from 'lucide-react';

export default function Header() {
  // 从 localStorage 获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accountType = user.role || '访客'; // 从 users 表中获取的用户类型

  return (
    <header className="h-16 bg-white border-b fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 删除用户名显示 */}
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            {/* Bell 图标用于显示通知，红色圆点表示有未读通知 */}
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="text-sm">
              <p className="text-gray-500">{accountType}</p> {/* 显示用户类型 */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
