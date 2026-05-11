import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const initForm = {
  flightNumber: '', airline: '',
  'from.city': '', 'from.airport': '', 'from.code': '',
  'to.city': '', 'to.airport': '', 'to.code': '',
  departureTime: '', arrivalTime: '',
  'price.economy': '', 'price.business': '',
  'seats.economy': '', 'seats.business': '',
};

// Chuyển form phẳng → object lồng nhau cho MongoDB
const buildFlightBody = (form) => ({
  flightNumber: form.flightNumber,
  airline: form.airline,
  from: { city: form['from.city'], airport: form['from.airport'], code: form['from.code'] },
  to: { city: form['to.city'], airport: form['to.airport'], code: form['to.code'] },
  departureTime: form.departureTime,
  arrivalTime: form.arrivalTime,
  price: { economy: Number(form['price.economy']), business: Number(form['price.business']) },
  seats: { economy: Number(form['seats.economy']), business: Number(form['seats.business']) },
});

export default function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initForm);
  const [editId, setEditId] = useState(null); // null = đang thêm mới
  const [showForm, setShowForm] = useState(false);

  const fetchFlights = async () => {
    try {
      const res = await api.get('/flights');
      setFlights(res.data.flights);
    } catch { toast.error('Không tải được danh sách'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFlights(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Khi bấm Sửa → điền thông tin cũ vào form
  const handleEdit = (f) => {
    setEditId(f._id);
    setForm({
      flightNumber: f.flightNumber, airline: f.airline,
      'from.city': f.from.city, 'from.airport': f.from.airport, 'from.code': f.from.code,
      'to.city': f.to.city, 'to.airport': f.to.airport, 'to.code': f.to.code,
      departureTime: f.departureTime?.slice(0, 16), // cắt cho input datetime-local
      arrivalTime: f.arrivalTime?.slice(0, 16),
      'price.economy': f.price.economy, 'price.business': f.price.business,
      'seats.economy': f.seats.economy, 'seats.business': f.seats.business,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xóa chuyến bay
  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa chuyến bay này?')) return;
    try {
      await api.delete(`/flights/${id}`);
      toast.success('Đã xóa thành công');
      fetchFlights();
    } catch { toast.error('Xóa thất bại'); }
  };

  // Submit form (thêm hoặc sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = buildFlightBody(form);
    try {
      if (editId) {
        await api.put(`/flights/${editId}`, body);
        toast.success('Cập nhật thành công!');
      } else {
        await api.post('/flights', body);
        toast.success('Thêm chuyến bay thành công!');
      }
      setForm(initForm);
      setEditId(null);
      setShowForm(false);
      fetchFlights();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi');
    }
  };

  const fields = [
    { name: 'flightNumber', label: 'Số hiệu (VD: VN123)', col: 1 },
    { name: 'airline', label: 'Hãng hàng không', col: 1 },
    { name: 'from.code', label: 'Mã sân bay đi (VD: HAN)', col: 1 },
    { name: 'from.city', label: 'Thành phố đi', col: 1 },
    { name: 'from.airport', label: 'Tên sân bay đi', col: 2 },
    { name: 'to.code', label: 'Mã sân bay đến (VD: SGN)', col: 1 },
    { name: 'to.city', label: 'Thành phố đến', col: 1 },
    { name: 'to.airport', label: 'Tên sân bay đến', col: 2 },
    { name: 'price.economy', label: 'Giá phổ thông (VNĐ)', col: 1, type: 'number' },
    { name: 'price.business', label: 'Giá thương gia (VNĐ)', col: 1, type: 'number' },
    { name: 'seats.economy', label: 'Số ghế phổ thông', col: 1, type: 'number' },
    { name: 'seats.business', label: 'Số ghế thương gia', col: 1, type: 'number' },
    { name: 'departureTime', label: 'Giờ khởi hành', col: 1, type: 'datetime-local' },
    { name: 'arrivalTime', label: 'Giờ đến', col: 1, type: 'datetime-local' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">⚙️ Quản Lý Chuyến Bay</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm(initForm); }}
          className="px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-blue-700"
        >
          {showForm ? 'Ẩn form' : '+ Thêm chuyến bay'}
        </button>
      </div>

      {/* Form thêm/sửa */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="font-bold text-gray-700 mb-4">
            {editId ? '✏️ Sửa chuyến bay' : '➕ Thêm chuyến bay mới'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.col === 2 ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button type="submit" className="px-6 py-2 bg-primary text-white rounded-xl font-medium hover:bg-blue-700">
              {editId ? 'Cập nhật' : 'Thêm mới'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setEditId(null); setForm(initForm); }}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Bảng danh sách */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Số hiệu</th>
                <th className="text-left px-4 py-3 font-semibold">Hãng</th>
                <th className="text-left px-4 py-3 font-semibold">Tuyến</th>
                <th className="text-left px-4 py-3 font-semibold">Khởi hành</th>
                <th className="text-left px-4 py-3 font-semibold">Giá (Economy)</th>
                <th className="text-left px-4 py-3 font-semibold">Ghế còn</th>
                <th className="text-left px-4 py-3 font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((f) => (
                <tr key={f._id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-primary">{f.flightNumber}</td>
                  <td className="px-4 py-3">{f.airline}</td>
                  <td className="px-4 py-3">{f.from.code} → {f.to.code}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(f.departureTime).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-medium">
                    {f.price.economy.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-4 py-3">{f.seats.economy}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(f)}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 text-xs font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(f._id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-xs font-medium"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {flights.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    Chưa có chuyến bay nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}