/**
 * SEED DATA - Tất cả sân bay Việt Nam + chuyến bay 1 chiều & khứ hồi
 * Cách chạy: node seed.js (trong thư mục backend)
 */

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User    = require('./models/User');
const Flight  = require('./models/Flight');
const Booking = require('./models/Booking');

// ── Helper: tạo Date tương lai ──────────────────────────────
const d = (daysAhead, h, m) => {
  const dt = new Date();
  dt.setDate(dt.getDate() + daysAhead);
  dt.setHours(h, m, 0, 0);
  return dt;
};

// ── 22 SÂN BAY VIỆT NAM ─────────────────────────────────────
// code / thành phố / tên sân bay
const AIRPORTS = {
  HAN: { city: 'Hà Nội',           airport: 'Nội Bài' },
  SGN: { city: 'TP. Hồ Chí Minh',  airport: 'Tân Sơn Nhất' },
  DAD: { city: 'Đà Nẵng',          airport: 'Đà Nẵng' },
  CXR: { city: 'Nha Trang',        airport: 'Cam Ranh' },
  PQC: { city: 'Phú Quốc',         airport: 'Phú Quốc' },
  VCA: { city: 'Cần Thơ',          airport: 'Cần Thơ' },
  HPH: { city: 'Hải Phòng',        airport: 'Cát Bi' },
  UIH: { city: 'Quy Nhơn',         airport: 'Phù Cát' },
  VDH: { city: 'Đồng Hới',         airport: 'Đồng Hới' },
  HUI: { city: 'Huế',              airport: 'Phú Bài' },
  DIN: { city: 'Điện Biên Phủ',    airport: 'Điện Biên' },
  VKG: { city: 'Rạch Giá',         airport: 'Rạch Giá' },
  CAH: { city: 'Cà Mau',           airport: 'Cà Mau' },
  BMV: { city: 'Buôn Ma Thuột',    airport: 'Buôn Ma Thuột' },
  VCL: { city: 'Chu Lai',          airport: 'Chu Lai' },
  PXU: { city: 'Pleiku',           airport: 'Pleiku' },
  TBB: { city: 'Tuy Hòa',          airport: 'Đông Tác' },
  DLI: { city: 'Đà Lạt',           airport: 'Liên Khương' },
  VCS: { city: 'Côn Đảo',          airport: 'Côn Đảo' },
  THD: { city: 'Thanh Hóa',        airport: 'Thọ Xuân' },
  VII: { city: 'Vinh',             airport: 'Vinh' },
  VBA: { city: 'Vũng Tàu',         airport: 'Vũng Tàu' },
};

// ── Helper tạo node from/to ─────────────────────────────────
const ap = code => ({ ...AIRPORTS[code], code });

// ── Helper tạo 1 chuyến bay ─────────────────────────────────
const flight = (num, airline, from, to, day, depH, depM, durMin, ecoPrice, bizPrice, ecoSeats = 120, bizSeats = 16) => {
  const dep = d(day, depH, depM);
  const arr = new Date(dep.getTime() + durMin * 60000);
  return {
    flightNumber: num,
    airline,
    from: ap(from),
    to:   ap(to),
    departureTime: dep,
    arrivalTime:   arr,
    price:  { economy: ecoPrice,  business: bizPrice  },
    seats:  { economy: ecoSeats,  business: bizSeats  },
    status: 'scheduled',
  };
};

// ── Viết tắt hãng ───────────────────────────────────────────
const VNA = 'Vietnam Airlines';
const VJA = 'VietJet Air';
const BAA = 'Bamboo Airways';
const PCA = 'Pacific Airlines';

