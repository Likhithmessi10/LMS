import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, User, Play, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/services/api';

import { useNavigate } from 'react-router-dom';

const CourseCatalog = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const filtered = courses.filter((c) =>
  c.title.toLowerCase().includes(search.toLowerCase()) ||
  c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Browse Courses</h1>
          <p className="text-sm text-slate-500 font-bold mt-2">Explore the full curriculum of APTRANSCO Learning Portal</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm w-72 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
            
          </div>
          <button className="p-2.5 border rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Filter size={18} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {loading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) =>
        <div key={i} className="h-96 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
        )}
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course, i) =>
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          
              <Card className="glass shadow-none border-none overflow-hidden group hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 flex flex-col h-full border border-white/10">
                <div className="aspect-video overflow-hidden relative">
                  <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider shadow-xl dark:text-white">
                      {course.category}
                    </span>
                  </div>
                  {course.enrolled &&
              <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
                      <div className="p-1 px-3 bg-primary text-white text-[10px] font-black rounded-full flex items-center gap-1.5 shadow-lg shadow-primary/30 uppercase tracking-tighter">
                        <CheckCircle2 size={12} /> Enrolled
                      </div>
                    </div>
              }
                </div>

                <CardContent className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed uppercase tracking-wide">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      <User size={14} className="text-primary" />
                      {course.instructor}
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      <BookOpen size={14} className="text-primary" />
                      {course.totalModules} Units
                    </div>
                  </div>

                  <div className="mt-auto">
                    {course.enrolled ?
                <button
                  onClick={() => navigate(`/player/${course.id}`)}
                  className="w-full py-4 bg-primary text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest">
                  
                        Continue Learning <Play size={14} fill="white" />
                      </button> :

                <button className="w-full py-4 bg-white dark:bg-slate-800 border-2 border-primary/20 text-primary text-xs font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all uppercase tracking-widest">
                        Enroll Now
                      </button>
                }
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        )}
        </div>
      }
    </div>);

};

export default CourseCatalog;