export interface Question {
  id: number;
  module: number;
  moduleName: string;
  code?: string; // e.g. "CLO1", "CLO2"
  difficulty: "Dễ" | "Trung bình" | "Khó";
  text: string;
  options: {
    key: string;
    text: string;
  }[];
  correctKey: string;
  explanation: string;
}

export const QUESTIONS_DB: Question[] = [
  // Module 1: Khái niệm cơ bản về máy tính, phần cứng, phần mềm, hệ điều hành
  {
    id: 1,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Dễ",
    text: "Thành phần nào sau đây được xem là phần cứng (Hardware) của máy tính?",
    options: [
      { key: "A", text: "Hệ điều hành Windows" },
      { key: "B", text: "Bộ xử lý trung tâm (CPU)" },
      { key: "C", text: "Trình duyệt web Google Chrome" },
      { key: "D", text: "Phần mềm diệt virus" }
    ],
    correctKey: "B",
    explanation: "CPU (Central Processing Unit) là bộ phận phần cứng vật lý thực hiện các phép tính và xử lý dữ liệu của máy tính. Các phương án còn lại là phần mềm."
  },
  {
    id: 2,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Dễ",
    text: "Hệ điều hành (Operating System) có vai trò chính nào sau đây?",
    options: [
      { key: "A", text: "Soạn thảo văn bản và lập bảng tính" },
      { key: "B", text: "Quản lý, điều phối tài nguyên phần cứng và cung cấp giao diện cho người dùng" },
      { key: "C", text: "Tự động thiết kế hình ảnh và tạo nội dung đa phương tiện" },
      { key: "D", text: "Kết nối mạng diện rộng toàn cầu không cần thiết bị thu phát" }
    ],
    correctKey: "B",
    explanation: "Hệ điều hành đóng vai trò là cầu nối quản lý phần cứng, phân phối tài nguyên hệ thống (RAM, CPU) cho các phần mềm ứng dụng khác và hiển thị giao diện để con người tương tác."
  },
  {
    id: 3,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Trung bình",
    text: "Khi máy tính của bạn chạy rất chậm khi mở nhiều ứng dụng cùng lúc và kiểm tra Task Manager thấy mức sử dụng bộ nhớ (Memory/RAM) liên tục ở mức 95-99%, giải pháp phần cứng nào là hiệu quả nhất?",
    options: [
      { key: "A", text: "Thay thế màn hình có độ phân giải cao hơn" },
      { key: "B", text: "Cài đặt lại hệ điều hành Windows gốc" },
      { key: "C", text: "Lắp thêm hoặc nâng cấp thanh RAM có dung lượng lớn hơn" },
      { key: "D", text: "Mua thêm ổ cứng di động SSD bên ngoài để lưu dữ liệu cá nhân" }
    ],
    correctKey: "C",
    explanation: "Khi RAM bị đầy (95-99%), hệ điều hành phải liên tục hoán đổi dữ liệu giữa RAM và bộ nhớ ảo trên ổ cứng (Virtual Memory), gây hiện tượng giật lag nghiêm trọng. Nâng cấp RAM sẽ giúp máy đa nhiệm tốt hơn mà không bị quá tải bộ nhớ."
  },
  {
    id: 4,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Khó",
    text: "Bạn cần sao chép một tệp video nặng 6GB từ máy tính vào USB định dạng chuẩn FAT32 nhưng máy tính liên tục báo lỗi 'File is too large for the destination file system' mặc dù USB còn trống 16GB. Nguyên nhân là gì?",
    options: [
      { key: "A", text: "USB của bạn đã bị hỏng bộ nhớ flash bên trong" },
      { key: "B", text: "Hệ thống tệp FAT32 giới hạn dung lượng tệp tin đơn cực đại là < 4GB" },
      { key: "C", text: "Máy tính của bạn đã bị nhiễm virus ghi đè mã tệp tin" },
      { key: "D", text: "Tệp video của bạn bị lỗi định dạng mã hóa và cần chuyển đổi sang .avi" }
    ],
    correctKey: "B",
    explanation: "Hệ thống tệp FAT32 (thường có trên các USB đời cũ) có một giới hạn vật lý là không thể lưu trữ bất kỳ tệp tin đơn lẻ nào vượt quá kích thước 4GB. Giải pháp là format lại USB sang chuẩn NTFS hoặc exFAT."
  },

  // Module 2: Kỹ năng tìm kiếm, khai thác, đánh giá dữ liệu/thông tin
  {
    id: 5,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Dễ",
    text: "Để tìm kiếm chính xác một cụm từ nguyên văn trên Google không bị chia tách các từ đơn lẻ, bạn nên đặt cụm từ đó trong ký tự nào?",
    options: [
      { key: "A", text: "Cặp dấu ngoặc đơn ( )" },
      { key: "B", text: "Cặp dấu ngoặc vuông [ ]" },
      { key: "C", text: "Cặp dấu ngoặc kép \" \"" },
      { key: "D", text: "Mỗi từ bắt đầu bằng dấu sao *" }
    ],
    correctKey: "C",
    explanation: "Đặt từ khóa trong cặp dấu ngoặc kép \"[từ_khóa]\" yêu cầu Google hiển thị chính xác các kết quả chứa cụm từ đó theo đúng thứ tự các ký tự viết."
  },
  {
    id: 6,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Trung bình",
    text: "Bạn muốn tìm kiếm các tài liệu học thuật định dạng PDF nói về 'trí tuệ nhân tạo' trên Google. Cú pháp nào sau đây mang lại kết quả nhanh và chính xác nhất?",
    options: [
      { key: "A", text: "\"trí tuệ nhân tạo\" pdf file" },
      { key: "B", text: "\"trí tuệ nhân tạo\" filetype:pdf" },
      { key: "C", text: "trí tuệ nhân tạo format:pdf" },
      { key: "D", text: "tìm tất cả file pdf về trí tuệ nhân tạo" }
    ],
    correctKey: "B",
    explanation: "Toán tử `filetype:[đuôi_tệp]` là cú pháp tìm kiếm nâng cao chính thức của Google để giới hạn kết quả trả về chỉ gồm các tệp ở dạng được chỉ định (như pdf, docx, pptx)."
  },
  {
    id: 7,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Trung bình",
    text: "Khi đánh giá độ tin cậy của một bài báo khoa học hay thông tin mạng xã hội, phương pháp 'Tam giác đạc thông tin' (Triangulation) khuyên người học nên làm gì?",
    options: [
      { key: "A", text: "Chỉ chọn bài viết nào có giao diện đẹp mắt, trình bày gọn gàng" },
      { key: "B", text: "Tìm kiếm thêm ít nhất 2 nguồn tin độc lập, uy tín khác để đối chiếu và xác minh liên chéo chéo chéo" },
      { key: "C", text: "Hỏi ý kiến bạn bè trên mạng xã hội Facebook hoặc TikTok" },
      { key: "D", text: "Tung đồng xu hoặc tự đưa ra phán đoán cảm quan cá nhân" }
    ],
    correctKey: "B",
    explanation: "Đối chiếu thông tin từ nhiều nguồn nghiên cứu độc lập khác nhau (Triangulation) giúp loại bỏ các sai lệch, thiên kiến cá nhân hoặc tin giả, đảm bảo tính khách quan tối đa."
  },
  {
    id: 8,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Khó",
    text: "Hiện tượng 'Filter Bubble' (Bong bóng lọc) trong quá trình chúng ta tìm kiếm thông tin và duyệt mạng xã hội hàng ngày có nghĩa là gì?",
    options: [
      { key: "A", text: "Mạng internet bị chập chờn do cáp quang biển bị ảnh hưởng" },
      { key: "B", text: "Trình duyệt tự động chặn tất cả quảng cáo độc hại xâm nhập" },
      { key: "C", text: "Thuật toán cá nhân hóa thông tin của nền tảng chỉ huấn luyện và đề xuất các bài viết củng cố niềm tin cũ, cô lập người dùng khỏi các góc nhìn đa chiều" },
      { key: "D", text: "Việc người dùng tự cài đặt mật khẩu quá mạnh cho các mạng xã hội" }
    ],
    correctKey: "C",
    explanation: "Filter Bubble xảy ra do các thuật toán AI theo dõi sở thích của bạn và chỉ hiện những gì bạn muốn xem, từ đó lướt mạng lâu ngày bạn sẽ bị suy giảm khả năng tư duy phản biện và bao bọc trong bong bóng ý kiến của riêng mình."
  },

  // Module 3: Tổng quan về Trí tuệ nhân tạo (AI)
  {
    id: 9,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Dễ",
    text: "Trí tuệ nhân tạo tạo sinh (Generative AI - GenAI) khác biệt cốt lõi so với AI truyền thống khác ở điểm nào?",
    options: [
      { key: "A", text: "GenAI chỉ có thể xử lý các phép toán số liệu thống kê lớn" },
      { key: "B", text: "GenAI có khả năng tạo ra các nội dung mới hoàn toàn (như văn bản, hình ảnh, âm nhạc, video) dựa trên dữ liệu đã được học" },
      { key: "C", text: "GenAI không cần bất kỳ dữ liệu huấn luyện đầu vào nào" },
      { key: "D", text: "GenAI hoạt động hoàn toàn offline không cần card đồ họa" }
    ],
    correctKey: "B",
    explanation: "AI truyền thống thường làm nhiệm vụ phân loại (classification), dự đoán hoặc ra quyết định từ dữ liệu cũ, trong khi GenAI sử dụng các mô hình học sâu để tự sinh ra nội dung nguyên bản hoàn toàn mới."
  },
  {
    id: 10,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Trung bình",
    text: "Trong kỹ thuật viết prompt (viết câu lệnh), khung cấu trúc viết prompt 'CRAC' bao gồm những thành phần nào?",
    options: [
      { key: "A", text: "Context (Bối cảnh), Role (Vai trò), Action (Hành động), Constraint (Ràng buộc-Giới hạn)" },
      { key: "B", text: "Code (Mã lệnh), Run (Chạy), Analysis (Phân tích), Clear (Xóa)" },
      { key: "C", text: "Create (Sáng tạo), Review (Đánh giá), Ask (Hỏi), Confirm (Xác nhận)" },
      { key: "D", text: "Content (Nội dung), Role (Vai trò), Accuracy (Độ chính xác), Clip (Đoạn phim)" }
    ],
    correctKey: "A",
    explanation: "Khung CRAC (Context - Role - Action - Constraint) là nền tảng của Prompt Engineering giúp AI hiểu rõ: ai là người trả lời, bối cảnh bài toán ra sao, hành động cụ thể cần làm gì và các giới hạn về từ ngữ hay định dạng đầu ra."
  },
  {
    id: 11,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Trung bình",
    text: "Khi thiết lập tham số 'Temperature' (Nhiệt độ) của một mô hình ngôn ngữ lớn (LLM), giá trị Temperature bằng 0 hoặc cực kỳ thấp sẽ dẫn đến kết quả như thế nào?",
    options: [
      { key: "A", text: "Câu trả lời của AI sẽ rất bay bổng, sáng tạo và ngẫu hứng" },
      { key: "B", text: "Câu trả lời sẽ nhất quán, mang tính logic cao, tập trung vào phương án có xác xuất từ xuất hiện cao nhất và ít biến đổi" },
      { key: "C", text: "AI sẽ từ chối trả lời do bộ xử lý CPU quá nóng" },
      { key: "D", text: "Mô hình tự động dịch câu lệnh sang định dạng ngôn ngữ máy tính" }
    ],
    correctKey: "B",
    explanation: "Temperature kiểm soát độ ngẫu nhiên. Nhiệt độ càng cao thì AI càng sáng tạo và tùy biến; nhiệt độ càng thấp (về 0) thì câu trả lời càng chính xác, mang tính kỹ thuật, rập khuôn và lặp lại nhất quán giữa các lần hỏi."
  },
  {
    id: 12,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Khó",
    text: "Hiện tượng 'Hallucination' (Ảo giác) của các mô hình ngôn ngữ lớn (LLM) hiện nay chỉ hiện tượng gì?",
    options: [
      { key: "A", text: "Mô hình tự động offline khi mạng internet bị ngắt quãng đột ngột" },
      { key: "B", text: "AI đưa ra thông tin hoàn toàn sai lệch, bịa đặt hoặc không có thật nhưng được trình bày một cách rất tự tin, trôi chảy và đầy thuyết phục" },
      { key: "C", text: "AI bị lây nhiễm mã độc độc hại từ tệp tải lên đầu vào của người dùng" },
      { key: "D", text: "Mô hình liên tục từ chối xử lý các câu hỏi phức tạp liên quan đến tính toán" }
    ],
    correctKey: "B",
    explanation: "Do LLM hoạt động trên nguyên lý dự đoán token (từ/mẩu từ) tiếp theo dựa vào xác suất thống kê chứ không tự hiểu logic thực tế như con người, dẫn đến việc đôi khi chúng bịa ra số liệu hoặc tài liệu trích dẫn trông rất thật."
  },

  // Module 4: Giao tiếp và hợp tác trong môi trường số
  {
    id: 13,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Dễ",
    text: "Theo quy tắc xã giao mạng (Netiquette), hành vi viết HOÀN TOÀN BẰNG CHỮ IN HOA (CAPSLOCK) trong email hay tin nhắn nhóm trực tuyến sẽ được hiểu là gì?",
    options: [
      { key: "A", text: "Thể hiện ý kiến của bạn rất trang trọng và lịch sự" },
      { key: "B", text: "Tương đương với việc bạn đang quát tháo, hét lớn vào mặt người đối diện và gây cảm giác khó chịu" },
      { key: "C", text: "Giúp người đọc dễ phân loại văn bản quan trọng hơn" },
      { key: "D", text: "Để AI nhận diện ngôn ngữ tốt hơn không bị lỗi phông chữ" }
    ],
    correctKey: "B",
    explanation: "Trong văn hóa giao tiếp trực tuyến, sử dụng chữ IN HOA TOÀN BỘ tạo cảm giác hung hăng, tức giận, giống như đang la hét. Hãy hạn chế tối đa và dùng in đậm để nhấn mạnh thay thế."
  },
  {
    id: 14,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Trung bình",
    text: "Khi gửi email làm việc nhóm cho đồng nghiệp, hai trường 'CC' (Carbon Copy) và 'BCC' (Blind Carbon Copy) khác nhau như thế nào?",
    options: [
      { key: "A", text: "CC gửi nhanh hơn BCC" },
      { key: "B", text: "Các người nhận nằm ở danh sách CC sẽ bị ẩn đi; người nhận ở BCC thì công khai" },
      { key: "C", text: "Người nhận chính nằm ở 'To' và 'CC' có thể nhìn thấy địa chỉ email của nhau; trong khi người nhận ở 'BCC' sẽ hoàn toàn được ẩn danh (không ai biết họ nhận được bản sao email này)" },
      { key: "D", text: "BCC chỉ dùng để gửi các email có đính kèm file dung lượng nén cực lớn" }
    ],
    correctKey: "C",
    explanation: "BCC viết tắt của Blind Carbon Copy - giúp gửi bản sao email cho một người khác bí mật. Người nhận chính và người nhận ở CC sẽ không bao giờ biết được email này cũng được chuyển tiếp đến người ở BCC."
  },
  {
    id: 15,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Trung bình",
    text: "Trong một dự án nhóm làm việc từ xa trực tuyến có các thành viên ở các quốc gia chênh lệch múi giờ lớn, phương thức giao tiếp nào được ưu tiên để duy trì sự cân bằng cuộc sống và năng suất?",
    options: [
      { key: "A", text: "Giao tiếp đồng bộ (Synchronous) - gọi video liên tục bất kỳ lúc nào có việc" },
      { key: "B", text: "Giao tiếp bất đồng bộ (Asynchronous) - trao đổi qua email, bình luận tài liệu dùng chung, thread Slack/Teams để mọi người tự sắp xếp thời gian trả lời" },
      { key: "C", text: "Spam tin nhắn thoại Zalo liên tục đến khi đối phương bắt buộc phải nghe máy" },
      { key: "D", text: "Im lặng và tự làm thay toàn bộ công việc của các thành viên khác" }
    ],
    correctKey: "B",
    explanation: "Giao tiếp bất đồng bộ (Asynchronous) tôn trọng ranh giới múi giờ sinh hoạt, cho phép mọi người có các khoảng thời gian 'Deep Work' (làm việc sâu) tập trung cao độ và trả lời cẩn trọng khi rảnh."
  },
  {
    id: 16,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Khó",
    text: "Khi nhiều thành viên cùng chỉnh sửa chung một file thuyết trình trực tiếp trên Google Docs hay Google Slides, hành động nào đảm bảo văn hóa cộng tác số chuyên nghiệp nhất?",
    options: [
      { key: "A", text: "Tự ý sửa thẳng hoặc xóa nội dung của người khác mà không cần thông báo hay bàn bạc" },
      { key: "B", text: "Sử dụng tính năng 'Suggesting mode' (Chế độ gợi ý/đề xuất) và để lại bình luận giải thích, thảo luận thống nhất trước khi áp dụng trực tiếp" },
      { key: "C", text: "Cấm tính năng chỉnh sửa và bắt các thành viên gửi tệp Word riêng lẻ rồi tự mình ghép lại" },
      { key: "D", text: "Copy nội dung ra tệp riêng của mình, sau đó xóa tệp dự án chung đi" }
    ],
    correctKey: "B",
    explanation: "Sử dụng chế độ Suggesting (Track Changes) giúp bảo toàn đóng góp của người khác, tạo không gian thảo luận văn minh và minh bạch hóa lịch sử phiên bản để cả nhóm theo dõi dễ dàng."
  },

  // Module 5: Sáng tạo nội dung số
  {
    id: 17,
    module: 5,
    moduleName: "Module 5: Sáng tạo Nội dung Số & Bản quyền Truyền thông",
    difficulty: "Dễ",
    text: "Giấy phép Creative Commons (CC) được sử dụng rộng rãi nhằm mục đích chính nào sau đây?",
    options: [
      { key: "A", text: "Cấm hoàn toàn việc sao chép tác phẩm kỹ thuật số dưới mọi hình thức" },
      { key: "B", text: "Cho phép tác giả cấp quyền một cách linh hoạt cho người khác sử dụng tác phẩm số của mình một cách hoàn toàn miễn phí đi kèm với các điều kiện cụ thể" },
      { key: "C", text: "Giúp tác giả bán bản quyền hình ảnh cho các nhà đầu tư lớn trên thị trường" },
      { key: "D", text: "Bảo vệ thông tin cá nhân của tác giả không bị lộ ra ngoài mạng" }
    ],
    correctKey: "B",
    explanation: "Creative Commons (CC) là bộ giấy phép mở giúp tác giả chia sẻ sản phẩm (ảnh, nhạc, bài viết) cho cộng đồng dùng miễn phí, nhưng ràng buộc các điều khoản như: phải ghi công tác giả (BY), phi thương mại (NC), hay không phái sinh (ND)."
  },
  {
    id: 18,
    module: 5,
    moduleName: "Module 5: Sáng tạo Nội dung Số & Bản quyền Truyền thông",
    difficulty: "Trung bình",
    text: "Khi chèn hình ảnh minh họa từ trên mạng tìm kiếm vào bài thuyết trình slide học tập chính thức, hành vi nào thể hiện sự tôn trọng quyền sở hữu trí tuệ đúng luật?",
    options: [
      { key: "A", text: "Tải bất kỳ ảnh nào trên Google rồi dùng phần mềm photoshop xóa mờ logo/watermark của tác giả đi" },
      { key: "B", text: "Sử dụng hình ảnh từ các trang cung cấp ảnh miễn phí có bản quyền (như Unsplash, Pixabay) hoặc có giấy phép CC và trích dẫn chính xác nguồn gốc tác giả" },
      { key: "C", text: "Nói dối rằng tất cả các bức hình này đều tự mình chụp hoàn toàn" },
      { key: "D", text: "Không dùng hình ảnh nào mà chỉ trình bày chữ đơn điệu tránh rắc rối" }
    ],
    correctKey: "B",
    explanation: "Tuân thủ luật bản quyền đòi hỏi chúng ta sử dụng tác phẩm được cho phép (Public Domain, Creative Commons hoặc ảnh tự chụp) và luôn ghi rõ tên tác giả, tên tác phẩm cùng nguồn liên kết."
  },
  {
    id: 19,
    module: 5,
    moduleName: "Module 5: Sáng tạo Nội dung Số & Bản quyền Truyền thông",
    difficulty: "Trung bình",
    text: "Khi thiết kế một slide thuyết trình hoặc poster, nguyên tắc thiết kế 'Khoảng trắng' (White Space/Negative Space) có tác dụng gì quan trọng nhất?",
    options: [
      { key: "A", text: "Làm cho thiết kế trông trống rỗng, thể hiện sự thiếu đầu tư" },
      { key: "B", text: "Giúp bố cục thoáng đãng, giảm tải bớt áp lực điều tiết cho mắt người xem và làm nổi bật nội dung/thông điệp chính" },
      { key: "C", text: "Tiết kiệm tối đa chi phí mực in khi in ấn ra giấy" },
      { key: "D", text: "Để có chỗ trống chèn thêm thật nhiều hình ảnh gif trang trí" }
    ],
    correctKey: "B",
    explanation: "Khoảng trắng không phải là vô nghĩa mà là một yếu tố cấu trúc cực kỳ mạnh. Nó hướng sự chú ý của người xem vào các thông tin trọng tâm và ngăn chặn sự rối mắt khi nhồi nhét quá nhiều chữ."
  },
  {
    id: 20,
    module: 5,
    moduleName: "Module 5: Sáng tạo Nội dung Số & Bản quyền Truyền thông",
    difficulty: "Khó",
    text: "Lựa chọn xuất tệp đồ họa vector (định dạng như .svg, .eps) vượt trội hơn đồ họa raster (.jpg, .png) ở điểm nào khi thiết kế in ấn thương hiệu hành chính?",
    options: [
      { key: "A", text: "Đồ họa vector có dung lượng tệp tin nhẹ hơn và nhiều màu sắc rực rỡ hơn nhiều lần" },
      { key: "B", text: "Ảnh vector lưu trữ hình ảnh qua các công thức toán học, cho phép thu phóng không giới hạn kích thước mà không bao giờ bị vỡ hạt hay giảm độ chi tiết" },
      { key: "C", text: "Ảnh vector định dạng mở cho phép chạy trực tiếp trên các máy nghe nhạc" },
      { key: "D", text: "Hỗ trợ nén tệp tin động có lồng thêm nhạc nền" }
    ],
    correctKey: "B",
    explanation: "Đồ họa raster lưu theo lưới pixel vật lý nên khi zoom đại sẽ bị mờ sọc (pixelated). Đồ họa vector lưu bởi các phương trình toán học về điểm, đường cong nên có thể phóng to bằng tòa nhà mà vẫn sắc nét hoàn hảo."
  },

  // Module 6: An toàn và liêm chính học thuật
  {
    id: 21,
    module: 6,
    moduleName: "Module 6: An toàn Thông tin & Liêm chính Học thuật",
    difficulty: "Dễ",
    text: "Hình thức tấn công mạng 'Phishing' phổ biến nhất nhắm vào người dùng cá nhân thường hoạt động thế nào?",
    options: [
      { key: "A", text: "Sử dụng búa và xung điện vật lý phá hỏng vỏ máy tính trực tiếp" },
      { key: "B", text: "Gửi các email, tin nhắn giả mạo tổ chức uy tín (như ngân hàng, trường học) dụ dỗ người dùng click vào link giả để nhập mật khẩu hoặc tài khoản" },
      { key: "C", text: "Gia tăng tốc độ card đồ họa lên mức cực đại để làm hỏng phần cứng" },
      { key: "D", text: "Tự động gửi email quảng cáo bán hàng giá rẻ cho người thân của bạn" }
    ],
    correctKey: "B",
    explanation: "Phishing (tấn công giả mạo) là kỹ thuật xã hội (Social Engineering) lừa gạt tâm lý tò mò hoặc hoảng sợ của nạn nhân (ví dụ tài khoản bị khóa, trúng thưởng lớn) để họ tự dâng mật khẩu danh tính của mình cho kẻ xấu."
  },
  {
    id: 22,
    module: 6,
    moduleName: "Module 6: An toàn Thông tin & Liêm chính Học thuật",
    difficulty: "Trung bình",
    text: "Nguyên tắc sao lưu dữ liệu vàng '3-2-1' khuyên người dùng cá nhân phòng tránh mất mát thông tin chuyên nghiệp như thế nào?",
    options: [
      { key: "A", text: "Sao lưu dữ liệu 3 lần mỗi ngày, xóa tệp tin cũ sau mỗi 2 tiếng" },
      { key: "B", text: "Lưu trữ ít nhất 3 bản sao dữ liệu, trên 2 loại phương tiện lưu trữ vật lý khác nhau, trong đó có ít nhất 1 bản lưu trữ ở vị trí địa lý khác (như đám mây/off-site)" },
      { key: "C", text: "Sử dụng 3 mật khẩu khác nhau, đổi mật khẩu sau mỗi 21 ngày" },
      { key: "D", text: "Chỉ lưu trữ đúng 3 tệp tin quan trọng nhất và xóa sạch các thư mục rác" }
    ],
    correctKey: "B",
    explanation: "Nguyên tắc 3-2-1 bảo vệ bạn trước mọi hiểm họa (như cháy nhà mất ổ cứng, virus mã hóa ransomware). Có 3 bản (1 bản gốc + 2 bản sao), lưu trên 2 loại thiết bị (RAM/ổ gắn ngoài + PC), và 1 bản gửi lên Cloud cứu trợ khi có thiên tai."
  },
  {
    id: 23,
    module: 6,
    moduleName: "Module 6: An toàn Thông tin & Liêm chính Học thuật",
    difficulty: "Trung bình",
    text: "Theo chuẩn đạo đức liêm chính học thuật hiện nay (2026), việc sinh viên sử dụng AI tạo sinh (như ChatGPT) trong bài tập nghiên cứu khoa học bị coi là gian lận khi nào?",
    options: [
      { key: "A", text: "Sử dụng AI như một trợ lý để brainstorm tìm kiếm ý tưởng mới và sửa lỗi chính tả trước khi nộp" },
      { key: "B", text: "Nộp một sản phẩm bài viết được viết hoàn toàn 100% bởi AI dưới danh nghĩa bài tự viết cá nhân mà không hề có sự đóng góp thực tế và tuyệt đối không khai báo trung thực" },
      { key: "C", text: "Hỏi AI giải thích các khái niệm triết học khó hiểu trong sách giáo học" },
      { key: "D", text: "Đọc các tài liệu tham khảo bài báo do AI tóm tắt hỗ trợ" }
    ],
    correctKey: "B",
    explanation: "Liêm chính học thuật cho phép dùng AI làm công cụ hỗ trợ tư duy, nhưng hành vi sao chép nguyên văn sản phẩm của AI rồi ký tên mình lên là đạo văn, chiếm dụng trí tuệ giả và phi đạo đức."
  },
  {
    id: 24,
    module: 6,
    moduleName: "Module 6: An toàn Thông tin & Liêm chính Học thuật",
    difficulty: "Khó",
    text: "Bạn vô tình nhặt được một chiếc USB lạ nằm ở bãi đỗ xe hoặc bàn quán cafe công cộng. Hành động nào sau đây là an toàn và thông thái nhất?",
    options: [
      { key: "A", text: "Cắm thử ngay vào máy tính cá nhân để tò mò xem bên trong chứa những hình ảnh hay tài liệu gì" },
      { key: "B", text: "Đem nộp cho bộ phận phụ trách an ninh thông tin IT của cơ quan kiểm tra trong môi trường bảo lập, hoặc tuyệt đối không cắm vào bất kỳ máy tính nào có dữ liệu quan trọng" },
      { key: "C", text: "Đổi tên USB thành tên của mình và cắm vào để dùng lưu dữ liệu ngay lập tức" },
      { key: "D", text: "Thử cắm vào máy tính trường học công cộng cho đỡ hỏng máy nhà" }
    ],
    correctKey: "B",
    explanation: "USB Drop Attack là chiêu bài của hacker chèn sẵn mã độc tự chạy (autorun), virus ransomware hoặc thiết bị chập mạch dòng điện (USB Killer) để phá hủy máy tính. Cắm vào là dính bẫy lập tức."
  },

  // Additional rich questions from PDF content to make it 30 complete questions
  {
    id: 25,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Trung bình",
    text: "Định dạng tệp tin nào sau đây thường dùng làm tệp tài liệu văn bản có cấu trúc đầy đủ định dạng và có khả năng chỉnh sửa sâu dễ dàng?",
    options: [
      { key: "A", text: ".jpg" },
      { key: "B", text: ".mp3" },
      { key: "C", text: ".docx" },
      { key: "D", text: ".mp4" }
    ],
    correctKey: "C",
    explanation: "Đuôi tệp văn bản .docx là chuẩn định dạng văn bản mặc định của MS Word cho phép chỉnh sửa toàn diện, định dạng bảng biểu, phông chữ."
  },
  {
    id: 26,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Trung bình",
    text: "Dấu hiệu nào sau đây cho thấy một trang cung cấp thông tin học thuật trực tuyến có độ tin cậy và chính xác cao?",
    options: [
      { key: "A", text: "Trang web có nhiều banner quảng cáo nháy sáng liên tục" },
      { key: "B", text: "Trang web có tên miền kết thúc bằng đuôi .gov (Chính phủ) hoặc .edu (Tổ chức giáo dục đại học)" },
      { key: "C", text: "Không ghi rõ tên tác giả và không đưa ra bài viết tham chiếu" },
      { key: "D", text: "Sử dụng nhiều ngôn ngữ giật tít, phóng đại cảm xúc" }
    ],
    correctKey: "B",
    explanation: "Các tên miền của chính phủ (.gov hoặc .gov.vn) và các tổ chức giáo dục (.edu / .edu.vn) được kiểm duyệt nghiêm ngặt, đảm bảo tính chuẩn xác và trung lập của dữ liệu cung cấp."
  },
  {
    id: 27,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Khó",
    text: "Kỹ thuật 'Chain-of-Thought' (Chuỗi tư duy) trong viết prompt giúp cải thiện chất lượng câu trả lời của AI ở những tác vụ nào rõ ràng nhất?",
    options: [
      { key: "A", text: "Tăng tốc độ trả lời văn bản ngắn nhanh hơn 2 lần" },
      { key: "B", text: "Kích thích mô hình tự lập luận, phân tích từng bước một một cách logic trước khi đưa ra đáp án cuối cho những bài toán logic phức tạp" },
      { key: "C", text: "Tạo hình ảnh chân thực lấp lánh có chiều sâu 3D" },
      { key: "D", text: "Xóa toàn bộ các token đầu vào để tiết kiệm chi phí sử dụng API" }
    ],
    correctKey: "B",
    explanation: "Chain of Thought (ví dụ thêm câu lệnh 'Let's think step-by-step') yêu cầu AI trình bày tường minh các bước suy luận trung gian, giúp tránh được các lỗi tính toán sai lệch tức thì của LLM."
  },
  {
    id: 28,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Trung bình",
    text: "Khi tham gia một buổi họp trực tuyến chuyên nghiệp trên Zoom hoặc Microsoft Teams, hành vi ứng xử số lịch sự và tôn trọng thời gian của người khác là gì?",
    options: [
      { key: "A", text: "Luôn bật micro tự do để phát âm thanh tiếng ồn sinh hoạt của phòng mình" },
      { key: "B", text: "Tắt micro khi không phát biểu để tránh tạp âm, trang phục thanh lịch phù hợp và sử dụng nút 'Giơ tay' khi muốn phát biểu" },
      { key: "C", text: "Ăn uống lớn tiếng và vừa nằm trên giường học vừa tắt camera suốt buổi" },
      { key: "D", text: "Nhắn tin bông đùa riêng tư phá hỏng mạch thảo luận chung" }
    ],
    correctKey: "B",
    explanation: "Đây là chuẩn mực xã giao cơ bản trong hội họp trực tuyến để bảo vệ thính giác của những người nghe khác và duy trì sự chuyên nghiệp, trang trọng của tập thể."
  },
  {
    id: 29,
    module: 5,
    moduleName: "Module 5: Sáng tạo Nội dung Số & Bản quyền Truyền thông",
    difficulty: "Trung bình",
    text: "Quy trình cơ bản để sáng tạo một nội dung số (Digital Content) chất lượng thường tuân theo trình tự khoa học nào dưới đây?",
    options: [
      { key: "A", text: "Đăng tải lên mạng xã hội ngay lập tức -> Thu thập phản hồi -> Chỉnh sửa lỗi sau" },
      { key: "B", text: "Lên ý tưởng & Mục tiêu -> Thiết kế/Lập kế hoạch -> Sản xuất/Thực hiện -> Biên tập/Chỉnh sửa -> Phân phối & Đo lường hiệu quả" },
      { key: "C", text: "Sao chép nguyên văn bài viết của trang đối thủ -> Đăng tải dưới tên mình" },
      { key: "D", text: "Chạy quảng cáo trước khi sản xuất nội dung thực tế" }
    ],
    correctKey: "B",
    explanation: "Sáng tạo nội dung cần sự chuẩn bị bài bản: từ xây dựng ý tưởng, lên kịch bản slide lý thuyết, tiến hành thu âm sản xuất, sau đó kiểm tra chất lượng (editing) rồi mới đem phân phối ra cộng đồng."
  },
  {
    id: 30,
    module: 6,
    moduleName: "Module 6: An toàn Thông tin & Liêm chính Học thuật",
    difficulty: "Trung bình",
    text: "Dịch vụ xác thực hai yếu tố (Two-Factor Authentication - 2FA) giúp bảo vệ tài khoản trực tuyến của bạn tốt hơn bằng cách nào?",
    options: [
      { key: "A", text: "Yêu cầu bạn đặt 2 mật khẩu khác nhau dài trên 24 ký tự" },
      { key: "B", text: "Yêu cầu thêm một bước xác minh thứ hai (mã gửi về SMS, ứng dụng authenticator, hoặc mã vân tay sinh trắc học) ngoài mật khẩu thông thường khi đăng nhập từ thiết bị lạ" },
      { key: "C", text: "Tự động thay đổi mật khẩu của bạn liên tục 12 tiếng một lần" },
      { key: "D", text: "Ngăn chặn mọi tin nhắn rác gửi đến hòm thư trực tuyến của bạn" }
    ],
    correctKey: "B",
    explanation: "Với 2FA, ngay cả khi tin tặc lấy được mật khẩu chính xác của bạn, chúng vẫn không thể đăng nhập do không có thiết bị vật lý trong tay bạn (như điện thoại thông minh nhận mã OTP OTP)."
  },
  {
    id: 31,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Trung bình",
    text: "Khi máy tính bị đơ (treo máy) đột ngột không thể thao tác di chuột hoặc đóng ứng dụng, tổ hợp phím tắt nhanh nào trên Windows giúp bạn mở Task Manager trực tiếp để cưỡng bức tắt tiến trình bị lỗi?",
    options: [
      { key: "A", text: "Ctrl + Shift + Esc" },
      { key: "B", text: "Ctrl + Alt + Delete" },
      { key: "C", text: "Alt + F4" },
      { key: "D", text: "Windows + D" }
    ],
    correctKey: "A",
    explanation: "Ctrl + Shift + Esc mở trực tiếp Task Manager của Windows mà không cần qua màn hình trung gian như Ctrl + Alt + Del."
  },
  {
    id: 32,
    module: 1,
    moduleName: "Module 1: Phần cứng, Phần mềm & Hệ điều hành",
    difficulty: "Trung bình",
    text: "Vận hành phần cứng, ổ cứng thể rắn SSD (Solid State Drive) có ưu thế vật lý vượt trội nào sau đây so với ổ đĩa cơ truyền thống HDD (Hard Disk Drive)?",
    options: [
      { key: "A", text: "Không giới hạn số lần ghi chép và độ bền vĩnh cửu" },
      { key: "B", text: "Sử dụng chip nhớ Flash đem lại tốc độ đọc/ghi dữ liệu cực nhanh, chống sốc vật lý tốt do không có bộ phận cơ học quay" },
      { key: "C", text: "Giá thành dung lượng rẻ hơn HDD gấp nhiều lần" },
      { key: "D", text: "Khả năng tự động phục hồi dữ liệu kể cả khi bị chập cháy mạch điện" }
    ],
    correctKey: "B",
    explanation: "SSD dùng các chip nhớ thể rắn flash tĩnh, không có đầu đọc cơ hay đĩa từ quay như HDD, giúp tốc độ truy xuất dữ liệu nhanh hơn vượt bậc và giảm rủi ro hỏng cơ học khi di chuyển."
  },
  {
    id: 33,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Trung bình",
    text: "Khi sử dụng cú pháp tìm kiếm nâng cao 'site:tuoitre.vn \"năng lực số\"' trên Google, kết quả hiển thị cho người sử dụng sẽ là gì?",
    options: [
      { key: "A", text: "Tất cả các bài viết về năng lực số trên toàn thế giới ngoại trừ trang tuoitre.vn" },
      { key: "B", text: "Các bài viết chứa chính xác cụm từ \"năng lực số\" chỉ thuộc phạm vi tên miền tuoitre.vn" },
      { key: "C", text: "Danh sách các trang quảng cáo được tuoitre.vn mua tài trợ liên quan đến công nghệ" },
      { key: "D", text: "Mã lỗi truy tìm do cú pháp bị sai hạn định phân tách địa chỉ" }
    ],
    correctKey: "B",
    explanation: "Toán tử site:[tên_miền] giới hạn phạm vi tìm kiếm của Google chỉ quét các bài viết nằm trong trang web được chỉ định. Cặp dấu ngoặc kép ép buộc tìm chính xác cụm từ nguyên bản."
  },
  {
    id: 34,
    module: 2,
    moduleName: "Module 2: Khai thác Dữ liệu & Tìm kiếm Thông tin",
    difficulty: "Khó",
    text: "Trong phân tích dữ liệu trực tuyến, 'Bản đồ nhiệt' (Heatmap) thiết lập trên trang web chủ yếu cung cấp thông tin gì về hành vi khách hàng?",
    options: [
      { key: "A", text: "Nhiệt độ của ổ cứng máy chủ chứa trang web khi có nhiều người truy cập" },
      { key: "B", text: "Mật độ và các điểm/khu vực trên trang web thu hút sự chú ý chuột, nhấp chuột hoặc cuộn màn hình nhiều nhất của người dùng" },
      { key: "C", text: "Vị trí địa lý thời tiết nóng hay lạnh của người truy cập trang web" },
      { key: "D", text: "Mức độ bức xạ sóng wifi phát ra từ màn hình thiết bị người xem" }
    ],
    correctKey: "B",
    explanation: "Bản đồ nhiệt (Heatmap) chuyển hóa hoạt động rê chuột, click chuột và cuộn màn hình của hàng vạn người dùng thành dải màu trực quan (đỏ là hot, xanh là cold) giúp nhà quản trị tối ưu hóa trải nghiệm giao diện."
  },
  {
    id: 35,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Trung bình",
    text: "Kỹ thuật 'Few-Shot Prompting' khi thiết lập câu lệnh điều phối cho Trí tuệ Nhân tạo thế hệ mới (GenAI) được hiểu là gì?",
    options: [
      { key: "A", text: "Cung cấp cho AI một vài ví dụ minh hóa thực tế về dữ liệu đầu vào và kết quả đầu ra mong muốn để mô hình học theo mẫu" },
      { key: "B", text: "Yêu cầu AI đưa ra đáp án cực ngắn chỉ trong một hoặc hai từ duy nhất" },
      { key: "C", text: "Chia nhỏ câu hỏi lớn thành nhiều câu lệnh ngắn gửi liên tục cho AI" },
      { key: "D", text: "Huấn luyện lại toàn bộ trọng số của mô hình ngôn ngữ lớn để nó thuộc lòng kiến thức mới" }
    ],
    correctKey: "A",
    explanation: "Few-shot prompting là kỹ thuật huấn luyện lâm thời tại ngữ cảnh (In-context learning) bằng cách đưa ra vài mẫu ví dụ thực tế (shots) để mô hình nắm bắt định dạng, văn phong và logic trả lời mong muốn của người dùng."
  },
  {
    id: 36,
    module: 3,
    moduleName: "Module 3: Tổng quan Trí tuệ Nhân tạo & Prompt Engineering",
    difficulty: "Khó",
    text: "Khi xây dựng phần mềm tương tác AI, vai trò của 'System Instruction' (Chỉ dẫn hệ thống) khác biệt gì so với 'User Prompt' (Câu lệnh người dùng)?",
    options: [
      { key: "A", text: "System Instruction chỉ chạy được trên hệ thống server chạy hệ điều hành Linux" },
      { key: "B", text: "System Instruction là bộ quy tắc nền tảng ép buộc AI luôn tuân thủ suốt cuộc hội thoại (như đóng vai, rào cản hành vi, tông giọng), áp dụng trước khi câu hỏi của người dùng bắt đầu" },
      { key: "C", text: "User Prompt có độ ưu tiên cao hơn và có thể ghi đè vĩnh viễn System Instruction" },
      { key: "D", text: "System Instruction là mã nguồn dùng để lập trình giao diện của chatbot" }
    ],
    correctKey: "B",
    explanation: "System Instruction thiết lập tính cách, nhiệm vụ tối thượng và giới hạn an toàn vĩnh viễn cho mô hình AI, giúp nó không bị người dùng chèo lái hay lừa đảo phá vỡ quy tắc trong suốt phiên làm việc."
  },
  {
    id: 37,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Trung bình",
    text: "Tại sao các chuyên gia về nghi thức giao tiếp qua email (Email Etiquette) khuyên người sử dụng nên hết sức hạn chế dùng tính năng 'Reply All' (Phản hồi tất cả) trong đàm thoại nhóm?",
    options: [
      { key: "A", text: "Vì Reply All sẽ làm tăng gấp đôi chi phí cước internet khi truyền gửi thư" },
      { key: "B", text: "Tránh làm phiền, gây ngập lụt hộp thư (spam) của những người trong danh sách nhận ban đầu không liên quan trực tiếp đến nội dung phản hồi nội bộ đó" },
      { key: "C", text: "Hệ thống bảo mật email thường đánh dấu các email Reply All là thư rác chứa virus tự nhân bản" },
      { key: "D", text: "Hệ thống email không hỗ trợ gửi kèm tệp tin đính kèm khi chọn Reply All" }
    ],
    correctKey: "B",
    explanation: "Chỉ nên dùng Reply All khi mọi người trong luồng mail đều thực sự cần biết thông tin phản hồi của bạn. Việc lạm dụng Reply All gửi những câu ngắn gọn không liên quan như 'Ok', 'Cảm ơn' cho hàng chục người sẽ gây ức chế và làm ngập hòm thư đồng nghiệp."
  },
  {
    id: 38,
    module: 4,
    moduleName: "Module 4: Giao tiếp & Hợp tác trong Môi trường Số",
    difficulty: "Khó",
    text: "Khái niệm 'Dấu chân số chủ động' (Active Digital Footprint) bao gồm loại dữ liệu nào sau đây phát sinh từ người dùng?",
    options: [
      { key: "A", text: "Địa chỉ IP tự động do nhà mạng định vị khi bạn vừa bật router wifi tại nhà" },
      { key: "B", text: "Thông tin về lịch sử duyệt web ẩn danh được lưu tự động trong cookie của trình duyệt" },
      { key: "C", text: "Bất kỳ nội dung nào do chính bạn chủ động chia sẻ, đăng tải công khai lên mạng xã hội (như ảnh, status, bình luận, video)" },
      { key: "D", text: "Các bản vá bảo mật hệ thống tự động tải về cập nhật khi máy tính nhàn rỗi" }
    ],
    correctKey: "C",
    explanation: "Dấu chân số chủ động được tạo dựng cố ý khi người dùng công khai hoặc gửi đi các thông tin cá nhân lên internet. Dấu chân số thụ động (Passive) là các dữ liệu được ghi nhận tự động ngầm dưới nền mà người dùng không trực tiếp tạo ra."
  },
  {
    id: 39,
    module: 5,
    moduleName: "Module 5: Sáng tạo Nội dung Số & Bản quyền Truyền thông",
    difficulty: "Trung bình",
    text: "Bạn thấy một tài liệu nhạc số có giấy phép Creative Commons định dạng ký hiệu 'CC-BY-NC'. Ký hiệu này cấp điều kiện sử dụng thế nào cho cộng đồng?",
    options: [
      { key: "A", text: "Được dùng tự do, không cần ghi công tác giả nhưng bắt buộc phải trả phí bản quyền" },
      { key: "B", text: "Được sao chép, phân phối và sửa đổi tác phẩm miễn phí nhưng bắt buộc phải ghi công tác giả (BY) và chỉ được dùng cho mục đích phi thương mại (NC)" },
      { key: "C", text: "Cho phép dùng độc quyền cho hoạt động buôn bán quảng cáo nhãn hàng nếu ghi nhận tác giả" },
      { key: "D", text: "Cấm hoàn toàn việc chia sẻ hay tái phân phối dưới mọi hình thức" }
    ],
    correctKey: "B",
    explanation: "BY nghĩa là ghi công (Attribution), NC nghĩa là phi thương mại (Non-Commercial). Giấy phép CC-BY-NC cho phép cộng đồng tái sử dụng nhưng không được kiếm tiền trực tiếp từ tác phẩm đó và phải ghi rõ tên tác giả ban đầu."
  },
  {
    id: 40,
    module: 6,
    moduleName: "Module 6: An toàn Thông tin & Liêm chính Học thuật",
    difficulty: "Khó",
    text: "Trong an toàn thông tin, phần mềm gián điệp thuộc nhóm 'Keylogger' thực hiện hành vi nguy hiểm nào sau đây trên thiết bị của nạn nhân?",
    options: [
      { key: "A", text: "Cố lặp mã hóa tất cả các ảnh và văn bản để đòi tiền chuộc bằng tiền ảo" },
      { key: "B", text: "Ghi chép bí mật toàn bộ các phím bấm từ bàn phím vật lý để đánh cắp mật khẩu, thẻ tín dụng và dữ liệu trò chuyện gửi về máy hacker" },
      { key: "C", text: "Tự động tăng âm lượng loa cảnh báo đột ngột của hệ thống máy tính" },
      { key: "D", text: "Cố tình xóa phân vùng khởi động chính của hệ điều hành làm hỏng BIOS" }
    ],
    correctKey: "B",
    explanation: "Keylogger (Trình ghi thao tác bàn phím) âm thầm thu thập mọi phím gõ của bạn, từ đó tin tặc dễ dàng giải mã được mật khẩu tài khoản ngân hàng, mật khẩu mạng xã hội hoặc thông điệp nhạy cảm."
  }
];
