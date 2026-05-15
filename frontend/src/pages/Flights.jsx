import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import FlightCard from '../components/FlightCard';
import SearchForm from '../components/SearchForm';

const AIRLINES   = ['Tất cả', 'Vietnam Airlines', 'VietJet Air', 'Bamboo Airways', 'Pacific Airlines'];
const TIME_SLOTS = [
  { label: 'Tất cả giờ',         min: 0,  max: 24 },
  { label: 'Sáng sớm (00–06h)',   min: 0,  max: 6  },
  { label: 'Buổi sáng (06–12h)',  min: 6,  max: 12 },
  { label: 'Buổi chiều (12–18h)', min: 12, max: 18 },
  { label: 'Buổi tối (18–24h)',   min: 18, max: 24 },
];

export default function Flights() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFrom = searchParams.get('from') || '';
  const urlTo   = searchParams.get('to')   || '';
  const urlDate = searchParams.get('date') || '';

  const [flights,    setFlights]    = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [searched,   setSearched]   = useState(false);

  const [airline,    setAirline]    = useState('Tất cả');
  const [timeSlot,   setTimeSlot]   = useState(0);
  const [maxPrice,   setMaxPrice]   = useState(5000000);
  const [sortBy,     setSortBy]     = useState('time');
  const [seatClass,  setSeatClass]  = useState('economy');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!urlFrom && !urlTo) return;
    fetchFlights({ from: urlFrom, to: urlTo, date: urlDate });
  }, [urlFrom, urlTo, urlDate]);

  const fetchFlights = async (params = {}) => {
    setLoading(true);
    setSearched(true);
    setAirline('Tất cả');
    setTimeSlot(0);
    setMaxPrice(5000000);
    setSortBy('time');
    try {
      const query = {};
      if (params.from) query.from = params.from;
      if (params.to)   query.to   = params.to;
      if (params.date) query.date = params.date;
      const res = await api.get('/flights', { params: query });
      setFlights(res.data.flights);
    } catch (err) {
      console.error('Lỗi tải chuyến bay:', err);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    const next = {};
    if (params.from) next.from = params.from;
    if (params.to)   next.to   = params.to;
    if (params.date) next.date = params.date;
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    let list = [...flights];
    const slot = TIME_SLOTS[timeSlot];
    if (airline !== 'Tất cả') list = list.filter(f => f.airline === airline);
    if (timeSlot !== 0) {
      list = list.filter(f => {
        const h = new Date(f.departureTime).getHours();
        return h >= slot.min && h < slot.max;
      });
    }
    list = list.filter(f => f.price[seatClass] <= maxPrice);
    if (sortBy === 'price_asc')  list.sort((a, b) => a.price[seatClass] - b.price[seatClass]);
    if (sortBy === 'price_desc') list.sort((a, b) => b.price[seatClass] - a.price[seatClass]);
    if (sortBy === 'time')       list.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
    return list;
  }, [flights, airline, timeSlot, maxPrice, sortBy, seatClass]);

  const resetFilters = () => {
    setAirline('Tất cả'); setTimeSlot(0);
    setMaxPrice(5000000); setSortBy('time'); setSeatClass('economy');
  };

  const activeFilters = [
    airline !== 'Tất cả', timeSlot !== 0,
    maxPrice < 5000000,   sortBy !== 'time',
    seatClass !== 'economy',
  ].filter(Boolean).length;

  const routeLabel = urlFrom && urlTo ? `${urlFrom} → ${urlTo}` : '';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          🔍 {routeLabel ? `Chuyến bay ${routeLabel}` : 'Tìm Chuyến Bay'}
        </h1>
        {urlDate && (
          <p className="text-gray-400 text-sm mt-1">
            📅 Ngày: {new Date(urlDate).toLocaleDateString('vi-VN', {
              weekday:'long', day:'2-digit', month:'2-digit', year:'numeric'
            })}
          </p>
        )}
      </div>

      <div className="mb-8">
        <SearchForm onSearch={handleSearch} initialFrom={urlFrom} initialTo={urlTo} initialDate={urlDate} />
      </div>

      {!searched && (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">✈️</p>
          <p className="text-gray-500 font-medium text-lg">Chọn điểm đi và điểm đến để tìm chuyến bay</p>
          <p className="text-gray-400 text-sm mt-2">Hơn 400 chuyến bay tới 22 thành phố trên toàn quốc</p>
        </div>
      )}

      {searched && (
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar bộ lọc */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 mb-3"
            >
              <span>
                🎛️ Bộ lọc
                {activeFilters > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-primary text-white rounded-full text-xs">{activeFilters}</span>
                )}
              </span>
              <span>{showFilter ? '▲' : '▼'}</span>
            </button>

            <div className={`${showFilter ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-700">Bộ lọc</h3>
                  {activeFilters > 0 && (
                    <button onClick={resetFilters} className="text-xs text-red-400 hover:text-red-600">Xóa tất cả</button>
                  )}
                </div>

                {/* Hạng ghế */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">💺 Hạng ghế</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[{val:'economy',label:'Phổ thông'},{val:'business',label:'Thương gia'}].map(c => (
                      <button key={c.val} onClick={() => setSeatClass(c.val)}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                          seatClass === c.val ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hãng bay */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">✈️ Hãng hàng không</p>
                  <div className="space-y-2">
                    {AIRLINES.map(a => (
                      <label key={a} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="airline" checked={airline === a}
                          onChange={() => setAirline(a)} className="accent-primary" />
                        <span className={`text-sm ${airline === a ? 'text-primary font-medium' : 'text-gray-600'} group-hover:text-primary`}>{a}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Giờ khởi hành */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">🕐 Giờ khởi hành</p>
                  <div className="space-y-2">
                    {TIME_SLOTS.map((slot, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name="timeSlot" checked={timeSlot === i}
                          onChange={() => setTimeSlot(i)} className="accent-primary" />
                        <span className={`text-sm ${timeSlot === i ? 'text-primary font-medium' : 'text-gray-600'} group-hover:text-primary`}>{slot.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Giá tối đa */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-600">💰 Giá tối đa</p>
                    <span className="text-xs text-primary font-bold">{(maxPrice/1000000).toFixed(1)}M đ</span>
                  </div>
                  <input type="range" min={200000} max={5000000} step={100000}
                    value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>200K</span><span>5M</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Kết quả */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <p className="text-sm text-gray-500">
                {loading ? 'Đang tìm...' : (
                  <>Tìm thấy <strong className="text-gray-800">{filtered.length}</strong> chuyến bay
                    {flights.length !== filtered.length && <span className="text-gray-400"> (trong {flights.length})</span>}
                  </>
                )}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Sắp xếp:</span>
                {[
                  { val:'time',       label:'⏰ Giờ bay' },
                  { val:'price_asc',  label:'💲 Giá tăng' },
                  { val:'price_desc', label:'💲 Giá giảm' },
                ].map(s => (
                  <button key={s.val} onClick={() => setSortBy(s.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      sortBy === s.val ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                    }`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm">Đang tìm chuyến bay {urlFrom} → {urlTo}...</p>
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-600 font-semibold text-lg">Không tìm thấy chuyến bay {urlFrom} → {urlTo}</p>
                <p className="text-gray-400 text-sm mt-2 mb-5">
                  {activeFilters > 0 ? 'Thử xóa bộ lọc để xem thêm kết quả' : 'Tuyến bay này chưa có chuyến hoặc không bay vào ngày đã chọn'}
                </p>
                {activeFilters > 0 && (
                  <button onClick={resetFilters}
                    className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {filtered.map(f => <FlightCard key={f._id} flight={f} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}