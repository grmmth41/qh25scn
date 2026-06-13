import React, { useState } from "react";
import { QuizSession } from "../types";
import { QUESTIONS_DB } from "../data/questions";
import { 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Sparkles, 
  BookOpen, 
  Bot, 
  Loader2, 
  RefreshCw 
} from "lucide-react";
import { motion } from "motion/react";

interface ReviewStatsProps {
  sessions: QuizSession[];
  onNavigateToQuiz: (moduleNumber?: number) => void;
}

export default function ReviewStats({ sessions, onNavigateToQuiz }: ReviewStatsProps) {
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Group performance by module
  const modulePerformance = Array.from({ length: 6 }, (_, i) => {
    const modNum = i + 1;
    const modQuestions = QUESTIONS_DB.filter(q => q.module === modNum);
    const modName = modQuestions[0]?.moduleName || `Module ${modNum}`;

    // Find answers across all quiz sessions for this module
    let totalAttempts = 0;
    let correctAttempts = 0;

    sessions.forEach(sess => {
      // Find questions in this session that belong to this module
      Object.entries(sess.answers).forEach(([qIdStr, userAns]) => {
        const qId = parseInt(qIdStr);
        const q = QUESTIONS_DB.find(q => q.id === qId);
        if (q && q.module === modNum) {
          totalAttempts++;
          if (userAns === q.correctKey) {
            correctAttempts++;
          }
        }
      });
    });

    const rate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : null;

    return {
      moduleNumber: modNum,
      name: modName,
      total: totalAttempts,
      correct: correctAttempts,
      rate,
    };
  });

  // Identify strength vs weak modules
  const modulesWithScore = modulePerformance.filter(m => m.rate !== null);
  
  const weakModules = modulePerformance
    .filter(m => m.rate !== null && m.rate < 70)
    .map(m => m.name);

  const strengthModules = modulePerformance
    .filter(m => m.rate !== null && m.rate >= 70)
    .map(m => m.name);

  // Get diagnostic advice
  async function generateAiPlan() {
    setLoadingAi(true);
    setAiError(null);
    try {
      const avgScore = sessions.length > 0 
        ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length) 
        : 0;

      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats: {
            avgScore,
            sessionsCount: sessions.length,
          },
          weakModules: weakModules.length > 0 ? weakModules : ["Chưa có dữ liệu yếu kém (Luyện đề thêm để phát hiện)"],
          strengthModules: strengthModules.length > 0 ? strengthModules : ["Chưa có dữ liệu thế mạnh"],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp sự cố khi kết tinh lộ trình.");
      }
      setAiDiagnosis(data.text);
    } catch (err: any) {
      setAiError(err.message || "Không kết nối được với AI Tutor.");
    } finally {
      setLoadingAi(false);
    }
  }

  // Calculate global stats
  const totalQuizzes = sessions.length;
  const avgAccuracy = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length) 
    : 0;

  return (
    <div className="space-y-8" id="statistics-panel">
      {/* Target Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Độ chính xác trung bình</p>
            <h3 className="text-2xl font-bold text-slate-800">{avgAccuracy}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Đợt luyện đề đã làm</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalQuizzes} đợt</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Phân tích yếu kém</p>
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {weakModules.length > 0 ? `Cần cải thiện ${weakModules.length} chủ đề` : "Tình hình rất khả quan ✨"}
            </h3>
          </div>
        </div>
      </div>

      {/* Module Breakdown Grid */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center space-x-2">
          <span>Xếp Hạng Kiến Thức Từng Module</span>
        </h3>

        <div className="space-y-5">
          {modulePerformance.map((mod) => {
            const hasData = mod.total > 0;
            const percentage = mod.rate || 0;
            
            // Choose color based on score
            let colorClass = "bg-rose-500";
            let textClass = "text-rose-600 bg-rose-50";
            let progressBg = "bg-rose-50";
            
            if (percentage >= 80) {
              colorClass = "bg-emerald-500";
              textClass = "text-emerald-600 bg-emerald-50";
              progressBg = "bg-emerald-50";
            } else if (percentage >= 60) {
              colorClass = "bg-amber-500";
              textClass = "text-amber-600 bg-amber-50";
              progressBg = "bg-amber-50";
            }

            return (
              <div key={mod.moduleNumber} className="group p-4 rounded-2xl hover:bg-slate-50/50 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-400 font-mono">MODULE {mod.moduleNumber}</span>
                    <h4 className="text-sm font-bold text-slate-800">{mod.name}</h4>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs text-slate-400 font-medium">
                      {hasData ? `${mod.correct}/${mod.total} câu đúng` : "Chưa kiểm tra"}
                    </span>
                    {hasData ? (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${textClass}`}>
                        {percentage}% Đúng
                      </span>
                    ) : (
                      <button 
                        onClick={() => onNavigateToQuiz(mod.moduleNumber)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full cursor-pointer transition-colors"
                      >
                        Luyện Ngay
                      </button>
                    )}
                  </div>
                </div>

                {hasData && (
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                    <motion.div 
                      className={`h-full ${colorClass}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Diagnostician and Study Solutions Advisor */}
      <div className="bg-gradient-to-tr from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Decorative subtle background overlay */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <Bot size={240} className="text-white" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-300 font-mono bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/20">
                PRO ACTIVE ADVISOR
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2">
                <Sparkles className="text-yellow-300 animate-pulse" size={24} />
                <span>Giải Pháp Học Tập Từ AI Tutor</span>
              </h3>
              <p className="text-sm text-indigo-200 max-w-xl">
                Dựa trên tất cả lịch sử làm bài và lặp lại kiến thức của bạn, AI sẽ chuẩn hóa hành vi học tập và khuyên ngày lặp lại thông thái.
              </p>
            </div>
            
            <button
              onClick={generateAiPlan}
              disabled={loadingAi}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-200 cursor-pointer shadow-sm hover:scale-105"
            >
              {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              <span>{aiDiagnosis ? "Phân tích lại" : "Khởi tạo giải pháp"}</span>
            </button>
          </div>

          {/* AI Response Output */}
          {loadingAi && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 bg-slate-950/20 rounded-2xl border border-indigo-500/10">
              <Loader2 size={40} className="text-indigo-400 animate-spin" />
              <p className="text-xs text-indigo-300 animate-pulse font-mono">AI đang phân loại điểm yếu và lên lịch ôn tập cho bạn...</p>
            </div>
          )}

          {aiError && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-2xl flex items-center space-x-3 text-sm">
              <AlertTriangle className="shrink-0 text-rose-400" size={18} />
              <p>{aiError}</p>
            </div>
          )}

          {!loadingAi && aiDiagnosis && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-950/40 border border-indigo-500/15 p-5 sm:p-6 rounded-2xl text-sm leading-relaxed text-slate-100 max-h-96 overflow-y-auto whitespace-pre-wrap font-sans space-y-4"
            >
              {/* Output markdown nicely separated */}
              {aiDiagnosis}
            </motion.div>
          )}

          {/* Default Local Analysis when AI has not been run yet */}
          {!loadingAi && !aiDiagnosis && (
            <div className="bg-slate-950/25 border border-indigo-500/10 p-5 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono mb-3">Chẩn Đoán Sơ Bộ Hệ Thống</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                    <AlertTriangle size={12} className="text-rose-400" />
                    <span>Nội dung yếu cần lưu tâm:</span>
                  </span>
                  <div className="text-xs space-y-1">
                    {weakModules.length > 0 ? (
                      weakModules.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-1 text-rose-300 font-medium">
                          <span>•</span>
                          <span>{m}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-emerald-300">Tuyệt vời, bạn chưa có chủ đề nào bị đánh giá yếu (&lt;70%)!</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold flex items-center space-x-1">
                    <Award size={12} className="text-emerald-400" />
                    <span>Lĩnh vực vững chắc nhất:</span>
                  </span>
                  <div className="text-xs space-y-1">
                    {strengthModules.length > 0 ? (
                      strengthModules.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-1 text-emerald-300 font-medium">
                          <span>•</span>
                          <span>{m}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400">Hãy tích cực làm thêm bài kiểm tra để xác định điểm mạnh.</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-indigo-500/10 flex items-center space-x-2 text-xs text-indigo-200">
                <Sparkles size={14} className="text-yellow-300" />
                <span>Nhấn nút <b>"Khởi tạo giải pháp"</b> ở góc phải trên để nhận lời khuyên sâu từ Trí tuệ nhân tạo!</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
