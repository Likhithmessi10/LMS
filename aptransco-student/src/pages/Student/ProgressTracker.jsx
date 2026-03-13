import { motion } from 'framer-motion';
import {
  CheckCircle2, Lock, AlertCircle, BarChart2, Award, Clock, TrendingUp
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, RadialBarChart, RadialBar, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const courses = [
  {
    id: 'C001', title: 'Cyber Security Essentials',
    overallProgress: 65,
    modules: [
      { title: 'Grid Security Intro',  status: 'completed', score: 92, locked: false },
      { title: 'Network Protocols',    status: 'completed', score: 85, locked: false },
      { title: 'Threat Detection',     status: 'completed', score: 78, locked: false },
      { title: 'Incident Response',    status: 'in_progress', score: null, locked: false },
      { title: 'Compliance & SLAs',    status: 'locked', score: null, locked: true },
      { title: 'Final Assessment',     status: 'locked', score: null, locked: true },
    ]
  },
  {
    id: 'C002', title: 'Grid Operations 101',
    overallProgress: 30,
    modules: [
      { title: 'Power Grid Fundamentals', status: 'completed', score: 88, locked: false },
      { title: 'Substation Operations',   status: 'in_progress', score: null, locked: false },
      { title: 'Load Dispatch',           status: 'locked', score: null, locked: true },
      { title: 'Fault Analysis',          status: 'locked', score: null, locked: true },
    ]
  },
];

const statusStyle = {
  completed:   'bg-emerald-50 text-emerald-600 border-emerald-100',
  in_progress: 'bg-blue-50 text-blue-600 border-blue-100',
  locked:      'bg-slate-100 text-slate-400 border-slate-200',
};

const quizScores = [
  { module: 'M1', score: 92 },
  { module: 'M2', score: 85 },
  { module: 'M3', score: 78 },
];

export default function ProgressTracker() {
  const avgScore = Math.round(quizScores.reduce((s, q) => s + q.score, 0) / quizScores.length);

  const radialData = [{ name: 'Progress', value: 65, fill: '#6366f1' }];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Progress Tracker</h2>
        <p className="text-sm text-slate-400 font-medium mt-1">Track your learning progress module by module.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Overall Progress', value: '47%',      icon: TrendingUp,  color: 'bg-primary' },
          { label: 'Hours Learned',    value: '18.5h',    icon: Clock,        color: 'bg-amber-500' },
          { label: 'Avg. Quiz Score',  value: `${avgScore}%`, icon: BarChart2, color: 'bg-emerald-500' },
          { label: 'Certs Earned',     value: '1',         icon: Award,        color: 'bg-purple-500' },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass border-none shadow-sm hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn('p-3 rounded-2xl text-white shadow-lg', k.color)}><k.icon size={18} /></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{k.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radial progress */}
        <Card className="glass border-none shadow-sm flex flex-col items-center py-6">
          <CardHeader className="pb-2 w-full">
            <CardTitle className="text-base font-bold">Course Completion</CardTitle>
          </CardHeader>
          <CardContent className="w-full flex flex-col items-center">
            <div className="h-48 w-full">
              <ResponsiveContainer>
                <RadialBarChart innerRadius={50} outerRadius={90} data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={8} background />
                  <Tooltip formatter={v => [`${v}%`]} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-3xl font-black text-primary -mt-8">65%</p>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Avg. Completion</p>
          </CardContent>
        </Card>

        {/* Quiz score bar */}
        <Card className="glass border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Quiz Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer>
                <BarChart data={quizScores} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="module" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v => [`${v}%`, 'Score']} />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {quizScores.map((q, i) => (
                      <Cell key={i} fill={q.score >= 80 ? '#10b981' : q.score >= 60 ? '#f59e0b' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Module Progress Tables */}
      {courses.map((course, ci) => (
        <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}>
          <Card className="glass border-none shadow-sm overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold">{course.title}</CardTitle>
                <div className="flex items-center gap-3">
                  <Progress value={course.overallProgress} className="w-32 h-1.5" />
                  <span className="text-sm font-bold text-primary">{course.overallProgress}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {course.modules.map((mod, mi) => (
                  <div key={mi} className="flex items-center gap-4 px-6 py-4">
                    <div className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                      mod.status === 'completed' ? 'bg-emerald-500 text-white' :
                      mod.status === 'in_progress' ? 'bg-blue-500 text-white' :
                      'bg-slate-100 text-slate-400'
                    )}>
                      {mod.status === 'completed' ? <CheckCircle2 size={14} /> :
                       mod.status === 'in_progress' ? <AlertCircle size={14} /> :
                       <Lock size={14} />}
                    </div>
                    <div className="flex-1">
                      <p className={cn('text-sm font-semibold', mod.locked && 'text-slate-400')}>{mod.title}</p>
                      {mod.status === 'in_progress' && (
                        <p className="text-[10px] text-blue-500 font-bold mt-0.5">Currently Active</p>
                      )}
                    </div>
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase', statusStyle[mod.status])}>
                      {mod.status.replace('_', ' ')}
                    </span>
                    <div className="w-14 text-right">
                      {mod.score !== null ? (
                        <span className={cn('text-sm font-black', mod.score >= 80 ? 'text-emerald-600' : 'text-orange-500')}>
                          {mod.score}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
