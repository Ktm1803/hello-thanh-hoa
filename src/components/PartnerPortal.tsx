import React, { useState } from 'react';
import { Building, TrendingUp, BookOpen, CheckCircle, Eye, MessageSquare, Award, Plus, ArrowRight, Upload, Facebook } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SPOTS } from '../data';
import ScrollReveal from './ScrollReveal';

export default function PartnerPortal() {
  // Tabs: register, articles, analytics
  const [activeTab, setActiveTab] = useState<'register' | 'articles' | 'analytics'>('register');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regCategory, setRegCategory] = useState('travel');
  const [regAddress, setRegAddress] = useState('');
  const [regDistrict, setRegDistrict] = useState('Thành phố Thanh Hóa');
  const [regDesc, setRegDesc] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regFacebookLink, setRegFacebookLink] = useState('');
  const [regImage, setRegImage] = useState('');
  const [regSubmitted, setRegSubmitted] = useState(false);

  // SEO Article State
  const [artTitle, setArtTitle] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState('Kinh nghiệm du lịch');
  const [artImage, setArtImage] = useState('');
  const [artFacebookLink, setArtFacebookLink] = useState('');
  const [artSubmitted, setArtSubmitted] = useState(false);

  // Helper for image file uploading (Converts File to Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        alert('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [articlesList, setArticlesList] = useState([
    { id: 1, title: 'Top 5 quán ăn Nem chua chính hiệu ngon nhất TP. Thanh Hóa', cat: 'Kinh nghiệm du lịch', views: '2.4k', date: '2026-07-01' },
    { id: 2, title: 'Lịch trình phượt Pù Luông 2 ngày 1 đêm chi tiết từ Hà Nội', cat: 'Cẩm nang phượt', views: '1.8k', date: '2026-06-25' },
    { id: 3, title: 'Hướng dẫn tham quan Thành Nhà Hồ di sản UNESCO tiết kiệm', cat: 'Di tích lịch sử', views: '950', date: '2026-06-12' },
  ]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regAddress.trim() || !regDesc.trim()) return;
    setRegSubmitted(true);
    setTimeout(() => {
      // Reset form fields
      setRegName('');
      setRegAddress('');
      setRegDesc('');
      setRegContact('');
      setRegFacebookLink('');
      setRegImage('');
    }, 4000);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) return;

    const newArt = {
      id: Date.now(),
      title: artTitle,
      cat: artCategory,
      views: '1',
      date: new Date().toISOString().split('T')[0]
    };

    setArticlesList([newArt, ...articlesList]);
    setArtTitle('');
    setArtContent('');
    setArtImage('');
    setArtFacebookLink('');
    setArtSubmitted(true);
    setTimeout(() => {
      setArtSubmitted(false);
    }, 4000);
  };

  // Recharts Chart Mock Data
  const analyticsData = [
    { name: 'T2', 'Lượt truy cập': 1200, 'Lượt Check-in': 340, 'Độ hài lòng (%)': 95 },
    { name: 'T3', 'Lượt truy cập': 1400, 'Lượt Check-in': 450, 'Độ hài lòng (%)': 97 },
    { name: 'T4', 'Lượt truy cập': 1800, 'Lượt Check-in': 560, 'Độ hài lòng (%)': 98 },
    { name: 'T5', 'Lượt truy cập': 1600, 'Lượt Check-in': 480, 'Độ hài lòng (%)': 96 },
    { name: 'T6', 'Lượt truy cập': 2400, 'Lượt Check-in': 780, 'Độ hài lòng (%)': 99 },
    { name: 'T7', 'Lượt truy cập': 4100, 'Lượt Check-in': 1560, 'Độ hài lòng (%)': 99 },
    { name: 'CN', 'Lượt truy cập': 4800, 'Lượt Check-in': 1920, 'Độ hài lòng (%)': 100 },
  ];

  const categoryPopularity = [
    { name: 'Du lịch', 'Mức độ quan tâm': 4200 },
    { name: 'Ẩm thực', 'Mức độ quan tâm': 3500 },
    { name: 'Khách sạn', 'Mức độ quan tâm': 2900 },
    { name: 'Cà phê', 'Mức độ quan tâm': 2100 },
    { name: 'Mua sắm', 'Mức độ quan tâm': 1100 },
    { name: 'Giáo dục', 'Mức độ quan tâm': 800 },
  ];

  return (
    <div className="w-full">
      {/* Portal Hero Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20 text-[10px] font-bold uppercase">
            🚀 Dành cho Đối tác & Doanh nghiệp xứ Thanh
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Kênh Quảng Bá & Đồng Hành Chuyển Đổi Số</h1>
          <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
            Đăng ký địa điểm kinh doanh miễn phí, tiếp thị nội dung bài viết chuẩn SEO và phân tích dữ liệu quan tâm của du khách trên hệ thống Hello Thanh Hóa.
          </p>
        </div>
      </section>

      {/* Tabs bar */}
      <div className="flex border-b border-slate-200 mb-8 gap-6 text-sm font-bold">
        <button
          onClick={() => { setActiveTab('register'); setRegSubmitted(false); }}
          className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'register' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building className="w-4 h-4" /> Đăng ký địa điểm kinh doanh
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'articles' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Viết bài tiếp thị SEO
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Số liệu thống kê du khách
        </button>
      </div>

      {/* Tab Area content */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        {activeTab === 'register' ? (
          /* Merchant Registration View */
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-5">
              <h2 className="font-extrabold text-slate-800 text-base mb-1">Cung cấp thông tin địa điểm của bạn</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Vui lòng điền chi tiết biểu mẫu sau. Ban quản lý Sở Du lịch sẽ thẩm định, xác thực thông tin và kích hoạt bài đăng địa điểm trên cổng thông tin Hello Thanh Hóa trong vòng 24 giờ làm việc.
              </p>

              {regSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-100/60 rounded-xl p-6 text-center space-y-3.5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Gửi hồ sơ đăng ký thành công!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Mã hồ sơ: <strong className="text-blue-600 font-mono">HTH-2026-{(Math.floor(Math.random() * 90000) + 10000)}</strong>. Ban quản lý đang thực hiện quy trình đối soát thực tế. Chúng tôi sẽ gửi thông báo xác nhận qua Email/SMS của doanh nghiệp.
                    </p>
                  </div>
                  <button 
                    onClick={() => setRegSubmitted(false)}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Gửi thêm địa điểm khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Tên địa điểm / Cơ sở kinh doanh *</label>
                      <input 
                        type="text" 
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ví dụ: Khách Sạn Sầm Sơn Star..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Danh mục hoạt động *</label>
                      <select 
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option value="travel">Du lịch / Thắng cảnh</option>
                        <option value="food">Ẩm thực / Nhà hàng</option>
                        <option value="cafe">Cà phê / Giải trí</option>
                        <option value="hotel">Khách sạn / Lưu trú</option>
                        <option value="shopping">Mua sắm / Quà tặng</option>
                        <option value="education">Giáo dục / Trường học</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Địa chỉ cụ thể *</label>
                      <input 
                        type="text" 
                        required
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="Số nhà, tên đường..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Khu vực quận / huyện *</label>
                      <select 
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option value="Thành phố Thanh Hóa">Thành phố Thanh Hóa</option>
                        <option value="Thành phố Sầm Sơn">Thành phố Sầm Sơn</option>
                        <option value="Thị xã Bỉm Sơn">Thị xã Bỉm Sơn</option>
                        <option value="Thị xã Nghi Sơn">Thị xã Nghi Sơn</option>
                        <option value="Huyện Bá Thước">Huyện Bá Thước</option>
                        <option value="Huyện Cẩm Thủy">Huyện Cẩm Thủy</option>
                        <option value="Huyện Đông Sơn">Huyện Đông Sơn</option>
                        <option value="Huyện Hà Trung">Huyện Hà Trung</option>
                        <option value="Huyện Hậu Lộc">Huyện Hậu Lộc</option>
                        <option value="Huyện Hoằng Hóa">Huyện Hoằng Hóa</option>
                        <option value="Huyện Lang Chánh">Huyện Lang Chánh</option>
                        <option value="Huyện Mường Lát">Huyện Mường Lát</option>
                        <option value="Huyện Nga Sơn">Huyện Nga Sơn</option>
                        <option value="Huyện Ngọc Lặc">Huyện Ngọc Lặc</option>
                        <option value="Huyện Như Thanh">Huyện Như Thanh</option>
                        <option value="Huyện Như Xuân">Huyện Như Xuân</option>
                        <option value="Huyện Nông Cống">Huyện Nông Cống</option>
                        <option value="Huyện Quan Hóa">Huyện Quan Hóa</option>
                        <option value="Huyện Quan Sơn">Huyện Quan Sơn</option>
                        <option value="Huyện Quảng Xương">Huyện Quảng Xương</option>
                        <option value="Huyện Thạch Thành">Huyện Thạch Thành</option>
                        <option value="Huyện Thiệu Hóa">Huyện Thiệu Hóa</option>
                        <option value="Huyện Thọ Xuân">Huyện Thọ Xuân</option>
                        <option value="Huyện Thường Xuân">Huyện Thường Xuân</option>
                        <option value="Huyện Triệu Sơn">Huyện Triệu Sơn</option>
                        <option value="Huyện Vĩnh Lộc">Huyện Vĩnh Lộc</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Số điện thoại liên hệ *</label>
                      <input 
                        type="text" 
                        required
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        placeholder="Số Hotline hỗ trợ..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Trang Facebook liên hệ (Không bắt buộc)</label>
                      <input 
                        type="url" 
                        value={regFacebookLink}
                        onChange={(e) => setRegFacebookLink(e.target.value)}
                        placeholder="https://facebook.com/trang-cua-ban..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="border border-slate-200 border-dashed rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="block text-[11px] font-bold text-slate-500">Hình ảnh Đại diện cơ sở (Tải ảnh hoặc dán link) *</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Upload Box */}
                      <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors relative group min-h-[100px]">
                        <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                        <p className="text-[10px] font-bold text-slate-600">Tải ảnh lên từ thiết bị</p>
                        <p className="text-[8px] text-slate-400">PNG, JPG, WEBP tối đa 2MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageFileChange(e, setRegImage)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL Paste & Preview */}
                      <div className="space-y-2 flex flex-col justify-between">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Hoặc nhập liên kết ảnh trực tiếp</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={regImage}
                            onChange={e => setRegImage(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        
                        {regImage && (
                          <div className="flex items-center gap-2.5 bg-white p-1.5 border border-slate-150 rounded-lg">
                            <img src={regImage} alt="Preview" className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-bold text-slate-700 truncate">Ảnh đã nạp</p>
                              <button
                                type="button"
                                onClick={() => setRegImage('')}
                                className="text-[9px] text-rose-500 hover:underline cursor-pointer font-bold"
                              >
                                Xóa ảnh
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Mô tả ngắn & Điểm đặc sắc nổi bật *</label>
                    <textarea 
                      required
                      rows={4}
                      value={regDesc}
                      onChange={(e) => setRegDesc(e.target.value)}
                      placeholder="Giới thiệu không gian phục vụ, các dịch vụ nổi trội, chính sách đặc biệt hấp dẫn..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors">
                    Nộp hồ sơ thẩm duyệt
                  </button>
                </form>
              )}
            </div>

            {/* Registration Benefits sidebar */}
            <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Quyền lợi khi tham gia</h3>
              
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Xác nhận Huy hiệu Chính chủ</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-light">Tăng độ uy tín, hiển thị đầu kết quả khi du khách tìm kiếm địa danh.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                    <Plus className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Đăng tin ưu đãi, khuyến mãi</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-light">Tự do đăng tải các mã voucher giảm giá đặc sản thúc đẩy hành vi khách mua.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Phân tích khách hàng thông minh</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-light">Truy cập biểu đồ lượng quan tâm, phân tích nhân khẩu học thông minh.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        ) : activeTab === 'articles' ? (
          /* Marketing Hub articles */
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-6">
              <h2 className="font-extrabold text-slate-800 text-base mb-1">Tạo bài viết chuẩn SEO giới thiệu xứ Thanh</h2>
              
              {artSubmitted && (
                <div className="bg-emerald-50 border border-emerald-100/60 rounded-xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🎉 Đăng bài viết tiếp thị SEO thành công! Bài viết đã được đưa vào danh sách xuất bản công cộng.</span>
                </div>
              )}

              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Tiêu đề bài viết SEO *</label>
                    <input 
                      type="text" 
                      required
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="Nhập tiêu đề thu hút người đọc..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Phân loại cẩm nang *</label>
                    <select 
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="Kinh nghiệm du lịch">Kinh nghiệm du lịch</option>
                      <option value="Cẩm nang phượt">Cẩm nang phượt</option>
                      <option value="Di tích lịch sử">Di tích lịch sử</option>
                      <option value="Địa điểm ẩm thực">Địa điểm ẩm thực</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Liên kết Facebook tác giả / cơ sở</label>
                    <input 
                      type="url" 
                      value={artFacebookLink}
                      onChange={(e) => setArtFacebookLink(e.target.value)}
                      placeholder="https://facebook.com/ca-nhan-hoac-trang..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 border-dashed rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <span className="block text-[11px] font-bold text-slate-500">Hình nền bài đăng cẩm nang (Tải ảnh hoặc dán link) *</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Box */}
                    <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors relative group min-h-[100px]">
                      <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                      <p className="text-[10px] font-bold text-slate-600">Tải ảnh bài viết lên</p>
                      <p className="text-[8px] text-slate-400">PNG, JPG, WEBP tối đa 2MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileChange(e, setArtImage)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* URL Paste & Preview */}
                    <div className="space-y-2 flex flex-col justify-between">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Hoặc nhập liên kết ảnh trực tiếp</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={artImage}
                          onChange={e => setArtImage(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      {artImage && (
                        <div className="flex items-center gap-2.5 bg-white p-1.5 border border-slate-150 rounded-lg">
                          <img src={artImage} alt="Preview" className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-700 truncate">Ảnh đã nạp</p>
                            <button
                              type="button"
                              onClick={() => setArtImage('')}
                              className="text-[9px] text-rose-500 hover:underline cursor-pointer font-bold"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Nội dung bài viết tiếp thị (hỗ trợ văn bản thường hoặc Markdown) *</label>
                  <textarea 
                    required
                    rows={8}
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    placeholder="Hãy mô tả hành trình trải nghiệm thực tế chi tiết, kèm các địa điểm đề xuất để thu hút lượt tìm kiếm Google của du khách..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors">
                  Xuất bản bài viết tiếp thị
                </button>
              </form>
            </div>

            {/* Published articles list */}
            <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2">Bài viết đang tiếp thị nổi bật</h3>
              
              <div className="space-y-3.5">
                {articlesList.map(art => (
                  <div key={art.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{art.cat}</span>
                      <span className="text-[10px] text-slate-400 font-light">{art.date}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors">{art.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50 font-light">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.views} lượt xem</span>
                      <span className="text-emerald-600 font-bold">● ĐANG HOẠT ĐỘNG</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
        ) : (
          /* Business Analytics Views using beautiful Recharts components */
          <ScrollReveal>
            <div className="space-y-8">
            <div>
              <h2 className="font-extrabold text-slate-800 text-base mb-1">Phân Tích Dữ Liệu Du Khách & Người Tiêu Dùng</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Biểu đồ đo lường dựa trên hàng ngàn lượt tương tác của du khách tìm kiếm, tham khảo, bình luận và check-in trên hệ thống Hello Thanh Hóa.
              </p>
            </div>

            {/* Counters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-blue-50/20 text-blue-600 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Tổng lượt tương tác tuần này</span>
                <p className="text-2xl font-black text-slate-800">16,900 <span className="text-xs font-bold text-emerald-600">(+18.2%)</span></p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-rose-50/20 text-rose-600 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Tỷ lệ đặt phòng/mua hàng thành công</span>
                <p className="text-2xl font-black text-slate-800">12.5% <span className="text-xs font-bold text-emerald-600">(+1.5%)</span></p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-amber-50/20 text-amber-600 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Điểm số trung bình trải nghiệm</span>
                <p className="text-2xl font-black text-slate-800">4.82 ★ <span className="text-xs font-bold text-emerald-600">(Đứng đầu vùng)</span></p>
              </div>
            </div>

            {/* Charts render inside a grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* Daily visit metrics */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-center">Tương tác của du khách theo ngày</h3>
                <div className="w-full h-64 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="Lượt truy cập" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                      <Area type="monotone" dataKey="Lượt Check-in" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category demand metrics */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-center">Mức độ quan tâm theo danh mục</h3>
                <div className="w-full h-64 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPopularity} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="Mức độ quan tâm" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        )}
      </div>
    </div>
  );
}
