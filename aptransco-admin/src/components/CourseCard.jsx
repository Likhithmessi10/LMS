import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';











const CourseCard = ({ course, onEdit, onDelete, onOpenBuilder, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}>
      
      <Card className="glass group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
          <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-md text-[10px] font-bold text-primary uppercase tracking-wider">
            {course.category}
          </div>
          
          <div className="absolute top-3 right-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-white transition-colors outline-none">
                  <MoreVertical size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-40">
                <DropdownMenuItem onClick={() => onEdit(course.id)} className="cursor-pointer">
                  <Edit2 size={14} className="mr-2" /> Edit Info
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onOpenBuilder(course.id)} className="cursor-pointer">
                  <BookOpen size={14} className="mr-2" /> Open Builder
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(course.id)} className="cursor-pointer text-red-500 focus:text-red-500">
                  <Trash2 size={14} className="mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1">
              {course.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{course.description}</p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              {course.enrolledEmployees} Enrolled
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => onOpenBuilder(course.id)}
              className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
              
              <BookOpen size={14} /> Course Builder
            </button>
            <button className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-500 group-hover:text-primary transition-colors">
              <ExternalLink size={14} />
            </button>
          </div>
          
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000"
              style={{ width: `${course.avgCompletion}%` }} />
            
          </div>
          <p className="text-[10px] text-slate-400 text-center font-medium">Avg. Completion: {course.avgCompletion}%</p>
        </CardContent>
      </Card>
    </motion.div>);

};

export default CourseCard;