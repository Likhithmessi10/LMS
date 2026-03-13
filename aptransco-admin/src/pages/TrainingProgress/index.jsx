import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, Download, TrendingUp,
  CheckCircle2, Clock, AlertCircle, BookOpen
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';
import StatCard from '@/components/StatCard';

const statusConfig = {
  completed:   { label: 'Completed',   class: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  in_progress: { label: 'In Progress', class: 'bg-blue-50 text-blue-600 border-blue-100' },
  not_started: { label: 'Not Started', class: 'bg-slate-100 text-slate-500 border-slate-200' },
  overdue:     { label: 'Overdue',     class: 'bg-red-50 text-red-600 border-red-100' },
};

const departmentColors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

export default function TrainingProgress() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.getEmployees().then(data => {
      setEmployees(data);
      setLoading(false);
    });
  }, []);

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const avgCompletion = employees.length
    ? Math.round(employees.reduce((s, e) => s + (e.overallProgress || 0), 0) / employees.length)
    : 0;

  const stats = {
    total:       employees.length,
    completed:   employees.filter(e => (e.overallProgress || 0) === 100).length,
    in_progress: employees.filter(e => (e.overallProgress || 0) > 0 && (e.overallProgress || 0) < 100).length,
    overdue:     employees.filter(e => e.status === 'overdue').length,
  };

  // Dept breakdown chart
  const deptMap = {};
  employees.forEach(e => {
    const dept = e.department || 'General';
    if (!deptMap[dept]) deptMap[dept] = { dept, total: 0, avg: 0 };
    deptMap[dept].total++;
    deptMap[dept].avg += (e.overallProgress || 0);
  });
  const deptChart = Object.values(deptMap).map(d => ({ ...d, avg: Math.round(d.avg / d.total) }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Training Progress</h2>
          <p className="text-slate-500 text-sm">Track employee learning progress across all assigned courses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-lg text-sm font-medium hover:bg-slate-50">
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard index={0} title="Total Employees" value={stats.total}       icon={BookOpen}     color="blue" />
        <StatCard index={1} title="Completed All"   value={stats.completed}   icon={CheckCircle2} color="emerald" />
        <StatCard index={2} title="In Progress"     value={stats.in_progress} icon={Clock}        color="purple" />
        <StatCard index={3} title="Overdue"         value={stats.overdue}     icon={AlertCircle}  color="orange" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avg completion gauge */}
        <Card className="glass border-none shadow-sm flex flex-col items-center justify-center py-8">
          <div className="relative w-36 h-36">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" fill="none" />
              <circle
                cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="12"
                fill="none" className="text-primary"
                strokeDasharray={`${2 * Math.PI * 50 * avgCompletion / 100} ${2 * Math.PI * 50}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">{avgCompletion}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Avg. Progress</span>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">Overall Completion Rate</p>
        </Card>

        {/* Dept bar chart */}
        <Card className="glass border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Department-wise Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChart} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="dept" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v => [`${v}%`, 'Avg Progress']} />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                    {deptChart.map((_, i) => <Cell key={i} fill={departmentColors[i % departmentColors.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card className="glass border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
              {['all', 'completed', 'in_progress', 'overdue'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all whitespace-nowrap',
                    filterStatus === f
                      ? 'bg-white dark:bg-slate-700 shadow-sm text-primary'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  )}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border rounded-lg text-sm w-72 focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {loading ? (
              <div className="py-16 text-center text-slate-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400">No employees found.</div>
            ) : (
              filtered.map((emp, i) => (
                <motion.div
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button
                    onClick={() => setExpanded(expanded === emp.id ? null : emp.id)}
                    className="w-full text-left px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <p className="font-semibold text-sm">{emp.name}</p>
                          <span className={cn('text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase',
                            statusConfig[emp.overallProgress === 100 ? 'completed' : emp.overallProgress > 0 ? 'in_progress' : 'not_started']?.class || statusConfig.not_started.class
                          )}>
                            {emp.overallProgress === 100 ? 'Completed' : emp.overallProgress > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={emp.overallProgress || 0} className="h-1.5 flex-1" />
                          <span className="text-xs font-bold text-primary w-10 text-right">{emp.overallProgress || 0}%</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 hidden md:block">
                        <p className="text-xs font-bold">{emp.assignmentsCompleted}/{emp.totalAssignments}</p>
                        <p className="text-[10px] text-slate-400">Courses</p>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expanded === emp.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="px-6 pb-4 bg-slate-50/50 dark:bg-slate-800/20 border-t"
                    >
                      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                          <p className="font-medium">{emp.department || 'General'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                          <p className="font-medium">{emp.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Quiz Score</p>
                          <p className="font-medium text-emerald-600">{emp.avgScore || '—'}%</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {(emp.courses || []).map((c, ci) => (
                          <div key={ci} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 rounded-xl border">
                            <BookOpen size={16} className="text-primary shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-bold">{c.title}</p>
                              <Progress value={c.progress} className="h-1 mt-1" />
                            </div>
                            <span className="text-xs font-bold text-primary">{c.progress}%</span>
                          </div>
                        ))}
                        {!(emp.courses?.length) && (
                          <p className="text-xs text-slate-400 italic">No course details available.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
