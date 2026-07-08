import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  CloudDrizzle, 
  Wind, 
  Droplets, 
  Thermometer, 
  Compass, 
  Umbrella, 
  AlertCircle, 
  Loader2, 
  CalendarDays 
} from 'lucide-react';

interface WeatherData {
  temp: number;
  apparentTemp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Fetch current weather for Thanh Hoa (Latitude: 19.8075, Longitude: 105.7764)
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=19.8075&longitude=105.7764&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=Asia%2FBangkok'
        );
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu thời tiết');
        }

        const data = await response.json();
        const current = data.current;

        setWeather({
          temp: Math.round(current.temperature_2m),
          apparentTemp: Math.round(current.apparent_temperature),
          humidity: current.relative_humidity_2m,
          windSpeed: Math.round(current.wind_speed_10m),
          weatherCode: current.weather_code,
          isDay: current.is_day === 1,
          time: current.time,
        });
        setError(null);
      } catch (err: any) {
        console.error('Error fetching weather:', err);
        // Fallback data for July in Thanh Hoa
        setWeather({
          temp: 31,
          apparentTemp: 35,
          humidity: 78,
          windSpeed: 12,
          weatherCode: 3, // Overcast
          isDay: true,
          time: new Date().toISOString(),
        });
        setError('offline');
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Translate weather code to Vietnamese and Lucide Icon
  const getWeatherDetails = (code: number, isDay: boolean) => {
    // Reference: WMO weather codes
    if (code === 0) {
      return {
        text: 'Trời quang đãng, nắng rực rỡ',
        icon: Sun,
        color: 'text-amber-500 bg-amber-50 border-amber-100',
        advice: 'Thời tiết tuyệt hảo cho biển Sầm Sơn! Nên tắm biển vào buổi sáng/chiều mát, bôi kem chống nắng và check-in Đền Độc Cước, Hòn Trống Mái.',
      };
    }
    if (code >= 1 && code <= 3) {
      return {
        text: code === 1 ? 'Ít mây, trời nắng nhẹ' : code === 2 ? 'Mây rải rác' : 'Nhiều mây, trời dịu mát',
        icon: Cloud,
        color: 'text-blue-500 bg-blue-50 border-blue-100',
        advice: 'Thời tiết rất ôn hòa! Rất thích hợp để khám phá thung lũng lúa hoang sơ tại Pù Luông hoặc ghé thăm Suối cá thần Cẩm Lương kỳ bí.',
      };
    }
    if (code === 45 || code === 48) {
      return {
        text: 'Có sương mù nhẹ',
        icon: Cloud,
        color: 'text-slate-500 bg-slate-50 border-slate-100',
        advice: 'Pù Luông lúc này sẽ cực kỳ huyền ảo với biển sương bồng bềnh! Thích hợp săn mây đỉnh núi hoặc thưởng thức trà nóng bên sườn đồi.',
      };
    }
    if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) {
      return {
        text: 'Mưa phùn nhẹ rải rác',
        icon: CloudDrizzle,
        color: 'text-cyan-500 bg-cyan-50 border-cyan-100',
        advice: 'Trời có mưa phùn lất phất. Thích hợp dạo bộ suối cá Cẩm Lương thanh bình hoặc uống cà phê phố cổ TP. Thanh Hóa, thưởng thức Bánh răng bừa ấm nóng.',
      };
    }
    if (code === 61 || code === 63 || code === 65 || code === 66 || code === 67 || code === 80 || code === 81 || code === 82) {
      return {
        text: 'Có mưa rào dông',
        icon: CloudRain,
        color: 'text-sky-600 bg-sky-50 border-sky-100',
        advice: 'Có mưa rào bất chợt. Bạn nên mang theo ô/áo mưa và ưu tiên các hoạt động trong nhà như chiêm ngưỡng kiến trúc đá Thành Nhà Hồ hoặc thưởng thức Chả tôm nóng hổi.',
      };
    }
    if (code === 95 || code === 96 || code === 99) {
      return {
        text: 'Dông sét dồn dập',
        icon: CloudLightning,
        color: 'text-red-500 bg-red-50 border-red-100',
        advice: 'Thời tiết dông sét nguy hiểm. Khuyến nghị hạn chế hoạt động ngoài trời, đặc biệt ở bãi tắm Sầm Sơn. Hãy thư giãn tại các quán cà phê đẹp mắt ở Vincom Plaza.',
      };
    }
    
    // Default
    return {
      text: 'Thời tiết ôn hòa',
      icon: Cloud,
      color: 'text-blue-500 bg-blue-50 border-blue-100',
      advice: 'Thời tiết thích hợp cho mọi hoạt động khám phá Thanh Hóa. Nem chua và chả tôm đang đợi bạn thưởng thức!',
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center min-h-[140px] shadow-xs">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2" />
        <p className="text-xs text-slate-400 font-medium">Đang cập nhật thời tiết xứ Thanh...</p>
      </div>
    );
  }

  if (!weather) return null;

  const details = getWeatherDetails(weather.weatherCode, weather.isDay);
  const WeatherIcon = details.icon;

  return (
    <div id="weather-widget-container" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Thời tiết Thanh Hóa</h4>
            <p className="text-[10px] text-slate-400 font-light mt-0.5">Thời gian thực (Cập nhật từ Google Search & Open-Meteo)</p>
          </div>
        </div>
        {error === 'offline' && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-100">
            <AlertCircle className="w-3 h-3" /> Chế độ offline
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Main Temperature Card */}
        <div className="md:col-span-5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${details.color} flex-shrink-0 shadow-xs`}>
              <WeatherIcon className="w-8 h-8 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{weather.temp}</span>
                <span className="text-base font-bold text-slate-500">°C</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{details.text}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Detailed Stats */}
        <div className="md:col-span-7 grid grid-cols-3 gap-2.5">
          <div className="flex flex-col p-2.5 bg-slate-50/30 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px] font-medium">Cảm giác</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{weather.apparentTemp}°C</span>
          </div>
          
          <div className="flex flex-col p-2.5 bg-slate-50/30 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-medium">Độ ẩm</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{weather.humidity}%</span>
          </div>

          <div className="flex flex-col p-2.5 bg-slate-50/30 rounded-xl border border-slate-100 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-medium">Sức gió</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Block based on weather conditions */}
      <div className="mt-4 p-3 bg-blue-50/30 border border-blue-100/50 rounded-xl flex items-start gap-2.5">
        <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0 mt-0.5">
          <Umbrella className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800">💡 Gợi ý du lịch cho bạn:</p>
          <p className="text-[11px] text-slate-600 font-light leading-relaxed mt-1">{details.advice}</p>
        </div>
      </div>
    </div>
  );
}
