import React, { useState } from 'react';
import { Shield } from 'lucide-react';

// 定义登录数据类型
interface LoginData {
  username: string;
  password: string;
}

// 定义组件Props
interface LoginProps {
  onLoginSuccess: () => void; // 登录成功的回调函数
}

// 实际的API登录验证函数
const authenticateUser = async (credentials: LoginData): Promise<boolean> => {
  try {
    console.log('Sending login request with credentials:', credentials);
    
    const response = await fetch('http://localhost:3006/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Received response:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || '登录失败');
    }

    if (data.token) {
      // 存储JWT令牌
      localStorage.setItem('token', data.token);
      // 存储用户信息
      localStorage.setItem('user', JSON.stringify(data.user));
      return true; // 登录成功
    } else {
      throw new Error('未收到有效的登录令牌');
    }
  } catch (error) {
    console.error('Login error:', error);
    return false; // 登录失败
  }
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>(''); // 错误消息状态
  const [isLoading, setIsLoading] = useState<boolean>(false); // 加载状态

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // 重置错误消息
    setIsLoading(true); // 开始加载状态

    try {
      const isAuthenticated = await authenticateUser (formData);
      
      if (isAuthenticated) {
        // 登录成功，调用成功回调
        onLoginSuccess();
      } else {
        // 登录失败，显示错误消息
        setError('用户名或密码错误');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('登录出现异常，请稍后重试');
    } finally {
      setIsLoading(false); // 结束加载状态
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">盾构机ERP系统</h2>
          <p className="mt-2 text-sm text-gray-600">请登录以继续操作</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className ="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                忘记密码？
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
