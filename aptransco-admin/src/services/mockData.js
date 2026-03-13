// Mock Data for APTRANSCO LMS

export const mockInterns = [
  { id: '1', name: 'Rahul Sharma',  college: 'IIT Madras',   skills: ['React', 'NodeJS'],  status: 'pending',  dateApplied: '2024-03-10', degree: 'B.Tech CSE', cgpa: 8.9, phone: '9876543210' },
  { id: '2', name: 'Priya Patel',   college: 'BITS Pilani',  skills: ['Python', 'AI/ML'],  status: 'approved', dateApplied: '2024-03-08', degree: 'B.Tech EEE', cgpa: 9.2, phone: '9876543211' },
  { id: '3', name: 'Amit Kumar',    college: 'NIT Trichy',   skills: ['Java', 'Spring'],   status: 'rejected', dateApplied: '2024-03-05', degree: 'B.Tech CS',  cgpa: 7.5, phone: '9876543212' },
  { id: '4', name: 'Anjali Reddy',  college: 'JNTU Kakinada',skills: ['Python', 'Django'], status: 'pending',  dateApplied: '2024-03-11', degree: 'B.Tech EEE', cgpa: 8.1, phone: '9876543213' },
  { id: '5', name: 'Kiran Babu',    college: 'AU College',   skills: ['C++', 'Embedded'],  status: 'pending',  dateApplied: '2024-03-12', degree: 'B.Tech ECE', cgpa: 7.8, phone: '9876543214' },
];

export const mockEmployees = [
  { id: 'E001', name: 'John Doe',      email: 'john@aptransco.com',   department: 'IT',          enrolledCourses: ['C001'],        overallProgress: 75, assignmentsCompleted: 15, totalAssignments: 20, avgScore: 84, status: 'in_progress',
    courses: [{ title: 'Cyber Security Essentials', progress: 75 }, { title: 'Grid Operations 101', progress: 60 }] },
  { id: 'E002', name: 'Sarah Connor',  email: 'sarah@aptransco.com',  department: 'Operations',  enrolledCourses: ['C001','C002'], overallProgress: 40, assignmentsCompleted: 8,  totalAssignments: 25, avgScore: 72, status: 'in_progress',
    courses: [{ title: 'Safety Compliance', progress: 40 }] },
  { id: 'E003', name: 'Ravi Kumar',    email: 'ravi@aptransco.com',   department: 'Engineering', enrolledCourses: ['C001'],        overallProgress: 100, assignmentsCompleted: 20, totalAssignments: 20, avgScore: 91, status: 'completed',
    courses: [{ title: 'Electrical Systems', progress: 100 }] },
  { id: 'E004', name: 'Lakshmi Devi',  email: 'lakshmi@aptransco.com',department: 'HR',         enrolledCourses: ['C003'],        overallProgress: 0,   assignmentsCompleted: 0,  totalAssignments: 10, avgScore: null, status: 'not_started',
    courses: [{ title: 'HR Compliance 2025', progress: 0 }] },
  { id: 'E005', name: 'Suresh Babu',   email: 'suresh@aptransco.com', department: 'IT',          enrolledCourses: ['C001','C003'], overallProgress: 55, assignmentsCompleted: 11, totalAssignments: 20, avgScore: 78, status: 'in_progress',
    courses: [{ title: 'Cyber Security Essentials', progress: 65 }, { title: 'HR Compliance 2025', progress: 45 }] },
];

