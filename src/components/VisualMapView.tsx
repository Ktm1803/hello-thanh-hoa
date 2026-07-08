import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Star, 
  Heart, 
  Compass, 
  Coffee, 
  Utensils, 
  Hotel, 
  ShoppingBag, 
  GraduationCap, 
  Navigation, 
  X, 
  Maximize2, 
  Minimize2, 
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  Camera
} from 'lucide-react';
import { Spot } from '../data';

// Normalized coordinates (0-100 percentages) mapped to each spot ID for exact positioning
const SPOT_COORDINATES: Record<string, { lat: number; lng: number; x: number; y: number; regionName: string }> = {
  'pu-luong': { lat: 20.4500, lng: 105.1500, x: 18, y: 22, regionName: 'Miền Núi Bá Thước' },
  'suoi-ca-than': { lat: 20.1900, lng: 105.4500, x: 38, y: 38, regionName: 'Cẩm Thủy' },
  'thanh-nha-ho': { lat: 20.0800, lng: 105.6100, x: 50, y: 46, regionName: 'Di sản Vĩnh Lộc' },
  'nem-chua-thanh-mai': { lat: 19.8100, lng: 105.7800, x: 68, y: 63, regionName: 'TP. Thanh Hóa' },
  'nha-hang-da-lan': { lat: 19.8120, lng: 105.7780, x: 64, y: 58, regionName: 'TP. Thanh Hóa' },
  'greenhouse-cafe': { lat: 19.8080, lng: 105.7820, x: 71, y: 61, regionName: 'TP. Thanh Hóa' },
  'muong-thanh-luxury': { lat: 19.7950, lng: 105.7830, x: 72, y: 66, regionName: 'TP. Thanh Hóa' },
  'melia-vinpearl': { lat: 19.8110, lng: 105.7800, x: 67, y: 55, regionName: 'TP. Thanh Hóa' },
  'vincom-plaza': { lat: 19.8105, lng: 105.7805, x: 74, y: 57, regionName: 'TP. Thanh Hóa' },
  'dai-hoc-hong-duc': { lat: 19.7900, lng: 105.7810, x: 66, y: 68, regionName: 'TP. Thanh Hóa' },
  'sam-son': { lat: 19.7350, lng: 105.8900, x: 86, y: 76, regionName: 'Bờ biển Sầm Sơn' },
  'hai-san-bien-nho': { lat: 19.7320, lng: 105.8950, x: 89, y: 80, regionName: 'Bờ biển Sầm Sơn' },
  'coastal-roasters': { lat: 19.7380, lng: 105.8850, x: 83, y: 73, regionName: 'Bờ biển Sầm Sơn' },
  'sen-spa': { lat: 19.8130, lng: 105.7790, x: 62, y: 52, regionName: 'TP. Thanh Hóa' },
  'hana-academy': { lat: 19.8090, lng: 105.7830, x: 70, y: 53, regionName: 'TP. Thanh Hóa' },
  'xu-thanh-studio': { lat: 19.8150, lng: 105.7750, x: 60, y: 56, regionName: 'TP. Thanh Hóa' },
  'sam-son-photo': { lat: 19.7340, lng: 105.8920, x: 88, y: 78, regionName: 'Bờ biển Sầm Sơn' },
  'may-corner': { lat: 20.4480, lng: 105.1520, x: 21, y: 25, regionName: 'Miền Núi Bá Thước' },
  'lavender-spa': { lat: 19.8100, lng: 105.7810, x: 63, y: 64, regionName: 'TP. Thanh Hóa' },
};

interface VisualMapViewProps {
  filteredSpots: Spot[];
  onNavigate: (view: string, spotId?: string) => void;
  savedSpotIds: string[];
  onToggleSaveSpot: (spotId: string) => void;
}

