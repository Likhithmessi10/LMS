import { motion } from 'framer-motion';
import {
  Award, BookOpen, Calendar, CheckCircle2, Download, Star, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const history = [
  {
    id: 'H1', title: 'Safety Compliance & SOPs',
    completedOn: '2024-01-15', duration: '10h 20m',
    score: 95, certified: true, category: 'Safety',
  },
  {
    id: 'H2', title: 'Electrical Systems Fundamentals',
    completedOn: '2023-11-20', duration: '14h 05m',
    score: 88, certified: true, category: 'Engineering',
  },
  {
    id: 'H3', title: 'HR Compliance Training 2023',
    completedOn: '2023-09-10', duration: '7h 30m',
    score: 76, certified: false, category: 'HR',
  },
];

const categoryColors = {
  Safety:      'bg-emerald-100 text-emerald-700',
  Engineering: 'bg-blue-100 text-blue-700',
  IT:          'bg-purple-100 text-purple-700',
  HR:          'bg-orange-100 text-orange-700',
};

export default function TrainingHistory() {
  const totalHours = '31h 55m';
  const avgScore   = Math.round(history.reduce((s, h) => s + h.score, 0) / history.length);
  const certs      = history.filter(h => h.certified).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Training History</h2>
        <p className="text-sm text-slate-400 font-medium mt-1">A record of all completed training courses and earned certificates.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Courses Completed', value: history.length, icon: BookOpen, color: 'bg-primary' },
          { label: 'Total Hours',        value: totalHours,     icon: Calendar,  color: 'bg-amber-500' },
          { label: 'Avg. Score',         value: `${avgScore}%`, icon: TrendingUp,color: 'bg-emerald-500' },
          { label: 'Certificates',       value: certs,          icon: Award,     color: 'bg-purple-500' },
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

      {/* History List */}
      <div className="space-y-4">
        {history.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          >
            <Card className="glass border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon */}
                  <div className="p-4 bg-primary/5 text-primary rounded-2xl shrink-0 self-start sm:self-center">
                    <BookOpen size={24} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-900 dark:text-white">{item.title}</h3>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold', categoryColors[item.category] || 'bg-slate-100 text-slate-600')}>
                        {item.category}
                      </span>
                      {item.certified && (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                          <Award size={10} /> Certified
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Calendar size={12} /> Completed: {item.completedOn}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Duration: {item.duration}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-400">Final Score</span>
                          <span className={item.score >= 80 ? 'text-emerald-600' : 'text-orange-500'}>{item.score}%</span>
                        </div>
                        <Progress value={item.score} className="h-1.5" />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {item.certified && (
                      <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                        <Download size={14} /> Certificate
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      <Star size={14} /> View Details
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
