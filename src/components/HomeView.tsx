import React, { useState } from 'react';
import { Search, MapPin, Star, Sparkles, Compass, Coffee, Utensils, Hotel, ShoppingBag, GraduationCap, ArrowRight, Clock, Percent, Heart, BookOpen, X, User, Calendar } from 'lucide-react';
import { Spot, SPOTS, ARTICLES, Article, SPECIALTY_DISHES, SpecialtyDish } from '../data';
import WeatherWidget from './WeatherWidget';
import ScrollReveal from './ScrollReveal';

interface HomeViewProps {
  onNavigate: (view: string, spotId?: string) => void;
  savedSpotIds: string[];
  onToggleSaveSpot: (spotId: string) => void;
}

export default function HomeView({ onNavigate, savedSpotIds, onToggleSaveSpot }: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tất cả khu vực');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);

  // Region options
  const regions = [
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

  // Categories list
  const categories = [
    { id: 'travel', label: 'Du lịch', icon: Compass, color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100' },
    { id: 'food', label: 'Ẩm thực', icon: Utensils, color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100' },
    { id: 'cafe', label: 'Cà phê', icon: Coffee, color: 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100' },
    { id: 'hotel', label: 'Khách sạn', icon: Hotel, color: 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' },
    { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag, color: 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100' },
    { id: 'education', label: 'Giáo dục', icon: GraduationCap, color: 'bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100' },
    { id: 'beauty', label: 'Làm đẹp & Ảnh', icon: Sparkles, color: 'bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100' },
  ];

  // Filter spots for search autocomplete suggestions
  const suggestions = searchQuery.trim() === '' ? [] : SPOTS.filter(spot => {
    const matchesQuery = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spot.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'Tất cả khu vực' || spot.district === selectedRegion;
    return matchesQuery && matchesRegion;
  }).slice(0, 5);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(`explore?query=${encodeURIComponent(searchQuery)}&region=${encodeURIComponent(selectedRegion)}`);
  };

  const handleSuggestionClick = (spotId: string) => {
    setSearchQuery('');
    setShowSuggestions(false);
    onNavigate('detail', spotId);
  };

  // Get hot deals and trending spots
  const trendingSpots = SPOTS.filter(spot => spot.rating >= 4.8).slice(0, 3);
  const promotionalSpots = SPOTS.filter(spot => spot.deals && spot.deals.length > 0).slice(0, 3);

  return (
    <div className="w-full pb-12">
      {/* Hero Section */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-slate-900 py-16 md:py-24 px-6 md:px-12 text-center text-white mb-10 shadow-lg">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-medium mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            Cổng Thông Tin Du Lịch & Dịch Vụ Xứ Thanh
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
            Khám Phá Thanh Hóa
          </h1>
          <p className="text-sm md:text-lg text-slate-200 mb-8 max-w-xl drop-shadow-sm leading-relaxed font-light">
            Tìm kiếm những địa điểm du lịch kỳ vĩ, ẩm thực truyền thống đặc sắc, không gian cà phê thư giãn và các dịch vụ tốt nhất tại xứ Thanh.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-1.5 flex flex-col sm:flex-row gap-1.5 border border-slate-200 relative text-slate-800">
            <div className="flex-1 flex items-center px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-100">
              <Search className="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Tìm tên địa điểm, món ăn, khu vực..." 
                className="w-full bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:outline-none text-sm font-medium"
              />
            </div>
            <div className="sm:w-48 flex items-center px-3 py-2">
              <MapPin className="w-4.5 h-4.5 text-slate-400 mr-2 flex-shrink-0" />
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full bg-transparent border-none text-slate-700 focus:outline-none text-sm font-semibold cursor-pointer py-1"
              >
                {regions.map(r => (
                  <option key={r} value={r} className="text-slate-800">{r}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex-shrink-0">
              Tìm kiếm
            </button>

            {/* Auto-suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden text-left">
                <div className="p-2 border-b border-slate-50">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">Gợi ý địa điểm</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {suggestions.map(spot => (
                    <button 
                      key={spot.id} 
                      type="button"
                      onMouseDown={() => handleSuggestionClick(spot.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left text-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{spot.name}</p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {spot.address}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded">
                        {spot.subCategory}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Weather Widget */}
      <ScrollReveal className="mb-10">
        <WeatherWidget />
      </ScrollReveal>

      {/* Quick Categories Grid */}
      <ScrollReveal className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
          <Compass className="w-5 h-5 text-blue-600" /> Danh Mục Khám Phá
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button 
                key={cat.id}
                onClick={() => onNavigate(`explore?cat=${cat.id}`)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 transition-all cursor-pointer group hover:shadow-md ${cat.color}`}
              >
                <div className="p-3 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {/* Specialty Dishes Section */}
      <ScrollReveal className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-emerald-600" /> Tinh Hoa Ẩm Thực Xứ Thanh
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium max-w-xl">
              Những món ngon nức tiếng mang đậm bản sắc văn hóa và hương vị độc nhất vô nhị nhất định phải thưởng thức một lần khi tới Thanh Hóa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SPECIALTY_DISHES.map(dish => (
            <div 
              key={dish.id}
              onClick={() => setSelectedDishId(dish.id)}
              className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden group flex flex-col h-full border-b-2 hover:border-b-emerald-500"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img 
                  src={dish.image} 
                  alt={dish.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                    {dish.tags[0]}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors line-clamp-1 mb-1.5">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                    {dish.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[11px] font-bold text-emerald-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {dish.bestTime}
                  </span>
                  <span className="inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Two Columns Layout: Hot Deals and Top Rated */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hot Deals */}
        <ScrollReveal>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Percent className="w-5 h-5 text-rose-500" /> Ưu Đãi & Khuyến Mãi Hot
            </h2>
            <button 
              onClick={() => onNavigate('explore?deals=true')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {promotionalSpots.map(spot => (
              <div 
                key={spot.id}
                onClick={() => onNavigate('detail', spot.id)}
                className="flex gap-4 p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all cursor-pointer group"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-1 left-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    PROMO
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveSpot(spot.id);
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:scale-110 shadow-xs transition-all cursor-pointer z-10"
                    title={savedSpotIds.includes(spot.id) ? "Bỏ lưu địa điểm" : "Lưu địa điểm"}
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedSpotIds.includes(spot.id) ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{spot.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" /> {spot.district}
                  </p>
                  
                  {/* Deal content */}
                  {spot.deals && spot.deals.length > 0 && (
                    <div className="mt-2 bg-rose-50 text-rose-700 text-[11px] px-2 py-1.5 rounded-md font-medium line-clamp-1 border border-rose-100/50">
                      🎁 {spot.deals[0]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Featured / Trending spots */}
        <ScrollReveal delay={0.15}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Địa Điểm Nổi Bật Đánh Giá Cao
            </h2>
            <button 
              onClick={() => onNavigate('explore?sort=rating')}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {trendingSpots.map(spot => (
              <div 
                key={spot.id}
                onClick={() => onNavigate('detail', spot.id)}
                className="flex flex-col lg:flex-row gap-4 p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all cursor-pointer group"
              >
                <div className="h-32 lg:w-32 lg:h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={spot.image} alt={spot.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveSpot(spot.id);
                      }}
                      className="p-1 rounded-full bg-white/95 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:scale-110 shadow-xs transition-all cursor-pointer"
                      title={savedSpotIds.includes(spot.id) ? "Bỏ lưu địa điểm" : "Lưu địa điểm"}
                    >
                      <Heart className={`w-3 h-3 ${savedSpotIds.includes(spot.id) ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                    <div className="bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-slate-800">{spot.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col min-w-0 justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                      {spot.subCategory}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors mt-1.5 line-clamp-1">{spot.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {spot.address}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-2 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {spot.hours}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      {/* Handbooks & Articles Section */}
      <ScrollReveal className="mt-14" delay={0.1}>
        <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-500" /> Cẩm Nang & Kinh Nghiệm Chia Sẻ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map(article => (
            <div 
              key={article.id}
              onClick={() => setSelectedArticleId(article.id)}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden group flex flex-col h-full"
            >
              <div className="h-44 w-full overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <span className="absolute top-3 left-3 bg-pink-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
                  Làm đẹp & Ảnh
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mb-2.5">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[11px] font-bold text-blue-600">
                  <span>Đọc bài viết ({article.readTime})</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* Article Detail Modal */}
      {selectedArticleId && (() => {
        const selectedArticle = ARTICLES.find(a => a.id === selectedArticleId);
        if (!selectedArticle) return null;
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Header image */}
              <div className="relative h-56 md:h-64 w-full flex-shrink-0">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <button 
                  onClick={() => setSelectedArticleId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/40 text-white hover:bg-slate-950/60 transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-pink-500 text-white px-2 py-0.5 rounded-md">
                    Cẩm nang Làm Đẹp & Ảnh
                  </span>
                  <h3 className="text-base md:text-xl font-bold mt-2 leading-snug drop-shadow-xs">{selectedArticle.title}</h3>
                </div>
              </div>

              {/* Meta and content */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-bold border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {selectedArticle.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedArticle.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedArticle.readTime}</span>
                </div>

                {/* Formatted body */}
                <div className="text-slate-600 text-xs md:text-sm leading-relaxed space-y-4 whitespace-pre-line font-medium max-h-[30vh] overflow-y-auto pr-2">
                  {selectedArticle.content}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedArticleId(null);
                      onNavigate('explore?cat=beauty');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Xem các địa điểm và dịch vụ liên quan
                  </button>
                  <button
                    onClick={() => setSelectedArticleId(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Specialty Dish Detail Modal */}
      {selectedDishId && (() => {
        const dish = SPECIALTY_DISHES.find(d => d.id === selectedDishId);
        if (!dish) return null;
        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Header image */}
              <div className="relative h-56 md:h-64 w-full flex-shrink-0">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <button 
                  onClick={() => setSelectedDishId(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/40 text-white hover:bg-slate-950/60 transition-colors cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white text-left">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {dish.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold mt-1 leading-snug drop-shadow-xs">{dish.name}</h3>
                </div>
              </div>

              {/* Detail content */}
              <div className="p-6 md:p-8 space-y-6 text-left">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hương vị & Đặc trưng</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-medium">
                    {dish.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/30">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Thời điểm thưởng thức ngon nhất
                    </h4>
                    <p className="text-slate-600 text-xs font-medium">
                      {dish.bestTime}
                    </p>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/30">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Địa bàn đặc trưng
                    </h4>
                    <p className="text-slate-600 text-xs font-medium">
                      Phổ biến tại {dish.id === 'vit-co-lung' ? 'Bá Thước' : dish.id === 'che-lam' ? 'Vĩnh Lộc' : 'TP. Thanh Hóa và toàn tỉnh'}.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Nơi thưởng thức uy tín & chuẩn vị</h4>
                  <div className="space-y-2">
                    {dish.whereToEat.map((place, index) => (
                      <div key={index} className="flex items-start gap-2.5 p-2.5 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100/50">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="text-xs text-left">
                          <p className="font-bold text-slate-800">{place.split(' (')[0]}</p>
                          <p className="text-slate-500 mt-0.5">{place.includes(' (') ? place.split(' (')[1].replace(')', '') : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedDishId(null);
                      onNavigate('explore?cat=food');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <Utensils className="w-4 h-4" />
                    Xem các quán ăn ngon khác trên cổng
                  </button>
                  <button
                    onClick={() => setSelectedDishId(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