export default function VisualMapView({ 
  filteredSpots, 
  onNavigate, 
  savedSpotIds, 
  onToggleSaveSpot 
}: VisualMapViewProps) {
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Auto-select the first spot if available on mount or search update
  useEffect(() => {
    if (filteredSpots.length > 0) {
      const match = filteredSpots.find(s => s.id === selectedSpotId);
      if (!match) {
        setSelectedSpotId(filteredSpots[0].id);
      }
    } else {
      setSelectedSpotId(null);
    }
  }, [filteredSpots]);

  const selectedSpot = filteredSpots.find(s => s.id === selectedSpotId);
  const selectedCoords = selectedSpotId ? SPOT_COORDINATES[selectedSpotId] : null;

  // Get appropriate Lucide icon depending on category & subCategory
  const getCategoryIcon = (category: string, subCategory?: string) => {
    if (subCategory === 'Dịch Vụ Chụp Ảnh') return Camera;
    switch (category) {
      case 'travel': return Compass;
      case 'food': return Utensils;
      case 'cafe': return Coffee;
      case 'hotel': return Hotel;
      case 'shopping': return ShoppingBag;
      case 'education': return GraduationCap;
      case 'beauty': return Sparkles;
      default: return MapPin;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'travel': return 'bg-emerald-500 border-emerald-100 text-white';
      case 'food': return 'bg-orange-500 border-orange-100 text-white';
      case 'cafe': return 'bg-amber-500 border-amber-100 text-white';
      case 'hotel': return 'bg-indigo-500 border-indigo-100 text-white';
      case 'shopping': return 'bg-pink-500 border-pink-100 text-white';
      case 'education': return 'bg-blue-500 border-blue-100 text-white';
      case 'beauty': return 'bg-rose-500 border-rose-100 text-white';
      default: return 'bg-slate-500 border-slate-100 text-white';
    }
  };

  return (
    <div 
      id="visual-map-view" 
      ref={mapContainerRef}
      className={`bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl h-[calc(100vh-32px)]' : 'h-[620px] shadow-sm'
      }`}
    >
      {/* Header bar of the map */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <Layers className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Hệ thống Định vị Số Thanh Hóa</h3>
            <p className="text-[10px] text-slate-400 font-medium">Bản đồ phân bố địa lý tương tác thực tế</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100%-53px)] overflow-hidden">
        
        {/* Left Side: Filtered locations sidebar */}
        <aside className="w-full lg:w-80 border-r border-slate-100 bg-white flex flex-col h-1/3 lg:h-full">
          <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Danh sách Bản đồ ({filteredSpots.length})</span>
            {selectedSpot && (
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                LAT: {SPOT_COORDINATES[selectedSpot.id]?.lat.toFixed(4) || '19.8075'}
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
            {filteredSpots.map(spot => {
              const coords = SPOT_COORDINATES[spot.id] || { lat: 19.8075, lng: 105.7764 };
              const IconComponent = getCategoryIcon(spot.category);
              const isSelected = selectedSpotId === spot.id;
              
              return (
                <div
                  key={spot.id}
                  onClick={() => setSelectedSpotId(spot.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/80 border border-blue-100 shadow-2xs' 
                      : 'hover:bg-slate-50/70 border border-transparent'
                  }`}
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    isSelected ? getCategoryColor(spot.category) : 'bg-slate-100 text-slate-500'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                      {spot.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-light mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" /> {spot.district}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.25 rounded">
                        {spot.subCategory}
                      </span>
                      <span className="flex items-center gap-0.5 text-[9px] text-amber-500 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {spot.rating}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveSpot(spot.id);
                    }}
                    className="p-1 rounded-full text-slate-300 hover:text-rose-500 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Heart className={`w-3.5 h-3.5 ${savedSpotIds.includes(spot.id) ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>
              );
            })}
            
            {filteredSpots.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300 animate-spin" />
                <p className="text-xs font-medium">Không tìm thấy địa điểm phù hợp</p>
              </div>
            )}
          </div>
        </aside>

        {/* Right Side: Visual Map Display */}
        <main className="flex-1 relative bg-slate-100/40 p-4 select-none h-2/3 lg:h-full flex items-center justify-center">
          
          {/* Map Base Canvas */}
          <div 
            id="thanh-hoa-artistic-map" 
            className="relative w-full max-w-4xl h-full rounded-2xl bg-white border border-slate-200/60 shadow-inner overflow-hidden flex flex-col justify-between p-4"
            style={{
              backgroundImage: 'radial-gradient(circle, #e2e8f0 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Compass Rose Accent */}
            <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur-xs rounded-xl border border-slate-100 shadow-xs flex items-center gap-2.5 pointer-events-none z-10">
              <Navigation className="w-5 h-5 text-blue-600 stroke-[2] animate-bounce" />
              <div>
                <span className="text-[9px] font-mono font-bold text-slate-400 tracking-wider block">CHỈ HƯỚNG</span>
                <span className="text-[11px] font-bold text-slate-800">TÂY BẮC - ĐÔNG NAM</span>
              </div>
            </div>

            {/* Geographic Terrain Background Watermarks */}
            <div className="absolute top-10 left-10 text-slate-200/70 font-bold pointer-events-none text-3xl select-none select-none tracking-widest leading-none">
              ĐỊA HÌNH SƠN CƯỚC
            </div>
            <div className="absolute bottom-16 right-10 text-blue-100/50 font-bold pointer-events-none text-4xl select-none tracking-widest">
              VỊNH BẮC BỘ
            </div>

            {/* Regional Dividers (Visual Representation of Thanh Hoa geography) */}
            {/* Northwest: Mountains */}
            <div className="absolute top-0 left-0 w-1/3 h-1/2 border-r border-b border-dashed border-slate-200/50 p-3 pointer-events-none">
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">VÙNG CAO TÂY BẮC (PÙ LUÔNG)</span>
            </div>
            {/* Center: Midlands / Historical */}
            <div className="absolute top-1/2 left-0 w-1/2 h-1/2 border-r border-dashed border-slate-200/50 p-3 pointer-events-none">
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">TRUNG DU & SUỐI CÁ THẦN</span>
            </div>
            {/* Center East: City */}
            <div className="absolute top-1/4 right-1/4 w-1/4 h-1/2 border-l border-b border-dashed border-slate-200/50 p-3 pointer-events-none">
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">TP. THANH HÓA</span>
            </div>
            {/* Far East: Sea Coast */}
            <div className="absolute top-0 right-0 w-1/4 h-full bg-blue-50/10 border-l border-dashed border-slate-200/60 p-3 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-l from-sky-50/30 to-transparent"></div>
              <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 z-10 relative">BIỂN SẦM SƠN</span>
            </div>

            {/* Plotting Coordinates Markers */}
            <div className="absolute inset-0 z-10">
              {filteredSpots.map(spot => {
                const coords = SPOT_COORDINATES[spot.id];
                if (!coords) return null;

                const isSelected = selectedSpotId === spot.id;
                const IconComponent = getCategoryIcon(spot.category, spot.subCategory);
                const categoryColorClass = getCategoryColor(spot.category);

                return (
                  <div
                    key={spot.id}
                    className="absolute transition-all duration-500 ease-out cursor-pointer group"
                    style={{
                      left: `${coords.x}%`,
                      top: `${coords.y}%`,
                      transform: 'translate(-51%, -51%)',
                    }}
                    onClick={() => setSelectedSpotId(spot.id)}
                  >
                    {/* Ring Pulse animation on the selected item */}
                    {isSelected && (
                      <span className="absolute inline-flex h-11 w-11 rounded-full bg-blue-400/30 animate-ping opacity-75 -left-2.5 -top-2.5"></span>
                    )}

                    {/* Styled pin bubble */}
                    <div className={`relative flex items-center justify-center w-6 h-6 rounded-full border shadow-sm transition-all duration-300 ${
                      isSelected 
                        ? `${categoryColorClass} scale-125 ring-4 ring-blue-500/20 z-30` 
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 scale-100 hover:scale-110 z-20 hover:z-25'
                    }`}>
                      <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                      
                      {/* Interactive floating name label on hover */}
                      <div className="absolute bottom-full mb-1.5 hidden group-hover:block bg-slate-900 text-white text-[10px] font-bold px-2 py-0.75 rounded-md whitespace-nowrap shadow-md pointer-events-none z-50">
                        {spot.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom floating details card overlay */}
            <div className="mt-auto relative z-20 flex justify-end">
              {selectedSpot && selectedCoords ? (
                <div 
                  className="w-full max-w-md bg-white rounded-xl border border-slate-100 p-3.5 shadow-md flex items-start gap-3.5 animate-in fade-in slide-in-from-bottom-3 duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={selectedSpot.image} 
                    alt={selectedSpot.name} 
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.25 rounded">
                        {selectedSpot.subCategory}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">{selectedCoords.regionName}</span>
                    </div>

                    <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1 mb-1">{selectedSpot.name}</h4>
                    
                    <p className="text-[10px] text-slate-400 font-light flex items-center gap-0.5 line-clamp-1 mb-2">
                      <MapPin className="w-2.5 h-2.5 flex-shrink-0" /> {selectedSpot.address}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-slate-700">{selectedSpot.rating}</span>
                        <span className="text-[9px] text-slate-400">({selectedSpot.checkins})</span>
                      </div>
                      
                      <button
                        onClick={() => onNavigate('detail', selectedSpot.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        Khám phá ngay <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-sm bg-slate-900/90 text-white backdrop-blur-xs rounded-xl p-3 shadow-md flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <p className="text-[10px] text-slate-300 font-light leading-snug">
                    Chọn một điểm trên bản đồ hoặc trong danh mục để xem thông tin vị trí thực tế, khoảng cách và lịch sử.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
