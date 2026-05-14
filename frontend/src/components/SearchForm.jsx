import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const airports = [
  { code: 'HAN', city: 'Hà Nội',           airport: 'Nội Bài' },
  { code: 'SGN', city: 'TP. Hồ Chí Minh',  airport: 'Tân Sơn Nhất' },
  { code: 'DAD', city: 'Đà Nẵng',          airport: 'Đà Nẵng' },
  { code: 'CXR', city: 'Nha Trang',        airport: 'Cam Ranh' },
  { code: 'PQC', city: 'Phú Quốc',         airport: 'Phú Quốc' },
  { code: 'VCA', city: 'Cần Thơ',          airport: 'Cần Thơ' },
  { code: 'HPH', city: 'Hải Phòng',        airport: 'Cát Bi' },
  { code: 'UIH', city: 'Quy Nhơn',         airport: 'Phù Cát' },
  { code: 'VDH', city: 'Đồng Hới',         airport: 'Đồng Hới' },
  { code: 'HUI', city: 'Huế',              airport: 'Phú Bài' },
  { code: 'DIN', city: 'Điện Biên Phủ',    airport: 'Điện Biên' },
  { code: 'VKG', city: 'Rạch Giá',         airport: 'Rạch Giá' },
  { code: 'CAH', city: 'Cà Mau',           airport: 'Cà Mau' },
  { code: 'BMV', city: 'Buôn Ma Thuột',    airport: 'Buôn Ma Thuột' },
  { code: 'VCL', city: 'Chu Lai',          airport: 'Chu Lai' },
  { code: 'PXU', city: 'Pleiku',           airport: 'Pleiku' },
  { code: 'TBB', city: 'Tuy Hòa',          airport: 'Đông Tác' },
  { code: 'DLI', city: 'Đà Lạt',           airport: 'Liên Khương' },
  { code: 'VCS', city: 'Côn Đảo',          airport: 'Côn Đảo' },
  { code: 'THD', city: 'Thanh Hóa',        airport: 'Thọ Xuân' },
  { code: 'VII', city: 'Vinh',             airport: 'Vinh' },
  { code: 'VBA', city: 'Vũng Tàu',         airport: 'Vũng Tàu' },
];

// Dropdown tuỳ chỉnh — luôn mở xuống, có search, không bị tràn
function AirportSelect({ label, icon, name, value, onChange, options, placeholder }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref      = useRef();
  const inputRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = options.filter(a =>
    a.code.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase()) ||
    a.airport.toLowerCase().includes(search.toLowerCase())
  );

  const selected = airports.find(a => a.code === value);

  const handleSelect = (code) => {
    onChange({ target: { name, value: code } });
    setSearch('');
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {icon} {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full border rounded-xl px-4 py-3 text-left flex items-center justify-between focus:outline-none transition-all bg-white ${
          open ? 'border-primary ring-2 ring-primary ring-opacity-30' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={selected ? 'text-gray-800 font-medium text-sm' : 'text-gray-400 text-sm'}>
          {selected ? `${selected.code} — ${selected.city}` : placeholder}
        </span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {open && (
        <div
          className="absolute z-[999] left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          style={{ maxHeight: '280px', display: 'flex', flexDirection: 'column', top: '100%' }}
        >
          {/* Search box */}
          <div className="p-2 border-b border-gray-100 flex-shrink-0 bg-gray-50">
            <input
              ref={inputRef}
              type="text"
              placeholder="🔍 Tìm theo tên hoặc mã sân bay..."
              value={search}
              onChange={e => setSearch(e.target.value)}
className="w-full px-3 py-2 text-sm text-black placeholder-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
            />
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">Không tìm thấy sân bay</p>
            ) : (
              filtered.map(a => (
                <button
                  key={a.code}
                  type="button"
                  onClick={() => handleSelect(a.code)}
                  className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 ${
                    value === a.code
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs font-bold bg-blue-100 text-primary px-2 py-1 rounded-md w-11 text-center flex-shrink-0">
                    {a.code}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${value === a.code ? 'text-primary' : 'text-gray-700'}`}>
                      {a.city}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{a.airport}</p>
                  </div>
                  {value === a.code && <span className="text-primary text-sm flex-shrink-0">✓</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchForm({ onSearch, initialFrom = '', initialTo = '', initialDate = '' }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    from: initialFrom,
    to:   initialTo,
    date: initialDate,
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSwap = () => {
    setForm(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.from || !form.to) {
      alert('Vui lòng chọn điểm đi và điểm đến');
      return;
    }
    if (form.from === form.to) {
      alert('Điểm đi và điểm đến không được trùng nhau');
      return;
    }

    // Chỉ gửi các param có giá trị (tránh gửi date rỗng)
    const params = {};
    if (form.from) params.from = form.from;
    if (form.to)   params.to   = form.to;
    if (form.date) params.date = form.date;

    if (onSearch) {
      onSearch(params);
    } else {
      navigate(`/flights?${new URLSearchParams(params).toString()}`);
    }
  };

  const fromOptions = airports.filter(a => a.code !== form.to);
  const toOptions   = airports.filter(a => a.code !== form.from);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

        {/* Điểm đi */}
        <AirportSelect
          label="Điểm đi" icon="✈" name="from"
          value={form.from} onChange={handleChange}
          options={fromOptions} placeholder="Chọn điểm đi"
        />

        {/* Điểm đến + nút hoán đổi */}
        <div className="relative">
          <button
            type="button" onClick={handleSwap}
            title="Hoán đổi"
            className="hidden md:flex absolute -left-5 top-8 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-400 hover:text-primary hover:border-primary shadow-sm text-xs"
          >
            ⇄
          </button>
          <AirportSelect
            label="Điểm đến" icon="🛬" name="to"
            value={form.to} onChange={handleChange}
            options={toOptions} placeholder="Chọn điểm đến"
          />
        </div>

        {/* Ngày bay */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">📅 Ngày bay</label>
          <input
            type="date" name="date" value={form.date} onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 bg-white"
          />
        </div>
      </div>

      {/* Swap mobile */}
      <button type="button" onClick={handleSwap}
        className="md:hidden w-full mt-2 py-2 text-sm text-gray-400 hover:text-primary flex items-center justify-center gap-2">
        ⇄ Hoán đổi điểm đi / đến
      </button>

      <button type="submit"
        className="mt-4 w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-95 transition-all">
        🔍 Tìm chuyến bay
      </button>
    </form>
  );
}