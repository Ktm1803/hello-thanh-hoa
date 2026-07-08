import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Calendar, Compass, RefreshCw, Bot, User, HelpCircle, Loader2 } from 'lucide-react';
import { Spot, SPOTS } from '../data';

// Simple lightweight Markdown converter helper to avoid markdown parser runtime bugs
function renderMarkdownToHtml(markdown: string) {
  if (!markdown) return '';
  
  // Split lines
  const lines = markdown.split('\n');
  let insideList = false;
  let html = '';

  for (let line of lines) {
    let cleanLine = line.trim();
    
    // Header 3
    if (cleanLine.startsWith('### ')) {
      if (insideList) { html += '</ul>'; insideList = false; }
      html += `<h3 class="text-base font-extrabold text-slate-800 mt-5 mb-2.5 flex items-center gap-1.5">${cleanLine.substring(4)}</h3>`;
      continue;
    }
    
    // Header 4
    if (cleanLine.startsWith('#### ')) {
      if (insideList) { html += '</ul>'; insideList = false; }
      html += `<h4 class="text-sm font-bold text-slate-800 mt-4 mb-2">${cleanLine.substring(5)}</h4>`;
      continue;
    }

    // Divider
    if (cleanLine === '---' || cleanLine === '***') {
      if (insideList) { html += '</ul>'; insideList = false; }
      html += `<hr class="my-4 border-slate-100" />`;
      continue;
    }

    // Bullet points
    if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
      if (!insideList) { html += '<ul class="list-disc pl-5 space-y-1.5 my-3 text-xs leading-relaxed text-slate-600 font-light">'; insideList = true; }
      // Bold rendering inside list
      let itemText = cleanLine.substring(2);
      itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');
      html += `<li>${itemText}</li>`;
      continue;
    }

    // Standard list items like 1. 2.
    const numberedListRegex = /^\d+\.\s(.*)/;
    if (numberedListRegex.test(cleanLine)) {
      if (insideList) { html += '</ul>'; insideList = false; }
      const match = cleanLine.match(numberedListRegex);
      let itemText = match ? match[1] : cleanLine;
      itemText = itemText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');
      html += `<div class="pl-4 py-1.5 border-l-2 border-blue-100 text-xs text-slate-600 leading-relaxed font-light my-2">${itemText}</div>`;
      continue;
    }

    // Empty lines
    if (cleanLine === '') {
      if (insideList) { html += '</ul>'; insideList = false; }
      continue;
    }

    // Normal paragraph
    if (insideList) { html += '</ul>'; insideList = false; }
    let pText = cleanLine.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-800">$1</strong>');
    html += `<p class="text-xs text-slate-600 leading-relaxed font-light mb-3">${pText}</p>`;
  }

  if (insideList) { html += '</ul>'; }
  return html;
}

