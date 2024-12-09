import React from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  BarChart3,
  Wrench,
  Package,
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 设备状态卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">设备状态概览</h3>
            <Wrench className="text-blue-500" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">运行中</span>
              <span className="text-green-500 font-semibold">8台</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">维护中</span>
              <span className="text-yellow-500 font-semibold">2台</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">待修理</span>
              <span className="text-red-500 font-semibold">1台</span>
            </div>
          </div>
        </div>

        {/* 库存警告卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">库存预警</h3>
            <AlertTriangle className="text-yellow-500" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">材料低库存</span>
              <span className="text-yellow-500 font-semibold">5项</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">备件低库存</span>
              <span className="text-red-500 font-semibold">3项</span>
            </div>
          </div>
        </div>

        {/* 维护提醒卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">维护提醒</h3>
            <Clock className="text-purple-500" size={24} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">今日待维护</span>
              <span className="text-purple-500 font-semibold">2台</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">本周待维护</span>
              <span className="text-purple-500 font-semibold">5台</span>
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">设备利用率趋势</h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            图表区域 - 设备利用率趋势
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">维护成本分析</h3>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            图表区域 - 维护成本分析
          </div>
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">最近活动</h3>
        <div className="space-y-4">
          {[
            {
              title: '完成设备维护',
              description: 'TBM-001完成例行维护检查',
              time: '2小时前',
              type: 'maintenance',
            },
            {
              title: '材料入库',
              description: '刀具组件补充入库 x5',
              time: '4小时前',
              type: 'inventory',
            },
            {
              title: '设备告警',
              description: 'TBM-003液压系统压力异常',
              time: '昨天',
              type: 'alert',
            },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === 'maintenance'
                    ? 'bg-green-500'
                    : activity.type === 'inventory'
                    ? 'bg-blue-500'
                    : 'bg-red-500'
                }`}
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{activity.title}</h4>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}