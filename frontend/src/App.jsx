import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vocabulary from './pages/Vocabulary';
import Reading from './pages/Reading';
import Speaking from './pages/Speaking';
import Writing from './pages/Writing';
import StudyPlan from './pages/StudyPlan';
import Profile from './pages/Profile';

// 布局组件
import Layout from './components/Layout';

// 样式
import './App.css';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#f5222d',
          fontSize: 14,
          borderRadius: 6,
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="vocabulary" element={<Vocabulary />} />
            <Route path="reading" element={<Reading />} />
            <Route path="speaking" element={<Speaking />} />
            <Route path="writing" element={<Writing />} />
            <Route path="study-plan" element={<StudyPlan />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
