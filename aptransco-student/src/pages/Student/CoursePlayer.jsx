import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Menu,
  Play,
  FileText,
  HelpCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  RefreshCcw,
  ArrowLeft } from

'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizAttempt, setQuizAttempt] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(null);

  useEffect(() => {
    api.getCourse(courseId).then((data) => {
      setCourse(data);
      if (data && data.modules.length > 0) {
        // Find first incomplete module
        const firstIncomplete = data.modules.find((m) => !m.isCompleted && m.isUnlocked) || data.modules[0];
        setActiveModuleId(firstIncomplete.id);
      }
    });
  }, [courseId]);

  const activeModule = course?.modules.find((m) => m.id === activeModuleId);

  const handleOptionSelect = (qId, optIdx) => {
    setQuizAttempt((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const submitQuiz = () => {
    if (!activeModule) return;
    let correctCount = 0;
    activeModule.quiz.questions.forEach((q) => {
      if (quizAttempt[q.id] === q.correctAnswer) correctCount++;
    });

    const score = correctCount / activeModule.quiz.questions.length * 100;
    const passed = score >= activeModule.quiz.passMark;

    setQuizPassed(passed);
    setQuizSubmitted(true);

    if (passed) {


      // Logic for unlocking next module and marking current as complete
      // In a real app, this calls Open edX APIs
    }};
  if (!course) return <div className="p-8 text-center text-slate-500">Loading course player...</div>;

  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-950 z-[100] flex flex-col overflow-hidden">
      {/* Player Topbar */}
      <header className="h-16 border-b glass flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/catalog')}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-primary">
            
            <ArrowLeft size={20} />
          </button>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{course.title}</h1>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{course.completedModules}/{course.totalModules} Completed</span>
              <Progress value={course.completedModules / course.totalModules * 100} className="w-24 h-1" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "p-2.5 rounded-xl transition-all",
              sidebarOpen ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900"
            )}>
            
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-6 lg:p-12 relative">
          <AnimatePresence mode="wait">
            {activeModule ?
            <motion.div
              key={activeModule.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto space-y-12 pb-24">
              
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{activeModule.title}</h2>
                  <div className="w-20 h-1.5 bg-primary rounded-full"></div>
                </div>

                <Tabs defaultValue="video" className="w-full">
                  <TabsList className="bg-transparent border-b rounded-none w-full justify-start gap-8 h-12 p-0 mb-8 border-slate-200 dark:border-slate-800">
                    <TabsTrigger value="video" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 font-black text-[10px] uppercase tracking-widest h-full">
                      Video Lecture
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 font-black text-[10px] uppercase tracking-widest h-full">
                      Reading Materials
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-0 font-black text-[10px] uppercase tracking-widest h-full">
                      Module Assessment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="video" className="mt-0">
                    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={80} className="text-white opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer group-hover:scale-110 transition-transform duration-500" fill="white" />
                      </div>
                      <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-white text-xs font-bold drop-shadow-lg">
                        <span>00:00 / {activeModule.videos[0]?.duration || '10:00'}</span>
                        <div className="flex-1 h-1 bg-white/20 mx-8 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[30%]"></div>
                        </div>
                        <span>HD 1080p</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-0 space-y-6">
                    {activeModule.notes.map((note) =>
                  <div key={note.id} className="p-8 glass bg-white dark:bg-slate-900 rounded-[2rem] flex items-center justify-between group hover:border-primary/30 transition-all border border-transparent">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                            <FileText size={24} />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">{note.title}</h4>
                            <p className="text-xs text-slate-500 font-bold mt-1">PDF Document • 4.5 MB</p>
                          </div>
                        </div>
                        <button className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all">
                          Download Note
                        </button>
                      </div>
                  )}
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-0 space-y-8">
                    {!quizSubmitted ?
                  <div className="space-y-12">
                        <div className="p-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-[2rem]">
                          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-2">
                            <HelpCircle size={20} className="stroke-[2.5]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Attention Learner</span>
                          </div>
                          <p className="text-sm font-bold text-amber-900 dark:text-amber-300 leading-relaxed">
                            To unlock the next module, you must score at least <span className="text-primary underline decoration-2">{activeModule.quiz.passMark}%</span>. If you fail, you will be required to re-visit the lecture materials.
                          </p>
                        </div>

                        <div className="space-y-10">
                          {activeModule.quiz.questions.length > 0 ?
                      activeModule.quiz.questions.map((q, i) =>
                      <div key={q.id} className="space-y-6">
                                <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-start gap-4">
                                  <span className="text-primary opacity-30 text-3xl leading-none">{i + 1}</span>
                                  {q.question}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {q.options.map((opt, oi) =>
                          <button
                            key={oi}
                            onClick={() => handleOptionSelect(q.id, oi)}
                            className={cn(
                              "p-5 rounded-2xl border-2 text-left text-sm font-bold transition-all flex items-center gap-4",
                              quizAttempt[q.id] === oi ?
                              "bg-primary/5 border-primary text-primary" :
                              "bg-white dark:bg-slate-900/50 border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-600 dark:text-slate-400"
                            )}>
                            
                                      <div className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center font-black text-[10px]",
                              quizAttempt[q.id] === oi ? "bg-primary border-primary text-white" : "border-slate-200 text-slate-300"
                            )}>
                                        {String.fromCharCode(65 + oi)}
                                      </div>
                                      {opt}
                                    </button>
                          )}
                                </div>
                              </div>
                      ) :

                      <div className="p-12 text-center text-slate-400 font-bold italic bg-slate-100 dark:bg-slate-800 rounded-3xl">
                              Quiz builder placeholder in mock data. In a real course, questions appear here.
                            </div>
                      }
                        </div>

                        <button
                      onClick={submitQuiz}
                      className="w-full py-5 bg-primary text-white text-sm font-black rounded-2xl shadow-xl shadow-primary/20 hover:opacity-95 transition-all uppercase tracking-[0.2em]">
                      
                          Submit Assessment
                        </button>
                      </div> :

                  <div className="text-center space-y-8 animate-in zoom-in duration-500">
                        <div className={cn(
                      "w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl",
                      quizPassed ? "bg-emerald-500 shadow-emerald-500/30" : "bg-red-500 shadow-red-500/30"
                    )}>
                          {quizPassed ? <CheckCircle2 size={60} className="text-white" /> : <RefreshCcw size={60} className="text-white" />}
                        </div>
                        <div>
                          <h3 className={cn("text-4xl font-black uppercase tracking-tight", quizPassed ? "text-emerald-500" : "text-red-500")}>
                            {quizPassed ? 'Assessment Passed' : 'Assessment Failed'}
                          </h3>
                          <p className="text-slate-500 font-bold mt-2">
                            {quizPassed ?
                        "Excellent! You've successfully unlocked the next module." :
                        "You didn't reach the required pass mark. Please review the module material carefully."}
                          </p>
                        </div>
                        {!quizPassed &&
                    <button
                      onClick={() => {setQuizSubmitted(false);setQuizAttempt({});}}
                      className="px-12 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black rounded-2xl uppercase tracking-[0.2em] hover:scale-105 transition-transform">
                      
                            Re-listen & Retry
                          </button>
                    }
                        {quizPassed &&
                    <button
                      onClick={() => {/* Navigate hook */}}
                      className="px-12 py-4 bg-primary text-white text-xs font-black rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                      
                            Go to Next Module
                          </button>
                    }
                      </div>
                  }
                  </TabsContent>
                </Tabs>
              </motion.div> :

            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <PlayCircle size={64} className="opacity-10 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Select a unit to begin</p>
              </div>
            }
          </AnimatePresence>

          {/* Module Nav Buttons */}
          <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t z-50 flex items-center justify-center">
            <div className="max-w-4xl w-full px-6 flex items-center justify-between">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ChevronLeft size={16} /> Previous Unit
              </button>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                Next Unit <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Course Tree Sidebar */}
        <AnimatePresence>
          {sidebarOpen &&
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="w-80 border-l bg-white dark:bg-slate-950 flex flex-col shrink-0 z-[60]">
            
              <div className="p-6 border-b shrink-0">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Course Content</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {course.modules.map((module, idx) =>
              <button
                key={module.id}
                disabled={!module.isUnlocked}
                onClick={() => setActiveModuleId(module.id)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all relative group",
                  activeModuleId === module.id ?
                  "bg-slate-100 dark:bg-slate-900 border-primary shadow-lg shadow-primary/5" :
                  "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-100 dark:hover:border-slate-800",
                  !module.isUnlocked && "opacity-50 grayscale cursor-not-allowed"
                )}>
                
                    <div className="flex items-start gap-4">
                      <div className={cn(
                    "mt-0.5 p-1.5 rounded-lg shrink-0",
                    module.isCompleted ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  )}>
                        {module.isCompleted ? <CheckCircle2 size={12} /> : module.isUnlocked ? <Play size={12} /> : <Lock size={12} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Module {idx + 1}</p>
                        <p className={cn(
                      "text-xs font-bold leading-tight",
                      activeModuleId === module.id ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-500"
                    )}>{module.title}</p>
                      </div>
                    </div>
                    {!module.isUnlocked &&
                <div className="absolute top-4 right-4 text-slate-300">
                        <Lock size={14} />
                      </div>
                }
                  </button>
              )}
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </div>
    </div>);

};

// Fixed missing icon in exports/imports
const PlayCircle = ({ size = 24, className }) =>
<svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>;


export default CoursePlayer;