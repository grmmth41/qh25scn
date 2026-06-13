import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error("GEMINI_API_KEY is not configured in Secrets / environment variables.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Keep a system instruction that forces Vietnamese response and high educational quality
const SYSTEM_PROMPT = `Bạn là Trợ Lý Ôn Thi Năng Lực Số (Digital Literacy & AI Prep Tutor) thông thái và tràn đầy năng lượng tích cực.
Mục tiêu là hỗ trợ sinh viên học tập, ôn luyện đề thi trắc nghiệm năng lực số năm 2026.
Yêu cầu phản hồi:
1. Luôn sử dụng ngôn ngữ Tiếng Việt chuẩn mực, rành mạch, dễ hiểu, hóm hỉnh và tràn đầy động lực học tập.
2. Thiết kế định dạng Markdown rõ ràng, dùng bullet points, bôi đậm các thuật ngữ phần cứng, prompt, bảo mật chính.
3. Không lặp lại các thông tin thừa, tập trung sâu vào bản chất kiến thức thực tế.
4. Đưa ra mẹo nhớ lâu (Takenote/Mnemonic) sáng tạo, dễ hiểu.`;

// API 1: Explain quiz question in detail with active learning advice
app.post("/api/ai/explain", async (req, res) => {
  try {
    const { question, userAnswer, correctKey, difficulty, moduleName } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Thiếu nội dung câu hỏi." });
    }

    const client = getGeminiAI();
    const prompt = `Hãy giải thích chi tiết câu hỏi trắc nghiệm dưới đây thuộc chủ đề: "${moduleName}" (Mức độ: ${difficulty}).
Câu hỏi: "${question}"
Các phương án lựa chọn:
${JSON.stringify(req.body.options || [])}

Đáp án ĐÚNG là: ${correctKey}
Người học đã chọn phương án: ${userAnswer || "Chưa chọn (bỏ trống)"}.

Hãy phân tích:
1. Tại sao phương án ${correctKey} lại đúng tuyệt đối? (Giải thích khoa học, trực quan, gần gũi năm 2026).
2. Nếu người học chọn sai, hãy chỉ ra lỗ hổng tư duy của họ ở phương án chọn sai đó.
3. Học nhanh (Mnemonic hay Mẹo Takenote): Sáng tạo ra 1 câu thơ ngắn, 1 quy tắc viết tắt sinh động, hoặc so sánh liên tưởng thực tế để họ nhớ sâu vĩnh viễn khái niệm này.
4. 1 Câu hỏi phụ siêu ngắn: Đưa ra 1 câu hỏi phản xạ active recall cực nhanh liên quan đến kiến thức này để họ tự trả lời nhẩm trong đầu.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini AI Explain Error:", error);
    res.status(500).json({ 
      error: error.message || "Không thể gọi trợ lý AI. Vui lòng kiểm tra cấu hình khóa API trong Settings > Secrets.",
      isAiError: true 
    });
  }
});

// API 2: Dynamic Study diagnostics advice based on historic performance
app.post("/api/ai/diagnose", async (req, res) => {
  try {
    const { stats, weakModules, strengthModules } = req.body;
    
    const client = getGeminiAI();
    const prompt = `Phân tích kết quả ôn tập trắc nghiệm Năng Lực Số của học viên:
Tỷ lệ làm đúng trung bình: ${stats?.avgScore || 0}%
Số lượt luyện đề đã làm: ${stats?.sessionsCount || 0} lượt.
Các module còn YẾU (tỷ lệ đúng thấp): ${JSON.stringify(weakModules || [])}
Các module là THẾ MẠNH (tỷ lệ đúng cao): ${JSON.stringify(strengthModules || [])}

Hãy xây dựng cho học viên một "Giải Pháp Hỗ Trợ Học Tập Cá Nhân Hóa" (Lộ trình Ôn tập Spaced Repetition):
1. Đánh giá tổng quan tình hình năng lực số hiện tại của họ một cách tích cực và khoa học.
2. Gợi ý cụ thể chế độ giãn cách ngày ôn (Spaced Repetition Schedule) phù hợp cho những module yếu. Ví dụ: Module yếu cần ôn lại sau 1 ngày, 3 ngày, 7 ngày bằng cách lật thẻ nhớ ra sao?
3. Đề xuất cách "Active Recall Cornell Takenotes" sáng tạo để nâng cao điểm số của module yếu đó.
4. Một câu nói truyền cảm hứng mạnh mẽ theo phong cách Silicon Valley năm 2026!`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini AI Diagnose Error:", error);
    res.status(500).json({ 
      error: error.message || "Không thể khởi động AI tư vấn học tập. Bạn vẫn có thể xem phân tích hiệu suất cục bộ bên dưới!",
      isAiError: true 
    });
  }
});

// API 3: Cornell Takenote Maker / Abbreviation creator
app.post("/api/ai/mnemonic", async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept) {
      return res.status(400).json({ error: "Thiếu khái niệm cần tạo takenote." });
    }

    const client = getGeminiAI();
    const prompt = `Hãy soạn một Thẻ ghi chú Takenote thông thái dạng phương pháp Cornell cho học phần Năng Lực Số về chủ đề/khái niệm: "${concept}".
Cấu trúc Thẻ ghi chú Cornell xuất ra phải bao gồm:
1. Từ Khóa Gợi Ý (Cues/Questions) - Bên trái: giúp kích hoạt phản xạ Active Recall.
2. Ghi Chép Cốt Lõi (Core Notes) - Ở giữa: Tóm tắt cực kỳ khoa học, giản lược tối đa, dễ nhìn.
3. Mẹo Ghi Nhớ Sáng Tạo (Abbreviation/Mnemonic/Chữ viết tắt hoặc Thơ nhớ lâu) độc đáo.
4. Tóm Tắt (Summary) - Dưới cùng: 1-2 câu kết tinh tinh hoa của khái niệm này.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini AI Mnemonic Error:", error);
    res.status(500).json({ 
      error: error.message || "Không thể kết nối AI tạo Takenote. Vui lòng thiết lập khóa API để mở khóa tính năng này.",
      isAiError: true 
    });
  }
});

async function startServer() {
  // Serve frontend assets
  const distPath = path.join(process.cwd(), "dist");

  if (process.env.NODE_ENV !== "production") {
    // We will load Vite dynamically inside dev server
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