interface AiPlannerViewProps {
  preselectedSpotId?: string | null;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AiPlannerView({ preselectedSpotId }: AiPlannerViewProps) {
  // Mode selection: planner vs chat
  const [activeMode, setActiveMode] = useState<'planner' | 'chat'>('planner');

  // 1. Planner State
  const [duration, setDuration] = useState('2 Ngày 1 Đêm');
  const [district, setDistrict] = useState('Tất cả khu vực');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [itineraryResult, setItineraryResult] = useState<string | null>(null);

  // 2. Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: 'model', text: 'Xin chào quý khách! Tôi là Trợ lý Du lịch Hello Thanh Hóa. Tôi ở đây để hỗ trợ giải đáp mọi thắc mắc của bạn về danh lam thắng cảnh, khách sạn, ẩm thực và kinh nghiệm du lịch tại xứ Thanh. Hôm nay bạn muốn hỏi về điều gì?' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If a spot is preselected, pre-fill it in selectedSpots
    if (preselectedSpotId) {
      const spot = SPOTS.find(s => s.id === preselectedSpotId);
      if (spot && !selectedSpots.includes(spot.name)) {
        setSelectedSpots([spot.name]);
        // Also switch region
        if (spot.district) {
          setDistrict(spot.district);
        }
      }
    }
  }, [preselectedSpotId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  // Interest options
  const interestOptions = [
    { value: 'Thiên nhiên', label: '🏞️ Thiên nhiên hoang sơ' },
    { value: 'Biển dã ngoại', label: '🏖️ Biển & Nghỉ dưỡng' },
    { value: 'Lịch sử di tích', label: '🏺 Di tích lịch sử' },
    { value: 'Ẩm thực ăn uống', label: '🍲 Đặc sản ẩm thực' },
    { value: 'Cà phê check-in', label: '☕ Cafe & Sống ảo' },
    { value: 'Tâm linh', label: '⛩️ Đền chùa tâm linh' },
  ];

  // District options
  const districts = [
    'Tất cả khu vực',
    'Thành phố Thanh Hóa',
    'Thành phố Sầm Sơn',
    'Thị xã Bỉm Sơn',
    'Thị xã Nghi Sơn',
    'Huyện Bá Thước',
    'Huyện Cẩm Thủy',
    'Huyện Đông Sơn',
    'Huyện Hà Trung',
    'Huyện Hậu Lộc',
    'Huyện Hoằng Hóa',
    'Huyện Lang Chánh',
    'Huyện Mường Lát',
    'Huyện Nga Sơn',
    'Huyện Ngọc Lặc',
    'Huyện Như Thanh',
    'Huyện Như Xuân',
    'Huyện Nông Cống',
    'Huyện Quan Hóa',
    'Huyện Quan Sơn',
    'Huyện Quảng Xương',
    'Huyện Thạch Thành',
    'Huyện Thiệu Hóa',
    'Huyện Thọ Xuân',
    'Huyện Thường Xuân',
    'Huyện Triệu Sơn',
    'Huyện Vĩnh Lộc'
  ];

  const handleInterestToggle = (val: string) => {
    setSelectedInterests(prev => 
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleSpotToggle = (spotName: string) => {
    setSelectedSpots(prev => 
      prev.includes(spotName) ? prev.filter(x => x !== spotName) : [...prev, spotName]
    );
  };

  // Submit Itinerary Planner Form
  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPlan(true);
    setItineraryResult(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          duration,
          interests: selectedInterests,
          district,
          spots: selectedSpots
        })
      });

      if (!response.ok) {
        throw new Error('Không thể lập lịch trình');
      }

