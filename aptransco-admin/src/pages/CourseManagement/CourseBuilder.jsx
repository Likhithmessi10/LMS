import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Save,
  Eye,
  Globe,
  Settings,
  Plus,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  BookOpen } from
'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/services/api';

import { cn } from '@/lib/utils';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      const courses = await api.getCourses();
      const found = courses.find((c) => c.id === courseId);
      if (found) {
        setCourse(found);
        if (found.modules.length > 0) {
          setSelectedModuleId(found.modules[0].id);
        }
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  const selectedModule = course?.modules.find((m) => m.id === selectedModuleId);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading builder...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">Course not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.16))] -m-8">
      {/* Builder Header */}
      <div className="h-16 border-b glass flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/courses')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{course.title}</h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-bold uppercase">Draft</span>
              <span>Last saved 2 mins ago</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Eye size={16} /> Preview
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <Save size={16} /> Save
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 transition-opacity">
            <Globe size={16} /> Publish to Open edX
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Modules List */}
        <div className="w-80 border-r bg-slate-50/50 dark:bg-slate-900/50 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Modules</h3>
            <button className="p-1 hover:bg-slate-100 rounded text-primary transition-colors">
              <Plus size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {course.modules.map((module, idx) =>
            <button
              key={module.id}
              onClick={() => setSelectedModuleId(module.id)}
              className={cn(
                "w-full text-left p-3 rounded-xl border transition-all duration-200 group relative",
                selectedModuleId === module.id ?
                "bg-white dark:bg-slate-800 border-primary/30 shadow-sm ring-1 ring-primary/10" :
                "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              )}>
              
                <div className="flex items-start gap-3">
                  <div className={cn(
                  "mt-0.5 p-1.5 rounded-lg shrink-0",
                  selectedModuleId === module.id ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600"
                )}>
                    {module.isUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
                  </div>
                  <div>
                    <p className={cn(
                    "text-xs font-bold",
                    selectedModuleId === module.id ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"
                  )}>
                      Module {idx + 1}: {module.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Video size={10} /> {module.videos.length}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-400">
                        <FileText size={10} /> {module.notes.length}
                      </span>
                      {module.isCompleted &&
                    <span className="text-[10px] text-emerald-500 font-bold ml-auto">Passed</span>
                    }
                    </div>
                  </div>
                </div>
              </button>
            )}
            
            <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all text-xs font-bold flex items-center justify-center gap-2">
              <Plus size={16} /> Add Module
            </button>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-slate-950">
          {selectedModule ?
          <div className="flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedModule.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedModule.description}</p>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                  <Settings size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <Tabs defaultValue="content" className="w-full">
                  <div className="px-6 border-b bg-slate-50/30">
                    <TabsList className="bg-transparent border-none gap-8 h-14 p-0">
                      <TabsTrigger value="content" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold text-xs uppercase tracking-wider">
                        Videos & Notes
                      </TabsTrigger>
                      <TabsTrigger value="quiz" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold text-xs uppercase tracking-wider">
                        MCQ Assessment Gate
                      </TabsTrigger>
                      <TabsTrigger value="settings" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold text-xs uppercase tracking-wider">
                        Module Gating
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6 max-w-4xl mx-auto w-full">
                    <TabsContent value="content" className="space-y-8 mt-0">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Video size={18} className="text-primary" />
                            Lecture Videos
                          </h4>
                          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <Plus size={14} /> Add Video Link
                          </button>
                        </div>
                        <div className="space-y-3">
                          {selectedModule.videos.map((vid) =>
                        <div key={vid.id} className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50/50 hover:border-primary/20 transition-colors group">
                              <div className="p-2 bg-white rounded-lg border shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                                <Video size={18} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">{vid.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{vid.url}</p>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{vid.duration}</span>
                              <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition-all">
                                <GripVertical size={14} className="text-slate-400" />
                              </button>
                            </div>
                        )}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <FileText size={18} className="text-primary" />
                            Reading Material & Notes
                          </h4>
                          <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            <Plus size={14} /> Add Note/Link
                          </button>
                        </div>
                        <div className="space-y-3">
                          {selectedModule.notes.map((note) =>
                        <div key={note.id} className="flex items-center gap-4 p-4 border rounded-xl bg-slate-50/50 hover:border-primary/20 transition-colors group">
                              <div className="p-2 bg-white rounded-lg border shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                                <FileText size={18} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">{note.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{note.url}</p>
                              </div>
                              <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded transition-all">
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                        )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="quiz" className="space-y-6 mt-0">
                      <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                        <div className="p-4 bg-primary/5 text-primary rounded-full">
                          <HelpCircle size={32} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">Module Quiz (MCQ)</h4>
                          <p className="text-sm text-slate-500 max-w-sm mt-1">Students must pass this quiz to unlock the next module. Current pass mark: <span className="text-primary font-bold">{selectedModule.quiz.passMark}%</span></p>
                        </div>
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                          Launch Quiz Builder
                        </button>
                      </div>

                      <div className="space-y-4">
                        {selectedModule.quiz.questions.map((q, i) =>
                      <div key={q.id} className="p-4 border rounded-xl space-y-3 relative group">
                            <div className="flex items-start justify-between">
                              <p className="text-sm font-bold text-slate-800">Q{i + 1}: {q.question}</p>
                              <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded text-slate-400">
                                <Edit2 size={14} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, oi) =>
                          <div key={oi} className={cn(
                            "p-2 rounded-lg text-[10px] font-medium border",
                            q.correctAnswer === oi ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" : "bg-white border-slate-100 text-slate-500"
                          )}>
                                  {String.fromCharCode(65 + oi)}. {opt}
                                </div>
                          )}
                            </div>
                          </div>
                      )}
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0">
                      <Card className="border-none shadow-none">
                        <CardContent className="p-0 space-y-6">
                          <div className="flex items-center justify-between p-4 border rounded-xl bg-amber-50/50 border-amber-100">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <Unlock size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-amber-900">Module Pre-requisite</p>
                                <p className="text-xs text-amber-700">Student must pass "Basics of Grid" with 80% to access this.</p>
                              </div>
                            </div>
                            <button className="text-xs font-bold text-amber-900 hover:underline">Change</button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div> :

          <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <BookOpen size={48} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">Select a module to start editing</p>
              <p className="text-sm max-w-xs mt-1">Add lessons, reading materials and MCQ quizzes to build your course.</p>
            </div>
          }
        </div>
      </div>
    </div>);

};

export default CourseBuilder;