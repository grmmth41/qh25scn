import React, { useState, useEffect } from "react";
import { Question, UserNote, QuizSession } from "./types";
import { QUESTIONS_DB } from "./data/questions";
import ReviewStats from "./components/ReviewStats";
import SessionHistory from "./components/SessionHistory";
import CornellNoteTaker from "./components/CornellNoteTaker";

import { 
  BookOpen, 
  Notebook, 
  TrendingUp, 
  History, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles, 
  Loader2, 
  AlertTriangle,
  Play,
  RotateCw,
  NotebookPen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<"quiz" | "notes" | "stats" | "history">("quiz");

  // Storage states
  const [userNotes, setUserNotes] = useState<UserNote[]>([]);
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  // Active quiz state
  const [quizMode, setQuizMode] = useState<"idle" | "active">("idle");
  const [quizType, setQuizType] = useState<"Mock" | "Module">("Mock");
  const [activeExamId, setActiveExamId] = useState<number | undefined>(undefined);
  const [selectedModule, setSelectedModule] = useState<number>(1);
  const [currentQuestionsQueue, setCurrentQuestionsQueue] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Practice instant review states (Only in Module mode)
  const [instantFeedbackSelected, setInstantFeedbackSelected] = useState<string | null>(null);
  const [aiExplanationLoading, setAiExplanationLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  
  // Quiz timer
  const [quizTimer, setQuizTimer] = useState(3600); // 60 mins in seconds
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);

  // Custom premium dialog box state
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const storedNotes = localStorage.getItem("digitalskills_takenotes");
    const storedSessions = localStorage.getItem("digitalskills_sessions");

    if (storedNotes) setUserNotes(JSON.parse(storedNotes));
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    } else {
      // Seed a default mockup quiz session so states are not empty and invite learning advice
      const seedSession: QuizSession = {
        id: "seed-1",
        date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        type: "Module",
        moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
        duration: 180,
        score: 80,
        correctCount: 4,
        totalCount: 5,
        answers: {
          1: "B", // Right
          2: "B", // Right
          3: "C", // Right
          4: "A", // Wrong (True: B)
          25: "C" // Right
        }
      };
      setSessions([seedSession]);
      localStorage.setItem("digitalskills_sessions", JSON.stringify([seedSession]));
    }
  }, []);

  // Timer effect for Active Mock quiz
  useEffect(() => {
    let interval: any = null;
    if (quizMode === "active" && quizType === "Mock" && !submitted) {
      interval = setInterval(() => {
        setQuizTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishQuiz(true); // auto submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerIntervalId(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizMode, quizType, submitted]);

  // Take note Save handler
  const savePersonalNote = (questionId: number, content: string, format: "Cornell" | "Standard" | "Mnemonic" | "ActiveRecall" = "Standard") => {
    const updatedNotes = userNotes.filter(n => n.questionId !== questionId);
    updatedNotes.push({
      questionId,
      content,
      format,
      updatedAt: new Date().toISOString()
    });
    setUserNotes(updatedNotes);
    localStorage.setItem("digitalskills_takenotes", JSON.stringify(updatedNotes));
  };

  // Delete take note handler
  const deletePersonalNote = (questionId: number) => {
    const updatedNotes = userNotes.filter(n => n.questionId !== questionId);
    setUserNotes(updatedNotes);
    localStorage.setItem("digitalskills_takenotes", JSON.stringify(updatedNotes));
  };

  // Launch pre-exam queues
  const startQuiz = (type: "Mock" | "Module", moduleNo?: number, examNo?: number) => {
    setQuizType(type);
    setSubmitted(false);
    setUserAnswers({});
    setInstantFeedbackSelected(null);
    setAiExplanation(null);
    setCurrentIdx(0);
    setIsConfirmSubmitOpen(false);
    setActiveExamId(examNo);
    
    let pool: Question[] = [];
    if (type === "Mock") {
      setQuizTimer(3600); // 60 minutes for driving test simulation
      if (examNo) {
        // Deterministic shuffle for Exam 1-14 using a reproducible seed
        const order = [...QUESTIONS_DB];
        let seed = examNo * 997;
        for (let i = order.length - 1; i > 0; i--) {
          seed = (seed * 9301 + 49297) % 233280;
          const j = Math.floor((seed / 233280) * (i + 1));
          const temp = order[i];
          order[i] = order[j];
          order[j] = temp;
        }
        pool = order;
      } else {
        // Shuffled combination of all questions in QUESTIONS_DB (which has exactly 40 unique items)
        pool = [...QUESTIONS_DB].sort(() => 0.5 - Math.random());
      }
    } else {
      const mod = moduleNo || selectedModule;
      pool = QUESTIONS_DB.filter(q => q.module === mod).sort(() => 0.5 - Math.random());
    }

    setCurrentQuestionsQueue(pool);
    setQuizMode("active");
  };

  // Answer selection in active quiz
  const handleSelectAnswer = (optionKey: string) => {
    if (submitted) return;

    const activeQuestion = currentQuestionsQueue[currentIdx];
    
    // In practice module mode, give immediate response + explanation
    if (quizType === "Module") {
      setInstantFeedbackSelected(optionKey);
      setUserAnswers(prev => ({ ...prev, [activeQuestion.id]: optionKey }));
    } else {
      // In Mock exam mode, just record response and let user select another anytime
      setUserAnswers(prev => ({ ...prev, [activeQuestion.id]: optionKey }));
    }
  };

  // Explain response using Gemini AI on backend
  const fetchAiExplanation = async () => {
    const activeQuestion = currentQuestionsQueue[currentIdx];
    const userAns = userAnswers[activeQuestion.id] || "Chưa chọn";
    
    setAiExplanationLoading(true);
    setAiExplanation(null);

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestion.text,
          userAnswer: userAns,
          correctKey: activeQuestion.correctKey,
          difficulty: activeQuestion.difficulty,
          moduleName: activeQuestion.moduleName,
          options: activeQuestion.options
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp sự cố giải thích từ AI.");
      }
      setAiExplanation(data.text);
    } catch (err: any) {
      setAiExplanation(`⚠️ Không thể kết nối AI: ${err.message}. Bạn có thể xem lời giải chuẩn hóa cực kỳ đầy đủ ngay bên dưới!`);
    } finally {
      setAiExplanationLoading(false);
    }
  };

  // Submit/Finish quiz
  const finishQuiz = (autoTriggered = false) => {
    if (submitted) return;

    if (timerIntervalId) clearInterval(timerIntervalId);
    setSubmitted(true);
    setIsConfirmSubmitOpen(false);

    // Calculate score
    let correctCount = 0;
    currentQuestionsQueue.forEach(q => {
      if (userAnswers[q.id] === q.correctKey) {
        correctCount++;
      }
    });

    const totalCount = currentQuestionsQueue.length;
    const score = Math.round((correctCount / totalCount) * 100);
    const duration = quizType === "Mock" ? (3600 - quizTimer) : 45 * totalCount; // elapsed seconds in Mock

    // Add session history
    const newSession: QuizSession = {
      id: "session_" + Date.now(),
      date: new Date().toISOString(),
      type: quizType,
      examId: activeExamId,
      moduleName: quizType === "Module" ? currentQuestionsQueue[0]?.moduleName : undefined,
      duration,
      score,
      correctCount,
      totalCount,
      answers: userAnswers
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem("digitalskills_sessions", JSON.stringify(updatedSessions));
  };

  // Nav helper from dashboard list click
  const handleQuickQuizFromStats = (moduleNo?: number) => {
    setActiveTab("quiz");
    if (moduleNo) {
      setSelectedModule(moduleNo);
      startQuiz("Module", moduleNo);
    } else {
      startQuiz("Mock");
    }
  };

  const answeredCount = currentQuestionsQueue.filter(q => !!userAnswers[q.id]).length;

  const getExamStatus = (examNum: number) => {
    const examSessions = sessions.filter(s => s.type === "Mock" && s.examId === examNum);
    if (examSessions.length === 0) return { status: "Chưa làm", score: null, passed: null };
    // Find highest score
    const bestSession = [...examSessions].sort((a,b) => b.score - a.score)[0];
    const passed = bestSession.correctCount >= 32;
    return {
      status: passed ? "ĐẠT" : "KHÔNG ĐẠT",
      score: `${bestSession.correctCount}/${bestSession.totalCount}`,
      passed
    };
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col">
      {/* Visual Navigation Header Banner with Bento Accents */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex flex-col cursor-pointer justify-center" onClick={() => { setQuizMode("idle"); setActiveTab("quiz"); }}>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                <span className="bg-slate-900 text-white rounded-lg px-2 py-1 text-base sm:text-lg font-black tracking-widest">DS</span>
                <span>EduMind <span className="text-indigo-650">Luyện Đề</span></span>
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 block">
                Hệ ôn luyện thi trắc nghiệm Năng Lực Số &amp; AI
              </p>
            </div>

            {/* Profile & Streak details styled precisely like Bento mockup */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase">TIẾN ĐỘ THI CỬ</span>
                <span className="text-xs font-bold text-emerald-600">⚡ Đã hoàn thành {sessions.length} đề thi</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-white font-extrabold text-xs select-none shadow-sm">
                AD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {quizMode === "active" ? (
          /* ACTIVE PREP PRACTICE CANVAS AREA */
          <div className="space-y-6">
            
            {/* Top info header representing beautiful status info for drive practice */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center space-x-3 text-xs">
                <span className={`font-black text-white px-3 py-1 rounded-lg uppercase tracking-wider ${quizType === "Mock" ? "bg-rose-500" : "bg-indigo-600"}`}>
                  {quizType === "Mock" ? (activeExamId ? `ĐỀ THI THỬ SỐ ${activeExamId}` : "ĐỀ SÁT HẠCH NGẪU NHIÊN") : "LUYỆN THEO CHỦ ĐỀ"}
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-slate-600">
                  Câu hỏi {currentIdx + 1} / {currentQuestionsQueue.length}
                </span>
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-slate-500 hidden sm:inline">
                  Đã làm: <b className="text-slate-800">{answeredCount}</b>/{currentQuestionsQueue.length} câu
                </span>
              </div>

              {quizType === "Mock" ? (
                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="flex items-center space-x-2 text-sm font-black text-rose-600 bg-rose-50 px-4 py-2 rounded-full font-mono shadow-inner">
                    <Clock size={16} className="animate-pulse" />
                    <span>
                      {Math.floor(quizTimer / 60).toString().padStart(2, "0")}:{(quizTimer % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  {!submitted && (
                    <button
                      onClick={() => setIsConfirmSubmitOpen(true)}
                      className="text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-full cursor-pointer transition-transform"
                    >
                      Nộp Bài Thi
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  {currentQuestionsQueue[0]?.moduleName.split(":")[0]}
                </div>
              )}
            </div>

            {/* Split Screen Grid (Left: Active Question, Right: Quiz Navigation Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Active Question presentation is styled robustly like Quizizz/Azota */}
              <div className="lg:col-span-8 space-y-6">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 relative overflow-hidden"
                  >
                    {/* Watermark identifier for license exams */}
                    <div className="absolute right-4 top-4 text-[42px] font-black text-slate-100/50 select-none pointer-events-none">
                      #{currentIdx + 1}
                    </div>

                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono border border-slate-200/50">
                          Câu {currentIdx + 1} / {currentQuestionsQueue.length}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                          currentQuestionsQueue[currentIdx]?.difficulty === "Dễ" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          currentQuestionsQueue[currentIdx]?.difficulty === "Trung bình" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          Độ khó: {currentQuestionsQueue[currentIdx]?.difficulty}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
                        {currentQuestionsQueue[currentIdx]?.text}
                      </h2>
                    </div>

                    {/* Question Option Radio grid */}
                    <div className="grid grid-cols-1 gap-3 relative z-10">
                      {currentQuestionsQueue[currentIdx]?.options.map((opt) => {
                        const isSelected = userAnswers[currentQuestionsQueue[currentIdx].id] === opt.key;
                        const correctKey = currentQuestionsQueue[currentIdx].correctKey;
                        
                        // Style attributes for final state or immediate feedback in Module mode
                        let containerStyle = "border-slate-200/80 hover:bg-slate-50 text-slate-700";
                        let circleStyle = "bg-slate-100 text-slate-600";

                        if (!submitted) {
                          if (quizType === "Module") {
                            const hasAnswered = !!userAnswers[currentQuestionsQueue[currentIdx].id];
                            if (hasAnswered) {
                              if (opt.key === correctKey) {
                                containerStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold shadow-xs";
                                circleStyle = "bg-emerald-500 text-white";
                              } else if (isSelected) {
                                containerStyle = "border-rose-500 bg-rose-50/50 text-rose-900";
                                circleStyle = "bg-rose-500 text-white";
                              } else {
                                containerStyle = "opacity-40 border-slate-100 bg-slate-50 text-slate-400";
                                circleStyle = "bg-slate-100 text-slate-300";
                              }
                            } else if (isSelected) {
                              containerStyle = "border-indigo-650 bg-indigo-50/40 text-indigo-900 font-bold";
                              circleStyle = "bg-indigo-600 text-white shadow-xs";
                            }
                          } else {
                            // Mock Mode: highlight standard selection cleanly
                            if (isSelected) {
                              containerStyle = "border-indigo-600 bg-indigo-50/40 text-indigo-950 font-bold ring-2 ring-indigo-600/30";
                              circleStyle = "bg-indigo-600 text-white";
                            }
                          }
                        } else {
                          // Final results display after Submission in Mock
                          if (opt.key === correctKey) {
                            containerStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold shadow-xs";
                            circleStyle = "bg-emerald-500 text-white";
                          } else if (isSelected) {
                            containerStyle = "border-rose-500 bg-rose-50/50 text-rose-900";
                            circleStyle = "bg-rose-500 text-white";
                          } else {
                            containerStyle = "opacity-45 border-slate-100 bg-slate-50 text-slate-400";
                            circleStyle = "bg-slate-100 text-slate-300";
                          }
                        }

                        return (
                          <button
                            key={opt.key}
                            onClick={() => handleSelectAnswer(opt.key)}
                            disabled={submitted || (quizType === "Module" && !!userAnswers[currentQuestionsQueue[currentIdx].id])}
                            className={`p-4 rounded-2xl flex items-center text-left w-full transition-all duration-150 border cursor-pointer text-xs sm:text-sm ${containerStyle}`}
                          >
                            <span className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 font-bold shrink-0 transition-colors ${circleStyle}`}>
                              {opt.key}
                            </span>
                            <span className="leading-snug pt-0.5">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback explanations for Practice Module mode OR general review state */}
                    {(submitted || (quizType === "Module" && userAnswers[currentQuestionsQueue[currentIdx].id])) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-4 relative z-10"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 pb-3 gap-3">
                          <div className="flex items-center space-x-2">
                            {userAnswers[currentQuestionsQueue[currentIdx].id] === currentQuestionsQueue[currentIdx].correctKey ? (
                              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center space-x-1 border border-emerald-200">
                                <Check size={12} />
                                <span>ĐÁP ÁN ĐÚNG</span>
                              </span>
                            ) : (
                              <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full flex items-center space-x-1 border border-rose-200">
                                <X size={12} />
                                <span>ĐÁP ÁN SAI</span>
                              </span>
                            )}
                            <span className="text-[11px] text-slate-400 font-semibold">(Đáp án chuẩn: {currentQuestionsQueue[currentIdx].correctKey})</span>
                          </div>

                          <button
                            onClick={fetchAiExplanation}
                            disabled={aiExplanationLoading}
                            className="text-xs font-black bg-indigo-600 hover:bg-slate-900 disabled:opacity-50 text-white px-4 py-2 rounded-full flex items-center space-x-1.5 transition-colors cursor-pointer"
                          >
                            {aiExplanationLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-yellow-300" />}
                            <span>{aiExplanation ? "Yêu cầu giải thích lại" : "Giải tích nâng cao bằng AI Trợ lý"}</span>
                          </button>
                        </div>

                        {aiExplanationLoading && (
                          <div className="py-4 text-center space-y-2 bg-white rounded-xl border border-dashed border-indigo-200">
                            <Loader2 size={24} className="text-indigo-600 animate-spin mx-auto" />
                            <p className="text-xs text-indigo-500 animate-pulse font-mono font-bold">Trợ lý AI đang lập luận khoa học...</p>
                          </div>
                        )}

                        {aiExplanation && (
                          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner font-mono">
                            {aiExplanation}
                          </div>
                        )}

                        {/* Standard Vietnam driving advice explanation explanation */}
                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          <p className="font-extrabold text-slate-900 inline">Mẹo nhớ nhanh: </p>
                          <span className="text-slate-600">{currentQuestionsQueue[currentIdx]?.explanation}</span>
                        </div>

                        {/* Note saving block */}
                        <div className="pt-3 border-t border-slate-200/60">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Note ghi chép cá nhân:</h4>
                          <input
                            type="text"
                            defaultValue={userNotes.find(n => n.questionId === currentQuestionsQueue[currentIdx].id)?.content || ""}
                            onBlur={(e) => {
                              if (e.target.value.trim()) {
                                savePersonalNote(currentQuestionsQueue[currentIdx].id, e.target.value.trim());
                              }
                            }}
                            placeholder="Ghi nhanh mẹo làm của bạn cho câu hỏi này tại đây (Tự động lưu vào sổ tay Cornell)..."
                            className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-hidden text-slate-700 font-medium font-sans"
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Navigation controls */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-2xs">
                  <button
                    onClick={() => {
                      if (submitted || window.confirm("Hủy bỏ đợt làm bài hiện tại và quay lại sảnh?")) {
                        setQuizMode("idle");
                      }
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2 hover:bg-slate-50 rounded-xl cursor-pointer"
                  >
                    Quay lại Sảnh
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        if (currentIdx > 0) {
                          setCurrentIdx(prev => prev - 1);
                          setInstantFeedbackSelected(null);
                          setAiExplanation(null);
                        }
                      }}
                      disabled={currentIdx === 0}
                      className="text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 disabled:opacity-30 px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft size={14} />
                      <span>Câu trước</span>
                    </button>

                    {currentIdx < currentQuestionsQueue.length - 1 ? (
                      <button
                        onClick={() => {
                          setCurrentIdx(prev => prev + 1);
                          setInstantFeedbackSelected(null);
                          setAiExplanation(null);
                        }}
                        disabled={quizType === "Module" && !userAnswers[currentQuestionsQueue[currentIdx].id]}
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl cursor-pointer transition-all flex items-center gap-1"
                      >
                        <span>Câu sau</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : (
                      !submitted && (
                        <button
                          onClick={() => setIsConfirmSubmitOpen(true)}
                          className="text-xs font-black bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-xl cursor-pointer shadow-sm"
                        >
                          Nộp Bài Thi
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Inline modal-like confirmation dialog box to replace standard blocked window alerts */}
                {isConfirmSubmitOpen && (
                  <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl space-y-4 shadow-sm animate-pulse">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="text-amber-600 mt-1 shrink-0" size={20} />
                      <div>
                        <h4 className="text-sm font-bold text-amber-900">Xác Nhận Nộp Bài Thi!</h4>
                        <p className="text-xs text-amber-800 leading-normal mt-1">
                          Bạn đã trả lời được <b>{answeredCount}/{currentQuestionsQueue.length}</b> câu hỏi. 
                          {quizType === "Mock" && ` Thời gian làm bài còn lại là ${Math.floor(quizTimer / 60)} phút ${quizTimer % 60} giây.`} 
                          Bạn có chắc chắn muốn nộp câu trả lời để chấm điểm ngay bây giờ?
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={() => setIsConfirmSubmitOpen(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Tiếp tục làm bài
                      </button>
                      <button
                        onClick={() => finishQuiz(false)}
                        className="text-xs font-black bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl cursor-pointer"
                      >
                        Đồng ý nộp bài
                      </button>
                    </div>
                  </div>
                )}

                {/* Score results block under the test if submitted */}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-250 shadow-md text-center space-y-5"
                  >
                    {/* Circle indicators */}
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-650 rounded-full flex flex-col items-center justify-center mx-auto text-xl font-black font-mono shadow-sm">
                      {Math.round((Object.values(userAnswers).filter((ans, idx) => ans === currentQuestionsQueue[idx]?.correctKey).length / currentQuestionsQueue.length) * 100)}%
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-800 flex items-center justify-center gap-2">
                        <Award className="text-yellow-500" size={22} />
                        <span>KẾT QUẢ ĐỢT LUYỆN THI</span>
                      </h3>
                      <p className="text-xs text-slate-500 max-w-md mx-auto leading-normal">
                        Chúc mừng bạn đã hoàn thiện bài thi trắc nghiệm! Kết quả: Bạn làm đúng <b>{Object.values(userAnswers).filter((ans, idx) => ans === currentQuestionsQueue[idx]?.correctKey).length} / {currentQuestionsQueue.length}</b> câu hỏi.
                      </p>
                    </div>

                    <div className="flex justify-center space-x-2 pt-2">
                      <button
                        onClick={() => {
                          setQuizMode("idle");
                          setActiveTab("history");
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-slate-800 px-4 py-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50"
                      >
                        Khảo sát lịch sử
                      </button>
                      <button
                        onClick={() => {
                          setQuizMode("idle");
                          setActiveTab("quiz");
                        }}
                        className="text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl cursor-pointer"
                      >
                        Nhận đề mới
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* RIGHT COLUMN: Question Grid selector and Progress sidebar (Azota/Driving license style) */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase">TIẾN ĐỘ THI CỬ</h3>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Đã ghi nhận:</span>
                    <span className="font-extrabold text-slate-900">{answeredCount} / {currentQuestionsQueue.length} câu</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(answeredCount / currentQuestionsQueue.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">BẢNG CHỌN CÂU HỎI NHANH</span>
                  
                  {/* Grid 1-40 or 1-N selection */}
                  <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
                    {currentQuestionsQueue.map((q, idx) => {
                      const isAnswered = !!userAnswers[q.id];
                      const isCurrent = currentIdx === idx;
                      const isCorrect = userAnswers[q.id] === q.correctKey;
                      
                      let btnStyle = "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100";
                      let indicatorDot = null;

                      if (!submitted) {
                        if (isCurrent) {
                          btnStyle = "bg-indigo-600 text-white font-extrabold border-indigo-600 shadow-xs ring-2 ring-indigo-500/20";
                        } else if (isAnswered) {
                          btnStyle = "bg-slate-900 text-white font-bold border-slate-900";
                        }
                      } else {
                        // After submission state
                        if (isAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold";
                            indicatorDot = <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />;
                          } else {
                            btnStyle = "bg-rose-50 text-rose-700 border-rose-300 font-bold";
                            indicatorDot = <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-rose-500" />;
                          }
                        } else {
                          btnStyle = "bg-slate-50 text-slate-300 border-slate-200 line-through";
                        }

                        if (isCurrent) {
                          btnStyle += " ring-2 ring-indigo-600/50";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentIdx(idx);
                            setInstantFeedbackSelected(null);
                            setAiExplanation(null);
                          }}
                          className={`relative h-10 w-full text-xs font-semibold rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${btnStyle}`}
                        >
                          <span>{idx + 1}</span>
                          {indicatorDot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-slate-400 text-[10px] space-y-1.5 pt-3 border-t border-slate-100 leading-normal">
                  <p className="font-bold text-slate-500">Mẹo tương tác sảnh thi:</p>
                  <p>✔ Click câu số bất kỳ để di chuyển tức thời.</p>
                  <p>✔ Chế độ thi tự trộn ngẫu nhiên từ kho dữ liệu 40 câu hỏi chuyên nghiệp.</p>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* REGULAR IDLE DASHBOARD TABS ENGINE */
          <div className="space-y-8">
            
            {/* Primary Tab Navigation Row: Modified to strictly exclude SRS Spaced Repetition */}
            <div className="bg-white border border-slate-100 rounded-2xl p-2 flex flex-wrap gap-1 shadow-2xs">
              {(["quiz", "notes", "stats", "history"] as const).map((tab) => {
                let label = "Kho Luyện Đề";
                let icon = <BookOpen size={16} />;
                if (tab === "notes") {
                  label = "Sổ Cornell Ghi Nhớ";
                  icon = <Notebook size={16} />;
                } else if (tab === "stats") {
                  label = "Giải Pháp & Báo Cáo";
                  icon = <TrendingUp size={16} />;
                } else if (tab === "history") {
                  label = "Lịch Sử Làm Bài";
                  icon = <History size={16} />;
                }

                const isSelected = activeTab === tab;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center space-x-2 text-xs font-extrabold px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer flex-1 justify-center sm:flex-initial ${
                      isSelected 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50/55"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS CONTAINER */}
            <div className="min-h-96">
              {activeTab === "quiz" && (
                /* BENTO GRID LAYOUT */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
                  
                  {/* Left Column Section (Col-span 8 on large screen) */}
                  <div className="lg:col-span-8 flex flex-col space-y-6">
                    
                    {/* Main Hero Bento Card formatted like driver's license practice platform */}
                    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                        <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/>
                        </svg>
                      </div>

                      <div className="space-y-3 z-10">
                        <span className="bg-rose-500/90 text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase font-mono shadow-xs">
                          MÔ PHỎNG ĐỂ THI CHÍNH THỨC
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight pt-1.5">
                          Sát Hạch Năng Lực Số Chuẩn 2026: <span className="text-yellow-300">40 Câu / 60 Phút</span>
                        </h2>
                        <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
                          Hệ thống trắc nghiệm trộn ngẫu nhiên tất cả 6 chủ đề năng lực số cốt lõi. Giao diện trực quan lý tưởng giống phần mềm thi bằng lái xe quốc gia hoặc Azota/Quizizz. Tích hợp đồng hồ đếm ngược và bảng chấm điểm chi tiết.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-6 z-10">
                        <button 
                          onClick={() => startQuiz("Mock")}
                          className="bg-white text-indigo-900 hover:bg-slate-100 px-6 py-3 rounded-xl text-xs font-black shadow-lg transition-transform hover:scale-102 cursor-pointer flex items-center gap-1.5"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Thi Ngẫu Nhiên (60 Phút)</span>
                        </button>
                        
                        <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-[11px] font-bold text-slate-300">
                          🎯 Bắt buộc đạt: <b className="text-white">32/40 câu</b>
                        </div>
                      </div>
                    </div>

                    {/* 14 Bộ Đề Thi Sát Hạch Cố Định */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black text-rose-500 font-mono tracking-widest uppercase block">
                            BỘ 14 ĐỀ THI SÁT HẠCH CỐ ĐỊNH
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center space-x-2">
                            <BookOpen className="text-rose-500 border border-rose-100 p-0.5 rounded-md" size={20} />
                            <span>Mô Phỏng Luyện Đề Sát Hạch (Đề 1 - Đề 14)</span>
                          </h3>
                        </div>
                        <span className="text-xs font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                          40 câu / đề
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Hệ thống đã xếp sẵng nội dung thành 14 đề bài cố định tự trộn thông minh. Hãy vượt qua tất cả 14 đề thi này với kết quả <b>ĐẠT (&gt;= 32/40 đáp án đúng)</b> để đảm bảo điểm 10 tuyệt đối khi bước vào phòng thi thật!
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                        {Array.from({ length: 14 }, (_, i) => {
                          const examNum = i + 1;
                          const report = getExamStatus(examNum);
                          
                          let cardBorder = "border-slate-200 bg-slate-50/50 hover:bg-slate-50";
                          let badgeStyle = "text-slate-500 bg-slate-100";
                          
                          if (report.passed === true) {
                            cardBorder = "border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/30";
                            badgeStyle = "text-emerald-700 bg-emerald-100";
                          } else if (report.passed === false) {
                            cardBorder = "border-rose-200 bg-rose-50/20 hover:bg-rose-50/30";
                            badgeStyle = "text-rose-700 bg-rose-100";
                          }

                          return (
                            <button
                              key={examNum}
                              onClick={() => startQuiz("Mock", undefined, examNum)}
                              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group h-full ${cardBorder}`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-xs font-black text-slate-800 group-hover:text-indigo-650 transition-colors">
                                  Đề số {examNum}
                                </span>
                                <div className="p-1 bg-white rounded-md border border-slate-200 group-hover:bg-indigo-50 group-hover:border-indigo-150 transition-all">
                                  <Play size={10} className="text-slate-400 group-hover:text-indigo-600" fill="currentColor" />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between w-full mt-3">
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md ${badgeStyle}`}>
                                  {report.status}
                                </span>
                                {report.score && (
                                  <span className="text-[10px] font-black font-mono text-slate-700">
                                    {report.score}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Topic Deep Practice Area - Bento card style */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-indigo-650 font-mono tracking-widest uppercase block">
                            TOPICAL EXAM PRACTICE
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center space-x-2">
                            <NotebookPen className="text-indigo-600 border border-indigo-100 p-0.5 rounded-md" size={20} />
                            <span>Luyện Tập Chuyên Sâu Theo Chủ Đề</span>
                          </h3>
                        </div>
                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                          6 Module cốt lõi
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Chọn một chủ đề chuyên biệt bên dưới để rèn luyện lý thuyết trực quan. Hệ thống sẽ hiển thị <b>đáp án tức thời, phân tích mẹo nhớ và gợi ý giải thích chuyên sâu từ AI Tutor</b>.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                        {Array.from({ length: 6 }, (_, i) => {
                          const mNum = i + 1;
                          const name = QUESTIONS_DB.find(q => q.module === mNum)?.moduleName || `Module ${mNum}`;
                          return (
                            <button
                              key={mNum}
                              onClick={() => {
                                setSelectedModule(mNum);
                                startQuiz("Module", mNum);
                              }}
                              className="text-left text-xs font-bold p-3.5 hover:bg-slate-50 text-slate-700 hover:text-indigo-700 bg-slate-50/70 border border-slate-150 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                            >
                              <span className="truncate pr-2">Module {mNum}: {name.split(":")[1] || name}</span>
                              <ArrowRight size={13} className="text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column Section (Col-span 4 on large screen) */}
                  <div className="lg:col-span-4 flex flex-col space-y-6">
                    
                    {/* Streak & User Bento Block */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between bg-white shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">ĐÀO TẠO NĂNG LỰC</span>
                        <p className="text-sm font-black text-amber-600 flex items-center space-x-1">
                          <span>🔥 Chuỗi ngày học tập được kích hoạt!</span>
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-xs select-none">
                        DS
                      </div>
                    </div>

                    {/* Mnemonic / Note Quick View Bento - Dark themed card */}
                    <div className="bg-slate-900 p-5 rounded-3xl text-white flex flex-col justify-between min-h-[220px] shadow-xs">
                      <div>
                        <h3 className="text-xs font-black mb-3 flex items-center text-slate-350 tracking-wider uppercase">
                          <span className="text-yellow-300 mr-2 text-sm">💡</span>
                          <span>BẢO BỐI CORNELL LÀM BÀI</span>
                        </h3>
                        <div className="border-l-2 border-indigo-400 pl-3 space-y-1">
                          <p className="text-[10px] font-black text-indigo-300 uppercase">Mẹo nhớ viết prompt (CRAC):</p>
                          <p className="text-xs font-semibold text-slate-200 leading-relaxed font-mono">
                            C - Context (Bối cảnh)<br />
                            R - Role (Vai trò)<br />
                            A - Action (Hành động)<br />
                            C - Constraint (Ràng buộc-Giới hạn)
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab("notes")}
                        className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-black text-center cursor-pointer transition-colors"
                      >
                        Vào Kho Cornell Notes
                      </button>
                    </div>

                    {/* Progress analysis visual bar block */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-between min-h-[200px] shadow-2xs">
                      <div>
                        <h3 className="text-xs font-black text-slate-800 mb-3 tracking-wider uppercase">TIẾN ĐỘ THI CỬ</h3>
                        
                        {/* Dynamic score growth representation block */}
                        <div className="flex items-end justify-between space-x-2.5 h-16 pt-2">
                          <div className="w-full flex flex-col items-center">
                            <div className="w-full bg-slate-100 h-10 rounded-t-lg relative">
                              <div className="absolute bottom-0 w-full bg-slate-300 h-[60%] rounded-t-lg" />
                            </div>
                            <span className="text-[8px] text-slate-400 mt-1">Lượt đầu</span>
                          </div>
                          <div className="w-full flex flex-col items-center">
                            <div className="w-full bg-indigo-50 h-10 rounded-t-lg relative">
                              <div className="absolute bottom-0 w-full bg-indigo-400 h-[75%] rounded-t-lg" />
                            </div>
                            <span className="text-[8px] text-slate-400 mt-1">Đầu tuần</span>
                          </div>
                          <div className="w-full flex flex-col items-center">
                            <div className="w-full bg-violet-100 h-10 rounded-t-lg relative">
                              <div className="absolute bottom-0 w-full bg-violet-600 h-[90%] rounded-t-lg" />
                            </div>
                            <span className="text-[8px] text-slate-800 font-extrabold mt-1">Học sinh tốt</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug mt-2 pt-2 border-t border-slate-100">
                        Hao hụt kiến thức? Hãy mở ngay <b>Sổ Cornell Ghi Nhớ</b> để lập bản đồ tư duy, liên hệ chéo và xóa rỗng lỗi sai.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <CornellNoteTaker
                  userNotes={userNotes}
                  onSaveNote={savePersonalNote}
                  onDeleteNote={deletePersonalNote}
                />
              )}

              {activeTab === "stats" && (
                <ReviewStats
                  sessions={sessions}
                  onNavigateToQuiz={handleQuickQuizFromStats}
                />
              )}

              {activeTab === "history" && (
                <SessionHistory
                  sessions={sessions}
                  onClearHistory={() => {
                    localStorage.removeItem("digitalskills_sessions");
                    setSessions([]);
                  }}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Aesthetic standard footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium whitespace-nowrap">
        <p>© 2026 - Ôn thi bằng lái số &amp; trắc nghiệm Năng Lực Số</p>
      </footer>
    </div>
  );
}
