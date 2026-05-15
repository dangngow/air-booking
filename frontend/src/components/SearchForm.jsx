import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const airports = [
  { code: 'HAN', city: 'Hà Nội',          airport: 'Nội Bài' },
  { code: 'SGN', city: 'TP. Hồ Chí Minh', airport: 'Tân Sơn Nhất' },
  { code: 'DAD', city: 'Đà Nẵng',         airport: 'Đà Nẵng' },
  { code: 'CXR', city: 'Nha Trang',       airport: 'Cam Ranh' },
  { code: 'PQC', city: 'Phú Quốc',        airport: 'Phú Quốc' },
  { code: 'VCA', city: 'Cần Thơ',         airport: 'Cần Thơ' },
  { code: 'HPH', city: 'Hải Phòng',       airport: 'Cát Bi' },
  { code: 'UIH', city: 'Quy Nhơn',        airport: 'Phù Cát' },
  { code: 'VDH', city: 'Đồng Hới',        airport: 'Đồng Hới' },
  { code: 'HUI', city: 'Huế',             airport: 'Phú Bài' },
  { code: 'DIN', city: 'Điện Biên Phủ',   airport: 'Điện Biên' },
  { code: 'VKG', city: 'Rạch Giá',        airport: 'Rạch Giá' },
  { code: 'CAH', city: 'Cà Mau',          airport: 'Cà Mau' },
  { code: 'BMV', city: 'Buôn Ma Thuột',   airport: 'Buôn Ma Thuột' },
  { code: 'VCL', city: 'Chu Lai',         airport: 'Chu Lai' },
  { code: 'PXU', city: 'Pleiku',          airport: 'Pleiku' },
  { code: 'TBB', city: 'Tuy Hòa',         airport: 'Đông Tác' },
  { code: 'DLI', city: 'Đà Lạt',          airport: 'Liên Khương' },
  { code: 'VCS', city: 'Côn Đảo',         airport: 'Côn Đảo' },
  { code: 'THD', city: 'Thanh Hóa',       airport: 'Thọ Xuân' },
  { code: 'VII', city: 'Vinh',            airport: 'Vinh' },
  { code: 'VBA', city: 'Vũng Tàu',        airport: 'Vũng Tàu' },
];

function AirportSelect({ label, icon, name, value, onChange, options, placeholder }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef    = useRef(null);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus ô search khi mở
  useEffect(() => {
    if (open) {
      // Delay nhỏ để DOM render xong rồi focus
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = options.filter(a => {
    const q = search.toLowerCase();
    return (
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.airport.toLowerCase().includes(q)
    );
  });

  const selected = airports.find(a => a.code === value);

  const handleToggle = useCallback(() => {
    setOpen(prev => !prev);
    if (open) setSearch('');
  }, [open]);

  const handleSelect = useCallback((code) => {
    onChange({ target: { name, value: code } });
    setSearch('');
    setOpen(false);
  }, [name, onChange]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      handleSelect(filtered[0].code);
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setSearch('');
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {icon} {label}
      </label>

      {/* Nút toggle */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full border rounded-xl px-4 py-3 text-left flex items-center justify-between bg-white focus:outline-none transition-all ${
          open
            ? 'border-primary ring-2 ring-primary ring-opacity-30'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className={`text-sm ${selected ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {selected ? `${selected.code} — ${selected.city}` : placeholder}
        </span>
        <span className={`text-gray-400 text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 9999,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '300px',
            overflow: 'hidden',
          }}
          // Ngăn click trong dropdown đóng dropdown
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Ô search */}
          <div style={{ padding: '8px', borderBottom: '1px solid #f3f4f6', background: '#f9fafb', flexShrink: 0 }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder="🔍 Gõ tên thành phố hoặc mã sân bay..."
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                color: '#111827',
                caretColor: '#2563eb',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 2px rgba(37,99,235,0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Danh sách */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>
                Không tìm thấy sân bay nào
              </div>
            ) : (
              filtered.map(a => {
                const isSelected = value === a.code;
                return (
                  <button
                    key={a.code}
                    type="button"
                    onClick={() => handleSelect(a.code)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: isSelected ? '#eff6ff' : 'white',
                      border: 'none',
                      borderBottom: '1px solid #f9fafb',
                      cursor: 'pointer',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = '#f9fafb'; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                  >
                    {/* Badge mã sân bay */}
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      background: '#dbeafe',
                      color: '#2563eb',
                      padding: '3px 6px',
                      borderRadius: '6px',
                      minWidth: '42px',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}>
                      {a.code}
                    </span>
                    {/* Tên thành phố + sân bay */}
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isSelected ? '600' : '500',
                        color: isSelected ? '#2563eb' : '#374151',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {a.city}
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                        {a.airport}
                      </div>
                    </div>
                    {/* Dấu check */}
                    {isSelected && (
                      <span style={{ color: '#2563eb', fontSize: '14px', flexShrink: 0 }}>✓</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          {filtered.length > 0 && (
            <div style={{
              padding: '6px 16px',
              borderTop: '1px solid #f3f4f6',
              fontSize: '11px',
              color: '#d1d5db',
              background: '#fafafa',
              flexShrink: 0,
            }}>
              {filtered.length} sân bay · Enter để chọn · Esc để đóng
            </div>
          )}
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

  // Đồng bộ khi initialFrom/To thay đổi (từ URL params)
  useEffect(() => {
    setForm({ from: initialFrom, to: initialTo, date: initialDate });
  }, [initialFrom, initialTo, initialDate]);

  const handleChange = useCallback((e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSwap = useCallback(() => {
    setForm(prev => ({ ...prev, from: prev.to, to: prev.from }));
  }, []);

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

        <AirportSelect
          label="Điểm đi" icon="✈" name="from"
          value={form.from} onChange={handleChange}
          options={fromOptions} placeholder="Chọn điểm đi"
        />

        <div style={{ position: 'relative' }}>
          {/* Nút hoán đổi desktop */}
          <button
            type="button" onClick={handleSwap}
            title="Hoán đổi điểm đi / đến"
            className="hidden md:flex absolute items-center justify-center w-7 h-7 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-primary hover:border-primary shadow-sm text-xs"
            style={{ left: '-14px', top: '38px', zIndex: 10 }}
          >
            ⇄
          </button>
          <AirportSelect
            label="Điểm đến" icon="🛬" name="to"
            value={form.to} onChange={handleChange}
            options={toOptions} placeholder="Chọn điểm đến"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">📅 Ngày bay</label>
          <input
            type="date" name="date"
            value={form.date} onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-gray-700 bg-white"
          />
        </div>
      </div>

      {/* Swap mobile */}
      <button type="button" onClick={handleSwap}
        className="md:hidden w-full mt-3 py-2 text-sm text-gray-400 hover:text-primary flex items-center justify-center gap-2">
        ⇄ Hoán đổi điểm đi / đến
      </button>

      <button type="submit"
        className="mt-4 w-full bg-primary text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 active:scale-95 transition-all">
        🔍 Tìm chuyến bay
      </button>
    </form>
  );
}