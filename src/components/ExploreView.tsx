import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Compass, Coffee, Utensils, Hotel, ShoppingBag, GraduationCap, Grid, List, Check, RotateCcw, Heart, Map, Sparkles, Clock, Camera } from 'lucide-react';
import { Spot } from '../data';
import { getSpots } from '../utils/db';
import VisualMapView from './VisualMapView';
import ScrollReveal from './ScrollReveal';

interface ExploreViewProps {
  initialCategory?: string | null;
  initialQuery?: string | null;
  initialRegion?: string | null;
  initialDealsOnly?: boolean;
  onNavigate: (view: string, spotId?: string) => void;
  savedSpotIds: string[];
  onToggleSaveSpot: (spotId: string) => void;
}

export default function ExploreView({ 
  initialCategory, 
  initialQuery, 
  initialRegion,
  initialDealsOnly = false,
  onNavigate,
  savedSpotIds,
  onToggleSaveSpot
}: ExploreViewProps) {
  // Filters State
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialRegion || 'all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [openOnly, setOpenOnly] = useState<boolean>(false);
  const [dealsOnly, setDealsOnly] = useState<boolean>(initialDealsOnly);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [includePhotography, setIncludePhotography] = useState<boolean>(false);
  const [includeBeautyCare, setIncludeBeautyCare] = useState<boolean>(false);

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hello_thanh_hoa_recent_searches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save query helper
  const saveSearchQuery = (queryToSave: string) => {
    const trimmed = queryToSave.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('hello_thanh_hoa_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('hello_thanh_hoa_recent_searches');
  };

  // Debounce saving of search query
  useEffect(() => {
    if (!searchQuery) return;
    const timer = setTimeout(() => {
      saveSearchQuery(searchQuery);
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync initial search values
  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialQuery !== undefined && initialQuery !== null) setSearchQuery(initialQuery);
    if (initialRegion) setSelectedDistrict(initialRegion);
    setDealsOnly(initialDealsOnly);
  }, [initialCategory, initialQuery, initialRegion, initialDealsOnly]);

  const districts = [
    { value: 'all', label: 'Tất cả huyện/thị/thành phố' },
    { value: 'Thành phố Thanh Hóa', label: 'Thành phố Thanh Hóa' },
    { value: 'Thành phố Sầm Sơn', label: 'Thành phố Sầm Sơn (Biển Sầm Sơn)' },
    { value: 'Thị xã Bỉm Sơn', label: 'Thị xã Bỉm Sơn' },
    { value: 'Thị xã Nghi Sơn', label: 'Thị xã Nghi Sơn' },
    { value: 'Huyện Bá Thước', label: 'Huyện Bá Thước (Pù Luông)' },
    { value: 'Huyện Cẩm Thủy', label: 'Huyện Cẩm Thủy (Suối Cá thần)' },
    { value: 'Huyện Đông Sơn', label: 'Huyện Đông Sơn' },
    { value: 'Huyện Hà Trung', label: 'Huyện Hà Trung' },
    { value: 'Huyện Hậu Lộc', label: 'Huyện Hậu Lộc' },
    { value: 'Huyện Hoằng Hóa', label: 'Huyện Hoằng Hóa' },
    { value: 'Huyện Lang Chánh', label: 'Huyện Lang Chánh' },
    { value: 'Huyện Mường Lát', label: 'Huyện Mường Lát' },
    { value: 'Huyện Nga Sơn', label: 'Huyện Nga Sơn' },
    { value: 'Huyện Ngọc Lặc', label: 'Huyện Ngọc Lặc' },
    { value: 'Huyện Như Thanh', label: 'Huyện Như Thanh' },
    { value: 'Huyện Như Xuân', label: 'Huyện Như Xuân' },
    { value: 'Huyện Nông Cống', label: 'Huyện Nông Cống' },
    { value: 'Huyện Quan Hóa', label: 'Huyện Quan Hóa' },
    { value: 'Huyện Quan Sơn', label: 'Huyện Quan Sơn' },
    { value: 'Huyện Quảng Xương', label: 'Huyện Quảng Xương' },
    { value: 'Huyện Thạch Thành', label: 'Huyện Thạch Thành' },
    { value: 'Huyện Thiệu Hóa', label: 'Huyện Thiệu Hóa' },
    { value: 'Huyện Thọ Xuân', label: 'Huyện Thọ Xuân' },
    { value: 'Huyện Thường Xuân', label: 'Huyện Thường Xuân' },
    { value: 'Huyện Triệu Sơn', label: 'Huyện Triệu Sơn' },
    { value: 'Huyện Vĩnh Lộc', label: 'Huyện Vĩnh Lộc (Thành Nhà Hồ)' }
  ];

  const categories = [
    { id: 'all', label: 'Tất cả danh mục', icon: Compass },
    { id: 'travel', label: 'Du lịch', icon: Compass },
    { id: 'food', label: 'Ẩm thực', icon: Utensils },
    { id: 'cafe', label: 'Cà phê', icon: Coffee },
    { id: 'hotel', label: 'Khách sạn', icon: Hotel },
    { id: 'shopping', label: 'Mua sắm', icon: ShoppingBag },
    { id: 'education', label: 'Giáo dục', icon: GraduationCap },
    { id: 'beauty_care', label: 'Làm đẹp & Spa', icon: Sparkles },
    { id: 'photography', label: 'Dịch vụ chụp ảnh', icon: Camera },
  ];

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDistrict('all');
    setPriceFilter('all');
    setRatingFilter('all');
    setOpenOnly(false);
    setDealsOnly(false);
    setShowSavedOnly(false);
    setSortBy('rating');
    setIncludePhotography(false);
    setIncludeBeautyCare(false);
  };

  // Filter and sort items
  const spotsList = getSpots().filter(spot => spot.approved !== false);
  const filteredSpots = spotsList.filter(spot => {
    const matchesSearch = spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    let matchesMainCategory = false;
    if (selectedCategory === 'all') {
      matchesMainCategory = true;
    } else if (selectedCategory === 'beauty_care') {
      matchesMainCategory = spot.category === 'beauty' && (spot.subCategory === 'Spa & Trị Liệu' || spot.subCategory === 'Chăm Sóc Da');
    } else if (selectedCategory === 'photography') {
      matchesMainCategory = spot.category === 'beauty' && spot.subCategory === 'Dịch Vụ Chụp Ảnh';
    } else if (selectedCategory === 'beauty') {
      matchesMainCategory = spot.category === 'beauty';
    } else {
      matchesMainCategory = spot.category === selectedCategory;
    }

    const matchesPhotographyToggle = includePhotography && spot.category === 'beauty' && spot.subCategory === 'Dịch Vụ Chụp Ảnh';
    const matchesBeautyToggle = includeBeautyCare && spot.category === 'beauty' && (spot.subCategory === 'Spa & Trị Liệu' || spot.subCategory === 'Chăm Sóc Da');

    matchesCategory = matchesMainCategory || matchesPhotographyToggle || matchesBeautyToggle;
    const matchesDistrict = selectedDistrict === 'all' || spot.district === selectedDistrict;
    const matchesPrice = priceFilter === 'all' || spot.priceRange === priceFilter;
    
    let matchesRating = true;
    if (ratingFilter === '5') {
      matchesRating = spot.rating >= 4.9;
    } else if (ratingFilter === '4.5') {
      matchesRating = spot.rating >= 4.5;
    } else if (ratingFilter === '4') {
      matchesRating = spot.rating >= 4.0;
    } else if (ratingFilter === '3') {
      matchesRating = spot.rating >= 3.0;
    }

    const matchesOpen = !openOnly || spot.isOpen;
    const matchesDeals = !dealsOnly || (spot.deals !== undefined && spot.deals.length > 0);
    const matchesSaved = !showSavedOnly || savedSpotIds.includes(spot.id);

    return matchesSearch && matchesCategory && matchesDistrict && matchesPrice && matchesRating && matchesOpen && matchesDeals && matchesSaved;
  }).sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'checkins') {
      const checkA = parseInt(a.checkins) || 0;
      const checkB = parseInt(b.checkins) || 0;
      return checkB - checkA;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
          Khám Phá Danh Mục Địa Điểm Xứ Thanh
        </h1>
        <p className="text-slate-500 text-sm">
          Tìm kiếm trong {spotsList.length} địa điểm chất lượng hàng đầu được xác thực chính thức tại Thanh Hóa.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Filters Panel */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm sticky top-24 space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-slate-50">
              <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                Bộ Lọc Tìm Kiếm
              </h2>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Thiết lập lại
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tìm Từ Khóa</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveSearchQuery(searchQuery);
                    }
                  }}
                  placeholder="Ví dụ: bãi biển, hải sản..." 
                  className="w-full pl-9 pr-12 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-500"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-[10px] text-slate-400 hover:text-slate-600 font-bold cursor-pointer select-none transition-colors"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" /> Tìm kiếm gần đây
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(query);
                          saveSearchQuery(query);
                        }}
                        className="inline-flex items-center px-2 py-0.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 text-[10px] font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Khu Vực (Quận / Huyện)</label>
              <select 
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {districts.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Danh mục</label>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                      selectedCategory === cat.id 
                        ? 'bg-blue-50 text-blue-700 font-bold' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Quick Toggles */}
            <div className="pt-2 border-t border-slate-50">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Bộ lọc bổ sung (Cộng dồn)
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIncludePhotography(!includePhotography)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                    includePhotography 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-2xs' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dịch vụ chụp ảnh</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    includePhotography ? 'bg-blue-600 border-blue-600' : 'border-slate-200 bg-white'
                  }`}>
                    {includePhotography && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeBeautyCare(!includeBeautyCare)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                    includeBeautyCare 
                      ? 'bg-pink-50 border-pink-200 text-pink-700 font-bold shadow-2xs' 
                      : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span>Làm đẹp & Spa</span>
                  </div>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                    includeBeautyCare ? 'bg-pink-600 border-pink-600' : 'border-slate-200 bg-white'
                  }`}>
                    {includeBeautyCare && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                  </div>
                </button>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mức Giá</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['all', '$', '$$', '$$$'].map(price => (
                  <button
                    key={price}
                    onClick={() => setPriceFilter(price)}
                    className={`py-1.5 border rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      priceFilter === price 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {price === 'all' ? 'Tất cả' : price}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Đánh Giá</label>
              <select 
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Tất cả đánh giá</option>
                <option value="3">Từ 3.0 ★ trở lên (Khá)</option>
                <option value="4">Từ 4.0 ★ trở lên (Tốt)</option>
                <option value="4.5">Từ 4.5 ★ trở lên (Rất tốt)</option>
                <option value="5">Từ 4.9 ★ trở lên (Tuyệt vời)</option>
              </select>
            </div>

            {/* Binary Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-slate-50">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                <input 
                  type="checkbox" 
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 w-4 h-4 shadow-2xs"
                />
                <span>Đang mở cửa</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                <input 
                  type="checkbox" 
                  checked={dealsOnly}
                  onChange={(e) => setDealsOnly(e.target.checked)}
                  className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 w-4 h-4 shadow-2xs"
                />
                <span className="text-rose-600 font-bold">Chỉ hiển thị Khuyến Mãi</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 select-none">
                <input 
                  type="checkbox" 
                  checked={showSavedOnly}
                  onChange={(e) => setShowSavedOnly(e.target.checked)}
                  className="rounded text-rose-600 border-slate-300 focus:ring-rose-500 w-4 h-4 shadow-2xs"
                />
                <span className="text-slate-700 font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Địa điểm đã lưu ({savedSpotIds.length})
                </span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Listings Area */}
        <main className="flex-1">
          {/* List Toolbar */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs text-slate-500 font-medium">
              Tìm thấy <strong className="text-slate-800">{filteredSpots.length}</strong> địa điểm phù hợp
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 border-r border-slate-100 pr-3">
                <span className="text-xs text-slate-400">Sắp xếp:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                >
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="checkins">Lượt check-in</option>
                  <option value="name">Tên (A-Z)</option>
                </select>
              </div>

              {/* View switches */}
              <div className="flex bg-slate-50 p-0.5 rounded-lg border border-slate-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Xem dạng lưới"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Xem dạng danh sách"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewMode === 'map' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Xem trên bản đồ"
                >
                  <Map className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Listings Rendering */}
          {filteredSpots.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center max-w-md mx-auto mt-8">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Không tìm thấy địa điểm nào</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Vui lòng thử điều chỉnh lại bộ lọc hoặc thay đổi từ khóa tìm kiếm để khám phá nhiều địa điểm thú hơn.
              </p>
              <button 
                onClick={handleResetFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : viewMode === 'map' ? (
            <VisualMapView 
              filteredSpots={filteredSpots}
              onNavigate={onNavigate}
              savedSpotIds={savedSpotIds}
              onToggleSaveSpot={onToggleSaveSpot}
            />
          ) : (
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredSpots.map(spot => (
                <ScrollReveal key={spot.id} className="h-full">
                  <article 
                    onClick={() => onNavigate('detail', spot.id)}
                    className={`bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 hover:border-blue-100/50 transition-all duration-300 overflow-hidden cursor-pointer group flex h-full ${
                      viewMode === 'grid' ? 'flex-col' : 'flex-col sm:flex-row'
                    }`}
                  >
                    {/* Photo area */}
                    <div className={`relative overflow-hidden flex-shrink-0 ${
                      viewMode === 'grid' ? 'h-48 w-full' : 'h-48 sm:w-64 sm:h-full min-h-[160px]'
                    }`}>
                      <img 
                        src={spot.image} 
                        alt={spot.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSaveSpot(spot.id);
                          }}
                          className="p-1.5 rounded-full bg-white/95 backdrop-blur-xs text-slate-400 hover:text-rose-500 hover:scale-110 shadow-sm transition-all cursor-pointer"
                          title={savedSpotIds.includes(spot.id) ? "Bỏ lưu địa điểm" : "Lưu địa điểm"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${savedSpotIds.includes(spot.id) ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>
                        <div className="bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm font-semibold">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs text-slate-800">{spot.rating}</span>
                        </div>
                      </div>
                      {spot.deals && spot.deals.length > 0 && (
                        <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                          ƯU ĐÃI
                        </div>
                      )}
                      <div className={`absolute bottom-3 right-3 px-2 py-1 rounded text-[10px] font-bold shadow-xs ${
                        spot.isOpen ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                      }`}>
                        {spot.isOpen ? 'ĐANG MỞ CỬA' : 'TẠM ĐÓNG'}
                      </div>
                    </div>

                    {/* Body area */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {spot.subCategory}
                        </span>
                        <span className="text-xs text-slate-300">|</span>
                        <span className="text-xs text-slate-400 font-medium">{spot.district}</span>
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                        {spot.name}
                      </h3>
                      
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-2 line-clamp-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {spot.address}
                      </p>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {spot.description}
                      </p>

                      {/* Footer stats */}
                      <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                        <span>{spot.checkins}</span>
                        <span className="font-bold text-slate-600">{spot.priceRange}</span>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
