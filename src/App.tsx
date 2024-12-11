import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import Materials from './pages/Materials';
import SpareParts from './pages/SpareParts';
import Maintenance from './pages/Maintenance';
import Quotation from './pages/Quotation';
import Settings from './pages/Settings';
import Login from './pages/Login';
import DatabaseManagement from './pages/DatabaseManagement'; // 导入数据库管理组件

// 简单的认证检查
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null; // 假设你使用 token 进行身份验证
};

// 受保护的路由组件
function ProtectedLayout({ children, setPageTitle }: { children: React.ReactNode; setPageTitle: (title: string) => void; }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setPageTitle={setPageTitle} /> {/* 传递 setPageTitle */}
      <div className="flex-1 ml-64">
        <Header />
        <main className="mt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// 包装Login组件以提供导航功能
function LoginWrapper({ setPageTitle }: { setPageTitle: (title: string) => void; }) {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // 强制更新状态以确保路由更新
    setPageTitle(''); // 触发状态更新
    navigate('/');
    window.location.reload(); // 刷新页面
  };

  return <Login onLoginSuccess={handleLoginSuccess} setPageTitle={setPageTitle} />;
}

function App() {
  const [pageTitle, setPageTitle] = useState(''); // 新增状态变量

  useEffect(() => {
    document.title = pageTitle ? `设备维保事业部_${pageTitle}` : '设备维保事业部'; // 更新文档标题
  }, [pageTitle]);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/" replace />
            ) : (
              <LoginWrapper setPageTitle={setPageTitle} />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <ProtectedLayout setPageTitle={setPageTitle}>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/database-management" // 新增数据库管理路由
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <DatabaseManagement />
            </ProtectedLayout>
          }
        />
        <Route
          path="/equipment"
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <Equipment />
            </ProtectedLayout>
          }
        />
        <Route
          path="/materials"
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <Materials />
            </ProtectedLayout>
          }
        />
        <Route
          path="/spare-parts"
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <SpareParts />
            </ProtectedLayout>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <Maintenance />
            </ProtectedLayout>
          }
        />
        <Route
          path="/quotation"
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <Quotation />
            </ProtectedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedLayout setPageTitle={setPageTitle}>
              <Settings />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
