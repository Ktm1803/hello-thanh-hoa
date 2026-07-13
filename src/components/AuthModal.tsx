import React, { useState } from 'react';
import { X, Mail, Lock, User, Briefcase, MapPin, AlignLeft, ShieldCheck, Sparkles, LogIn, Eye, EyeOff } from 'lucide-react';
import { UserAccount, getUsers, saveUser, setCurrentUser } from '../utils/db';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserAccount, message: string) => void;
}

type AuthType = 'tourist' | 'partner' | 'admin';
type Mode = 'login' | 'register';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authType, setAuthType] = useState<AuthType>('tourist');
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);

  // Common Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Partner-Specific Fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('travel');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDistrict, setBusinessDistrict] = useState('Thành phố Thanh Hóa');
  const [businessDesc, setBusinessDesc] = useState('');
  const [businessMapLink, setBusinessMapLink] = useState('');

  // UI Error State
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const districts = [
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

  const handleToggleMode = () => {
    setMode(prev => prev === 'login' ? 'register' : 'login');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    const users = getUsers();

    if (mode === 'login') {
      // Login Process
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        setError('Tài khoản không tồn tại trên hệ thống.');
        return;
      }

      if (foundUser.password !== password) {
        setError('Mật khẩu không chính xác.');
        return;
      }

      if (!foundUser.active) {
        setError('Tài khoản này đã bị khóa hoặc tạm dừng hoạt động.');
        return;
      }

      if (foundUser.role === 'partner' && !foundUser.approved) {
        setError('Tài khoản doanh nghiệp đang chờ quản trị viên phê duyệt.');
        return;
      }

      // Success
      setCurrentUser(foundUser);
      onAuthSuccess(foundUser, `Chào mừng ${foundUser.name} đã quay trở lại!`);
      onClose();
    } else {
      // Register Process
      if (!name) {
        setError('Vui lòng nhập họ và tên của bạn.');
        return;
      }

      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError('Email này đã được đăng ký sử dụng.');
        return;
      }

      if (password.length < 3) {
        setError('Mật khẩu tối thiểu phải từ 3 ký tự trở lên.');
        return;
      }

      let newUser: UserAccount = {
        email,
        name,
        password,
        role: authType,
        active: true,
        avatar: authType === 'tourist' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
          : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80'
      };

      if (authType === 'partner') {
        if (!businessName || !businessAddress || !businessDesc) {
          setError('Vui lòng nhập đầy đủ thông tin doanh nghiệp đăng ký.');
          return;
        }
        newUser = {
          ...newUser,
          businessName,
          businessCategory,
          businessAddress,
          businessDistrict,
          businessDesc,
          businessMapLink,
          approved: false // requires admin approval
        };
      } else {
        newUser.approved = true;
      }

      saveUser(newUser);

      if (authType === 'partner') {
        setError('');
        alert('Đăng ký thành công! Tài khoản doanh nghiệp của bạn đang được quản trị viên xét duyệt. Vui lòng đợi trong giây lát hoặc liên hệ Hotline.');
        setMode('login');
      } else {
        setCurrentUser(newUser);
        onAuthSuccess(newUser, `Chúc mừng ${newUser.name}! Bạn đã đăng ký tài khoản thành công.`);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Visual */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden flex-shrink-0 text-left">
          <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 to-slate-900"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10">
            <h2 className="text-lg font-black flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {mode === 'login' ? 'Đăng Nhập Cổng Du Lịch' : 'Đăng Ký Thành Viên'}
            </h2>
            <p className="text-[11px] text-slate-300 font-light mt-1">
              {mode === 'login' 
                ? 'Hãy đăng nhập để lưu trữ hành trình và tùy chỉnh trải nghiệm của bạn.' 
                : 'Trở thành một phần của mạng lưới du lịch thông minh xứ Thanh.'}
            </p>
          </div>
        </div>

        {/* Role Switcher tabs (Only show when NOT on admin tab explicitly or let admin be a small sub-option) */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-1.5">
          <button
            type="button"
            onClick={() => { setAuthType('tourist'); setError(''); }}
            className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authType === 'tourist' 
                ? 'bg-white text-blue-700 shadow-2xs font-extrabold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Khách Du Lịch
          </button>
          <button
            type="button"
            onClick={() => { setAuthType('partner'); setError(''); }}
            className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authType === 'partner' 
                ? 'bg-white text-blue-700 shadow-2xs font-extrabold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Doanh Nghiệp
          </button>
          <button
            type="button"
            onClick={() => { setAuthType('admin'); setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
              authType === 'admin' 
                ? 'bg-white text-blue-700 shadow-2xs font-extrabold' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Quản Trị Viên
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 text-left">
          
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[11px] leading-relaxed font-bold">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-3.5">
            {/* Account Details */}
            {mode === 'register' && (
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Họ và Tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1.5">Mật Khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9.5 pr-10 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Partner specific fields */}
            {authType === 'partner' && mode === 'register' && (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-[11px] font-black text-blue-600 mb-1">
                  <Briefcase className="w-3.5 h-3.5" /> THÔNG TIN DOANH NGHIỆP ĐĂNG KÝ
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tên Cơ sở Kinh doanh / Doanh nghiệp</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Mây Corner, Khách sạn Mường Thanh..."
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Danh mục lĩnh vực</label>
                    <select
                      value={businessCategory}
                      onChange={e => setBusinessCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden text-slate-700 font-bold"
                    >
                      <option value="travel">Địa danh Du lịch</option>
                      <option value="food">Đặc sản Ẩm thực</option>
                      <option value="cafe">Cà phê & Giải trí</option>
                      <option value="hotel">Khách sạn & Resort</option>
                      <option value="beauty">Làm đẹp & Chụp ảnh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Huyện/Thị xã</label>
                    <select
                      value={businessDistrict}
                      onChange={e => setBusinessDistrict(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden text-slate-700 font-bold"
                    >
                      {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ cụ thể</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Số nhà, tên đường, phường/xã..."
                      value={businessAddress}
                      onChange={e => setBusinessAddress(e.target.value)}
                      className="w-full pl-9 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Mô tả ngắn dịch vụ</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400" />
                    <textarea
                      required
                      placeholder="Nêu ngắn gọn dịch vụ, thế mạnh, ưu đãi..."
                      rows={2}
                      value={businessDesc}
                      onChange={e => setBusinessDesc(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Liên kết Bản đồ (Google Maps URL)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://maps.app.goo.gl/... hoặc https://google.com/maps/..."
                      value={businessMapLink}
                      onChange={e => setBusinessMapLink(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white placeholder-slate-300 font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            {mode === 'login' ? 'Đăng Nhập Ngay' : 'Hoàn Tất Đăng Ký'}
          </button>

          {/* Quick instructions for testers */}
          {mode === 'login' && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed font-medium">
              💡 **Tài khoản dùng thử (mật khẩu `123`):**<br />
              • Khách du lịch: <span className="font-bold text-slate-700">tourist@example.com</span><br />
              • Doanh nghiệp: <span className="font-bold text-slate-700">partner@example.com</span><br />
              • Quản trị viên: <span className="font-bold text-slate-700">admin@example.com</span>
            </div>
          )}

          {/* Switch mode */}
          {authType !== 'admin' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-[11px] font-bold text-slate-500 hover:text-blue-600 underline cursor-pointer"
              >
                {mode === 'login' 
                  ? 'Chưa có tài khoản? Đăng ký ngay miễn phí' 
                  : 'Đã có tài khoản? Quay về Đăng nhập'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
