import React, { useState, useEffect } from 'react';
import { Plus, FileText, Download } from 'lucide-react';
import DataTable from '../components/DataTable';

interface ProjectType {
  id: number;
  name: string;
}

interface QuotationItem {
  itemType: 'equipment' | 'material' | 'spare_part';
  itemId: number;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface Quotation {
  id: number;
  projectName: string;
  projectType: string;
  diameter: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function Quotation() {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [diameter, setDiameter] = useState('');
  const [projectName, setProjectName] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [showForm, setShowForm] = useState(false);

  // 获取项目类型
  useEffect(() => {
    // TODO: 从API获取项目类型列表
  }, []);

  // 获取推荐配置
  const handleGetRecommendedItems = async () => {
    if (!selectedType || !diameter) return;
    // TODO: 从API获取推荐配置
  };

  // 添加物品
  const handleAddItem = () => {
    setItems([...items, {
      itemType: 'equipment',
      itemId: 0,
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }]);
  };

  // 删除物品
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // 更新物品
  const handleUpdateItem = (index: number, field: keyof QuotationItem, value: any) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      totalPrice: field === 'quantity' || field === 'unitPrice'
        ? value * (field === 'quantity' ? items[index].unitPrice : items[index].quantity)
        : items[index].totalPrice
    };
    setItems(newItems);
  };

  // 创建报价单
  const handleCreateQuotation = async () => {
    // TODO: 调用API创建报价单
  };

  // 导出报价单
  const handleExportQuotation = (id: number) => {
    // TODO: 导出报价单为PDF
  };

  const columns = [
    { header: '项目名称', accessor: 'projectName' as keyof Quotation },
    { header: '项目类型', accessor: 'projectType' as keyof Quotation },
    { header: '直径(m)', accessor: 'diameter' as keyof Quotation },
    {
      header: '总金额',
      accessor: 'totalAmount' as keyof Quotation,
      render: (value: number) => `¥${value.toLocaleString()}`
    },
    {
      header: '状态',
      accessor: 'status' as keyof Quotation,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          value === 'approved' ? 'bg-green-100 text-green-800' :
          value === 'rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value === 'approved' ? '已批准' :
           value === 'rejected' ? '已拒绝' :
           value === 'submitted' ? '已提交' : '草稿'}
        </span>
      )
    },
    {
      header: '操作',
      accessor: 'id' as keyof Quotation,
      render: (value: number) => (
        <button
          onClick={() => handleExportQuotation(value)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Download size={20} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">后配套报价系统</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          新建报价单
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                项目名称
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                项目类型
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">请选择项目类型</option>
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                盾构机直径(m)
              </label>
              <input
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">配置清单</h3>
              <div className="space-x-4">
                <button
                  onClick={handleGetRecommendedItems}
                  className="text-blue-600 hover:text-blue-800"
                >
                  获取推荐配置
                </button>
                <button
                  onClick={handleAddItem}
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
                >
                  添加物品
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <select
                    value={item.itemType}
                    onChange={(e) => handleUpdateItem(index, 'itemType', e.target.value)}
                    className="block w-32 rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="equipment">设备</option>
                    <option value="material">材料</option>
                    <option value="spare_part">备件</option>
                  </select>
                  
                  <input
                    type="text"
                    value={item.itemName}
                    onChange={(e) => handleUpdateItem(index, 'itemName', e.target.value)}
                    placeholder="物品名称"
                    className="block flex-1 rounded-md border-gray-300 shadow-sm"
                  />
                  
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(index, 'quantity', Number(e.target.value))}
                    placeholder="数量"
                    className="block w-24 rounded-md border-gray-300 shadow-sm"
                  />
                  
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleUpdateItem(index, 'unitPrice', Number(e.target.value))}
                    placeholder="单价"
                    className="block w-32 rounded-md border-gray-300 shadow-sm"
                  />
                  
                  <input
                    type="text"
                    value={item.totalPrice}
                    readOnly
                    className="block w-32 rounded-md border-gray-300 bg-gray-50"
                  />
                  
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleCreateQuotation}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              生成报价单
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">报价单列表</h2>
          <DataTable data={quotations} columns={columns} />
        </div>
      </div>
    </div>
  );
}