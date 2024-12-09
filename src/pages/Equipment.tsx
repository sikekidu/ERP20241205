import React from 'react';
import { Plus, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import type { Equipment } from '../types';

const mockEquipment: Equipment[] = [
  {
    id: '1',
    name: 'TBM-001',
    model: 'Shield-X2000',
    serialNumber: 'SN20240001',
    status: 'operational',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-03-15',
    location: '工地A',
    specifications: {
      diameter: '6.5m',
      power: '2500kW',
    },
  },
  {
    id: '2',
    name: 'TBM-002',
    model: 'Shield-X2000',
    serialNumber: 'SN20240002',
    status: 'maintenance',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-04-01',
    location: '工地B',
    specifications: {
      diameter: '6.5m',
      power: '2500kW',
    },
  },
];

export default function Equipment() {
  const columns = [
    { header: '设备名称', accessor: 'name' as keyof Equipment },
    { header: '型号', accessor: 'model' as keyof Equipment },
    { header: '序列号', accessor: 'serialNumber' as keyof Equipment },
    {
      header: '状态',
      accessor: 'status' as keyof Equipment,
      render: (value: string) => <StatusBadge status={value} />,
    },
    { header: '位置', accessor: 'location' as keyof Equipment },
    { header: '上次维护', accessor: 'lastMaintenance' as keyof Equipment },
    { header: '下次维护', accessor: 'nextMaintenance' as keyof Equipment },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">设备管理</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          添加设备
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索设备..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <select className="border rounded-lg px-4 py-2">
              <option value="">所有状态</option>
              <option value="operational">运行中</option>
              <option value="maintenance">维护中</option>
              <option value="repair">维修中</option>
              <option value="idle">闲置</option>
            </select>
          </div>
        </div>
        <DataTable data={mockEquipment} columns={columns} />
      </div>
    </div>
  );
}