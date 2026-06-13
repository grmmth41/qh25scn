import React, { useState } from "react";
import { QuizSession, Question } from "../types";
import { QUESTIONS_DB } from "../data/questions";
import { 
  Calendar, 
  Hourglass, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  History 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SessionHistoryProps {
  sessions: QuizSession[];
  onClearHistory?: () => void;
}

export default function SessionHistory({ sessions, onClearHistory }: SessionHistoryProps) {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  function toggleSessionDetails(id: string) {
    if (selectedSessionId === id) {
      setSelectedSessionId(null);
    } else {
      setSelectedSessionId(id);
    }
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs} giây`;
  }

  function formatDate(isoStr: string) {
    const date = new Date(isoStr);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // Find selected session details
  const activeSessionDetails = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="space-y-6" id="history-container">
      {/* Header panel */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <History size={20} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">Lịch Sử Luyện Đề Từng Đợt</h3>
        </div>
        {onClearHistory && sessions.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử luyện thi?")) {
                onClearHistory();
                setSelectedSessionId(null);
              }
            }}
            className="text-xs text-rose-500 hover:text-rose-600 font-bold bg-rose-50 px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-rose-100/50 transition-colors"
          >
            Xóa lịch sử
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-md mx-auto">
          <BookOpen className="mx-auto text-slate-300" size={48} />
          <h4 className="text-sm font-bold text-slate-700">Chưa có lịch sử làm đề!</h4>
          <p className="text-xs text-slate-400 px-6 leading-relaxed">
            Hãy bắt đầu một đợt thi thử hoặc ôn tập theo chủ đề. Kết quả chi tiết đúng/sai sẽ được lưu trữ tự động tại đây.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* History Lists Panel - Left */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase block">
              Danh sách đợt thi ({sessions.length})
            </span>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {sessions.map((sess, idx) => {
                const isActive = sess.id === selectedSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => toggleSessionDetails(sess.id)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex justify-between items-center ${
                      isActive 
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs" 
                        : "bg-white text-slate-700 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1 max-w-[70%]">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          sess.type === "Mock" 
                            ? "bg-indigo-500/20 text-indigo-400" 
                            : "bg-teal-500/20 text-teal-400"
                        }`}>
                          {sess.type === "Mock" ? "Thi Thử" : sess.moduleName ? "Chủ Đề" : "Thẻ Nhớ"}
                        </span>
                        <span className="text-[11px] font-mono opacity-80 flex items-center space-x-1">
                          <Calendar size={11} />
                          <span>{formatDate(sess.date).split(" ")[0]}</span>
                        </span>
                      </div>
                      <h4 className="text-xs font-bold truncate">
                        {sess.type === "Mock" ? "Thi thử Đề Năng Lực Số" : sess.moduleName || "Ôn tập SRS"}
                      </h4>
                      <p className="text-[10px] opacity-70 flex items-center space-x-1">
                        <Hourglass size={10} />
                        <span>Thời gian: {formatDuration(sess.duration)}</span>
                      </p>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className={`text-sm font-extrabold block ${
                        sess.score >= 80 ? "text-emerald-500" : sess.score >= 50 ? "text-amber-500" : "text-rose-500"
                      }`}>
                        {sess.score}% Đúng
                      </span>
                      <p className="text-[10px] opacity-60">
                        {sess.correctCount} / {sess.totalCount} câu
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Breakdown - Right */}
          <div className="lg:col-span-7">
            {activeSessionDetails ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
                <div className="border-b border-rose-50 pb-4 space-y-2">
                  <span className="text-[10px] font-extrabold text-indigo-500 font-mono tracking-widest uppercase block">
                    ĐỢT THI NGÀY {formatDate(activeSessionDetails.date).toUpperCase()}
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-extrabold text-slate-800">
                      {activeSessionDetails.type === "Mock" ? "Đề Thi thử Năng Lực Số \& AI" : activeSessionDetails.moduleName}
                    </h3>
                    <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Tỉ lệ đúng: {activeSessionDetails.score}%
                    </span>
                  </div>
                </div>

                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1">
                  {Object.entries(activeSessionDetails.answers).map(([qIdStr, userAns], index) => {
                    const qId = parseInt(qIdStr);
                    const question = QUESTIONS_DB.find(q => q.id === qId);
                    if (!question) return null;

                    const isCorrect = userAns === question.correctKey;

                    return (
                      <div key={qId} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 font-mono">
                              CÂU {index + 1} ({question.difficulty})
                            </span>
                            <h4 className="text-sm font-bold text-slate-800">
                              {question.text}
                            </h4>
                          </div>
                          <span className="shrink-0 text-sm">
                            {isCorrect ? (
                              <CheckCircle2 className="text-emerald-500 fill-emerald-50" size={18} />
                            ) : (
                              <XCircle className="text-rose-500 fill-rose-50" size={18} />
                            )}
                          </span>
                        </div>

                        {/* Options log */}
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {question.options.map((opt) => {
                            const isSelected = userAns === opt.key;
                            const isCorrectAns = question.correctKey === opt.key;

                            let optionStyles = "bg-white border-slate-100 text-slate-700";
                            if (isCorrectAns) {
                              optionStyles = "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-semibold";
                            } else if (isSelected && !isCorrect) {
                              optionStyles = "bg-rose-500/10 border-rose-500/30 text-rose-800 font-medium";
                            }

                            return (
                              <div 
                                key={opt.key} 
                                className={`flex items-start space-x-2.5 p-2 rounded-xl border ${optionStyles}`}
                              >
                                <span className={`w-5 h-5 flex items-center justify-center rounded-md font-bold text-[10px] shrink-0 ${
                                  isCorrectAns ? "bg-emerald-500 text-white" :
                                  isSelected ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500"
                                }`}>
                                  {opt.key}
                                </span>
                                <p className="leading-snug">{opt.text}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Detaled translation */}
                        <div className="p-3 bg-white rounded-xl border border-slate-100/50 text-xs">
                          <p className="font-bold text-indigo-600 inline">Giải thích: </p>
                          <span className="text-slate-500 font-medium leading-relaxed">{question.explanation}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-slate-100 shadow-xs">
                <AlertCircle className="mx-auto text-slate-300" size={36} />
                <h4 className="text-sm font-bold text-slate-600">Chọn một đợt thi để xem chi tiết</h4>
                <p className="text-xs text-slate-400 px-8 leading-normal max-w-xs mx-auto">
                  Click vào danh sách các đợt làm bài ở cột bên trái để phân tích kĩ đúng sai từng câu hỏi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
