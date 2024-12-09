import React from 'react';
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
function ProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
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
function LoginWrapper() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
  };

  return <Login onLoginSuccess={handleLoginSuccess} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/" replace />
            ) : (
              <LoginWrapper />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <ProtectedLayout>
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
            <ProtectedLayout>
              <DatabaseManagement />
            </ProtectedLayout>
          }
        />
        <Route
          path="/equipment"
          element={
            <ProtectedLayout>
              <Equipment />
            </ProtectedLayout>
          }
        />
        <Route
          path="/materials"
          element={
            <ProtectedLayout>
              <Materials />
            </ProtectedLayout>
          }
        />
        <Route
          path="/spare-parts"
          element={
            <ProtectedLayout>
              <SpareParts />
            </ProtectedLayout>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedLayout>
              <Maintenance />
            </ProtectedLayout>
          }
        />
        <Route
          path="/quotation"
          element={
            <ProtectedLayout>
              <Quotation />
            </ProtectedLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