export const mockCourses = [
  {
    id: 'C001', title: 'Cyber Security Essentials',
    description: 'Protecting the grid infrastructure from digital threats.',
    category: 'IT/Security', duration: '20 hours',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800',
    enrolledEmployees: 120, avgCompletion: 68,
    modules: [
      {
        id: 'M1', title: 'Introduction to Grid Security',
        description: 'Basics of industrial control systems security.',
        isCompleted: true, isUnlocked: true,
        videos: [{ id: 'V1', title: 'Security Basics', url: 'https://youtube.com/watch?v=1', duration: '15:00' }],
        notes:  [{ id: 'N1', title: 'Basics PDF', url: '#' }],
        quiz: { id: 'Q1', passMark: 80, questions: [
          { id: 'q1', question: 'What does SCADA stand for?', options: ['Supervisory Control & Data Acquisition','Simple Control Domain Access','Secure Cloud Data Approach','System Cloud Automation'], correctAnswer: 0 },
          { id: 'q2', question: 'Which protocol is commonly used in industrial networks?', options: ['HTTP','Modbus','FTP','SMTP'], correctAnswer: 1 },
        ]}
      },
      {
        id: 'M2', title: 'Threat Detection & Response',
        description: 'Identifying and responding to cyber threats.',
        isCompleted: false, isUnlocked: false,
        videos: [{ id: 'V2', title: 'Threat Landscape', url: 'https://youtube.com/watch?v=2', duration: '18:00' }],
        notes:  [{ id: 'N2', title: 'Threats PDF', url: '#' }],
        quiz: { id: 'Q2', passMark: 80, questions: [] }
      },
    ]
  },
  {
    id: 'C002', title: 'Grid Operations 101',
    description: 'Fundamentals of electrical grid management and operations.',
    category: 'Operations', duration: '16 hours',
    thumbnail: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800',
    enrolledEmployees: 85, avgCompletion: 53,
    modules: [
      {
        id: 'M3', title: 'Power Grid Fundamentals',
        description: 'Understanding transmission and distribution.',
        isCompleted: false, isUnlocked: true,
        videos: [{ id: 'V3', title: 'Grid Basics', url: 'https://youtube.com/watch?v=3', duration: '20:00' }],
        notes:  [{ id: 'N3', title: 'Grid PDF', url: '#' }],
        quiz: { id: 'Q3', passMark: 75, questions: [
          { id: 'q3', question: 'What is the standard voltage for transmission lines in India?', options: ['11 kV','33 kV','220 kV','400 kV'], correctAnswer: 3 },
        ]}
      }
    ]
  },
  {
    id: 'C003', title: 'Safety Compliance & SOPs',
    description: 'APTRANSCO safety standards and standard operating procedures.',
    category: 'Safety', duration: '10 hours',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800',
    enrolledEmployees: 200, avgCompletion: 91,
    modules: [
      {
        id: 'M4', title: 'Safety First Principles',
        description: 'Core safety rules for field workers.',
        isCompleted: false, isUnlocked: true,
        videos: [{ id: 'V4', title: 'Safety Overview', url: 'https://youtube.com/watch?v=4', duration: '12:00' }],
        notes:  [{ id: 'N4', title: 'Safety Manual PDF', url: '#' }],
        quiz: { id: 'Q4', passMark: 90, questions: [] }
      }
    ]
  }
];

export const mockAnnouncements = [
  { id: 'A1', title: 'New Course Launch', description: 'Grid Management 101 is now live for all Operations staff.', targetAudience: 'all', date: '2024-03-12' },
  { id: 'A2', title: 'Safety Training Mandatory', description: 'All field employees must complete the Safety Compliance course by April 30.', targetAudience: 'employees', date: '2024-03-10' },
  { id: 'A3', title: 'Internship Batch 2024', description: 'The new internship batch has been assigned their training courses.', targetAudience: 'interns', date: '2024-03-08' },
];

export const mockSessions = [
  { id: 'S1', title: 'Cyber Security Q&A Live', instructor: 'Dr. R. Krishnamurthy', date: '2024-03-15', time: '14:00', link: 'https://zoom.us/j/123456' },
  { id: 'S2', title: 'Grid Operations Workshop', instructor: 'Eng. S. Prasad', date: '2024-03-18', time: '10:00', link: 'https://meet.google.com/abc-def-ghi' },
  { id: 'S3', title: 'HR Compliance Briefing', instructor: 'Ms. L. Devi', date: '2024-03-20', time: '15:30', link: 'https://teams.microsoft.com/l/meetup-join/123' },
];

export const mockTrainingCamps = [
  {
    id: 'TC1', name: 'Electrical Safety Training Camp',
    location: 'Hyderabad, APTRANSCO HQ',
    description: 'Intensive hands-on training on electrical safety protocols, emergency procedures, and equipment handling for field staff.',
    startDate: '2024-04-10', endDate: '2024-04-14',
    capacity: 50, enrolledCount: 32, status: 'upcoming'
  },
  {
    id: 'TC2', name: 'Transmission Line Maintenance Camp',
    location: 'Vijayawada, APEPDCL Grounds',
    description: 'Field training on high-voltage transmission line maintenance, tower climbing safety, and live-line working.',
    startDate: '2024-03-01', endDate: '2024-03-05',
    capacity: 30, enrolledCount: 28, status: 'completed'
  },
  {
    id: 'TC3', name: 'IT Systems & SCADA Bootcamp',
    location: 'Amaravati, AP State Data Center',
    description: 'Three-day hands-on bootcamp focusing on SCADA systems, ERP tools, and cybersecurity operations used by APTRANSCO.',
    startDate: '2024-03-25', endDate: '2024-03-27',
    capacity: 40, enrolledCount: 15, status: 'upcoming'
  },
];