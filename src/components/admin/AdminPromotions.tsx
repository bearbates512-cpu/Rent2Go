import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { HeroBannerItem, DiscountCampaign, Vehicle, VehicleCategory } from '../../types/index.ts';
import { soundFX } from '../../utils/soundEffects.ts';
import { SpinInHeading, SpinInText, LiquidGasBadge } from '../effects/SpinInTypography.tsx';
import { LiquidGasAura } from '../effects/LiquidGasCanvas.tsx';
import {
  Sparkles,
  Image as ImageIcon,
  Tag,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  Percent,
  Calendar,
  Gift,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  Car,
  Sliders,
  ChevronRight,
  ExternalLink,
  Upload,
  RotateCcw
} from 'lucide-react';

const PRESET_BANNER_IMAGES = [
  {
    name: 'Modern Futuristic Rental Hero',
    url: '/assets/aistudio/a_polished_modern_car_rental_website_hero_banner_i_1a91e531.png'
  },
  {
    name: 'Family Luxury Roadtrip',
    url: '/assets/aistudio/Rent2Go_Family_Travel_Banner_efd52a90.png'
  },
  {
    name: 'Premium SUV & Chauffeur Convoy',
    url: '/assets/aistudio/Premium_Cars__Unforgettable_Journeys_abbb121d.png'
  },
  {
    name: 'Honda Civic RS Sporty Turbo',
    url: '/cars/civic-rs.jpg'
  },
  {
    name: 'Toyota Fortuner Legender 4x4',
    url: '/cars/fortuner-legender.jpg'
  },
  {
    name: 'Toyota Corolla Altis Grande',
    url: '/cars/corolla-grande.jpg'
  },
  {
    name: 'Hyundai Sonata Pearl White',
    url: '/cars/sonata-pearl.jpg'
  },
  {
    name: 'Toyota Yaris ATIV Executive',
    url: '/cars/yaris-ativ.jpg'
  },
  {
    name: 'Toyota Land Cruiser V8 Protocol',
    url: '/cars/landcruiser-v8.jpg'
  },
  {
    name: 'Toyota Hiace Grand Cabin 14-Seater',
    url: '/cars/hiace-grand-cabin.jpg'
  }
];

