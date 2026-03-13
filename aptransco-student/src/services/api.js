

















































// Mock Data
export const MOCK_COURSES = [
{
  id: '1',
  title: 'Advanced Grid Protection Systems',
  description: 'Learn the latest techniques in power grid protection, including relayout and fault analysis.',
  image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=300',
  category: 'Engineering',
  enrolled: true,
  progress: 65,
  totalModules: 3,
  completedModules: 2,
  instructor: 'Dr. Ramesh Kumar',
  modules: [
  {
    id: 'm1',
    title: 'Basics of Grid Stability',
    isUnlocked: true,
    isCompleted: true,
    videos: [{ id: 'v1', title: 'Introduction', url: 'https://youtube.com/...', duration: '10:00' }],
    notes: [{ id: 'n1', title: 'Grid Basics PDF', url: '#' }],
    quiz: { id: 'q1', passMark: 80, questions: [] }
  },
  {
    id: 'm2',
    title: 'Fault Analysis Part 1',
    isUnlocked: true,
    isCompleted: true,
    videos: [{ id: 'v2', title: 'Fault Analysis', url: 'https://youtube.com/...', duration: '15:00' }],
    notes: [{ id: 'n2', title: 'Fault Types Slide', url: '#' }],
    quiz: { id: 'q2', passMark: 80, questions: [] }
  },
  {
    id: 'm3',
    title: 'Advanced Protection Relays',
    isUnlocked: false,
    isCompleted: false,
    videos: [{ id: 'v3', title: 'Relay Logic', url: 'https://youtube.com/...', duration: '20:00' }],
    notes: [{ id: 'n3', title: 'Relay Schematic', url: '#' }],
    quiz: { id: 'q3', passMark: 85, questions: [] }
  }]

},
{
  id: '2',
  title: 'Transmission Line Maintenance',
  description: 'Comprehensive guide to maintaining high voltage transmission lines efficiently and safely.',
  image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=300',
  category: 'Engineering',
  enrolled: true,
  progress: 30,
  totalModules: 2,
  completedModules: 0,
  instructor: 'Smt. Lakshmi Devi',
  modules: []
},
{
  id: '3',
  title: 'Financial Management for Utilities',
  description: 'Understanding the financial aspects of public utility companies like APTRANSCO.',
  image: 'https://images.unsplash.com/photo-1554224155-8d23485d45d3?auto=format&fit=crop&q=80&w=300',
  category: 'Management',
  enrolled: false,
  progress: 0,
  totalModules: 5,
  completedModules: 0,
  instructor: 'Shri Venkat Rao',
  modules: []
}];


import axiosInstance from './axiosInstance';

export const api = {
  getCourses: async () => {
    try {
      const response = await axiosInstance.get('/api/courses/v1/courses/');
      return response.data.results.map((c) => ({
        ...c,
        image: c.media.course_image.uri,
        enrolled: true // For dev
      }));
    } catch (e) {
      console.warn('Real API failed, using mock data', e);
      await new Promise((r) => setTimeout(r, 600));
      return MOCK_COURSES;
    }
  },
  getCourse: async (id) => {
    try {
      // Fetching deep course structure (Blocks API)
      const response = await axiosInstance.get(`/api/courses/v1/blocks/?course_id=${id}&all_blocks=true&depth=all&requested_fields=student_view_data,graded`);
      // Transform logic would go here to map edX blocks to our Module/Video interface
      console.log('Real edX Blocks:', response.data);
      return MOCK_COURSES.find((c) => c.id === id) || null; // Return mock for now until mapping is verified
    } catch (e) {
      return MOCK_COURSES.find((c) => c.id === id) || null;
    }
  }
};