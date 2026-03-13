import { useState } from 'react';
import { Plus, Video, Calendar as CalendarIcon, Clock, User, ExternalLink, MoreVertical, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';

const mockSessions = [
{ id: 'S1', title: 'Cyber Security Q&A Session', instructor: 'Dr. Emily Watson', date: '2024-03-15', time: '14:00 - 15:30', link: 'https://zoom.us/j/123456', status: 'upcoming', batch: 'Batch 2024' },
{ id: 'S2', title: 'Grid Operations Workshop', instructor: 'Mr. Rajesh Kumar', date: '2024-03-18', time: '10:00 - 12:00', link: 'https://meet.google.com/abc-def', status: 'upcoming', batch: 'All Zones' },
{ id: 'S3', title: 'Python for Power Systems', instructor: 'Prof. S. Murthy', date: '2024-03-10', time: '15:00 - 16:30', link: '#', status: 'completed', batch: 'Batch 2024' }];


const LiveSessions = () => {
  const [sessions] = useState(mockSessions);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Live Sessions</h2>
          <p className="text-slate-500 text-sm">Schedule and manage interactive live lectures and workshops.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
          <Plus size={18} /> Schedule New Session
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button className="px-4 py-1.5 rounded-md text-xs font-bold bg-white dark:bg-slate-700 shadow-sm text-primary">All Sessions</button>
          <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-700">Upcoming</button>
          <button className="px-4 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:text-slate-700">Recurrent</button>
        </div>
        
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search sessions..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary" />
          
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session, idx) =>
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}>
          
            <Card className={cn(
            "glass border-none shadow-sm overflow-hidden group hover:shadow-md transition-all relative",
            session.status === 'completed' ? "opacity-75 grayscale-[0.5]" : ""
          )}>
              <div className="h-2 w-full bg-gradient-to-r from-primary/50 via-primary to-indigo-500" />
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase",
                    session.status === 'upcoming' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                  )}>
                        {session.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{session.batch}</span>
                  </div>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                  {session.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User size={14} className="text-primary/70" />
                    <span className="font-medium">{session.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarIcon size={14} className="text-primary/70" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} className="text-primary/70" />
                    <span className="font-tabular-nums">{session.time}</span>
                  </div>
                </div>

                {session.status === 'upcoming' ?
              <a
                href={session.link}
                target="_blank"
                rel="noreferrer"
                className="w-full h-10 bg-primary/10 text-primary border border-primary/20 rounded-xl flex items-center justify-center gap-2 text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm">
                
                    <Video size={14} /> Join Session <ExternalLink size={12} />
                  </a> :

              <button disabled className="w-full h-10 bg-slate-100 text-slate-400 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold cursor-not-allowed">
                    Session Completed
                  </button>
              }
              </CardContent>
            </Card>
          </motion.div>
        )}

        <button className="h-full min-h-[250px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-full">
            <Plus size={24} />
          </div>
          <span className="text-sm font-bold">Schedule Session</span>
        </button>
      </div>
    </div>);

};

export default LiveSessions;