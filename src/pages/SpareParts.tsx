import React from 'react';
import { Plus, Search } from 'lucide-react';
import DataTable from '../components/DataTable';
import type { SparePart } from '../types';

const mockSpareParts: SparePart[] = [
  {
    id: '1',
    name: '主轴承',
    partNumber: 'BRG-001',
    compatibility: ['Shield-X2000', 'Shield-X3000'],
    quantity: 5,
    minimumStock: 3,
    supplier: '供应商C',
    location: '仓库B-01',
    lastUsed: '2024-02-20',
  },
  {
    id: '2',
    name: '液压泵',
    partNumber: 'HYD-002',
    compatibility: ['Shield-X2000'],
    quantity: 2,
    minimumStock: 2,
    supplier: '供应商D',
    location: '仓库B-02',
    lastUsed: '2024-03-01',
  },
];

export default function SpareParts() {
  const columns = [
    { header: '零件名称', accessor: 'name' as keyof SparePart },
    { header: '零件编号', accessor: 'partNumber' as keyof SparePart },
    {
      header: '适用型号',
      accessor: 'compatibility' as keyof SparePart,
      render: (value: string[]) => value.join(', '),
    },
    {
      header: '库存量',
      accessor: 'quantity' as keyof SparePart,
      render: (value: number, item: SparePart) => (
        <span className={value <= item.minimumStock ? 'text-red-600' : ''}>
          {value}
        </span>
      ),
    },
    { header: '最低库存', accessor: 'minimumStock' as keyof SparePart },
    { header: '供应商', accessor: 'supplier' as keyof SparePart },
    { header: '存放位置', accessor: 'location' as keyof SparePart },
    { header: '最后使用', accessor: 'lastUsed' as keyof SparePart },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">备品备件管理</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} />
          添加备件
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="搜索备件..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
            <select className="border rounded-lg px-4 py-2">
              <option value="">所有型号</option>
              <option value="Shield-X2000">Shield-X2000</option>
              <option value="Shield-X3000">Shield-X3000</option>
            </select>
          </div>
        </div>
        <DataTable data={mockSpareParts} columns={columns} />
      </div>
    </div>
  );
}