// ════════════════════════════════════════════════════════════
//  DANH SÁCH CHUYẾN BAY
//  Cấu trúc: flight(số_hiệu, hãng, từ, đến, ngày, giờ, phút, thời_gian_bay_phút, eco, biz)
// ════════════════════════════════════════════════════════════
const flights = [

  // ═══════════════════════════════════
  //  HÀ NỘI (HAN) ↔ CÁC TUYẾN
  // ═══════════════════════════════════

  // HAN ↔ SGN (nhiều chuyến/ngày)
  flight('VN101', VNA, 'HAN','SGN', 1,  6, 0,130, 1200000,3500000,140,24),
  flight('VJ102', VJA, 'HAN','SGN', 1,  9,30,130,  890000,2600000,180,12),
  flight('BL103', BAA, 'HAN','SGN', 1, 13, 0,130,  950000,2800000,120,16),
  flight('VN104', VNA, 'HAN','SGN', 1, 16,30,130, 1350000,3800000,100,20),
  flight('VJ105', VJA, 'HAN','SGN', 1, 20,15,130,  780000,2300000,160,10),
  flight('PC106', PCA, 'HAN','SGN', 2,  7, 0,130,  820000,2400000,150,12),
  flight('VN107', VNA, 'HAN','SGN', 2, 11,45,130, 1100000,3200000,130,18),
  flight('VJ108', VJA, 'HAN','SGN', 2, 17, 0,130,  750000,2200000,170,10),
  flight('BL109', BAA, 'HAN','SGN', 3,  8,30,130,  980000,2900000,110,14),
  flight('VN110', VNA, 'HAN','SGN', 3, 14, 0,130, 1250000,3600000,120,20),

  // SGN → HAN (khứ hồi)
  flight('VN201', VNA, 'SGN','HAN', 1, 14,30,130, 1350000,3800000,120,18),
  flight('VJ202', VJA, 'SGN','HAN', 1, 18, 0,130,  820000,2400000,150,10),
  flight('BL203', BAA, 'SGN','HAN', 1, 21,30,130,  950000,2800000,110,14),
  flight('VN204', VNA, 'SGN','HAN', 2,  7, 0,130, 1200000,3500000,130,20),
  flight('VJ205', VJA, 'SGN','HAN', 2, 12,30,130,  790000,2300000,160,10),
  flight('PC206', PCA, 'SGN','HAN', 2, 19, 0,130,  810000,2400000,140,12),
  flight('BL207', BAA, 'SGN','HAN', 3,  9,15,130, 1000000,3000000,120,16),
  flight('VN208', VNA, 'SGN','HAN', 3, 15,30,130, 1300000,3700000,110,20),

  // HAN ↔ DAD
  flight('VN301', VNA, 'HAN','DAD', 1,  7,15, 80, 1100000,3000000,120,16),
  flight('VJ302', VJA, 'HAN','DAD', 1, 12, 0, 80,  890000,2200000,150,10),
  flight('BL303', BAA, 'HAN','DAD', 1, 17,45, 80,  750000,1900000,170,8),
  flight('VN304', VNA, 'HAN','DAD', 2,  9,30, 80, 1050000,2900000,130,14),
  flight('VJ305', VJA, 'HAN','DAD', 2, 15,20, 80,  720000,2000000,160,10),
  flight('VN401', VNA, 'DAD','HAN', 1, 10, 0, 80, 1100000,3000000,120,16),
  flight('VJ402', VJA, 'DAD','HAN', 1, 15,30, 80,  880000,2200000,150,10),
  flight('BL403', BAA, 'DAD','HAN', 2,  8, 0, 80,  770000,2000000,140,12),
  flight('VN404', VNA, 'DAD','HAN', 2, 20,15, 80, 1080000,2900000,110,14),

  // HAN ↔ CXR
  flight('VN501', VNA, 'HAN','CXR', 1,  8,45,115, 1100000,3100000,100,16),
  flight('VJ502', VJA, 'HAN','CXR', 2, 14, 0,115,  920000,2600000,130,10),
  flight('BL503', BAA, 'HAN','CXR', 3,  6,30,115, 1000000,2800000,120,12),
  flight('VN601', VNA, 'CXR','HAN', 1, 12,30,115, 1100000,3100000,100,16),
  flight('VJ602', VJA, 'CXR','HAN', 2, 18,30,115,  910000,2600000,130,10),
  flight('BL603', BAA, 'CXR','HAN', 3, 10, 0,115,  990000,2800000,120,12),

  // HAN ↔ PQC
  flight('VN701', VNA, 'HAN','PQC', 1,  9, 0,150, 1500000,4200000, 90,12),
  flight('VJ702', VJA, 'HAN','PQC', 2,  6,30,150, 1200000,3500000,120,10),
  flight('BL703', BAA, 'HAN','PQC', 3, 14, 0,150, 1350000,3900000,100,14),
  flight('VN704', VNA, 'HAN','PQC', 4,  8, 0,150, 1600000,4500000, 80,16),
  flight('VN801', VNA, 'PQC','HAN', 1, 13,30,150, 1500000,4200000, 90,12),
  flight('VJ802', VJA, 'PQC','HAN', 2, 11, 0,150, 1200000,3500000,120,10),
  flight('BL803', BAA, 'PQC','HAN', 3, 18,30,150, 1350000,3900000,100,14),

  // HAN ↔ DLI
  flight('VN901', VNA, 'HAN','DLI', 2, 10, 0,120, 1300000,3700000, 90,12),
  flight('VJ902', VJA, 'HAN','DLI', 3,  7,30,120, 1050000,3000000,110,10),
  flight('VN903', VNA, 'DLI','HAN', 2, 14,30,120, 1300000,3700000, 90,12),
  flight('VJ904', VJA, 'DLI','HAN', 3, 12, 0,120, 1050000,3000000,110,10),

  // HAN ↔ BMV
  flight('VN111', VNA, 'HAN','BMV', 1, 11, 0,110, 1250000,3400000, 90,12),
  flight('VJ112', VJA, 'HAN','BMV', 2, 16,30,110, 1000000,2900000,110,10),
  flight('VN113', VNA, 'BMV','HAN', 1, 14,30,110, 1250000,3400000, 90,12),
  flight('VJ114', VJA, 'BMV','HAN', 2, 20, 0,110, 1000000,2900000,110,10),

  // HAN ↔ PXU
  flight('VN115', VNA, 'HAN','PXU', 2,  8, 0,110, 1200000,3300000, 80,10),
  flight('VN116', VNA, 'PXU','HAN', 2, 12,30,110, 1200000,3300000, 80,10),

  // HAN ↔ VCA
  flight('VN117', VNA, 'HAN','VCA', 1, 13, 0,140, 1400000,4000000, 80,12),
  flight('VJ118', VJA, 'HAN','VCA', 3, 10,30,140, 1100000,3200000,100,10),
  flight('VN119', VNA, 'VCA','HAN', 1, 18, 0,140, 1400000,4000000, 80,12),
  flight('VJ120', VJA, 'VCA','HAN', 3, 15,30,140, 1100000,3200000,100,10),

  // HAN ↔ HPH (bay ngắn ~35 phút)
  flight('VN121', VNA, 'HAN','HPH', 1,  7, 0, 35,  450000,1200000,100,10),
  flight('VJ122', VJA, 'HAN','HPH', 1, 12,30, 35,  380000,1000000,120,8),
  flight('VN123', VNA, 'HPH','HAN', 1,  9, 0, 35,  450000,1200000,100,10),
  flight('VJ124', VJA, 'HPH','HAN', 1, 15, 0, 35,  380000,1000000,120,8),

  // HAN ↔ DIN
  flight('VN125', VNA, 'HAN','DIN', 1,  8, 0, 60,  650000,1800000, 60,6),
  flight('VN126', VNA, 'DIN','HAN', 1, 10,30, 60,  650000,1800000, 60,6),

  // HAN ↔ THD
  flight('VN127', VNA, 'HAN','THD', 1,  9, 0, 50,  550000,1500000, 70,8),
  flight('VJ128', VJA, 'HAN','THD', 2, 15, 0, 50,  480000,1300000, 80,6),
  flight('VN129', VNA, 'THD','HAN', 1, 11, 0, 50,  550000,1500000, 70,8),
  flight('VJ130', VJA, 'THD','HAN', 2, 17,30, 50,  480000,1300000, 80,6),

  // HAN ↔ VII
  flight('VN131', VNA, 'HAN','VII', 1,  9,30, 55,  580000,1600000, 80,8),
  flight('VJ132', VJA, 'HAN','VII', 2, 14, 0, 55,  500000,1400000, 90,6),
  flight('VN133', VNA, 'VII','HAN', 1, 11,30, 55,  580000,1600000, 80,8),
  flight('VJ134', VJA, 'VII','HAN', 2, 16,30, 55,  500000,1400000, 90,6),

  // HAN ↔ VDH
  flight('VN135', VNA, 'HAN','VDH', 1, 10, 0, 75,  750000,2100000, 80,10),
  flight('BL136', BAA, 'HAN','VDH', 2, 16, 0, 75,  680000,1900000, 90,8),
  flight('VN137', VNA, 'VDH','HAN', 1, 13, 0, 75,  750000,2100000, 80,10),
  flight('BL138', BAA, 'VDH','HAN', 2, 19, 0, 75,  680000,1900000, 90,8),

  // HAN ↔ HUI
  flight('VN139', VNA, 'HAN','HUI', 1, 11, 0, 80,  850000,2400000, 90,12),
  flight('VJ140', VJA, 'HAN','HUI', 2,  8,30, 80,  720000,2000000,110,8),
  flight('VN141', VNA, 'HUI','HAN', 1, 14, 0, 80,  850000,2400000, 90,12),
  flight('VJ142', VJA, 'HUI','HAN', 2, 12, 0, 80,  720000,2000000,110,8),

  // HAN ↔ UIH
  flight('VN143', VNA, 'HAN','UIH', 2,  9, 0,100,  950000,2700000, 80,10),
  flight('VJ144', VJA, 'HAN','UIH', 3, 15,30,100,  820000,2300000,100,8),
  flight('VN145', VNA, 'UIH','HAN', 2, 13, 0,100,  950000,2700000, 80,10),
  flight('VJ146', VJA, 'UIH','HAN', 3, 20, 0,100,  820000,2300000,100,8),

  // HAN ↔ TBB
  flight('VN147', VNA, 'HAN','TBB', 2, 10, 0,105,  900000,2500000, 70,8),
  flight('VN148', VNA, 'TBB','HAN', 2, 14,30,105,  900000,2500000, 70,8),

  // HAN ↔ VCL
  flight('VN149', VNA, 'HAN','VCL', 1, 12, 0, 90,  880000,2500000, 80,10),
  flight('VJ150', VJA, 'HAN','VCL', 3,  9, 0, 90,  750000,2100000,100,8),
  flight('VN151', VNA, 'VCL','HAN', 1, 15, 0, 90,  880000,2500000, 80,10),
  flight('VJ152', VJA, 'VCL','HAN', 3, 12,30, 90,  750000,2100000,100,8),

  // ═══════════════════════════════════
  //  TP.HCM (SGN) ↔ CÁC TUYẾN
  // ═══════════════════════════════════

  // SGN ↔ DAD
  flight('VN501A', VNA, 'SGN','DAD', 1,  7, 0, 80,  980000,2700000,120,16),
  flight('VJ502A', VJA, 'SGN','DAD', 1, 12,30, 80,  750000,2100000,150,10),
  flight('BL503A', BAA, 'SGN','DAD', 1, 18, 0, 80,  820000,2300000,130,12),
  flight('VN504A', VNA, 'SGN','DAD', 2, 10,15, 80, 1000000,2800000,110,14),
  flight('VN505A', VNA, 'DAD','SGN', 1, 10,30, 80,  980000,2700000,120,16),
  flight('VJ506A', VJA, 'DAD','SGN', 1, 16, 0, 80,  760000,2100000,150,10),
  flight('BL507A', BAA, 'DAD','SGN', 2,  8,30, 80,  830000,2300000,130,12),
  flight('VN508A', VNA, 'DAD','SGN', 2, 20, 0, 80, 1000000,2800000,110,14),

  // SGN ↔ CXR
  flight('VN509A', VNA, 'SGN','CXR', 1, 11,20, 60,  680000,1800000,110,10),
  flight('VJ510A', VJA, 'SGN','CXR', 2,  7, 0, 60,  550000,1500000,140,8),
  flight('BL511A', BAA, 'SGN','CXR', 2, 15, 0, 60,  620000,1700000,120,10),
  flight('VN512A', VNA, 'CXR','SGN', 1, 15, 0, 60,  680000,1800000,110,10),
  flight('VJ513A', VJA, 'CXR','SGN', 2, 11,30, 60,  550000,1500000,140,8),
  flight('BL514A', BAA, 'CXR','SGN', 2, 19, 0, 60,  620000,1700000,120,10),

  // SGN ↔ PQC
  flight('VJ515A', VJA, 'SGN','PQC', 1, 16, 0, 60,  580000,1500000,160,8),
  flight('BL516A', BAA, 'SGN','PQC', 1, 11, 0, 60,  650000,1800000,120,10),
  flight('VN517A', VNA, 'SGN','PQC', 2,  9, 0, 60,  850000,2400000,100,14),
  flight('PC518A', PCA, 'SGN','PQC', 2, 14,30, 60,  620000,1700000,130,8),
  flight('VJ519A', VJA, 'PQC','SGN', 1, 20, 0, 60,  580000,1500000,160,8),
  flight('BL520A', BAA, 'PQC','SGN', 2,  8, 0, 60,  650000,1800000,120,10),
  flight('VN521A', VNA, 'PQC','SGN', 2, 13, 0, 60,  850000,2400000,100,14),

  // SGN ↔ DLI
  flight('VN522A', VNA, 'SGN','DLI', 1, 10, 0, 65,  750000,2100000,100,12),
  flight('VJ523A', VJA, 'SGN','DLI', 2,  7,30, 65,  620000,1800000,120,8),
  flight('BL524A', BAA, 'SGN','DLI', 3, 15, 0, 65,  680000,1900000,110,10),
  flight('VN525A', VNA, 'DLI','SGN', 1, 13, 0, 65,  750000,2100000,100,12),
  flight('VJ526A', VJA, 'DLI','SGN', 2, 11, 0, 65,  620000,1800000,120,8),
  flight('BL527A', BAA, 'DLI','SGN', 3, 19,30, 65,  680000,1900000,110,10),

  // SGN ↔ BMV
  flight('VN528A', VNA, 'SGN','BMV', 1,  8,30, 65,  720000,2000000, 90,10),
  flight('VJ529A', VJA, 'SGN','BMV', 2, 14, 0, 65,  580000,1600000,110,8),
  flight('VN530A', VNA, 'BMV','SGN', 1, 12, 0, 65,  720000,2000000, 90,10),
  flight('VJ531A', VJA, 'BMV','SGN', 2, 18,30, 65,  580000,1600000,110,8),

  // SGN ↔ PXU
  flight('VN532A', VNA, 'SGN','PXU', 1, 11, 0, 70,  750000,2100000, 80,10),
  flight('BL533A', BAA, 'SGN','PXU', 3,  8, 0, 70,  680000,1900000, 90,8),
  flight('VN534A', VNA, 'PXU','SGN', 1, 15, 0, 70,  750000,2100000, 80,10),
  flight('BL535A', BAA, 'PXU','SGN', 3, 12,30, 70,  680000,1900000, 90,8),

  // SGN ↔ VCA
  flight('VN536A', VNA, 'SGN','VCA', 1,  9, 0, 45,  450000,1300000,100,10),
  flight('VJ537A', VJA, 'SGN','VCA', 1, 14,30, 45,  380000,1100000,120,8),
  flight('BL538A', BAA, 'SGN','VCA', 2, 11, 0, 45,  420000,1200000,110,8),
  flight('VN539A', VNA, 'VCA','SGN', 1, 12, 0, 45,  450000,1300000,100,10),
  flight('VJ540A', VJA, 'VCA','SGN', 1, 17,30, 45,  380000,1100000,120,8),
  flight('BL541A', BAA, 'VCA','SGN', 2, 14, 0, 45,  420000,1200000,110,8),

  // SGN ↔ UIH
  flight('VN542A', VNA, 'SGN','UIH', 1, 10, 0, 70,  700000,2000000, 90,10),
  flight('VJ543A', VJA, 'SGN','UIH', 2,  8, 0, 70,  580000,1700000,110,8),
  flight('VN544A', VNA, 'UIH','SGN', 1, 13,30, 70,  700000,2000000, 90,10),
  flight('VJ545A', VJA, 'UIH','SGN', 2, 12, 0, 70,  580000,1700000,110,8),

  // SGN ↔ TBB
  flight('VN546A', VNA, 'SGN','TBB', 2, 12, 0, 60,  650000,1800000, 80,8),
  flight('VN547A', VNA, 'TBB','SGN', 2, 15,30, 60,  650000,1800000, 80,8),

  // SGN ↔ VCL
  flight('VN548A', VNA, 'SGN','VCL', 1, 13,30, 75,  720000,2000000, 80,10),
  flight('VJ549A', VJA, 'SGN','VCL', 2, 10, 0, 75,  610000,1700000, 90,8),
  flight('VN550A', VNA, 'VCL','SGN', 1, 17, 0, 75,  720000,2000000, 80,10),
  flight('VJ551A', VJA, 'VCL','SGN', 2, 14, 0, 75,  610000,1700000, 90,8),

  // SGN ↔ VKG
  flight('VN552A', VNA, 'SGN','VKG', 1,  9,30, 50,  480000,1400000, 70,6),
  flight('VN553A', VNA, 'VKG','SGN', 1, 12,30, 50,  480000,1400000, 70,6),

  // SGN ↔ CAH
  flight('VN554A', VNA, 'SGN','CAH', 1, 10,30, 55,  520000,1500000, 70,6),
  flight('VN555A', VNA, 'CAH','SGN', 1, 14, 0, 55,  520000,1500000, 70,6),

  // SGN ↔ VCS (Côn Đảo)
  flight('VN556A', VNA, 'SGN','VCS', 1,  8, 0, 50,  650000,1800000, 50,6),
  flight('VJ557A', VJA, 'SGN','VCS', 2, 13, 0, 50,  550000,1600000, 60,4),
  flight('VN558A', VNA, 'VCS','SGN', 1, 10, 0, 50,  650000,1800000, 50,6),
  flight('VJ559A', VJA, 'VCS','SGN', 2, 16, 0, 50,  550000,1600000, 60,4),

  // SGN ↔ VBA (Vũng Tàu - nếu còn hoạt động)
  flight('VN560A', VNA, 'SGN','VBA', 1,  8,30, 30,  350000,1000000, 40,4),
  flight('VN561A', VNA, 'VBA','SGN', 1, 10, 0, 30,  350000,1000000, 40,4),

  // SGN ↔ HUI
  flight('VN562A', VNA, 'SGN','HUI', 1, 12, 0, 90,  900000,2500000, 90,12),
  flight('VJ563A', VJA, 'SGN','HUI', 2,  9,30, 90,  780000,2200000,110,8),
  flight('VN564A', VNA, 'HUI','SGN', 1, 15,30, 90,  900000,2500000, 90,12),
  flight('VJ565A', VJA, 'HUI','SGN', 2, 14, 0, 90,  780000,2200000,110,8),

  // SGN ↔ VII
  flight('VN566A', VNA, 'SGN','VII', 2, 10, 0,110,  950000,2700000, 80,10),
  flight('VN567A', VNA, 'VII','SGN', 2, 14,30,110,  950000,2700000, 80,10),

  // SGN ↔ VDH
  flight('VN568A', VNA, 'SGN','VDH', 2, 11, 0,105,  920000,2600000, 80,10),
  flight('VN569A', VNA, 'VDH','SGN', 2, 15,30,105,  920000,2600000, 80,10),

  // ═══════════════════════════════════
  //  ĐÀ NẴNG (DAD) ↔ CÁC TUYẾN
  // ═══════════════════════════════════

  // DAD ↔ CXR
  flight('VN601A', VNA, 'DAD','CXR', 2, 10, 0, 65,  750000,2000000, 80,10),
  flight('VJ602A', VJA, 'DAD','CXR', 3,  8,30, 65,  620000,1700000,100,8),
  flight('VN603A', VNA, 'CXR','DAD', 2, 14, 0, 65,  750000,2000000, 80,10),
  flight('VJ604A', VJA, 'CXR','DAD', 3, 13, 0, 65,  620000,1700000,100,8),

  // DAD ↔ PQC
  flight('VN605A', VNA, 'DAD','PQC', 1, 11, 0, 90,  950000,2700000, 80,10),
  flight('BL606A', BAA, 'DAD','PQC', 3,  8, 0, 90,  850000,2400000, 90,8),
  flight('VN607A', VNA, 'PQC','DAD', 1, 15, 0, 90,  950000,2700000, 80,10),
  flight('BL608A', BAA, 'PQC','DAD', 3, 12,30, 90,  850000,2400000, 90,8),

  // DAD ↔ DLI
  flight('VN609A', VNA, 'DAD','DLI', 2, 12, 0, 80,  850000,2400000, 70,8),
  flight('VN610A', VNA, 'DLI','DAD', 2, 16, 0, 80,  850000,2400000, 70,8),

  // DAD ↔ BMV
  flight('VN611A', VNA, 'DAD','BMV', 3, 10,30, 75,  820000,2300000, 70,8),
  flight('VN612A', VNA, 'BMV','DAD', 3, 14, 0, 75,  820000,2300000, 70,8),

  // DAD ↔ HUI
  flight('VN613A', VNA, 'DAD','HUI', 1,  9, 0, 40,  480000,1400000, 90,8),
  flight('VJ614A', VJA, 'DAD','HUI', 2, 13,30, 40,  420000,1200000,110,6),
  flight('VN615A', VNA, 'HUI','DAD', 1, 11, 0, 40,  480000,1400000, 90,8),
  flight('VJ616A', VJA, 'HUI','DAD', 2, 17, 0, 40,  420000,1200000,110,6),

  // DAD ↔ UIH
  flight('VN617A', VNA, 'DAD','UIH', 2, 11, 0, 50,  550000,1600000, 80,8),
  flight('VN618A', VNA, 'UIH','DAD', 2, 14, 0, 50,  550000,1600000, 80,8),

  // DAD ↔ VCL
  flight('VN619A', VNA, 'DAD','VCL', 1, 13, 0, 35,  400000,1200000, 80,6),
  flight('VJ620A', VJA, 'DAD','VCL', 2, 10, 0, 35,  360000,1000000,100,6),
  flight('VN621A', VNA, 'VCL','DAD', 1, 15, 0, 35,  400000,1200000, 80,6),
  flight('VJ622A', VJA, 'VCL','DAD', 2, 13, 0, 35,  360000,1000000,100,6),

  // DAD ↔ HPH
  flight('VN623A', VNA, 'DAD','HPH', 2,  8, 0, 80,  850000,2400000, 80,10),
  flight('VN624A', VNA, 'HPH','DAD', 2, 12, 0, 80,  850000,2400000, 80,10),

  // DAD ↔ VCA
  flight('VN625A', VNA, 'DAD','VCA', 3, 11, 0, 90,  900000,2500000, 80,10),
  flight('VN626A', VNA, 'VCA','DAD', 3, 15, 0, 90,  900000,2500000, 80,10),

  // ═══════════════════════════════════
  //  CÁC TUYẾN LIÊN VÙNG KHÁC
  // ═══════════════════════════════════

  // HPH ↔ SGN
  flight('VN701A', VNA, 'HPH','SGN', 1,  9, 0,130, 1200000,3400000, 90,12),
  flight('VJ702A', VJA, 'HPH','SGN', 2, 15,30,130,  980000,2800000,110,10),
  flight('VN703A', VNA, 'SGN','HPH', 1, 14, 0,130, 1200000,3400000, 90,12),
  flight('VJ704A', VJA, 'SGN','HPH', 2, 20, 0,130,  980000,2800000,110,10),

  // HPH ↔ DAD
  flight('VN705A', VNA, 'HPH','DAD', 2, 10, 0, 85,  900000,2500000, 80,10),
  flight('VN706A', VNA, 'DAD','HPH', 2, 14,30, 85,  900000,2500000, 80,10),

  // HPH ↔ CXR
  flight('VN707A', VNA, 'HPH','CXR', 3,  9, 0,110, 1050000,2900000, 70,8),
  flight('VN708A', VNA, 'CXR','HPH', 3, 14, 0,110, 1050000,2900000, 70,8),

  // HPH ↔ PQC
  flight('VN709A', VNA, 'HPH','PQC', 4,  8, 0,150, 1450000,4100000, 70,10),
  flight('VN710A', VNA, 'PQC','HPH', 4, 13,30,150, 1450000,4100000, 70,10),

  // VCA ↔ CXR
  flight('VN711A', VNA, 'VCA','CXR', 2, 12, 0, 80,  720000,2000000, 70,8),
  flight('VN712A', VNA, 'CXR','VCA', 2, 16, 0, 80,  720000,2000000, 70,8),

  // VCA ↔ PQC
  flight('VN713A', VNA, 'VCA','PQC', 1, 10, 0, 50,  480000,1400000, 70,6),
  flight('VJ714A', VJA, 'VCA','PQC', 2,  8,30, 50,  420000,1200000, 80,6),
  flight('VN715A', VNA, 'PQC','VCA', 1, 13, 0, 50,  480000,1400000, 70,6),
  flight('VJ716A', VJA, 'PQC','VCA', 2, 12, 0, 50,  420000,1200000, 80,6),

  // VCA ↔ DAD
  flight('VN717A', VNA, 'VCA','DAD', 3, 11, 0, 90,  900000,2500000, 70,8),
  flight('VN718A', VNA, 'DAD','VCA', 3, 15, 0, 90,  900000,2500000, 70,8),

  // CXR ↔ PQC
  flight('VN719A', VNA, 'CXR','PQC', 2, 10, 0, 60,  580000,1700000, 60,6),
  flight('VN720A', VNA, 'PQC','CXR', 2, 13, 0, 60,  580000,1700000, 60,6),

  // CXR ↔ DLI
  flight('VN721A', VNA, 'CXR','DLI', 3, 11, 0, 55,  550000,1600000, 60,6),
  flight('VN722A', VNA, 'DLI','CXR', 3, 15, 0, 55,  550000,1600000, 60,6),

  // BMV ↔ DLI
  flight('VN723A', VNA, 'BMV','DLI', 2, 10, 0, 50,  500000,1500000, 60,6),
  flight('VN724A', VNA, 'DLI','BMV', 2, 13, 0, 50,  500000,1500000, 60,6),

  // BMV ↔ PQC
  flight('VN725A', VNA, 'BMV','PQC', 3,  9, 0, 80,  750000,2100000, 60,6),
  flight('VN726A', VNA, 'PQC','BMV', 3, 13, 0, 80,  750000,2100000, 60,6),

  // PXU ↔ DAD
  flight('VN727A', VNA, 'PXU','DAD', 2, 10, 0, 55,  600000,1700000, 60,6),
  flight('VN728A', VNA, 'DAD','PXU', 2, 13,30, 55,  600000,1700000, 60,6),

  // PXU ↔ CXR
  flight('VN729A', VNA, 'PXU','CXR', 3, 11, 0, 60,  620000,1800000, 60,6),
  flight('VN730A', VNA, 'CXR','PXU', 3, 14, 0, 60,  620000,1800000, 60,6),

  // HUI ↔ SGN
  flight('VN731A', VNA, 'HUI','SGN', 1, 12, 0, 90,  900000,2500000, 90,12),
  flight('VJ732A', VJA, 'HUI','SGN', 2,  9,30, 90,  780000,2200000,110,8),
  flight('VN733A', VNA, 'SGN','HUI', 1, 16, 0, 90,  900000,2500000, 90,12),
  flight('VJ734A', VJA, 'SGN','HUI', 2, 14, 0, 90,  780000,2200000,110,8),

  // VDH ↔ SGN
  flight('VN735A', VNA, 'VDH','SGN', 2, 11, 0,105,  920000,2600000, 80,10),
  flight('VN736A', VNA, 'SGN','VDH', 2, 16, 0,105,  920000,2600000, 80,10),

  // VII ↔ DAD
  flight('VN737A', VNA, 'VII','DAD', 2, 10, 0, 60,  650000,1800000, 70,8),
  flight('VN738A', VNA, 'DAD','VII', 2, 14, 0, 60,  650000,1800000, 70,8),

  // THD ↔ SGN
  flight('VN739A', VNA, 'THD','SGN', 2, 12, 0,120, 1100000,3100000, 70,8),
  flight('VN740A', VNA, 'SGN','THD', 2, 17, 0,120, 1100000,3100000, 70,8),

  // THD ↔ DAD
  flight('VN741A', VNA, 'THD','DAD', 3,  9, 0, 65,  680000,1900000, 70,8),
  flight('VN742A', VNA, 'DAD','THD', 3, 13, 0, 65,  680000,1900000, 70,8),

  // TBB ↔ DAD
  flight('VN743A', VNA, 'TBB','DAD', 2, 10, 0, 50,  580000,1600000, 60,6),
  flight('VN744A', VNA, 'DAD','TBB', 2, 13, 0, 50,  580000,1600000, 60,6),

  // TBB ↔ CXR
  flight('VN745A', VNA, 'TBB','CXR', 3, 11, 0, 40,  480000,1400000, 60,6),
  flight('VN746A', VNA, 'CXR','TBB', 3, 14, 0, 40,  480000,1400000, 60,6),

  // VCL ↔ SGN
  flight('VN747A', VNA, 'VCL','SGN', 1, 13, 0, 75,  720000,2000000, 80,10),
  flight('VJ748A', VJA, 'VCL','SGN', 2, 10, 0, 75,  610000,1700000, 90,8),
  flight('VN749A', VNA, 'SGN','VCL', 1, 17, 0, 75,  720000,2000000, 80,10),
  flight('VJ750A', VJA, 'SGN','VCL', 2, 14, 0, 75,  610000,1700000, 90,8),

  // VKG ↔ PQC
  flight('VN751A', VNA, 'VKG','PQC', 1,  9, 0, 40,  400000,1200000, 50,4),
  flight('VN752A', VNA, 'PQC','VKG', 1, 12, 0, 40,  400000,1200000, 50,4),

  // CAH ↔ PQC
  flight('VN753A', VNA, 'CAH','PQC', 2, 10, 0, 50,  450000,1300000, 50,4),
  flight('VN754A', VNA, 'PQC','CAH', 2, 13, 0, 50,  450000,1300000, 50,4),

  // UIH ↔ PQC
  flight('VN755A', VNA, 'UIH','PQC', 3, 11, 0, 80,  750000,2100000, 60,6),
  flight('VN756A', VNA, 'PQC','UIH', 3, 15, 0, 80,  750000,2100000, 60,6),

  // DIN ↔ SGN (dài)
  flight('VN757A', VNA, 'DIN','SGN', 3,  9, 0,175, 1700000,4800000, 50,6),
  flight('VN758A', VNA, 'SGN','DIN', 3, 14, 0,175, 1700000,4800000, 50,6),

  // VCS ↔ CAH
  flight('VN759A', VNA, 'VCS','CAH', 2, 10, 0, 45,  500000,1500000, 40,4),
  flight('VN760A', VNA, 'CAH','VCS', 2, 13, 0, 45,  500000,1500000, 40,4),

  // VCS ↔ VCA
  flight('VN761A', VNA, 'VCS','VCA', 3, 11, 0, 55,  550000,1600000, 40,4),
  flight('VN762A', VNA, 'VCA','VCS', 3, 15, 0, 55,  550000,1600000, 40,4),

];

