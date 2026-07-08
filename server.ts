import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. AI Features might not work.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing JSON
  app.use(express.json());

  // ------------------- API ROUTES -------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Chatbot Endpoint (Tour guide assistant about Thanh Hoa)
  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    try {
      const ai = getGeminiClient();
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: "Xin chào! Hiện tại hệ thống chưa cấu hình khóa API (GEMINI_API_KEY). Tuy nhiên, tôi là Trợ lý Ảo xứ Thanh, tôi có thể tư vấn cho bạn rằng Thanh Hóa có rất nhiều danh lam thắng cảnh như biển Sầm Sơn náo nhiệt, khu bảo tồn thiên nhiên Pù Luông mộc mạc hoang sơ, và di tích lịch sử Thành Nhà Hồ vĩ đại. Bạn hãy nhập khóa API trong Secrets để khám phá hết sức mạnh AI của tôi nhé!"
        });
      }

      const contents = history ? history.map((item: any) => ({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.text }]
      })) : [];

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const systemInstruction = `Bạn là "Trợ lý du lịch Hello Thanh Hóa" - một chuyên gia am hiểu tường tận về địa lý, văn hóa, danh lam thắng cảnh, ẩm thực, lịch sử và con người của xứ Thanh (tỉnh Thanh Hóa, Việt Nam).
Nhiệm vụ của bạn là tư vấn du lịch, gợi ý địa điểm ăn uống, nghỉ ngơi, vui chơi giải trí cho du khách một cách thân thiện, khách quan, hào hứng và chân thực.
Dưới đây là một số địa điểm nổi tiếng có sẵn trong cơ sở dữ liệu của chúng ta mà bạn nên ưu tiên giới thiệu:
1. Khu bảo tồn thiên nhiên Pù Luông (Bá Thước) - tuyệt tác ruộng bậc thang hoang sơ, thác Hiêu, vịt Cổ Lũng, thích hợp nghỉ dưỡng thiên nhiên.
2. Bãi biển Sầm Sơn - sôi động nhộn nhịp, sóng mạnh, quảng trường biển hiện đại, hải sản phong phú.
3. Thành Nhà Hồ (Vĩnh Lộc) - Di sản văn hóa thế giới UNESCO, thành đá kiệt tác kiến trúc quân sự cổ đại triều Hồ Quý Ly.
4. Suối cá thần Cẩm Lương (Cẩm Thủy) - dòng suối kỳ bí ngàn cá thần bơi lội thanh bình bên đền Ngọc cổ kính.
5. Ẩm thực nổi tiếng: Nem chua Thanh Hóa (đặc biệt nem Thanh Mai), hải sản Sầm Sơn (Nhà hàng Biển Nhớ), chả tôm Thanh Hóa, bánh khoái tép, bánh răng bừa (bánh lá).
6. Khách sạn cao cấp: Khách sạn Mường Thanh Luxury Đông Vệ, Meliá Vinpearl 27 Trần Phú (cao nhất thành phố, có Skybar tuyệt đẹp).
7. Mua sắm: Vincom Plaza Thanh Hóa, Chợ Vườn Hoa, Chợ Sầm Sơn.
8. Giáo dục: Đại học Hồng Đức, trường Chuyên Lam Sơn.

Hãy trả lời bằng tiếng Việt một cách lịch sự, cuốn hút. Sử dụng định dạng markdown rõ ràng, xuống dòng hợp lý, có sử dụng các gạch đầu dòng để người đọc dễ theo dõi. Tránh trả lời khô khan hay lặp từ.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error in /api/chat:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi kết nối với AI: ' + error.message });
    }
  });

  // Trip Itinerary Planner Endpoint
  app.post('/api/plan', async (req, res) => {
    const { duration, interests, district, spots } = req.body;

    try {
      const ai = getGeminiClient();
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `### Lịch trình du lịch Thanh Hóa gợi ý (Chế độ mô phỏng)

**Thời gian:** ${duration || '2 Ngày 1 Đêm'}
**Khu vực:** ${district || 'Tất cả các khu vực'}
**Sở thích:** ${interests && interests.length > 0 ? interests.join(', ') : 'Khám phá chung'}

---

