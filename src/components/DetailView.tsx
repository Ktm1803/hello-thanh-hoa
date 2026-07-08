import React, { useState } from 'react';
import { ArrowLeft, MapPin, Star, Phone, Clock, MessageSquare, Plus, Check, Percent, Share2, Heart, Facebook } from 'lucide-react';
import { Spot, Review } from '../data';

interface DetailViewProps {
  spot: Spot;
  onBack: () => void;
  onAddReview: (spotId: string, review: Review) => void;
  onNavigate: (view: string, spotId?: string) => void;
  savedSpotIds: string[];
  onToggleSaveSpot: (spotId: string) => void;
}

export default function DetailView({ 
  spot, 
  onBack, 
  onAddReview, 
  onNavigate,
  savedSpotIds = [],
  onToggleSaveSpot
}: DetailViewProps) {
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [ratingValue, setRatingValue] = useState(5);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?spot=${spot.id}`;
    const shareData = {
      title: `Khám phá ${spot.name} - Du lịch xứ Thanh`,
      text: spot.description,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.log('Share flow canceled or failed:', err);
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Không thể sao chép liên kết:', err);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) return;

    const newReview: Review = {
      author: authorName,
      rating: ratingValue,
      text: commentText,
      date: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?auto=format&fit=crop&w=120&h=120&q=80`
    };

    onAddReview(spot.id, newReview);
    setAuthorName('');
    setCommentText('');
    setRatingValue(5);
    setActiveTab('reviews');
  };

  return (
    <div className="w-full">
      {/* Back navigation */}
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer py-1"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </button>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Image, Details, Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
            {/* Banner Photo */}
            <div className="relative h-64 md:h-[350px] w-full">
              <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase shadow-md">
                {spot.subCategory}
              </div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md font-bold text-sm text-slate-800">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {spot.rating}
              </div>
            </div>

            {/* Title Block */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">{spot.name}</h1>
                  <p className="text-slate-400 text-xs md:text-sm flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-slate-300 flex-shrink-0" /> {spot.address}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 self-start flex-shrink-0">
                  {/* Share Action Button */}
                  <button
                    onClick={handleShare}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs border ${
                      isCopied 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border-slate-100 hover:border-blue-100'
                    }`}
                    title="Chia sẻ địa điểm này"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500 animate-bounce" />
                        <span>Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Chia sẻ</span>
                      </>
                    )}
                  </button>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={() => onToggleSaveSpot(spot.id)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-2xs border ${
                      savedSpotIds.includes(spot.id)
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border-slate-100 hover:border-rose-100'
                    }`}
                    title={savedSpotIds.includes(spot.id) ? "Bỏ lưu địa điểm" : "Lưu địa điểm"}
                  >
                    <Heart className={`w-4 h-4 ${savedSpotIds.includes(spot.id) ? 'text-rose-500 fill-rose-500' : ''}`} />
                    <span>{savedSpotIds.includes(spot.id) ? 'Đã lưu' : 'Lưu'}</span>
                  </button>
                </div>
              </div>

              {/* Tabs list */}
              <div className="flex border-b border-slate-100 mt-8 gap-4 text-sm font-semibold">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-3 relative cursor-pointer ${
                    activeTab === 'info' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Thông tin chi tiết
                  {activeTab === 'info' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded" />}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'reviews' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Đánh giá từ du khách ({spot.reviews.length})
                  {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded" />}
                </button>
              </div>

              {/* Tab Contents */}
              <div className="py-6">
                {activeTab === 'info' ? (
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5">Mô tả địa điểm</h2>
                      <p className="text-slate-600 text-sm leading-relaxed font-light">{spot.description}</p>
                    </div>

                    {/* Highlights */}
                    {spot.highlights && spot.highlights.length > 0 && (
                      <div>
                        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2.5">Điểm nổi bật nhất</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {spot.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100/40">
                              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Button shortcut */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Muốn lên lịch trình cùng địa điểm này?</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Trợ lý AI của chúng tôi sẽ thiết kế lộ trình di chuyển lý tưởng nhất.</p>
                      </div>
                      <button
                        onClick={() => onNavigate('ai-planner', spot.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors shrink-0"
                      >
                        Lên lộ trình bằng AI
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Add Review Form */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                      <h3 className="font-bold text-slate-800 text-sm mb-3">Để lại đánh giá của bạn</h3>
                      <form onSubmit={handleSubmitReview} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Tên của bạn</label>
                            <input 
                              type="text" 
                              required
                              value={authorName}
                              onChange={(e) => setAuthorName(e.target.value)}
                              placeholder="Nhập tên du khách..." 
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1">Điểm đánh giá</label>
                            <div className="flex items-center gap-1 h-9">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRatingValue(star)}
                                  className="text-amber-400 p-0.5 cursor-pointer focus:outline-none"
                                >
                                  <Star className={`w-5 h-5 ${star <= ratingValue ? 'fill-amber-400' : ''}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Bình luận, chia sẻ trải nghiệm</label>
                          <textarea 
                            required
                            rows={3}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Chia sẻ về chất lượng phục vụ, không gian, đồ ăn thức uống tại đây..." 
                            className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors">
                          Gửi đánh giá ngay
                        </button>
                      </form>
                    </div>

                    {/* Review list */}
                    <div className="space-y-4 divide-y divide-slate-100">
                      {spot.reviews.map((r, i) => (
                        <div key={i} className={`flex gap-4 items-start ${i > 0 ? 'pt-4' : ''}`}>
                          <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                          <div className="flex-1 space-y-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 text-xs">{r.author}</span>
                              <span className="text-[10px] text-slate-400">{r.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 text-amber-400">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star key={j} className={`w-3 h-3 ${j < r.rating ? 'fill-amber-400' : ''}`} />
                              ))}
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed font-light mt-1.5">{r.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact info & Deals */}
        <div className="space-y-6">
          {/* Quick info panel */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4 text-xs font-semibold text-slate-600">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Thông tin liên hệ</h3>
            
            <div className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Số điện thoại</p>
                <p className="text-slate-700 font-bold mt-0.5">{spot.contact}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Giờ mở cửa</p>
                <p className="text-slate-700 font-bold mt-0.5">{spot.hours}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4.5 h-4.5 text-slate-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Check-ins & Sự quan tâm</p>
                <p className="text-slate-700 font-bold mt-0.5">{spot.checkins}</p>
              </div>
            </div>

            {/* Facebook contact link */}
            <div className="pt-3 border-t border-slate-100">
              <a
                href={spot.facebookLink || `https://www.facebook.com/search/pages/?q=${encodeURIComponent(spot.name + ' Thanh Hoá')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
              >
                <Facebook className="w-4 h-4 text-white fill-white" />
                <span>{spot.facebookLink ? 'Liên hệ qua Facebook' : 'Tìm kiếm Facebook'}</span>
              </a>
            </div>
          </div>

          {/* Special Deals Cards */}
          {spot.deals && spot.deals.length > 0 && (
            <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 opacity-10 bg-white rounded-full p-16"></div>
              
              <h3 className="font-extrabold text-sm flex items-center gap-1.5 mb-4">
                <Percent className="w-4.5 h-4.5" /> Ưu Đãi Độc Quyền
              </h3>
              
              <div className="space-y-3">
                {spot.deals.map((d, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-lg text-xs leading-relaxed font-light">
                    🎯 {d}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