// ═══════════════════════════════════════════════════════════
//  USERS
// ═══════════════════════════════════════════════════════════
const users = [
  { name: 'Admin AirBook',   email: 'admin@airbook.vn', password: '123456', phone: '0901234567', role: 'admin' },
  { name: 'Nguyễn Văn An',  email: 'an@gmail.com',     password: '123456', phone: '0912345678', role: 'user'  },
  { name: 'Trần Thị Bình',  email: 'binh@gmail.com',   password: '123456', phone: '0923456789', role: 'user'  },
];

// ═══════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');

    await User.deleteMany({});
    await Flight.deleteMany({});
    await Booking.deleteMany({});
    console.log('🗑️  Đã xóa dữ liệu cũ');

    const createdUsers   = await User.create(users);
    const createdFlights = await Flight.create(flights);
    console.log(`👥 Đã tạo ${createdUsers.length} người dùng`);
    console.log(`✈️  Đã tạo ${createdFlights.length} chuyến bay`);

    // Booking mẫu
    const bk = await Booking.create({
      user:       createdUsers[1]._id,
      flight:     createdFlights[0]._id,
      passengers: [{ name: 'Nguyễn Văn An', age: 25, passport: '087654321' }],
      seatClass:  'economy',
      totalPrice: createdFlights[0].price.economy,
    });
    console.log(`🎫 Booking mẫu: ${bk.bookingCode}`);

    console.log('\n═══════════════════════════════════════');
    console.log('🎉 SEED THÀNH CÔNG!');
    console.log(`📊 Tổng: ${createdFlights.length} chuyến bay | 22 sân bay | 4 hãng`);
    console.log('───────────────────────────────────────');
    console.log('📧 ADMIN : admin@airbook.vn / 123456');
    console.log('📧 USER  : an@gmail.com     / 123456');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed:', err);
    process.exit(1);
  }
};

seedDB();