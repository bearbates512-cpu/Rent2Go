import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Vehicle, VehicleCategory, VehicleVisibility, VehicleOpStatus } from '../../types/index.ts';
import {
  Car,
  PlusCircle,
  Search,
  FileEdit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Image,
  X,
  Gauge,
  Users,
  Copy,
  Sparkles,
  Navigation,
  ShieldCheck,
  RotateCcw,
  Upload,
  Check
} from 'lucide-react';

const POPULAR_FLEET_PRESETS = [
  {
    label: 'Corolla Grande 2024',
    make: 'Toyota',
    model: 'Corolla Altis Grande',
    variant: '1.8 Dual VVT-i Special Edition',
    year: 2024,
    category: 'sedan' as VehicleCategory,
    seats: 5,
    doors: 4,
    trans: 'automatic' as const,
    fuel: 'petrol' as const,
    dailyRate: '8000',
    driverFee: 1500,
    deposit: 15000,
    img: '/cars/corolla-grande.jpg'
  },
  {
    label: 'Civic RS Turbo 2023',
    make: 'Honda',
    model: 'Civic RS Turbo',
    variant: '1.5 VTEC Turbo Oriel',
    year: 2023,
    category: 'sedan' as VehicleCategory,
    seats: 5,
    doors: 4,
    trans: 'automatic' as const,
    fuel: 'petrol' as const,
    dailyRate: '12000',
    driverFee: 2000,
    deposit: 25000,
    img: '/cars/civic-rs.jpg'
  },
  {
    label: 'Fortuner Legender 2024',
    make: 'Toyota',
    model: 'Fortuner Legender',
    variant: '2.8L 4x4 Sigma 4',
    year: 2024,
    category: 'suv' as VehicleCategory,
    seats: 7,
    doors: 5,
    trans: 'automatic' as const,
    fuel: 'diesel' as const,
    dailyRate: '25000',
    driverFee: 2500,
    deposit: 35000,
    img: '/cars/fortuner-legender.jpg'
  },
  {
    label: 'Land Cruiser Prado 2023',
    make: 'Toyota',
    model: 'Land Cruiser Prado',
    variant: 'TX-L 4.0 V6 4x4',
    year: 2023,
    category: 'luxury' as VehicleCategory,
    seats: 7,
    doors: 5,
    trans: 'automatic' as const,
    fuel: 'petrol' as const,
    dailyRate: '32000',
    driverFee: 3000,
    deposit: 40000,
    img: '/cars/prado.jpg'
  },
  {
    label: 'Toyota Yaris ATIV 2023',
    make: 'Toyota',
    model: 'Yaris ATIV',
    variant: '1.3 CVT Automatic',
    year: 2023,
    category: 'sedan' as VehicleCategory,
    seats: 5,
    doors: 4,
    trans: 'automatic' as const,
    fuel: 'petrol' as const,
    dailyRate: '5500',
    driverFee: 1500,
    deposit: 10000,
    img: '/cars/toyota-yaris.jpg'
  },
  {
    label: 'Suzuki Alto VXL 2024',
    make: 'Suzuki',
    model: 'Alto VXL',
    variant: '660cc AGS Automatic',
    year: 2024,
    category: 'hatchback' as VehicleCategory,
    seats: 4,
    doors: 5,
    trans: 'automatic' as const,
    fuel: 'petrol' as const,
    dailyRate: '3500',
    driverFee: 1200,
    deposit: 8000,
    img: '/cars/suzuki-alto.jpg'
  },
  {
    label: 'Suzuki Cultus VXL 2023',
    make: 'Suzuki',
    model: 'Cultus VXL',
    variant: '1.0L K10B Auto Gear Shift',
    year: 2023,
    category: 'hatchback' as VehicleCategory,
    seats: 5,
    doors: 5,
    trans: 'automatic' as const,
    fuel: 'petrol' as const,
    dailyRate: '4500',
    driverFee: 1500,
    deposit: 10000,
    img: '/cars/suzuki-cultus.jpg'
  },
  {
    label: 'Hiace Grand Cabin 2023',
    make: 'Toyota',
    model: 'Hiace Grand Cabin',
    variant: 'High Roof Super GL 14-Seater',
    year: 2023,
    category: 'van' as VehicleCategory,
    seats: 14,
    doors: 4,
    trans: 'automatic' as const,
    fuel: 'diesel' as const,
    dailyRate: '16000',
    driverFee: 2000,
    deposit: 20000,
    img: '/cars/hiace-cabin.jpg'
  }
];

