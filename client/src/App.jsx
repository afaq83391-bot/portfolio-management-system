import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectForm from './pages/ProjectForm';
import Skills from './pages/Skills';
import SkillForm from './pages/SkillForm';
import Preview from './pages/Preview';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
   // In App.jsx, find this part and replace:
<div style={{
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f1f5f9'
}}>
  <div style={{
    width: 40, height: 40,
    border: '3px solid #e2e8f0',
    borderTopColor: '#d97706',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  }} />
</div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/projects/:id/edit" element={<ProjectForm />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/new" element={<SkillForm />} />
          <Route path="/skills/:id/edit" element={<SkillForm />} />
          <Route path="/preview" element={<Preview />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;