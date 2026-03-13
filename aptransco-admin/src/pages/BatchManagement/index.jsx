import { useState } from 'react';
import { Plus, Users, BookOpen, ChevronRight, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';


const mockBatches = [
{
  id: 'B1',
  name: 'Graduate Engineering Trainee - Batch 2024',
  students: 45,
  courses: [
  { id: 'C1', title: 'Cyber Security Essentials', progress: 85 },
  { id: 'C2', title: 'Grid Management 101', progress: 42 }],

  lastActive: '2 hours ago'
},
{
  id: 'B2',
  name: 'Operations & Maintenance Team - Zone 4',
  students: 120,
  courses: [
  { id: 'C1', title: 'Cyber Security Essentials', progress: 68 }],

  lastActive: 'Inside 24 hours'
},
{
  id: 'B3',
  name: 'Internship Batch - Summer 2024',
  students: 30,
  courses: [
  { id: 'C3', title: 'Power Distribution Systems', progress: 10 }],

  lastActive: 'Just now'
}];


const BatchManagement = () => {
  const [batches] = useState(mockBatches);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Batch Management</h2>
          <p className="text-slate-500 text-sm">Organize employees and interns into batches and assign curriculum.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
            <Plus size={18} /> Create New Batch
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {batches.map((batch, idx) =>
        <motion.div
          key={batch.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}>
          
            <Card className="glass border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded uppercase">Active Batch</span>
                      <span className="text-[10px] text-slate-400">ID: {batch.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                      {batch.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Users size={16} />
                      <span className="font-bold text-slate-700">{batch.students}</span> Students
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <BookOpen size={16} />
                      <span className="font-bold text-slate-700">{batch.courses.length}</span> Courses
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                      View Batch Dashboard <ChevronRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-4 border border-white/20">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                    Assigned Courses & Progress
                    <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors">
                      <Plus size={14} className="text-primary" />
                    </button>
                  </h4>
                  <div className="space-y-4">
                    {batch.courses.map((course) =>
                  <div key={course.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">{course.title}</span>
                          <span className="text-primary font-bold">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                      </div>
                  )}
                    {batch.courses.length === 0 &&
                  <p className="text-xs text-slate-400 italic">No courses assigned to this batch yet.</p>
                  }
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-between md:justify-center p-2 gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                        <MoreVertical size={20} />
                    </button>
                    <div className="text-center md:mt-auto">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Last Activity</p>
                        <p className="text-xs font-medium text-slate-600 italic">{batch.lastActive}</p>
                    </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>);

};

export default BatchManagement;