export const PRESET_GALLERY_IMAGES = [
  { name: 'Corolla Altis Grande (White)', url: '/cars/corolla-grande.jpg' },
  { name: 'Civic RS Turbo (Black)', url: '/cars/civic-rs.jpg' },
  { name: 'Fortuner Legender 4x4 (White)', url: '/cars/fortuner-legender.jpg' },
  { name: 'Land Cruiser Prado (Black)', url: '/cars/prado.jpg' },
  { name: 'Toyota Yaris ATIV (Silver)', url: '/cars/toyota-yaris.jpg' },
  { name: 'Suzuki Alto VXL (White)', url: '/cars/suzuki-alto.jpg' },
  { name: 'Suzuki Cultus VXL (Grey)', url: '/cars/suzuki-cultus.jpg' },
  { name: 'Hiace Grand Cabin (White)', url: '/cars/hiace-cabin.jpg' }
];

export const AdminVehicles: React.FC = () => {
  const {
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    duplicateVehicle,
    clearDemoFleet,
    resetFleetToDefault,
    purgeAllDemoData,
    resetAllData
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form state
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Corolla');
  const [variant, setVariant] = useState('Altis 1.6');
  const [modelYear, setModelYear] = useState<number>(2023);
  const [category, setCategory] = useState<VehicleCategory>('sedan');
  const [seats, setSeats] = useState<number>(5);
  const [doors, setDoors] = useState<number>(4);
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'hybrid' | 'electric'>('petrol');
  const [hasAC, setHasAC] = useState<boolean>(true);
  const [driverOption, setDriverOption] = useState<'with_driver' | 'self_drive' | 'both'>('both');
  const [dailyRate, setDailyRate] = useState<string>('6500');
  const [isQuoteOnly, setIsQuoteOnly] = useState<boolean>(false);
  const [driverFee, setDriverFee] = useState<number>(1500);
  const [mileageLimit, setMileageLimit] = useState<string>('200 KM');
  const [extraKmRate, setExtraKmRate] = useState<number>(25);
  const [secDeposit, setSecDeposit] = useState<number>(10000);
  const [regNumber, setRegNumber] = useState<string>('RYK-2023-');
  const [odometerKm, setOdometerKm] = useState<number>(38500);
  const [gpsTracker, setGpsTracker] = useState<boolean>(true);
  const [coverImage, setCoverImage] = useState<string>('/cars/corolla-grande.jpg');
  const [visibility, setVisibility] = useState<VehicleVisibility>('published');
  const [opStatus, setOpStatus] = useState<VehicleOpStatus>('available');
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Please select an image under 10MB.');
      return;
    }

    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1000;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCoverImage(compressedDataUrl);
        }
        setUploadLoading(false);
      };
      img.onerror = () => {
        setUploadLoading(false);
        alert('Could not process this image file.');
      };
      if (typeof readerEvent.target?.result === 'string') {
        img.src = readerEvent.target.result;
      }
    };
    reader.onerror = () => {
      setUploadLoading(false);
      alert('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (p: typeof POPULAR_FLEET_PRESETS[0]) => {
    setMake(p.make);
    setModel(p.model);
    setVariant(p.variant);
    setModelYear(p.year);
    setCategory(p.category);
    setSeats(p.seats);
    setDoors(p.doors);
    setTransmission(p.trans);
    setFuelType(p.fuel);
    setDailyRate(p.dailyRate);
    setIsQuoteOnly(false);
    setDriverFee(p.driverFee);
    setSecDeposit(p.deposit);
    setCoverImage(p.img);
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setMake('Toyota');
    setModel('Corolla Altis');
    setVariant('1.6 Automatic');
    setModelYear(2023);
    setCategory('sedan');
    setSeats(5);
    setDoors(4);
    setTransmission('automatic');
    setFuelType('petrol');
    setHasAC(true);
    setDriverOption('both');
    setDailyRate('6500');
    setIsQuoteOnly(false);
    setDriverFee(1500);
    setMileageLimit('200 KM');
    setExtraKmRate(25);
    setSecDeposit(10000);
    setRegNumber(`RYK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setOdometerKm(35000);
    setGpsTracker(true);
    setCoverImage('/cars/corolla-grande.jpg');
    setVisibility('published');
    setOpStatus('available');
    setModalOpen(true);
  };

  const openEditModal = (v: Vehicle) => {
    setEditingVehicle(v);
    setMake(v.make);
    setModel(v.model);
    setVariant(v.variant || '');
    setModelYear(v.modelYear);
    setCategory(v.category);
    setSeats(v.seats);
    setDoors(v.doors);
    setTransmission(v.transmission);
    setFuelType(v.fuelType);
    setHasAC(v.hasAC);
    setDriverOption(v.driverOption);
    setDailyRate(v.dailyRatePKR ? v.dailyRatePKR.toString() : '');
    setIsQuoteOnly(v.dailyRatePKR === null);
    setDriverFee(v.driverDailyFeePKR || 1500);
    setMileageLimit(v.customFields?.mileageLimitPerDay || '200 KM');
    setExtraKmRate(v.customFields?.extraKmRate || 25);
    setSecDeposit(v.customFields?.securityDeposit || 10000);
    setRegNumber(v.customFields?.registrationNumber || `RYK-${v.modelYear}-0000`);
    setOdometerKm(v.customFields?.odometerKm || 40000);
    setGpsTracker(v.customFields?.gpsTrackerInstalled ?? true);
    setCoverImage(v.coverImage);
    setVisibility(v.visibility);
    setOpStatus(v.opStatus);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData: Omit<Vehicle, 'id'> = {
      stockCode: editingVehicle?.stockCode || `R2G-${make.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      slug: `${make.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${modelYear}`,
      make: make.trim(),
      model: model.trim(),
      variant: variant.trim(),
      modelYear,
      category,
      title: {
        en: `${make} ${model} (${modelYear})`,
        ur: `${make} ${model} (${modelYear})`
      },
      description: {
        en: `${make} ${model} ${variant}. Available for hire in Sadiqabad with professional driver or self-drive.`,
        ur: `${make} ${model} صادق آباد اور پنجاب بھر کے سفر کے لیے دستیاب۔`
      },
      seats,
      doors,
      transmission,
      fuelType,
      hasAC,
      driverOption,
      features: [
        'Air Conditioning',
        'Power Windows',
        'ABS Brakes',
        'Clean Sanitized Interior',
        gpsTracker ? 'Live GPS Satellite Tracker' : 'Factory Security'
      ],
      customFields: {
        registrationNumber: regNumber.trim(),
        odometerKm,
        gpsTrackerInstalled: gpsTracker,
        mileageLimitPerDay: mileageLimit,
        extraKmRate,
        securityDeposit: secDeposit
      },
      dailyRatePKR: isQuoteOnly ? null : (parseInt(dailyRate) || 5000),
      driverDailyFeePKR: driverFee,
      visibility,
      opStatus,
      isFeatured: true,
      coverImage: coverImage.trim(),
      galleryImages: [coverImage.trim()],
      maintenanceWindows: editingVehicle?.maintenanceWindows || []
    };

    if (editingVehicle) {
      updateVehicle({ ...vehicleData, id: editingVehicle.id });
    } else {
      addVehicle(vehicleData);
    }

    setModalOpen(false);
  };

  const filteredVehicles = vehicles.filter(v => {
    if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.stockCode.toLowerCase().includes(q) ||
        (v.customFields?.registrationNumber && v.customFields.registrationNumber.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#0B1F3A]">Fleet & Vehicles Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              {vehicles.length} Cars
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Add cars, update daily rates, track registration numbers, and toggle visibility.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to purge all demo bookings and customer inquiries? Your cars will be preserved.')) {
                purgeAllDemoData();
              }
            }}
            title="Clean up test customer inquiries and bookings while keeping cars"
            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-700 hover:bg-rose-100/80 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Purge Demo Bookings</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Load the 8 fresh Pakistani rental cars (Grande, Civic RS, Fortuner, Prado, Yaris, Alto, Cultus, Hiace) with high-res photos?')) {
                resetFleetToDefault();
              }
            }}
            title="Reload 8 Pakistani rental models with realistic photos and rates"
            className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/60 text-blue-800 hover:bg-blue-100/80 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            <span>Reset 8 Real Cars</span>
          </button>

          {vehicles.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all vehicles from the fleet? You can restore them anytime with "Reset 8 Real Cars".')) {
                  clearDemoFleet();
                }
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-all cursor-pointer"
            >
              Clear Fleet
            </button>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Vehicle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {['all', 'sedan', 'suv', 'hatchback', 'van', 'luxury'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                selectedCategory === cat
                  ? 'bg-[#0B1F3A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search make, model, stock code..."
            className="w-full ps-9 pe-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium"
          />
        </div>
      </div>

      {/* Vehicles Grid / Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-[#0B1F3A] text-white uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4 text-start">Car & Stock</th>
                <th className="py-3.5 px-4 text-start">Category</th>
                <th className="py-3.5 px-4 text-start">Specs</th>
                <th className="py-3.5 px-4 text-start">Daily Rent</th>
                <th className="py-3.5 px-4 text-start">Driver Fee</th>
                <th className="py-3.5 px-4 text-start">Visibility</th>
                <th className="py-3.5 px-4 text-start">Status</th>
                <th className="py-3.5 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map(veh => (
                <tr key={veh.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={veh.coverImage}
                        alt=""
                        className="w-14 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">
                          {veh.make} {veh.model}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono text-slate-400">{veh.stockCode} • {veh.modelYear}</span>
                          {veh.customFields?.registrationNumber && (
                            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                              {veh.customFields.registrationNumber}
                            </span>
                          )}
                          {veh.customFields?.gpsTrackerInstalled && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              <span>GPS</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 uppercase text-slate-600 font-semibold">
                    {veh.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <span>{veh.seats} Seats</span> • <span className="capitalize">{veh.transmission}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0B1F3A]">
                    {veh.dailyRatePKR ? `Rs. ${veh.dailyRatePKR.toLocaleString()}` : (
                      <span className="text-amber-700 font-sans font-semibold text-xs">Quote Only</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    Rs. {veh.driverDailyFeePKR.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        veh.visibility === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : veh.visibility === 'draft'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {veh.visibility}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        veh.opStatus === 'available'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {veh.opStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-end space-x-1.5">
                    <button
                      onClick={() => duplicateVehicle(veh.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                      title="Duplicate Vehicle (Clone)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(veh)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100"
                      title="Edit Vehicle"
                    >
                      <FileEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${veh.make} ${veh.model}?`)) {
                          deleteVehicle(veh.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0B1F3A]">
                {editingVehicle ? `Edit ${editingVehicle.make} ${editingVehicle.model}` : 'Add New Fleet Vehicle'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {!editingVehicle && (
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Auto-Fill With Popular Pakistani Rental Cars:</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {POPULAR_FLEET_PRESETS.map(p => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-slate-800 text-[11px] font-bold hover:bg-[#0B1F3A] hover:text-[#F5B301] hover:border-[#0B1F3A] transition-all shadow-2xs cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Registration and Operations */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-700 block">Fleet Identity & Hardware</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Registration / Plate No *</label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={e => setRegNumber(e.target.value)}
                      placeholder="e.g. RYK-2023-4567"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Current Odometer (KM)</label>
                    <input
                      type="number"
                      value={odometerKm}
                      onChange={e => setOdometerKm(Number(e.target.value))}
                      placeholder="35000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                    />
                  </div>
                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gpsTracker}
                        onChange={e => setGpsTracker(e.target.checked)}
                        className="w-4 h-4 accent-[#0B1F3A]"
                      />
                      <span className="text-slate-700 font-bold">GPS Tracker Installed</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Make *</label>
                  <input
                    type="text"
                    value={make}
                    onChange={e => setMake(e.target.value)}
                    placeholder="Toyota, Honda, Suzuki"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model *</label>
                  <input
                    type="text"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                    placeholder="Corolla, Civic, Prado"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Model Year *</label>
                  <input
                    type="number"
                    value={modelYear}
                    onChange={e => setModelYear(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 capitalize"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV 4x4</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="van">Passenger Van</option>
                    <option value="luxury">Luxury VIP</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Seats</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={seats}
                    onChange={e => setSeats(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={e => setTransmission(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>

              {/* Pricing section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-bold text-slate-700 block">Tariff & Driver Rates</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Daily Rate (PKR)</label>
                    <input
                      type="number"
                      disabled={isQuoteOnly}
                      value={dailyRate}
                      onChange={e => setDailyRate(e.target.value)}
                      placeholder="6000"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Driver Daily Fee (PKR)</label>
                    <input
                      type="number"
                      value={driverFee}
                      onChange={e => setDriverFee(parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                    />
                  </div>

                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isQuoteOnly}
                        onChange={e => setIsQuoteOnly(e.target.checked)}
                        className="accent-[#0B1F3A]"
                      />
                      <span className="text-slate-700 font-semibold">"Contact for Quote" only</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Photo & Image Section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 block">Vehicle Photo *</span>
                  <span className="text-[10px] text-slate-500">Device upload, preset library, or web link</span>
                </div>

                {/* Preview and Direct Upload */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-2xs">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Image className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#0B1F3A] hover:bg-slate-100 cursor-pointer text-xs font-bold text-slate-800 transition-all shadow-2xs">
                        <Upload className="w-4 h-4 text-amber-500" />
                        <span>{uploadLoading ? 'Optimizing photo...' : 'Upload Photo from Device / Mobile'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploadLoading}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">or enter file path / link:</span>
                    </div>

                    <input
                      type="text"
                      value={coverImage}
                      onChange={e => setCoverImage(e.target.value)}
                      placeholder="/cars/corolla-grande.jpg or https://..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono text-[11px] bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Quick Presets Gallery Selector */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                    Or Pick Real Car Photo from Library:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_GALLERY_IMAGES.map((preset) => {
                      const isSelected = coverImage === preset.url;
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => setCoverImage(preset.url)}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border text-start transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-400/30'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-10 h-8 object-cover rounded-lg shrink-0 border border-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/cars/corolla-grande.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-slate-800 truncate leading-tight">{preset.name}</p>
                            {isSelected && (
                              <span className="text-[9px] font-bold text-amber-700 flex items-center gap-0.5 mt-0.5">
                                <Check className="w-3 h-3" /> Selected
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Visibility and Operational Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Visibility</label>
                  <select
                    value={visibility}
                    onChange={e => setVisibility(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 capitalize"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Operational Status</label>
                  <select
                    value={opStatus}
                    onChange={e => setOpStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 capitalize"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">In Maintenance</option>
                    <option value="temporarily_unavailable">Temporarily Unavailable</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0B1F3A] text-[#F5B301] font-bold"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
