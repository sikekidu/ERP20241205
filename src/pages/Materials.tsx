import React from 'react';
import { Plus, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import type { Material } from '../types';

const mockMaterials: Material[] = [
  {
    id: '1',
    name: '刀具组件A型',
    category: '刀具',
    quantity: 50,
    unit: '套',
    minimumStock: 20,
    supplier: '供应商A',
    location: '仓库A-01',
    lastRestocked: '2024-03-01',
  },
  {
    id: '2',
    name: '密封圈B型',
    category: '密封件',
    quantity: 100,
    unit: '个',
    minimumStock: 50,
    supplier: '供应商B',
    location: '仓库A-02',
    lastRestocked: '2024-02-28',
  },
];

export default function Materials() {
  const columns = [
    { header: '材料名称', accessor: 'name' as keyof Material },
    { header: '类别', accessor: 'category' as keyof Material },
    {
      header: '库存量',
      accessor: 'quantity' as keyof Material,
      render: (value: number, item: Material) => (
        <span className={value <= item.minimumStock ? 'text-red-600' : ''}>
          {value} {item.unit}
        </span>
      ),
    },
    { header: '最低库存', accessor: 'minimumStock' as keyof Material },
    { header: '供应商', accessor: 'supplier' as keyof Material },
    { header: '存放位置', accessor: 'location' as keyof Material },
    { header: '最后入库', accessor: 'lastRestocked' as keyof Material },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">材料管理</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          添加材料
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索材料..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <select className="border rounded-lg px-4 py-2">
              <option value="">所有类别</option>
              <option value="刀具">刀具</option>
              <option value="密封件">密封件</option>
              <option value="液压件">液压件</option>
            </select>
          </div>
        </div>
        <DataTable data={mockMaterials} columns={columns} />
      </div>
    </div>
  );
}