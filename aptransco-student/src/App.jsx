import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import Dashboard from '@/pages/Student/Dashboard';
import CourseCatalog from '@/pages/Student/CourseCatalog';
import CoursePlayer from '@/pages/Student/CoursePlayer';
import Certificates from '@/pages/Student/Certificates';
import ProgressTracker from '@/pages/Student/ProgressTracker';
import TrainingHistory from '@/pages/Student/TrainingHistory';
import AuthCallback from '@/pages/AuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route element={<MainLayout />}>
        <Route path="/"              element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/catalog"       element={<CourseCatalog />} />
        <Route path="/certificates"  element={<Certificates />} />
        <Route path="/progress"      element={<ProgressTracker />} />
        <Route path="/history"       element={<TrainingHistory />} />
      </Route>
      <Route path="/player/:courseId" element={<CoursePlayer />} />
      <Route path="*"                 element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;