import { useState } from 'react';
import { Plus, Megaphone, Users, Calendar, Filter, Trash2, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';

const mockAnnouncements = [
{ id: 'A1', title: 'New Course Launch: Grid Management 101', description: 'We are excited to announce that a new course on Grid Management is now live for all engineering trainees.', target: 'All', date: '2024-03-12', category: 'Educational' },
{ id: 'A2', title: 'Maintenance Window - LMS Portal', description: 'The learning portal will be down for scheduled maintenance on Sunday from 2:00 AM to 4:00 AM.', target: 'All', date: '2024-03-10', category: 'System' },
{ id: 'A3', title: 'Assessment Deadline Extension', description: 'The deadline for the Cyber Security Module 1 quiz has been extended by 3 days for Batch 2024.', target: 'Batch 2024', date: '2024-03-08', category: 'Urgent' }];


const Announcements = () => {
  const [announcements] = useState(mockAnnouncements);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Announcements</h2>
          <p className="text-slate-500 text-sm">Post updates, deadlines, and news to specific batches or everyone.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Placeholder */}
        <Card className="glass border-none shadow-sm lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-bold">New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Title</label>
              <input type="text" placeholder="Something important..." className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Target Audience</label>
              <select className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-lg text-sm outline-none">
                <option>All Students & Staff</option>
                <option>Batch 2024</option>
                <option>Team Zone 4</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Content</label>
              <textarea placeholder="Tell them what's happening..." className="w-full h-32 px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary resize-none" />
            </div>
          </CardContent>
          <CardFooter>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 dark:bg-primary text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity">
              <Send size={14} /> Post Announcement
            </button>
          </CardFooter>
        </Card>

        {/* Announcements List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sent History</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Filter size={16} /></button>
            </div>
          </div>
          
          {announcements.map((ann, idx) =>
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}>
            
              <Card className="glass border-none shadow-sm group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                      "p-2.5 rounded-xl border flex items-center justify-center shrink-0",
                      ann.category === 'Urgent' ? "bg-red-50 text-red-500 border-red-100" :
                      ann.category === 'System' ? "bg-slate-50 text-slate-500 border-slate-100" :
                      "bg-primary/5 text-primary border-primary/10"
                    )}>
                        <Megaphone size={20} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{ann.title}</h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">{ann.category}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{ann.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400">
                             <Users size={12} /> {ann.target}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-400">
                             <Calendar size={12} /> {formatDate(ann.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded text-slate-400 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

};

export default Announcements;