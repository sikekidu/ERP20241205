import React from 'react';
import { Plus, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import type { MaintenanceRecord } from '../types';

const mockMaintenance: MaintenanceRecord[] = [
  {
    id: '1',
    equipmentId: 'TBM-001',
    date: '2024-03-15',
    type: 'routine',
    description: '例行维护检查',
    technician: '张三',
    partsUsed: [
      { partId: '1', quantity: 1 },
    ],
    status: 'scheduled',
  },
  {
    id: '2',
    equipmentId: 'TBM-002',
    date: '2024-03-10',
    type: 'repair',
    description: '液压系统维修',
    technician: '李四',
    partsUsed: [
      { partId: '2', quantity: 1 },
    ],
    status: 'completed',
  },
];

export default function Maintenance() {
  const columns = [
    { header: '设备编号', accessor: 'equipmentId' as keyof MaintenanceRecord },
    { header: '日期', accessor: 'date' as keyof MaintenanceRecord },
    {
      header: '类型',
      accessor: 'type' as keyof MaintenanceRecord,
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'routine'
              ? '例行维护'
              : value === 'repair'
              ? '维修'
              : '紧急维修'
          }
        />
      ),
    },
    { header: '描述', accessor: 'description' as keyof MaintenanceRecord },
    { header: '技术员', accessor: 'technician' as keyof MaintenanceRecord },
    {
      header: '状态',
      accessor: 'status' as keyof MaintenanceRecord,
      render: (value: string) => (
        <StatusBadge
          status={
            value === 'scheduled'
              ? '已计划'
              : value === 'in-progress'
              ? '进行中'
              : '已完成'
          }
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">维护记录</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          添加记录
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索维护记录..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <select className="border rounded-lg px-4 py-2">
              <option value="">所有类型</option>
              <option value="routine">例行维护</option>
              <option value="repair">维修</option>
              <option value="emergency">紧急维修</option>
            </select>
            <select className="border rounded-lg px-4 py-2">
              <option value="">所有状态</option>
              <option value="scheduled">已计划</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已完成</option>
            </select>
          </div>
        </div>
        <DataTable data={mockMaintenance} columns={columns} />
      </div>
    </div>
  );
}