      const data = await response.json();
      setItineraryResult(data.text);
    } catch (err: any) {
      console.error(err);
      setItineraryResult(`❌ Lỗi hệ thống: Không thể kết nối với AI để tạo lịch trình. Vui lòng thử lại sau giây lát.`);
    } finally {
      setLoadingPlan(false);
    }
  };

  // Submit Tour Guide Chat Message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error('Lỗi máy chủ khi chat');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', text: '🤖 Rất tiếc, đường truyền kết nối AI bị gián đoạn. Vui lòng kiểm tra lại thiết lập của bạn hoặc thử lại sau.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" /> Trợ Lý Lập Lịch Trình & Tư Vấn AI
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Ứng dụng công nghệ AI tạo sinh để đồng hành cùng bạn trên mọi hành trình khám phá xứ Thanh.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-center">
          <button
            onClick={() => setActiveMode('planner')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'planner' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Lên lịch trình tự động
          </button>
          <button
            onClick={() => setActiveMode('chat')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Trò chuyện với Tour Guide
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {activeMode === 'planner' ? (
          /* Planner Mode View */
          <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Left: Input Form (2 cols) */}
            <form onSubmit={handleGeneratePlan} className="lg:col-span-2 p-6 space-y-5">
              <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-50 pb-2 flex items-center gap-2">
                <Calendar className="w-4.5 h-4.5 text-blue-600" /> Thiết kế chuyến đi của bạn
              </h2>

              {/* Duration select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Thời gian chuyến đi</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1 Ngày', '2 Ngày 1 Đêm', '3 Ngày 2 Đêm'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDuration(t)}
                      className={`py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        duration === t 
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* District select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Khu vực muốn khám phá</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Interests multi-select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Sở thích du lịch</label>
                <div className="grid grid-cols-2 gap-2">
                  {interestOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleInterestToggle(opt.value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                        selectedInterests.includes(opt.value)
                          ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spots selections */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Thêm các địa danh muốn ghé qua ({selectedSpots.length})
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2.5 space-y-1.5 divide-y divide-slate-50/50">
                  {SPOTS.map(spot => (
                    <label key={spot.id} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 py-1 select-none">
                      <input
                        type="checkbox"
                        checked={selectedSpots.includes(spot.name)}
                        onChange={() => handleSpotToggle(spot.name)}
                        className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span className="line-clamp-1">{spot.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPlan}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs py-3 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loadingPlan ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" /> Đang tạo lịch trình với AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5" /> Tạo lịch trình tự động bằng AI
                  </>
                )}
              </button>
            </form>

            {/* Right: Results display (3 cols) */}
            <div className="lg:col-span-3 p-6 bg-slate-50/50 flex flex-col justify-center min-h-[350px]">
              {loadingPlan ? (
                <div className="text-center py-12 max-w-sm mx-auto space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-blue-100 text-blue-600 animate-bounce">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">Đang suy luận lộ trình lý tưởng...</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Mô hình AI đang kết nối, tính toán khoảng cách đường đi, thời lượng mở cửa và phong vị ẩm thực địa phương để kiến tạo trải nghiệm tuyệt vời nhất cho bạn.
                  </p>
                </div>
              ) : itineraryResult ? (
                /* Plan result markdown render */
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Lịch trình đề xuất cho bạn</span>
                    <button 
                      onClick={() => { setItineraryResult(null); setSelectedSpots([]); setSelectedInterests([]); }}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Lên kế hoạch khác
                    </button>
                  </div>
                  
                  {/* Itinerary output scrollarea */}
                  <div className="flex-1 max-h-[450px] overflow-y-auto pr-2 no-scrollbar">
                    <div 
                      className="prose prose-sm text-slate-700"
                      dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(itineraryResult) }}
                    />
                  </div>
                </div>
              ) : (
                /* No result state */
                <div className="text-center py-12 max-w-sm mx-auto space-y-3">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 mx-auto">
                    <Compass className="w-6.5 h-6.5 text-blue-500" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Chưa có lịch trình được tạo</h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-light">
                    Vui lòng điều chỉnh các tùy chọn thời gian, địa điểm, sở thích ở cột bên trái và nhấn nút "Tạo lịch trình" để AI đồng hành lập lộ trình hoàn hảo nhất cho bạn.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tour Guide Chatbot View */
          <div className="flex flex-col h-[520px]">
            {/* Chat Messages scroll area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/40">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex gap-3.5 max-w-2xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border shadow-xs ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-white text-blue-600 border-slate-100'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed border shadow-xs ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white border-blue-500 font-medium' 
                      : 'bg-white text-slate-700 border-slate-100 font-light'
                  }`}>
                    {/* Render helper */}
                    {msg.role === 'model' ? (
                      <div 
                        className="space-y-2"
                        dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(msg.text) }}
                      />
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Chat loading state */}
              {chatLoading && (
                <div className="flex gap-3.5 max-w-xs">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-white text-blue-600 border border-slate-100 shadow-xs animate-spin">
                    <Loader2 className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-xs text-xs text-slate-400 italic">
                    Đang tìm kiếm thông tin tư vấn...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts Suggestions */}
            <div className="px-5 py-2.5 bg-white border-t border-b border-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                'Kể tên đặc sản nổi tiếng Thanh Hóa?',
                'Du lịch Pù Luông mùa nào đẹp nhất?',
                'Kinh nghiệm đi biển Sầm Sơn tự túc?',
                'Có di tích lịch sử nào cổ kính?'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setChatInput(q); }}
                  className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100/50 text-[10px] font-bold shrink-0 transition-all cursor-pointer"
                >
                  💡 {q}
                </button>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendChatMessage} className="p-4 bg-white border-t border-slate-100 flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn về du lịch, ẩm thực Thanh Hóa tại đây..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
