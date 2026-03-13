import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import InternshipManagement from './pages/InternshipManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import CourseManagement from './pages/CourseManagement';
import CourseBuilder from './pages/CourseManagement/CourseBuilder';
import BatchManagement from './pages/BatchManagement';
import Announcements from './pages/Announcements';
import LiveSessions from './pages/LiveSessions';
import TrainingCamps from './pages/TrainingCamps';
import TrainingProgress from './pages/TrainingProgress';
import AuthCallback from '@/pages/AuthCallback';

function App() {
  return (
    <Routes>
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"         element={<Dashboard />} />
        <Route path="internships"       element={<InternshipManagement />} />
        <Route path="employees"         element={<EmployeeManagement />} />
        <Route path="courses"           element={<CourseManagement />} />
        <Route path="courses/:courseId/builder" element={<CourseBuilder />} />
        <Route path="batches"           element={<BatchManagement />} />
        <Route path="announcements"     element={<Announcements />} />
        <Route path="live-sessions"     element={<LiveSessions />} />
        <Route path="training-camps"    element={<TrainingCamps />} />
        <Route path="training-progress" element={<TrainingProgress />} />
      </Route>
    </Routes>
  );
}

export default App;