export const AdminPromotions: React.FC = () => {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    discountCampaigns,
    addDiscountCampaign,
    updateDiscountCampaign,
    deleteDiscountCampaign,
    vehicles,
    updateVehicle,
    getVehicleEffectivePrice,
    settings,
    updateSiteLogo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'banners' | 'campaigns' | 'per_car' | 'logo'>('banners');
  const [logoInputUrl, setLogoInputUrl] = useState(settings.logoUrl || '/assets/aistudio/Rent2Go_icon_transparent.png');
  const [logoPreviewError, setLogoPreviewError] = useState(false);
  const logoFileInputRef = React.useRef<HTMLInputElement>(null);

  // Banner Modal States
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Omit<HeroBannerItem, 'id' | 'sortOrder'>>({
    image: PRESET_BANNER_IMAGES[0].url,
    titleEn: '',
    titleUr: '',
    badgeEn: 'Rahim Yar Khan · 7 Days 24 Hours Service',
    badgeUr: 'رحیم یار خان · 7 دن 24 گھنٹے سروس',
    animation: 'fade',
    isActive: true
  });

  // Campaign Modal States
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [campaignForm, setCampaignForm] = useState<Omit<DiscountCampaign, 'id'>>({
    titleEn: '',
    titleUr: '',
    badgeEn: 'SPECIAL OFFER',
    badgeUr: 'خصوصی رعایت',
    descriptionEn: '',
    descriptionUr: '',
    discountType: 'percentage',
    discountValue: 15,
    applyTo: 'all',
    targetCategory: 'sedan',
    targetVehicleIds: [],
    isActive: true,
    announceInBar: true
  });

  // Success alert indicator
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // ----------------------------------------------------
  // BANNER HANDLERS
  // ----------------------------------------------------
  const handleOpenAddBanner = () => {
    soundFX.playClick();
    setEditingBannerId(null);
    setBannerForm({
      image: PRESET_BANNER_IMAGES[0].url,
      titleEn: '',
      titleUr: '',
      badgeEn: '7 Days 24 Hours · Rahim Yar Khan',
      badgeUr: '7 دن 24 گھنٹے سروس · رحیم یار خان',
      animation: 'fade',
      isActive: true
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: HeroBannerItem) => {
    soundFX.playClick();
    setEditingBannerId(b.id);
    setBannerForm({
      image: b.image,
      titleEn: b.titleEn,
      titleUr: b.titleUr,
      badgeEn: b.badgeEn,
      badgeUr: b.badgeUr,
      animation: b.animation,
      isActive: b.isActive
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    if (!bannerForm.image.trim()) {
      alert('Please provide an image URL for the banner.');
      return;
    }

    if (editingBannerId) {
      updateBanner(editingBannerId, bannerForm);
      showFeedback('Hero Banner updated successfully!');
    } else {
      addBanner(bannerForm);
      showFeedback('New Hero Banner added to website!');
    }
    setIsBannerModalOpen(false);
  };

  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    soundFX.playClick();
    const newBanners = [...banners];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newBanners.length) return;

    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;

    reorderBanners(newBanners);
    showFeedback('Banner order updated!');
  };

  // ----------------------------------------------------
  // DISCOUNT CAMPAIGN HANDLERS
  // ----------------------------------------------------
  const handleOpenAddCampaign = () => {
    soundFX.playClick();
    setEditingCampaignId(null);
    setCampaignForm({
      titleEn: '',
      titleUr: '',
      badgeEn: 'SPECIAL OFFER',
      badgeUr: 'خصوصی رعایت',
      descriptionEn: '',
      descriptionUr: '',
      discountType: 'percentage',
      discountValue: 15,
      applyTo: 'all',
      targetCategory: 'sedan',
      targetVehicleIds: [],
      isActive: true,
      announceInBar: true
    });
    setIsCampaignModalOpen(true);
  };

  const handleOpenEditCampaign = (camp: DiscountCampaign) => {
    soundFX.playClick();
    setEditingCampaignId(camp.id);
    setCampaignForm({
      titleEn: camp.titleEn,
      titleUr: camp.titleUr,
      badgeEn: camp.badgeEn,
      badgeUr: camp.badgeUr,
      descriptionEn: camp.descriptionEn || '',
      descriptionUr: camp.descriptionUr || '',
      discountType: camp.discountType,
      discountValue: camp.discountValue,
      applyTo: camp.applyTo,
      targetCategory: camp.targetCategory || 'sedan',
      targetVehicleIds: camp.targetVehicleIds || [],
      isActive: camp.isActive,
      announceInBar: camp.announceInBar
    });
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playClick();
    if (!campaignForm.titleEn.trim() && !campaignForm.titleUr.trim()) {
      alert('Please provide a campaign title.');
      return;
    }

    if (editingCampaignId) {
      updateDiscountCampaign(editingCampaignId, campaignForm);
      showFeedback('Discount Campaign updated successfully!');
    } else {
      addDiscountCampaign(campaignForm);
      showFeedback('New Promotional Campaign launched!');
    }
    setIsCampaignModalOpen(false);
  };

  // Quick 1-Click Festive Presets
  const applyFestivePreset = (presetKey: 'eid' | 'month_end' | 'wedding' | 'weekend') => {
    soundFX.playClick();
    if (presetKey === 'eid') {
      addDiscountCampaign({
        titleEn: '🌙 Eid Festival Mubarak Mega Discount',
        titleUr: '🌙 عید الفطر / عید الاضحیٰ میگا ڈسکاؤنٹ',
        badgeEn: '15% OFF · EID SPECIAL',
        badgeUr: '15% عید اسپیشل رعایت',
        descriptionEn: 'Celebrate festive days with 15% discount across our entire luxury and family fleet!',
        descriptionUr: 'تمام فیملی اور لگژری گاڑیوں پر 15 فیصد خصوصی عید رعایت۔',
        discountType: 'percentage',
        discountValue: 15,
        applyTo: 'all',
        isActive: true,
        announceInBar: true
      });
      showFeedback('🌙 Eid Festival Special Campaign activated (15% OFF Sitewide)!');
    } else if (presetKey === 'month_end') {
      addDiscountCampaign({
        titleEn: '📅 Month-End Closing Super Deal',
        titleUr: '📅 ماہانہ کلوزنگ سپر آفر',
        badgeEn: '20% OFF · CLOSING SALE',
        badgeUr: '20% ماہانہ کلوزنگ آفر',
        descriptionEn: 'Special month-end closing clearance: 20% discount on all Corolla, Civic and Yaris Sedans!',
        descriptionUr: 'ماہانہ کلوزنگ پر تمام سیڈان گاڑیوں پر 20 فیصد خصوصی رعایت۔',
        discountType: 'percentage',
        discountValue: 20,
        applyTo: 'category',
        targetCategory: 'sedan',
        isActive: true,
        announceInBar: true
      });
      showFeedback('📅 Month-End Closing Deal activated (20% OFF Sedans)!');
    } else if (presetKey === 'wedding') {
      addDiscountCampaign({
        titleEn: '💍 Wedding & Baraat VIP Protocol Deal',
        titleUr: '💍 شادی بیاہ اور بارات وی آئی پی پروٹوکول',
        badgeEn: 'Rs. 3,000 OFF',
        badgeUr: '3,000 روپے رعایت',
        descriptionEn: 'Flat Rs. 3,000 discount per day on Fortuner, Land Cruiser & Prado 4x4 wedding convoys!',
        descriptionUr: 'فارچونر اور پراڈو پر شادی کی بارات کے لیے یومیہ 3000 روپے کی خصوصی بچت۔',
        discountType: 'fixed_pkr',
        discountValue: 3000,
        applyTo: 'category',
        targetCategory: 'suv',
        isActive: true,
        announceInBar: true
      });
      showFeedback('💍 Wedding Protocol Deal activated (Rs. 3,000 OFF on SUVs)!');
    } else if (presetKey === 'weekend') {
      addDiscountCampaign({
        titleEn: '⚡ Weekend Motorway Highway Flash Sale',
        titleUr: '⚡ ویک اینڈ موٹروے ہائی وے فلیش آفر',
        badgeEn: '10% OFF · WEEKEND',
        badgeUr: '10% ویک اینڈ رعایت',
        descriptionEn: 'Instant 10% discount on all family trips across Punjab & Sindh on M-5 corridor!',
        descriptionUr: 'تمام فیملی اسفار پر 10 فیصد فوری ویک اینڈ رعایت۔',
        discountType: 'percentage',
        discountValue: 10,
        applyTo: 'all',
        isActive: true,
        announceInBar: true
      });
      showFeedback('⚡ Weekend Highway Flash Sale activated (10% OFF Sitewide)!');
    }
  };

  // ----------------------------------------------------
  // PER-CAR DISCOUNT HANDLER
  // ----------------------------------------------------
  const handleUpdateCarDiscount = (
    vehicle: Vehicle,
    discountPercent: number,
    badgeTextEn: string,
    badgeTextUr: string
  ) => {
    soundFX.playClick();
    const updated: Vehicle = {
      ...vehicle,
      discountPercentage: discountPercent > 0 ? discountPercent : undefined,
      discountBadge: discountPercent > 0 ? {
        en: badgeTextEn || `${discountPercent}% OFF`,
        ur: badgeTextUr || `${discountPercent}% رعایت`
      } : undefined
    };
    updateVehicle(updated);
    showFeedback(`Discount updated for ${vehicle.make} ${vehicle.model}!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0B1523] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>HQ PROMOTIONS & MARKETING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            Website Banners & Discounts (آفرز اور بینرز)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Change hero pictures, add new banners, launch festive Eid/Month-end promotions, and set vehicle discounts.
          </p>
        </div>

        {/* Global Feedback Pill */}
        {feedbackMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('banners');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Hero Banners ({banners.length})</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('campaigns');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'campaigns'
              ? 'bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Gift className="w-4 h-4 text-rose-500" />
          <span>Festival & Seasonal Deals ({discountCampaigns.length})</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('per_car');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'per_car'
              ? 'bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Car className="w-4 h-4 text-cyan-500" />
          <span>Per-Car Discounts ({vehicles.length})</span>
        </button>

        <button
          onClick={() => {
            soundFX.playClick();
            setActiveTab('logo');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold font-mono transition-all cursor-pointer ${
            activeTab === 'logo'
              ? 'bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Website Logo (لوگو تبدیل کریں)</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: HERO BANNERS MANAGEMENT
         ======================================================== */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                Website Hero Banners (ہیرو بینرز مینجمنٹ)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Change pictures of existing banners or add new slides. Visitors see these rotating in the top hero slider.
              </p>
            </div>
            <button
              onClick={handleOpenAddBanner}
              className="px-4 py-2.5 rounded-2xl bg-[#0B1F3A] dark:bg-[#F5B301] hover:bg-[#142F57] dark:hover:bg-amber-400 text-white dark:text-[#0B1F3A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Banner (نیا بینر)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col justify-between group hover:border-amber-400/50 transition-all"
              >
                {/* Image Thumbnail */}
                <div className="relative aspect-16/9 bg-slate-950 overflow-hidden">
                  <img
                    src={banner.image}
                    alt={banner.titleEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300">
                      Slide #{index + 1} · {banner.animation.toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                        banner.isActive
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-rose-500/90 text-white'
                      }`}
                    >
                      {banner.isActive ? 'ACTIVE' : 'HIDDEN'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                      {banner.titleEn || '(No English Title)'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-sans line-clamp-1" dir="rtl">
                      {banner.titleUr || '(کوئی اردو عنوان نہیں)'}
                    </p>
                    <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 mt-1">
                      Badge: {banner.badgeEn}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveBanner(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveBanner(index, 'down')}
                        disabled={index === banners.length - 1}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          soundFX.playClick();
                          updateBanner(banner.id, { isActive: !banner.isActive });
                          showFeedback(`Banner ${banner.isActive ? 'hidden' : 'activated'}!`);
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold cursor-pointer transition-all ${
                          banner.isActive
                            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                        }`}
                      >
                        {banner.isActive ? 'Hide' : 'Show'}
                      </button>

                      <button
                        onClick={() => handleOpenEditBanner(banner)}
                        className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 cursor-pointer"
                        title="Edit Banner & Change Picture"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (banners.length <= 1) {
                            alert('You must have at least 1 banner for the hero section.');
                            return;
                          }
                          if (confirm('Are you sure you want to delete this hero banner?')) {
                            soundFX.playClick();
                            deleteBanner(banner.id);
                            showFeedback('Banner removed.');
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: FESTIVALS & SEASONAL DISCOUNT CAMPAIGNS
         ======================================================== */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Quick Festive Presets */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>1-CLICK FESTIVE PRESETS (تہواروں کے لیے فوری آفرز)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Launch instant festive promotions with 1 click for Eid, Month-End Closing, Wedding Convoys, or Weekend Highway trips:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => applyFestivePreset('eid')}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1523] border border-amber-500/30 hover:border-amber-500 text-start space-y-1 transition-all cursor-pointer shadow-xs hover:shadow-md group active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">🌙</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">15% OFF</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-500">
                  Eid Mubarak Festival
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  عید خصوصی تہوار رعایت (تمام گاڑیاں)
                </div>
              </button>

              <button
                onClick={() => applyFestivePreset('month_end')}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1523] border border-amber-500/30 hover:border-amber-500 text-start space-y-1 transition-all cursor-pointer shadow-xs hover:shadow-md group active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">📅</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-cyan-400 text-[10px] font-mono font-bold">20% OFF</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-500">
                  Month-End Closing
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  ماہانہ کلوزنگ سیل (تمام سیڈان)
                </div>
              </button>

              <button
                onClick={() => applyFestivePreset('wedding')}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1523] border border-amber-500/30 hover:border-amber-500 text-start space-y-1 transition-all cursor-pointer shadow-xs hover:shadow-md group active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">💍</span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] font-mono font-bold">Rs. 3,000 OFF</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-500">
                  Wedding & Protocol
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  شادی بارات فارچونر پیکیج
                </div>
              </button>

              <button
                onClick={() => applyFestivePreset('weekend')}
                className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1523] border border-amber-500/30 hover:border-amber-500 text-start space-y-1 transition-all cursor-pointer shadow-xs hover:shadow-md group active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">⚡</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 text-[10px] font-mono font-bold">10% OFF</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-500">
                  Weekend Highway Trip
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-sans">
                  ویک اینڈ موٹروے فلیش ڈیل
                </div>
              </button>
            </div>
          </div>

          {/* Active Campaigns List */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                Active Promotions & Discounts (فعال آفرز)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customers visiting the website immediately see these discounts on car cards, tariffs, and in the booking wizard.
              </p>
            </div>
            <button
              onClick={handleOpenAddCampaign}
              className="px-4 py-2.5 rounded-2xl bg-[#0B1F3A] dark:bg-[#F5B301] hover:bg-[#142F57] dark:hover:bg-amber-400 text-white dark:text-[#0B1F3A] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Deal (نئی آفر بنائیں)</span>
            </button>
          </div>

          <div className="space-y-4">
            {discountCampaigns.map(camp => (
              <div
                key={camp.id}
                className={`p-6 rounded-3xl border transition-all ${
                  camp.isActive
                    ? 'bg-white dark:bg-[#0B1523] border-amber-400/60 shadow-md ring-1 ring-amber-400/20'
                    : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#F5B301] text-slate-950 font-mono text-xs font-black">
                        {camp.badgeEn}
                      </span>
                      {camp.badgeUr && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-sans text-xs font-bold" dir="rtl">
                          {camp.badgeUr}
                        </span>
                      )}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          camp.isActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/15 text-slate-500'
                        }`}
                      >
                        {camp.isActive ? 'ACTIVE ON SITE' : 'PAUSED'}
                      </span>
                      {camp.announceInBar && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-[10px] font-mono font-bold">
                          TOP BAR ALERT
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                      {camp.titleEn}
                    </h3>
                    {camp.titleUr && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-sans" dir="rtl">
                        {camp.titleUr}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {camp.descriptionEn || camp.descriptionUr}
                    </p>

                    <div className="text-xs font-mono text-slate-600 dark:text-slate-400 pt-2 flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">Scope:</span>
                      {camp.applyTo === 'all' && <span className="text-emerald-600 dark:text-emerald-400 font-bold">All Cars (Sitewide)</span>}
                      {camp.applyTo === 'category' && <span className="text-blue-600 dark:text-cyan-400 font-bold">Category: {camp.targetCategory?.toUpperCase()}</span>}
                      {camp.applyTo === 'specific_cars' && <span className="text-purple-600 dark:text-purple-400 font-bold">{camp.targetVehicleIds?.length || 0} Specific Cars</span>}
                      <span>·</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">Discount:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-black">
                        {camp.discountType === 'percentage' ? `${camp.discountValue}% OFF` : `Rs. ${camp.discountValue.toLocaleString()} OFF / Day`}
                      </span>
                    </div>
                  </div>

                  {/* Toggle & Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        soundFX.playClick();
                        updateDiscountCampaign(camp.id, { isActive: !camp.isActive });
                        showFeedback(`Promotion ${camp.isActive ? 'paused' : 'activated'}!`);
                      }}
                      className={`px-4 py-2 rounded-2xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        camp.isActive
                          ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                      }`}
                    >
                      {camp.isActive ? 'Turn Off (بند کریں)' : 'Turn On (لگائیں)'}
                    </button>

                    <button
                      onClick={() => handleOpenEditCampaign(camp)}
                      className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 hover:bg-blue-100 cursor-pointer"
                      title="Edit Campaign"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete promotion "${camp.titleEn}"?`)) {
                          soundFX.playClick();
                          deleteDiscountCampaign(camp.id);
                          showFeedback('Campaign deleted.');
                        }
                      }}
                      className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: PER-CAR INDIVIDUAL DISCOUNTS
         ======================================================== */}
      {activeTab === 'per_car' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                Individual Vehicle Discounts (ہر گاڑی کے ساتھ مخصوص ڈسکاؤنٹ)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set custom discount percentage and custom badges for specific cars in your inventory.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs font-mono">
                <thead className="bg-[#0B1F3A] text-white uppercase text-[11px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-4 px-5 text-start">Vehicle</th>
                    <th className="py-4 px-5 text-start">Category</th>
                    <th className="py-4 px-5 text-start">Base Tariff</th>
                    <th className="py-4 px-5 text-start">Discount %</th>
                    <th className="py-4 px-5 text-start">Badge Text (EN / UR)</th>
                    <th className="py-4 px-5 text-start">Effective Price</th>
                    <th className="py-4 px-5 text-end">Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {vehicles.map(veh => {
                    const pricing = getVehicleEffectivePrice(veh);
                    return (
                      <CarDiscountRow
                        key={veh.id}
                        vehicle={veh}
                        pricing={pricing}
                        onSave={handleUpdateCarDiscount}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: WEBSITE LOGO MANAGER (لوگو تبدیل کریں)
         ======================================================== */}
      {activeTab === 'logo' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Website Logo & Brand Emblem (ویب سائٹ کا لوگو)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize your car rental logo picture. It updates instantly across the top header, mobile menu, page loader, 3D card, and admin portal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  const defaultLogo = '/assets/aistudio/Rent2Go_icon_transparent.png';
                  updateSiteLogo(defaultLogo);
                  setLogoInputUrl(defaultLogo);
                  showFeedback('Default logo restored (اصل لوگو بحال ہو گیا)');
                }}
                className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold font-mono flex items-center gap-2 cursor-pointer shadow-xs transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-slate-500" />
                <span>Reset Default (اصل لوگو)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  logoFileInputRef.current?.click();
                }}
                className="px-5 py-2.5 rounded-2xl bg-[#0B1F3A] dark:bg-[#F5B301] hover:bg-[#142F57] dark:hover:bg-amber-400 text-white dark:text-[#0B1F3A] text-xs font-bold font-mono flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>Upload New Logo (کمپیوٹر/موبائل سے اپلوڈ کریں)</span>
              </button>
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 4 * 1024 * 1024) {
                      alert('Please select an image smaller than 4MB.');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = ev => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) {
                        updateSiteLogo(dataUrl);
                        setLogoInputUrl(dataUrl);
                        soundFX.playSuccess();
                        showFeedback('✅ لوگو کامیابی سے تبدیل ہو گیا (Logo updated successfully)!');
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>

          {/* Live Preview Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Preview 1: Dark Header */}
            <div className="bg-[#0B1F3A] rounded-3xl p-6 border border-amber-500/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest">
                  Live Preview: Dark Header
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  Active
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#081528] border border-white/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center p-1.5 shadow-inner shrink-0">
                  <img
                    src={settings.logoUrl || '/assets/aistudio/Rent2Go_icon_transparent.png'}
                    alt="Logo Dark Preview"
                    className="w-full h-full object-contain"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Rent2Go_icon_transparent.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-mono tracking-tight leading-tight">
                    Jam Rent A Car
                  </h3>
                  <p className="text-[10px] text-amber-400 font-mono tracking-wider">
                    RAHIM YAR KHAN · 24/7
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                یہ انداز ویب سائٹ کے مین ہیڈر پر وزٹرز کو نظر آتا ہے۔
              </p>
            </div>

            {/* Preview 2: Light Header */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Live Preview: Light Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  Clean
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1.5 shadow-xs shrink-0">
                  <img
                    src={settings.logoUrl || '/assets/aistudio/Rent2Go_icon_transparent.png'}
                    alt="Logo Light Preview"
                    className="w-full h-full object-contain"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Rent2Go_icon_transparent.png';
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white font-mono tracking-tight leading-tight">
                    Jam Rent A Car
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wider">
                    RAHIM YAR KHAN · 24/7
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Light background per logo ki transparency aur clear visibility ka jaiza.
              </p>
            </div>

            {/* Preview 3: Page Loader & App Icon */}
            <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                  Page Loader & Icon
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-mono">
                  Loading Screen
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 flex items-center justify-center py-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center p-2 shadow-lg shadow-amber-500/10">
                    <img
                      src={settings.logoUrl || '/assets/aistudio/Rent2Go_icon_transparent.png'}
                      alt="Logo Loader Preview"
                      className="w-full h-full object-contain animate-pulse"
                      onError={e => {
                        (e.currentTarget as HTMLImageElement).src = '/assets/aistudio/Rent2Go_icon_transparent.png';
                      }}
                    />
                  </div>
                  <div className="absolute -inset-1 rounded-2xl border border-amber-400/30 animate-ping pointer-events-none opacity-20" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                Page Loading Screen اور 3D بزنس کارڈ پر یہ لوگو اینیمیشن کے ساتھ شو ہوتا ہے۔
              </p>
            </div>
          </div>

          {/* Manual URL Input Card */}
          <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>Direct Image Link or URL (انٹرنیٹ یا ہوسٹنگ سے لنک درج کریں)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste any online image URL (PNG transparent recommended) or use local assets path.
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (logoInputUrl.trim()) {
                  soundFX.playSuccess();
                  updateSiteLogo(logoInputUrl.trim());
                  showFeedback('✅ لوگو کا لنک محفوظ کر دیا گیا ہے (Logo URL applied)!');
                }
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={logoInputUrl}
                  onChange={e => setLogoInputUrl(e.target.value)}
                  placeholder="https://your-domain.com/logo.png or /assets/..."
                  className="w-full p-3.5 pr-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer shadow-md hover:opacity-95 active:scale-95 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Apply Logo (محفوظ کریں)</span>
              </button>
            </form>
          </div>

          {/* Curated Luxury Automotive Logo Presets */}
          <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Automotive Emblem Presets (تیار شدہ لگژری لوگو ڈیزائنز)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One-click instant logos designed specifically for premium VIP car rental services:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                {
                  id: 'gold-crest',
                  name: 'Rent2Go Gold Iconic Emblem',
                  nameUr: 'گولڈن رینٹل ایمبلم (ڈیفالٹ)',
                  url: '/assets/aistudio/Rent2Go_icon_transparent.png',
                  badge: 'Recommended'
                },
                {
                  id: 'full-banner',
                  name: 'Rent2Go Full Brand Signature',
                  nameUr: 'مکمل برانڈ سگنیچر لوگو',
                  url: '/assets/aistudio/Rent2Go_Logo_transparent.png',
                  badge: 'Signature'
                },
                {
                  id: 'motion-edition',
                  name: 'Motion Gold Automotive Crest',
                  nameUr: 'موشن ایڈیشن گولڈ کریسٹ',
                  url: '/assets/aistudio/Rent2Go_Home___Motion_Logo_4f24b879.png',
                  badge: 'Executive'
                },
                {
                  id: 'vip-falcon',
                  name: 'Royal Crown Chauffeur Wings',
                  nameUr: 'شاہی شوفر گولڈ ونگز',
                  url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='50' r='46' stroke='%23F5B301' stroke-width='3' fill='%230B1F3A'/%3E%3Cpath d='M20 50 C32 30, 45 42, 50 32 C55 42, 68 30, 80 50 C68 46, 56 62, 50 72 C44 62, 32 46, 20 50 Z' fill='%23F5B301'/%3E%3Cpolygon points='50,22 45,30 55,30' fill='%23FFFFFF'/%3E%3Ctext x='50' y='86' font-size='9' font-weight='bold' fill='%23FFFFFF' text-anchor='middle' font-family='sans-serif'%3EJAM RENT%3C/text%3E%3C/svg%3E",
                  badge: 'VIP Protocol'
                }
              ].map(preset => {
                const isSelected = settings.logoUrl === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      soundFX.playSuccess();
                      updateSiteLogo(preset.url);
                      setLogoInputUrl(preset.url);
                      showFeedback(`Selected: ${preset.name}`);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-500/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        {preset.badge}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <div className="h-20 w-full rounded-xl bg-[#0B1F3A] flex items-center justify-center p-3 border border-white/5">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white font-mono leading-tight">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-sans" dir="rtl">
                        {preset.nameUr}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-900 font-black shadow-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-500'
                      }`}
                    >
                      {isSelected ? '✓ Current Logo' : 'Select Logo (یہ لگائیں)'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT HERO BANNER
         ======================================================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-mono">
                  {editingBannerId ? 'Edit Hero Banner (تصویر تبدیل کریں)' : 'Add New Hero Banner (نیا بینر)'}
                </h3>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Image Preview & URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono block">
                  Banner Image URL (بینر کی تصویر کا لنک) *
                </label>
                <input
                  type="text"
                  value={bannerForm.image}
                  onChange={e => setBannerForm({ ...bannerForm, image: e.target.value })}
                  placeholder="/assets/aistudio/... or https://..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                  required
                />

                {/* Quick Presets Picker */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    Quick Select from High-Resolution Cars:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {PRESET_BANNER_IMAGES.map(preset => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          soundFX.playClick();
                          setBannerForm({ ...bannerForm, image: preset.url });
                        }}
                        className={`p-1.5 rounded-xl border text-start space-y-1 transition-all cursor-pointer ${
                          bannerForm.image === preset.url
                            ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-12 rounded-lg object-cover"
                        />
                        <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 line-clamp-1 block">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {bannerForm.image && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">Live Image Preview:</span>
                    <div className="aspect-16/9 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <img
                        src={bannerForm.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/cars/civic-rs.jpg';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    English Headline (عنوان انگریزی)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.titleEn}
                    onChange={e => setBannerForm({ ...bannerForm, titleEn: e.target.value })}
                    placeholder="Your Journey. Your Ride. Discover Freedom."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Urdu Headline (عنوان اردو)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.titleUr}
                    onChange={e => setBannerForm({ ...bannerForm, titleUr: e.target.value })}
                    placeholder="آپ کا سفر۔ آپ کی گاڑی۔ آزادی کا آغاز۔"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-sans text-end"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Badge Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Badge Tag (English)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.badgeEn}
                    onChange={e => setBannerForm({ ...bannerForm, badgeEn: e.target.value })}
                    placeholder="7 Days 24 Hours · Rahim Yar Khan"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Badge Tag (Urdu)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.badgeUr}
                    onChange={e => setBannerForm({ ...bannerForm, badgeUr: e.target.value })}
                    placeholder="7 دن 24 گھنٹے سروس · رحیم یار خان"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-sans text-end"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Animation Select & Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Transition Animation (اینیمیشن کا انداز)
                  </label>
                  <select
                    value={bannerForm.animation}
                    onChange={e => setBannerForm({ ...bannerForm, animation: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono cursor-pointer"
                  >
                    <option value="fade">Fade In (ہموار فید)</option>
                    <option value="spin">3D Spin / Tilt In (گھومتی ہوئی تصویر)</option>
                    <option value="jump">Elastic Jump In (جمپ اینیمیشن)</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={bannerForm.isActive}
                      onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded-md accent-[#0B1F3A] dark:accent-amber-400"
                    />
                    <span>Active on Website (ویب سائٹ پر دکھائیں)</span>
                  </label>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] text-xs font-bold shadow-md active:scale-95 cursor-pointer font-mono"
                >
                  {editingBannerId ? 'Save Banner Changes' : 'Publish Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD / EDIT DISCOUNT CAMPAIGN
         ======================================================== */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0B1523] rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg text-slate-900 dark:text-white font-mono">
                  {editingCampaignId ? 'Edit Promotion Deal' : 'Create New Promotional Deal (نئی آفر)'}
                </h3>
              </div>
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCampaign} className="space-y-4">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Deal Title (English) *
                  </label>
                  <input
                    type="text"
                    value={campaignForm.titleEn}
                    onChange={e => setCampaignForm({ ...campaignForm, titleEn: e.target.value })}
                    placeholder="e.g. Month-End Closing Super Sale"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Deal Title (Urdu)
                  </label>
                  <input
                    type="text"
                    value={campaignForm.titleUr}
                    onChange={e => setCampaignForm({ ...campaignForm, titleUr: e.target.value })}
                    placeholder="مثلاً: ماہانہ کلوزنگ سپر آفر"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-sans text-end"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Promo Badge (e.g. 20% OFF)
                  </label>
                  <input
                    type="text"
                    value={campaignForm.badgeEn}
                    onChange={e => setCampaignForm({ ...campaignForm, badgeEn: e.target.value })}
                    placeholder="20% OFF · CLOSING SALE"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Promo Badge (Urdu)
                  </label>
                  <input
                    type="text"
                    value={campaignForm.badgeUr}
                    onChange={e => setCampaignForm({ ...campaignForm, badgeUr: e.target.value })}
                    placeholder="20% ماہانہ کلوزنگ آفر"
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-sans text-end"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Discount Type and Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Discount Calculation Type
                  </label>
                  <select
                    value={campaignForm.discountType}
                    onChange={e => setCampaignForm({ ...campaignForm, discountType: e.target.value as any })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono cursor-pointer"
                  >
                    <option value="percentage">Percentage (فیصد % رعایت)</option>
                    <option value="fixed_pkr">Fixed PKR Amount (فکسڈ روپے رعایت)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {campaignForm.discountType === 'percentage' ? 'Percentage Value (e.g. 20 for 20%)' : 'PKR Value (e.g. 3000 for Rs. 3,000)'} *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={campaignForm.discountType === 'percentage' ? 90 : 50000}
                    value={campaignForm.discountValue}
                    onChange={e => setCampaignForm({ ...campaignForm, discountValue: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Scope Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                  Apply Discount To (کس پر ڈسکاؤنٹ لاگو ہو)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCampaignForm({ ...campaignForm, applyTo: 'all' })}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      campaignForm.applyTo === 'all'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All Fleet (تمام گاڑیاں)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCampaignForm({ ...campaignForm, applyTo: 'category' })}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      campaignForm.applyTo === 'category'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Category (مخصوص کیٹیگری)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCampaignForm({ ...campaignForm, applyTo: 'specific_cars' })}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      campaignForm.applyTo === 'specific_cars'
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Specific Cars (منتخب گاڑیاں)
                  </button>
                </div>
              </div>

              {/* Target Category (if category selected) */}
              {campaignForm.applyTo === 'category' && (
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                    Select Target Vehicle Category:
                  </label>
                  <select
                    value={campaignForm.targetCategory}
                    onChange={e => setCampaignForm({ ...campaignForm, targetCategory: e.target.value as VehicleCategory })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-mono cursor-pointer"
                  >
                    <option value="sedan">Sedans (Civic, Corolla, Yaris, Sonata)</option>
                    <option value="suv">SUVs (Fortuner, Prado, Land Cruiser)</option>
                    <option value="hatchback">Hatchbacks / Economy (Alto, Cultus)</option>
                    <option value="van">Passenger Vans (Hiace Grand Cabin)</option>
                  </select>
                </div>
              )}

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={campaignForm.isActive}
                    onChange={e => setCampaignForm({ ...campaignForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded-md accent-[#0B1F3A] dark:accent-amber-400"
                  />
                  <span>Active Right Now (ابھی چالو کریں)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={campaignForm.announceInBar}
                    onChange={e => setCampaignForm({ ...campaignForm, announceInBar: e.target.checked })}
                    className="w-4 h-4 rounded-md accent-[#0B1F3A] dark:accent-amber-400"
                  />
                  <span>Announce in Top Bar (ٹاپ بار میں دکھائیں)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0B1F3A] dark:bg-[#F5B301] text-white dark:text-[#0B1F3A] text-xs font-bold shadow-md active:scale-95 cursor-pointer font-mono"
                >
                  {editingCampaignId ? 'Update Promotion' : 'Launch Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Subcomponent for individual car discount row
const CarDiscountRow: React.FC<{
  vehicle: Vehicle;
  pricing: any;
  onSave: (vehicle: Vehicle, discountPercent: number, badgeEn: string, badgeUr: string) => void;
}> = ({ vehicle, pricing, onSave }) => {
  const [discountPercent, setDiscountPercent] = useState<number>(vehicle.discountPercentage || 0);
  const [badgeEn, setBadgeEn] = useState<string>(vehicle.discountBadge?.en || '');
  const [badgeUr, setBadgeUr] = useState<string>(vehicle.discountBadge?.ur || '');
  const [isChanged, setIsChanged] = useState<boolean>(false);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="py-3.5 px-5 flex items-center gap-3">
        <img
          src={vehicle.coverImage}
          alt={vehicle.make}
          className="w-12 h-9 rounded-lg object-cover shrink-0"
        />
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {vehicle.make} {vehicle.model}
          </span>
          <span className="text-[10px] text-slate-400 block">
            {vehicle.modelYear} · {vehicle.transmission}
          </span>
        </div>
      </td>
      <td className="py-3.5 px-5 uppercase text-[11px] text-slate-500 font-bold">
        {vehicle.category}
      </td>
      <td className="py-3.5 px-5 font-mono font-bold text-slate-800 dark:text-slate-200">
        {vehicle.dailyRatePKR ? `Rs. ${vehicle.dailyRatePKR.toLocaleString()}` : 'Quote'}
      </td>
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-1.5 w-24">
          <input
            type="number"
            min={0}
            max={70}
            value={discountPercent}
            onChange={e => {
              setDiscountPercent(parseInt(e.target.value) || 0);
              setIsChanged(true);
            }}
            className="w-16 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-center"
          />
          <span className="font-bold text-amber-500">%</span>
        </div>
      </td>
      <td className="py-3.5 px-5 space-y-1">
        <input
          type="text"
          value={badgeEn}
          onChange={e => {
            setBadgeEn(e.target.value);
            setIsChanged(true);
          }}
          placeholder="e.g. EID DEAL"
          className="w-28 p-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-mono"
        />
      </td>
      <td className="py-3.5 px-5">
        {pricing.hasDiscount ? (
          <div>
            <span className="text-slate-400 line-through text-[10px] block">
              Rs. {pricing.originalRate.toLocaleString()}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-black font-mono text-sm">
              Rs. {pricing.discountedRate.toLocaleString()}
            </span>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 block font-bold">
              {pricing.discountBadge}
            </span>
          </div>
        ) : (
          <span className="text-slate-500 text-xs">
            {vehicle.dailyRatePKR ? `Rs. ${vehicle.dailyRatePKR.toLocaleString()}` : 'Standard'}
          </span>
        )}
      </td>
      <td className="py-3.5 px-5 text-end">
        <button
          onClick={() => {
            onSave(vehicle, discountPercent, badgeEn, badgeUr);
            setIsChanged(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-all cursor-pointer ${
            isChanged
              ? 'bg-[#F5B301] text-slate-950 shadow-md animate-pulse'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          Save
        </button>
      </td>
    </tr>
  );
};
