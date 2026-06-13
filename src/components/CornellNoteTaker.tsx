import React, { useState } from "react";
import { UserNote } from "../types";
import { QUESTIONS_DB } from "../data/questions";
import { 
  Plus, 
  Sparkles, 
  Loader2, 
  Trash2, 
  FileText, 
  Bookmark, 
  Maximize2, 
  ArrowRight,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { motion } from "motion/react";

interface CornellNoteTakerProps {
  userNotes: UserNote[];
  onSaveNote: (questionId: number, content: string, format?: "Cornell" | "Standard" | "Mnemonic" | "ActiveRecall") => void;
  onDeleteNote: (questionId: number) => void;
}

const CONCEPTS_PRESETS = [
  "Nguyên tắc sao lưu dữ liệu 3-2-1",
  "Khung viết prompt CRAC (Context-Role-Action-Constraint)",
  "Thuật ngữ Phishing và cách nhận diện",
  "Spaced Repetition (Phương pháp ôn tập 40 câu/60 phút)",
  "Tấn công lừa đảo giả mạo SMS Brandname fake",
  "Đồ họa Vector vs Đồ họa Raster",
  "Hệ điều hành Windows vs Linux Kernel",
  "Bản quyền Creative Commons (Giấy phép CC)",
  "Hiện tượng Hallucination (Ảo giác) trong LLMs",
  "Kỹ thuật viết prompt Chain-of-Thought"
];

export default function CornellNoteTaker({ userNotes, onSaveNote, onDeleteNote }: CornellNoteTakerProps) {
  const [selectedConcept, setSelectedConcept] = useState(CONCEPTS_PRESETS[0]);
  const [customConcept, setCustomConcept] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Custom manual note states
  const [manualTitle, setManualConcept] = useState("");
  const [manualCue, setManualCue] = useState("");
  const [manualNote, setManualNote] = useState("");
  const [manualMnemonic, setManualMnemonic] = useState("");
  const [manualSummary, setManualSummary] = useState("");

  const [activeTab, setActiveTab] = useState<"presets" | "manual">("presets");

  // Call Server-side AI to generate formatted Cornell style notes
  async function generateCornellAI() {
    setLoadingAi(true);
    setAiError(null);
    const conceptQuery = activeTab === "presets" ? selectedConcept : customConcept;
    
    if (!conceptQuery.trim()) {
      setAiError("Vui lòng nhập tên khái niệm cần làm Cornell Takenotes.");
      setLoadingAi(false);
      return;
    }

    try {
      const res = await fetch("/api/ai/mnemonic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: conceptQuery }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gặp sự cố khi sinh Takenotes.");
      }

      // We assign a negative unique ID for custom concepts to differentiate them from question-rooted notes
      const customNoteId = -Math.floor(Math.random() * 1000000) - 1000;
      onSaveNote(customNoteId, data.text, "Cornell");
      setCustomConcept("");
    } catch (err: any) {
      setAiError(err.message || "Gặp sự cố kết nối AI.");
    } finally {
      setLoadingAi(false);
    }
  }

  // Handle manual saving
  function handleSaveManual() {
    if (!manualTitle.trim()) {
      alert("Vui lòng điền tên chủ đề!");
      return;
    }

    const compiledCornellContent = `
### 1. TỪ KHÓA GỢI Ý (CUES):
${manualCue}

### 2. GHI CHÉP CỐT LÕI (NOTES):
${manualNote}

### 3. MẸO PHẢN XẠ & CHỮ VIẾT TẮT (MNEMONIC):
${manualMnemonic}

### 4. TÓM TẮT CHUNG (SUMMARY):
${manualSummary}
    `.trim();

    const customId = -Math.floor(Math.random() * 1000000) - 5000;
    onSaveNote(customId, compiledCornellContent, "Cornell");
    
    // Clear inputs
    setManualConcept("");
    setManualCue("");
    setManualNote("");
    setManualMnemonic("");
    setManualSummary("");
    alert("Lưu thẻ ghi nhớ Cornell thành công!");
  }

  return (
    <div className="space-y-8" id="cornell-notebook">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Creator panel - Left */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 font-mono tracking-wider uppercase block">
              CORNELL METHOD MAKER
            </span>
            <h3 className="text-base font-extrabold text-slate-800">
              Kiến Tạo Thẻ Takenot Cornell
            </h3>
            <p className="text-xs text-slate-400">
              Sử dụng phương pháp Takenote Cornell kinh điển để ghi chép: phân tách Từ khóa Gợi ý, Nội dung tóm gọn, và Mẹo Mnemonic giúp não bộ phản xạ rực rỡ.
            </p>
          </div>

          {/* Maker toggle tabs */}
          <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex-1 text-xs font-extrabold py-2 rounded-lg cursor-pointer ${
                activeTab === "presets" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Ý tưởng gợi ý từ AI
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 text-xs font-extrabold py-2 rounded-lg cursor-pointer ${
                activeTab === "manual" ? "bg-white text-indigo-600 shadow-2xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tự ghi chép thủ công
            </button>
          </div>

          {activeTab === "presets" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Chọn chủ đề khó:</label>
                <select
                  value={selectedConcept}
                  onChange={(e) => setSelectedConcept(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden font-medium text-slate-700"
                >
                  {CONCEPTS_PRESETS.map((p, idx) => (
                    <option key={idx} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-50 space-y-3">
                <p className="text-[11px] text-slate-400 italic">
                  * Trợ lý AI sẽ tự động phân loại, mã hóa kiến thức và chuẩn hóa sơ đồ định dạng Cornell siêu trực quan cho bạn.
                </p>
                <button
                  onClick={generateCornellAI}
                  disabled={loadingAi}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-2xl cursor-pointer text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  {loadingAi ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>AI đang biên vẽ Cornell Takenote...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                      <span>Kết tạo bằng AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Tên chủ đề (e.g. Chuẩn hóa mạng 5G)"
                value={manualTitle}
                onChange={(e) => setManualConcept(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden"
              />
              <textarea
                placeholder="1. Từ khóa gợi ý (Cues) - Giúp khơi gợi câu hỏi..."
                value={manualCue}
                onChange={(e) => setManualCue(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[60px] focus:outline-hidden"
              />
              <textarea
                placeholder="2. Ghi chép cốt lõi (Notes) - Các ý lý thuyết ngắn gọn..."
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[70px] focus:outline-hidden"
              />
              <textarea
                placeholder="3. Mẹo nhớ lâu (Mnemonic Abbreviation)..."
                value={manualMnemonic}
                onChange={(e) => setManualMnemonic(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] focus:outline-hidden"
              />
              <textarea
                placeholder="4. Tóm tắt nhanh (Summary) - Tinh hoa tóm lại..."
                value={manualSummary}
                onChange={(e) => setManualSummary(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl min-h-[50px] focus:outline-hidden"
              />

              <button
                onClick={handleSaveManual}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer"
              >
                Lưu Thẻ Thủ Công
              </button>
            </div>
          )}

          {aiError && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600">
              {aiError}
            </div>
          )}
        </div>

        {/* Existing Note Decks - Right */}
        <div className="md:col-span-7 space-y-4">
          <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase block">
            Kho Sổ Tay Takenotes Đang Lưu ({userNotes.length})
          </span>

          {userNotes.length === 0 ? (
            <div className="py-24 text-center space-y-3 bg-white border border-slate-100 rounded-3xl shadow-xs">
              <FileText className="mx-auto text-slate-200" size={44} />
              <h4 className="text-sm font-bold text-slate-600">Hàng thẻ Takenotes đang trống!</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto px-4">
                Tận dụng trình kiến tạo AI ở cột trái, hoặc thêm ghi chú từ quá trình làm sảnh đề thi và luyện tập để hiển thị kho tư liệu ghi nhớ tại đây.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-1">
              {userNotes.map((note) => {
                const isAiNote = note.questionId < 0;
                // If it represents a real question, let's look up its text if possible
                const realQ = !isAiNote ? QUESTIONS_DB.find(q => q.id === note.questionId) : null;
                const noteTitle = realQ ? `Mẹo Nhớ Cho Câu Hỏi ${realQ.id}` : "Thẻ Cornell Số Học";

                return (
                  <div key={note.questionId} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-4 hover:border-slate-200 transition-colors">
                    <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-100">
                      <div>
                        {realQ && (
                          <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider block mb-0.5">
                            {realQ.moduleName.toUpperCase()}
                          </span>
                        )}
                        <h4 className="text-xs font-black text-slate-800 flex items-center space-x-1.5">
                          <Bookmark size={12} className="text-indigo-500 fill-indigo-10" />
                          <span>{realQ ? realQ.text.substring(0, 50) + "..." : noteTitle}</span>
                        </h4>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm("Xóa thẻ ghi nhớ này?")) {
                            onDeleteNote(note.questionId);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Cornell Grid structure layout */}
                    <div className="text-xs space-y-4">
                      {/* Check if Cornell structure is parsed or formatted */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        {/* Cues left side */}
                        <div className="sm:col-span-4 bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100/50">
                          <p className="text-[10px] font-extrabold text-indigo-600 uppercase font-mono tracking-wider mb-1.5 flex items-center space-x-1">
                            <HelpCircle size={10} />
                            <span>Từ khóa Cues</span>
                          </p>
                          <div className="text-[11px] text-indigo-900 leading-normal font-medium whitespace-pre-wrap">
                            {note.content.includes("### 1. TỪ KHÓA GỢI Ý") 
                              ? note.content.split("### 2. GHI CHÉP CỐT LÕI")[0].replace("### 1. TỪ KHÓA GỢI Ý (CUES):", "").trim()
                              : "Cần tự học bằng Active Recall: Đọc kĩ khái niệm để đặt câu hỏi thảo luận."}
                          </div>
                        </div>

                        {/* Notes right side */}
                        <div className="sm:col-span-8 bg-slate-50 p-3 rounded-2xl border border-slate-100/60">
                          <p className="text-[10px] font-extrabold text-slate-500 uppercase font-mono tracking-wider mb-1.5 flex items-center space-x-1">
                            <FileText size={10} />
                            <span>Ghi chép Core Notes</span>
                          </p>
                          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap prose prose-slate">
                            {note.content.includes("### 2. GHI CHÉP CỐT LÕI")
                              ? note.content.split("### 2. GHI CHÉP CỐT LÕI")[1].split("### 3. MẸO PHẢN XẠ")[0].trim()
                              : note.content}
                          </div>
                        </div>
                      </div>

                      {/* Summary & Mnemonic row */}
                      <div className="bg-amber-500/5 p-3.5 rounded-2xl border border-amber-500/10 space-y-2">
                        <p className="text-[10px] font-extrabold text-amber-700 uppercase font-mono tracking-wider flex items-center space-x-1.5">
                          <Lightbulb size={11} className="text-amber-500" />
                          <span>Mẹo phản xạ & Tóm tắt nhanh</span>
                        </p>
                        
                        <div className="text-xs text-slate-700 space-y-1 leading-relaxed">
                          {note.content.includes("### 3. MẸO PHẢN XẠ") ? (
                            <>
                              <div className="font-semibold text-amber-900">
                                {note.content.split("### 3. MẸO PHẢN XẠ (MNEMONIC):")[1].split("### 4. TÓM TẮT CHUNG")[0].trim()}
                              </div>
                              <div className="pt-1.5 border-t border-amber-500/10 text-slate-500 italic">
                                {note.content.split("### 4. TÓM TẮT CHUNG (SUMMARY):")[1]?.trim() || ""}
                              </div>
                            </>
                          ) : (
                            <div className="italic text-slate-500">Chưa thiết lập Mnemonic AI. Hãy tận dụng AI Cornell Maker để tạo ra những câu nói ghi nhớ thông thái!</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
