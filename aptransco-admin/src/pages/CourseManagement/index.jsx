import { useState, useEffect } from 'react';
import { Plus, Search, Grid, List as ListIcon } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { api } from '@/services/api';

import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await api.getCourses();
      setCourses(data);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Course Management</h2>
          <p className="text-slate-500 text-sm">Create and manage courses linked to Open edX and external resources.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mr-2">
            <button className="p-1.5 rounded-md bg-white dark:bg-slate-700 shadow-sm"><Grid size={16} /></button>
            <button className="p-1.5 rounded-md text-slate-500"><ListIcon size={16} /></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
            <Plus size={18} /> Create New Course
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search courses by title, category, or instructor..."
            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-full outline-none" />
          
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white dark:bg-slate-900 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20">
            <option>All Categories</option>
            <option>IT/Security</option>
            <option>Engineering</option>
            <option>Management</option>
          </select>
        </div>
      </div>

      {loading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) =>
        <div key={i} className="h-64 glass animate-pulse rounded-2xl" />
        )}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) =>
        <CourseCard
          key={course.id}
          course={course}
          index={idx}
          onEdit={() => {}}
          onDelete={() => {}}
          onOpenBuilder={(id) => navigate(`/courses/${id}/builder`)} />

        )}
        </div>
      }
    </div>);

};

export default CourseManagement;