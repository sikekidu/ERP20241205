import React, { useState } from 'react';

const DatabaseManagement = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tableName, setTableName] = useState('');

  // 预定义的表名选项
  const tableOptions = [
    { value: 'goods_info', label: '货品信息表' },
    { value: 'supplier_info', label: '供应商信息表' },
    { value: 'customer_info', label: '客户信息表' },
    { value: 'order_info', label: '订单信息表' },
    { value: 'inventory_info', label: '库存信息表' },
    { value: 'shield_machine_info', label: '盾构机设备表' }
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      // 验证文件类型
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
      const validExtensions = ['.csv', '.xlsx', '.xls'];
      
      const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
      if (!validTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
        setError('请选择 CSV、XLSX 或 XLS 文件');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('请先选择一个文件');
      return;
    }

    if (!tableName) {
      setError('请选择要上传到的表');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tableName', tableName);

    try {
      const response = await fetch('http://localhost:3006/api/database/upload', {
        method: 'POST',
        body: formData,
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        throw new Error('服务器响应格式错误');
      }

      if (!response.ok) {
        throw new Error(responseData?.message || '上传失败');
      }

      alert('文件上传成功');
      
      // 清除已选择的文件
      setFile(null);
      if (document.querySelector<HTMLInputElement>('input[type="file"]')) {
        (document.querySelector<HTMLInputElement>('input[type="file"]')!).value = '';
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传过程中发生错误');
      // 出错时也要清除文件选择
      setFile(null);
      if (document.querySelector<HTMLInputElement>('input[type="file"]')) {
        (document.querySelector<HTMLInputElement>('input[type="file"]')!).value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">数据库管理</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择目标表
          </label>
          <select
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">请选择表</option>
            {tableOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            选择文件
          </label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".csv,.xlsx,.xls"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <button 
          onClick={handleUpload} 
          disabled={!file || !tableName || loading}
          className={`mt-4 px-4 py-2 rounded ${
            loading || !file || !tableName
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold`}
        >
          {loading ? '上传中...' : '上传文件'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseManagement;
