import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Clock, Award, Star, ArrowRight,
  PlayCircle, AlertCircle, CheckCircle2, Calendar
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

// Role can be: 'employee' | 'intern'
// For now we read from localStorage; the real app should use JWT context
const getRole = () => localStorage.getItem('lms_role') || 'employee';
const getUser = () => ({
  name: localStorage.getItem('lms_name') || 'Employee',
  id:   localStorage.getItem('lms_id')   || '#4920',
});

// ── Shared course data ────────────────────────────────────────────
const employeeCourses = [
  {
    id: 'C001', title: 'Cyber Security Essentials',
    instructor: 'Dr. R. Krishnamurthy',
    progress: 65, lastAccessed: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=300',
    totalModules: 10, completedModules: 6,
    deadline: '2024-05-01', mandatory: true,
  },
  {
    id: 'C002', title: 'Grid Operations 101',
    instructor: 'Eng. S. Prasad',
    progress: 30, lastAccessed: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=300',
    totalModules: 8, completedModules: 2,
    deadline: '2024-06-01', mandatory: true,
  },
];

const internCourse = {
  id: 'C003', title: 'Safety Compliance & SOPs',
  instructor: 'Ms. L. Devi',
  progress: 45,
  image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=300',
  totalModules: 6, completedModules: 3,
  nextQuiz: 'Module 4 Assessment',
  certStatus: 'in_progress', // 'not_started' | 'in_progress' | 'ready'
};

// ── Employee Dashboard ─────────────────────────────────────────────
function EmployeeDashboard({ user, navigate }) {
  const stats = [
    { title: 'Assigned Courses',  value: '2',   icon: BookOpen, color: 'bg-primary' },
    { title: 'Learning Hours',    value: '18.5', icon: Clock,    color: 'bg-amber-500' },
    { title: 'Certificates',      value: '1',    icon: Award,    color: 'bg-emerald-500' },
    { title: 'Avg. Progress',     value: '47%',  icon: Star,     color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative h-64 rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-indigo-600" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-8 right-12 w-20 h-20 bg-white/10 rounded-full blur-xl" />
        <div className="relative z-10 h-full p-10 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block backdrop-blur-md">
              Employee Portal
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-white/60 mt-2 text-sm font-medium">
              You have mandatory training courses to complete.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass shadow-none border-none hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn('p-3 rounded-2xl text-white shadow-lg', stat.color)}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Mandatory Courses */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mandatory Training</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Complete all assigned courses before deadlines</p>
          </div>
          <button onClick={() => navigate('/catalog')} className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest group">
            My Library <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {employeeCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
              onClick={() => navigate(`/player/${course.id}`)}
              className="cursor-pointer"
            >
              <Card className="glass shadow-none border-none overflow-hidden group hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-40 h-40 sm:h-auto overflow-hidden relative shrink-0">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={40} className="text-white drop-shadow-2xl" />
                    </div>
                    {course.mandatory && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-full uppercase tracking-wide">
                        Mandatory
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">In Progress</span>
                      <div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold ml-auto">
                        <Calendar size={10} /> Due: {course.deadline}
                      </div>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold mb-4">by {course.instructor}</p>
                    <div className="mt-auto space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                        <span>{course.progress}% Complete</span>
                        <span>{course.completedModules}/{course.totalModules} Modules</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-5">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { label: 'Completed Module 6: Threat Detection', time: '2 hours ago',  icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
            { label: 'Passed Assessment: Grid Security Basics', time: 'Yesterday',  icon: Award,        color: 'text-primary bg-primary/5' },
            { label: 'Started Course: Grid Operations 101',    time: '3 days ago',  icon: BookOpen,     color: 'text-amber-500 bg-amber-50' },
          ].map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800"
            >
              <div className={cn('p-2.5 rounded-xl', a.color)}><a.icon size={16} /></div>
              <p className="text-sm font-medium flex-1">{a.label}</p>
              <span className="text-[11px] text-slate-400 font-bold">{a.time}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Intern Dashboard ──────────────────────────────────────────────
function InternDashboard({ user, navigate }) {
  const certColors = {
    not_started: 'bg-slate-100 text-slate-500 border-slate-200',
    in_progress: 'bg-amber-50 text-amber-600 border-amber-200',
    ready:       'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative h-64 rounded-[2rem] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 h-full p-10 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
              Intern Portal
            </span>
            <h1 className="text-3xl font-black text-white">Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="text-white/60 mt-2 text-sm font-medium">Complete your assigned training to earn your certificate.</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: 'Progress',      value: `${internCourse.progress}%`, icon: Star,     color: 'bg-primary' },
          { title: 'Modules Done',  value: `${internCourse.completedModules}/${internCourse.totalModules}`, icon: BookOpen, color: 'bg-amber-500' },
          { title: 'Next Quiz',     value: 'Module 4',                  icon: AlertCircle, color: 'bg-orange-500' },
          { title: 'Certificate',   value: internCourse.certStatus === 'ready' ? 'Ready!' : 'Pending', icon: Award, color: 'bg-emerald-500' },
        ].map((stat, i) => (
          <motion.div key={stat.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass shadow-none border-none hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn('p-3 rounded-2xl text-white shadow-lg', stat.color)}><stat.icon size={18} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Assigned Training */}
      <section>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-5">Assigned Training</h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate(`/player/${internCourse.id}`)}
          className="cursor-pointer"
        >
          <Card className="glass shadow-none border-none overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-56 h-48 sm:h-auto overflow-hidden relative shrink-0">
                <img src={internCourse.image} alt={internCourse.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={52} className="text-white drop-shadow-2xl" />
                </div>
              </div>
              <div className="flex-1 p-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{internCourse.title}</h3>
                <p className="text-xs text-slate-400 font-bold mb-6">by {internCourse.instructor}</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Overall Progress</span><span className="text-primary">{internCourse.progress}%</span>
                    </div>
                    <Progress value={internCourse.progress} className="h-2" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-orange-500 font-bold">
                      <AlertCircle size={16} /> Next: {internCourse.nextQuiz}
                    </div>
                    <span className={cn('ml-auto text-xs px-3 py-1 rounded-full border font-bold', certColors[internCourse.certStatus])}>
                      Certificate: {internCourse.certStatus.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}

// ── Main Dashboard (role-aware) ───────────────────────────────────
const Dashboard = () => {
  const role = getRole();
  const user = getUser();
  const navigate = useNavigate();

  return role === 'intern'
    ? <InternDashboard user={user} navigate={navigate} />
    : <EmployeeDashboard user={user} navigate={navigate} />;
};

export default Dashboard;