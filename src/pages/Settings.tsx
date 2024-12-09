import React from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">系统设置</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">通知设置</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>设备维护提醒</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>库存不足提醒</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span>设备状态变更提醒</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">库存警告阈值</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    材料最低库存警告（%）
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={20}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    备件最低库存警告（%）
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={30}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">维护计划设置</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    例行维护提前提醒天数
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={7}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    维护计划自动生成周期（天）
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    defaultValue={30}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
              <Save size={20} />
              保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}