#### 📍 Ngày 1: Khám phá Trung tâm & Biển Sầm Sơn
*   **Sáng:** Xuất phát đến TP. Thanh Hóa. Thưởng thức đặc sản **Nem chua Thanh Hóa** và bánh cuốn nóng hổi tại khu vực Trường Thi. Ghé thăm di tích lịch sử núi Hàm Rồng hoặc đền thờ Bà Triệu.
*   **Trưa:** Di chuyển xuống **Bãi biển Sầm Sơn** (khoảng 16km từ trung tâm). Nhận phòng khách sạn (ví dụ: resort FLC hoặc khu vực bãi tắm C) và dùng bữa trưa hải sản tươi rói tại **Nhà hàng Biển Nhớ**.
*   **Chiều:** Tự do tắm biển Sầm Sơn, đón những con sóng mạnh mẽ đặc trưng. Tham quan **Đền Độc Cước** linh thiêng cổ kính tọa lạc trên hòn núi đá hướng biển và check-in **Hòn Trống Mái**.
*   **Tối:** Tản bộ dọc quảng trường biển Sầm Sơn náo nhiệt, thưởng thức hải sản nướng vỉa hè hoặc cafe view biển ngắm hoàng hôn cực đỉnh tại **The Coastal Roasters**.

#### 📍 Ngày 2: Tìm về thiên nhiên hoang sơ Pù Luông hoặc Di sản văn hóa
*   **Sáng:** Dậy sớm đón bình minh tuyệt đẹp trên biển Sầm Sơn. Ăn sáng bún hải sản. Sau đó khởi hành đi **Khu bảo tồn thiên nhiên Pù Luông** (hướng Bá Thước) để ngắm nhìn những thửa ruộng bậc thang tuyệt mỹ xanh ngắt hoặc đi **Thành Nhà Hồ** cổ kính để chiêm ngưỡng kiệt tác ghép đá khổng lồ.
*   **Trưa:** Ăn trưa đặc sản Vịt Cổ Lũng quay thơm lừng hoặc gà đồi, cơm lam nướng tại Pù Luông.
*   **Chiều:** Thăm **Suối cá thần Cẩm Lương** kỳ bí, ngắm hàng vạn chú cá thần bơi lội thanh bình dưới chân núi Trường Sinh trước khi xuất phát trở về.

*(Để trải nghiệm lịch trình chi tiết và cá nhân hóa sâu sắc bằng AI thông minh thực sự, quý khách vui lòng cấu hình GEMINI_API_KEY trong mục Settings > Secrets)*`
        });
      }

      const interestsStr = interests && interests.length > 0 ? interests.join(', ') : 'Khám phá tổng hợp';
      const spotsStr = spots && spots.length > 0 ? spots.join(', ') : 'Các địa điểm nổi bật của Thanh Hóa';

      const prompt = `Lập lịch trình du lịch chi tiết cho chuyến đi Thanh Hóa với các tham số sau:
- Thời gian: ${duration}
- Khu vực trọng tâm: ${district}
- Sở thích của tôi: ${interestsStr}
- Danh sách địa điểm tôi muốn ghé thăm nếu có thể: ${spotsStr}

Hãy thiết kế lịch trình cụ thể từng buổi (Sáng, Trưa, Chiều, Tối) cho mỗi ngày.
Đưa ra gợi ý về phương tiện di chuyển, trang phục phù hợp, các món ăn đặc sản địa phương nổi bật phải thử trong chuyến đi (như Nem chua, vịt Cổ Lũng, hải sản Sầm Sơn, chả tôm...) và các mẹo hữu ích để tiết kiệm chi phí cũng như có trải nghiệm tuyệt vời nhất.
Câu trả lời phải có cấu trúc markdown chuyên nghiệp, đẹp mắt với các tiêu đề hấp dẫn, biểu tượng cảm xúc (emoji) trực quan sinh động.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          temperature: 0.8,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error in /api/plan:', error);
      res.status(500).json({ error: 'Đã xảy ra lỗi khi AI lập lịch trình: ' + error.message });
    }
  });

  // ------------------- DEV/PROD ROUTING & INTEGRATION -------------------

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve the built dist directory
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server Hello Thanh Hóa running on http://localhost:${PORT}`);
  });
}

startServer();
