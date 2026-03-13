import axiosInstance from './axiosInstance';
import { OPENEDX_CONFIG } from '../config/openedx';
import {
  mockInterns,
  mockEmployees,
  mockCourses,
  mockAnnouncements,
  mockSessions,
  mockTrainingCamps,
} from './mockData';

// ---------- Backend Base URL (FastAPI) ----------
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Simulated delay for mock operations
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ---------- In-memory state for mock mutations ----------
let _interns = [...mockInterns];
let _employees = [...mockEmployees];
let _camps = [...mockTrainingCamps];
let _announcements = [...mockAnnouncements];
let _sessions = [...mockSessions];

// ================================================================
// INTERNSHIP MANAGEMENT
// Reads from the existing aptransco DB via FastAPI /api/internships
// ================================================================
export const api = {
  getInternshipApplications: async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/api/internships/applications`);
      return res.data;
    } catch {
      await delay(500);
      return [..._interns];
    }
  },

  approveIntern: async (id) => {
    try {
      await axiosInstance.patch(`${API_BASE}/api/internships/applications/${id}/approve`);
    } catch {
      await delay(300);
    }
    _interns = _interns.map(i => i.id === id ? { ...i, status: 'approved' } : i);
    return true;
  },

  rejectIntern: async (id) => {
    try {
      await axiosInstance.patch(`${API_BASE}/api/internships/applications/${id}/reject`);
    } catch {
      await delay(300);
    }
    _interns = _interns.map(i => i.id === id ? { ...i, status: 'rejected' } : i);
    return true;
  },

  assignCourseToIntern: async (internId, courseId) => {
    try {
      await axiosInstance.post(`${API_BASE}/api/internships/applications/${internId}/assign-course`, { courseId });
    } catch {
      await delay(400);
    }
    return true;
  },

  // ================================================================
  // EMPLOYEE MANAGEMENT
  // ================================================================
  getEmployees: async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/api/employees`);
      return res.data;
    } catch {
      await delay(600);
      return [..._employees];
    }
  },

  createEmployee: async (data) => {
    try {
      const res = await axiosInstance.post(`${API_BASE}/api/employees`, data);
      _employees.push(res.data);
      return res.data;
    } catch {
      await delay(500);
      const newEmp = { ...data, id: `E${Date.now()}`, overallProgress: 0, assignmentsCompleted: 0, totalAssignments: 0, courses: [] };
      _employees.push(newEmp);
      return newEmp;
    }
  },

  importEmployeesCSV: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post(`${API_BASE}/api/employees/import-csv`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    } catch {
      await delay(1000);
      return { imported: Math.floor(Math.random() * 20 + 5), errors: [] };
    }
  },

  assignCourseToEmployee: async (employeeId, courseId) => {
    try {
      await axiosInstance.post(`${API_BASE}/api/employees/${employeeId}/assign-course`, { courseId });
    } catch {
      await delay(400);
      console.log(`Assigned course ${courseId} to employee ${employeeId}`);
    }
    return true;
  },

  getEmployeeProgress: async (employeeId) => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/api/employees/${employeeId}/progress`);
      return res.data;
    } catch {
      await delay(500);
      return _employees.find(e => e.id === employeeId) || null;
    }
  },

  // ================================================================
  // COURSE MANAGEMENT  (Open edX primary, mock fallback)
  // ================================================================
  getCourses: async () => {
    try {
      const response = await axiosInstance.get(`${OPENEDX_CONFIG.API_V1_BASE}/courses`);
      return response.data.results.map(course => ({
        id: course.id,
        title: course.name,
        category: course.org || 'General',
        duration: 'Self-paced',
        enrolledEmployees: 0,
        avgCompletion: 0,
        thumbnail: course.media?.image?.uri
          ? `${OPENEDX_CONFIG.BASE_URL}${course.media.image.uri}`
          : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800',
        description: course.short_description || 'No description available',
        modules: [],
      }));
    } catch {
      await delay(400);
      return [...mockCourses];
    }
  },

  getCourse: async (courseId) => {
    await delay(300);
    return mockCourses.find(c => c.id === courseId) || mockCourses[0];
  },

  createCourse: async (data) => {
    await delay(800);
    const newCourse = { ...mockCourses[0], ...data, id: `C${Date.now()}`, modules: [] };
    return newCourse;
  },

  // ================================================================
  // TRAINING CAMPS
  // ================================================================
  getTrainingCamps: async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/api/training-camps`);
      return res.data;
    } catch {
      await delay(400);
      return [..._camps];
    }
  },

  createTrainingCamp: async (data) => {
    try {
      const res = await axiosInstance.post(`${API_BASE}/api/training-camps`, data);
      _camps.push(res.data);
      return res.data;
    } catch {
      await delay(600);
      const newCamp = { ...data, id: `TC${Date.now()}`, enrolledCount: 0, status: 'upcoming' };
      _camps.push(newCamp);
      return newCamp;
    }
  },

  assignEmployeesToCamp: async (campId, employeeIds) => {
    try {
      await axiosInstance.post(`${API_BASE}/api/training-camps/${campId}/assign`, { employeeIds });
    } catch {
      await delay(500);
      console.log(`Assigned ${employeeIds.length} employees to camp ${campId}`);
    }
    return true;
  },

  // ================================================================
  // ANNOUNCEMENTS
  // ================================================================
  getAnnouncements: async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/api/announcements`);
      return res.data;
    } catch {
      await delay(400);
      return [..._announcements];
    }
  },

  createAnnouncement: async (data) => {
    try {
      const res = await axiosInstance.post(`${API_BASE}/api/announcements`, data);
      _announcements.unshift(res.data);
      return res.data;
    } catch {
      await delay(500);
      const newAnn = { ...data, id: `A${Date.now()}`, date: new Date().toISOString().slice(0, 10) };
      _announcements.unshift(newAnn);
      return newAnn;
    }
  },

  // ================================================================
  // LIVE SESSIONS
  // ================================================================
  getLiveSessions: async () => {
    try {
      const res = await axiosInstance.get(`${API_BASE}/api/live-sessions`);
      return res.data;
    } catch {
      await delay(400);
      return [..._sessions];
    }
  },

  createLiveSession: async (data) => {
    try {
      const res = await axiosInstance.post(`${API_BASE}/api/live-sessions`, data);
      _sessions.push(res.data);
      return res.data;
    } catch {
      await delay(500);
      const newSession = { ...data, id: `S${Date.now()}` };
      _sessions.push(newSession);
      return newSession;
    }
  },

  notifyEmployees: async (sessionId, employeeIds) => {
    try {
      await axiosInstance.post(`${API_BASE}/api/live-sessions/${sessionId}/notify`, { employeeIds });
    } catch {
      await delay(300);
      console.log(`Notified ${employeeIds.length} employees about session ${sessionId}`);
    }
    return true;
  },
};