import {
  Vehicle,
  Booking,
  ServiceItem,
  CustomerReview,
  SiteSettings,
  CMSPage,
  AuditEvent
} from '../types/index.ts';

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-corolla-2023',
    stockCode: 'R2G-COR-01',
    slug: 'toyota-corolla-gli-2023',
    make: 'Toyota',
    model: 'Corolla GLi',
    variant: '1.3 VVTi Automatic',
    modelYear: 2023,
    category: 'sedan',
    title: {
      en: 'Toyota Corolla GLi (2023)',
      ur: 'ٹویوٹا کرولا جی ایل آئی (2023)'
    },
    description: {
      en: 'Pakistan’s favorite reliable family sedan. Smooth suspension, powerful dual AC, and spacious boot for long highway journeys.',
      ur: 'پاکستان کی پسندیدہ اور پائیدار فیملی گاڑی۔ بہترین اے سی، آرام دہ سیٹیں اور سامان کے لیے کشادہ ڈگی۔'
    },
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    hasAC: true,
    driverOption: 'both',
    features: ['Chilled Dual AC', 'Bluetooth Audio', 'ABS Brakes', 'Power Windows', 'Spacious Trunk'],
    customFields: {
      mileageLimitPerDay: '200 KM',
      extraKmRate: 25,
      securityDeposit: 10000,
      luggageBags: 3
    },
    dailyRatePKR: 6000,
    driverDailyFeePKR: 1500,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: true,
    featuredOrder: 1,
    coverImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  },
  {
    id: 'veh-civic-2022',
    stockCode: 'R2G-CIV-02',
    slug: 'honda-civic-oriel-2022',
    make: 'Honda',
    model: 'Civic Oriel',
    variant: '1.5 Turbo VTEC',
    modelYear: 2022,
    category: 'sedan',
    title: {
      en: 'Honda Civic Oriel Sunroof (2022)',
      ur: 'ہونڈا سیوک اورئیل سن روف (2022)'
    },
    description: {
      en: 'Executive luxury sedan with sporty performance, sunroof, push start, and premium leather interior for VIP travel and business trips.',
      ur: 'پرتعیش ایگزیکٹو سیڈان مع سن روف، بہترین پک اور لیدر انٹیرئیر، وی آئی پی سفر اور بزنس کے لیے۔'
    },
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    hasAC: true,
    driverOption: 'both',
    features: ['Electric Sunroof', 'Cruise Control', 'Push Start', 'Rear AC Vents', 'Reverse Camera'],
    customFields: {
      mileageLimitPerDay: '200 KM',
      extraKmRate: 35,
      securityDeposit: 20000,
      luggageBags: 3
    },
    dailyRatePKR: 9500,
    driverDailyFeePKR: 1500,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: true,
    featuredOrder: 2,
    coverImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  },
  {
    id: 'veh-fortuner-2023',
    stockCode: 'R2G-FOR-03',
    slug: 'toyota-fortuner-legender-2023',
    make: 'Toyota',
    model: 'Fortuner',
    variant: 'Legender 4x4 Sigma 4',
    modelYear: 2023,
    category: 'suv',
    title: {
      en: 'Toyota Fortuner Legender 4x4 (2023)',
      ur: 'ٹویوٹا فارچونر لیجنڈر 4x4 (2023)'
    },
    description: {
      en: 'King of the road 7-seater luxury 4x4 SUV. Commanding presence, premium leather, power tailgate, perfect for weddings, protocol, and northern tours.',
      ur: 'شاہانہ 7 سیٹر 4x4 ایس یو وی۔ شادی بیاہ، پروٹوکول اور فیملی کے لمبے سفر کے لیے بہترین انتخاب۔'
    },
    seats: 7,
    doors: 5,
    transmission: 'automatic',
    fuelType: 'diesel',
    hasAC: true,
    driverOption: 'with_driver',
    features: ['4x4 Off-Road', '7 Leather Seats', 'Dual Climate Control', 'Power Tailgate', 'VIP Protocol Look'],
    customFields: {
      mileageLimitPerDay: '250 KM',
      extraKmRate: 60,
      securityDeposit: 30000,
      luggageBags: 5
    },
    dailyRatePKR: 22000,
    driverDailyFeePKR: 2000,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: true,
    featuredOrder: 3,
    coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  },
  {
    id: 'veh-yaris-2023',
    stockCode: 'R2G-YAR-04',
    slug: 'toyota-yaris-ativ-2023',
    make: 'Toyota',
    model: 'Yaris',
    variant: '1.3 ATIV CVT',
    modelYear: 2023,
    category: 'sedan',
    title: {
      en: 'Toyota Yaris ATIV (2023)',
      ur: 'ٹویوٹا یارس اے ٹی آئی وی (2023)'
    },
    description: {
      en: 'Fuel efficient and modern compact sedan. Very comfortable in city traffic and economical for Rahim Yar Khan, Sukkur, or local trips.',
      ur: 'کم ایندھن خرچ کرنے والی جدید گاڑی۔ شہر کے اندر اور قریبی شہروں کے سفر کے لیے انتہائی کفایتی۔'
    },
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    hasAC: true,
    driverOption: 'both',
    features: ['Excellent Fuel Mileage', 'Traction Control', 'Touchscreen Infotainment', 'Chilled AC'],
    customFields: {
      mileageLimitPerDay: '200 KM',
      extraKmRate: 20,
      securityDeposit: 10000,
      luggageBags: 2
    },
    dailyRatePKR: 5500,
    driverDailyFeePKR: 1500,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  },
  {
    id: 'veh-alto-2024',
    stockCode: 'R2G-ALT-05',
    slug: 'suzuki-alto-vxl-2024',
    make: 'Suzuki',
    model: 'Alto',
    variant: 'VXL AGS Automatic',
    modelYear: 2024,
    category: 'hatchback',
    title: {
      en: 'Suzuki Alto VXL AGS (2024)',
      ur: 'سوزوکی آلٹو وی ایکس ایل (2024)'
    },
    description: {
      en: 'Most economical city runner. High fuel average (20+ km/l), automatic AGS gear, easy to park, perfect for daily errands in Sadiqabad.',
      ur: 'سب سے سستی اور کفایتی گاڑی۔ شاندار پیٹرول ایوریج، آٹومیٹک، روزمرہ کاموں کے لیے موزوں۔'
    },
    seats: 4,
    doors: 5,
    transmission: 'automatic',
    fuelType: 'petrol',
    hasAC: true,
    driverOption: 'both',
    features: ['High Fuel Economy 20+ KM/L', 'AGS Automatic', 'Power Steering', 'Air Conditioning'],
    customFields: {
      mileageLimitPerDay: '150 KM',
      extraKmRate: 15,
      securityDeposit: 8000,
      luggageBags: 1
    },
    dailyRatePKR: 3500,
    driverDailyFeePKR: 1200,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: true,
    featuredOrder: 4,
    coverImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  },
  {
    id: 'veh-cabin-2022',
    stockCode: 'R2G-CAB-06',
    slug: 'toyota-hiace-grand-cabin-2022',
    make: 'Toyota',
    model: 'Hiace Grand Cabin',
    variant: 'High Roof Super GL',
    modelYear: 2022,
    category: 'van',
    title: {
      en: 'Toyota Hiace Grand Cabin (14 Seater)',
      ur: 'ٹویوٹا ہائی ایس گرینڈ کیبن (14 سیٹر)'
    },
    description: {
      en: 'Spacious high-roof 14-seater luxury passenger van. Individual AC vents, reclining captain seats, ideal for family umrah/ziarat groups, weddings, and long tours.',
      ur: 'کشادہ 14 سیٹر لگژری ہائی ایس۔ ہر سیٹ کے لیے الگ اے سی، فیملی ٹور، زیارات اور بارات کے لیے بہترین۔'
    },
    seats: 14,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'diesel',
    hasAC: true,
    driverOption: 'with_driver',
    features: ['14 Passenger Reclining Seats', 'Roof Dual AC', 'Huge Luggage Space', 'Trained Highway Driver'],
    customFields: {
      mileageLimitPerDay: '300 KM',
      extraKmRate: 40,
      securityDeposit: 0,
      luggageBags: 10
    },
    dailyRatePKR: 14000,
    driverDailyFeePKR: 2000,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  },
  {
    id: 'veh-mercedes-2021',
    stockCode: 'R2G-MERC-07',
    slug: 'mercedes-benz-e-class-2021',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    variant: 'E200 Exclusive Luxury',
    modelYear: 2021,
    category: 'luxury',
    title: {
      en: 'Mercedes-Benz E-Class Luxury VIP',
      ur: 'مرسڈیز بینز ای کلاس لگژری'
    },
    description: {
      en: 'Ultra-prestigious VIP sedan available exclusively on special quotation for VIP guests, corporate events, and wedding bride/groom entry.',
      ur: 'انتہائی پروقار لگژری گاڑی۔ خصوصی تقریبات، وی آئی پی معززین اور دلہا دلہن کے پروٹوکول کے لیے۔'
    },
    seats: 5,
    doors: 4,
    transmission: 'automatic',
    fuelType: 'petrol',
    hasAC: true,
    driverOption: 'with_driver',
    features: ['VIP Chauffeur in Uniform', 'Ambient Lighting', 'Burmester Sound', 'Tinted Windows'],
    customFields: {
      mileageLimitPerDay: 'Custom',
      extraKmRate: 100,
      securityDeposit: 50000,
      luggageBags: 3
    },
    dailyRatePKR: null, // "Contact for quote"
    driverDailyFeePKR: 2500,
    visibility: 'published',
    opStatus: 'available',
    isFeatured: true,
    featuredOrder: 5,
    coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    maintenanceWindows: []
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-driver',
    slug: 'car-rental-with-driver',
    name: {
      en: 'Car Rental with Professional Driver',
      ur: 'ڈرائیور کے ساتھ گاڑی کا کرایہ'
    },
    shortDesc: {
      en: 'Experienced, polite, and verified local drivers who know all major routes and motorways.',
      ur: 'تجربہ کار، بااخلاق اور تصدیق شدہ ڈرائیورز جو تمام موٹرویز اور راستوں سے بخوبی واقف ہیں۔'
    },
    description: {
      en: 'Enjoy a stress-free journey while our seasoned drivers handle traffic, parking, and long highway driving. Every driver is background-checked and punctual.',
      ur: 'سفر کا مکمل سکون حاصل کریں، ٹریفک اور پارکنگ کی فکر ہمارے تجربہ کار ڈرائیورز پر چھوڑ دیں۔'
    },
    inclusions: [
      { en: 'Professional verified chauffeur', ur: 'تربیت یافتہ تصدیق شدہ ڈرائیور' },
      { en: 'Vehicle insurance & breakdown coverage', ur: 'گاڑی کی انشورنس اور بریک ڈاؤن سپورٹ' }
    ],
    exclusions: [
      { en: 'Fuel & motorway tolls', ur: 'پیٹرول اور موٹروے ٹول ٹیکس' },
      { en: 'Driver night stay allowance if outside Sadiqabad', ur: 'صادق آباد سے باہر رات رکنے پر ڈرائیور الاؤنس' }
    ],
    icon: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
    startingPricePKR: 4700
  },
  {
    id: 'srv-selfdrive',
    slug: 'self-drive-car-rental',
    name: {
      en: 'Self-Drive Car Rental',
      ur: 'سیلف ڈرائیو (خود چلائیں)'
    },
    shortDesc: {
      en: 'Complete privacy and independence. Rent a car and drive yourself anywhere in Pakistan.',
      ur: 'مکمل رازداری اور آزادی۔ گاڑی خود ڈرائیو کریں جہاں چاہیں جائیں۔'
    },
    description: {
      en: 'Available with transparent CNIC and security verification. Clean, mechanically tested cars handed over with full fuel and inspection report.',
      ur: 'شناختی کارڈ اور ضروری تصدیق کے بعد فوری گاڑی حاصل کریں۔ بغیر ڈرائیور اپنی رفتار سے سفر کریں۔'
    },
    inclusions: [
      { en: 'Well-maintained verified car', ur: 'مکمل جانچ شدہ بہترین گاڑی' },
      { en: 'Emergency roadside phone support', ur: 'ہنگامی صورت میں فون سپورٹ' }
    ],
    exclusions: [
      { en: 'Refundable security deposit required', ur: 'واپسی کے قابل سیکیورٹی ڈپازٹ' }
    ],
    icon: 'Key',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
    startingPricePKR: 3500
  },
  {
    id: 'srv-airport',
    slug: 'airport-pick-and-drop',
    name: {
      en: 'Airport Pick & Drop Service',
      ur: 'ائیرپورٹ پک اینڈ ڈراپ'
    },
    shortDesc: {
      en: 'Guaranteed on-time transfers to Sheikh Zayed (RYK), Sukkur, or Multan Airport.',
      ur: 'شیخ زید رحیم یار خان، سکھر یا ملتان ائیرپورٹ کے لیے وقت کی پابند سروس۔'
    },
    description: {
      en: 'Never miss a flight. We track your flight arrival/departure time and provide seamless door-to-terminal transport with luggage assistance.',
      ur: 'فلائٹ چھوٹنے کا کوئی خطرہ نہیں۔ ڈرائیور وقت سے پہلے آپ کے دروازے پر موجود ہوگا۔'
    },
    inclusions: [
      { en: 'Doorstep pickup in Sadiqabad', ur: 'صادق آباد میں گھر کی دہلیز سے پک اپ' },
      { en: 'Luggage loading assistance', ur: 'سامان لوڈ کروانے میں مدد' }
    ],
    exclusions: [
      { en: 'Airport parking fee', ur: 'ائیرپورٹ پارکنگ فیس' }
    ],
    icon: 'Plane',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
    startingPricePKR: 7000
  },
  {
    id: 'srv-wedding',
    slug: 'wedding-event-cars',
    name: {
      en: 'Wedding & Event Luxury Fleet',
      ur: 'شادی بیاہ اور بارات کی گاڑیاں'
    },
    shortDesc: {
      en: 'Decorated luxury sedans, Fortuners, and protocol convoys for bride & groom.',
      ur: 'دلہا اور دلہن کے لیے تازہ پھولوں سے سجی ہوئی پرتعیش گاڑیاں اور کانوائے۔'
    },
    description: {
      en: 'Make your wedding memorable. We provide immaculate Mercedes, Fortuner, and Civic cars with optional fresh flower decoration and protocol service.',
      ur: 'اپنی شادی کو یادگار بنائیں۔ بہترین لیموزین اور ایس یو وی سروس صادق آباد اور گردونواح کے لیے۔'
    },
    inclusions: [
      { en: 'Immaculately detailed vehicle', ur: 'چمچماتی ہوئی صاف گاڑی' },
      { en: 'Courteous chauffeur in proper attire', ur: 'باوقار لباس میں تربیت یافتہ ڈرائیور' }
    ],
    exclusions: [
      { en: 'Custom fresh flower decoration package', ur: 'پھولوں سے سجاوٹ کے الگ چارجز' }
    ],
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
    startingPricePKR: 15000
  },
  {
    id: 'srv-intercity',
    slug: 'intercity-travel',
    name: {
      en: 'Intercity Highway Travel',
      ur: 'بین الاضلاعی موٹروے سفر'
    },
    shortDesc: {
      en: 'Comfortable trips from Sadiqabad to Lahore, Karachi, Islamabad, Sukkur, or Bahawalpur via M-5.',
      ur: 'صادق آباد سے لاہور، کراچی، اسلام آباد، ملتان اور بہاولپور کا آرام دہ سفر۔'
    },
    description: {
      en: 'Travel across Pakistan with experienced highway drivers well-versed with M-5 Motorway and National Highway N-5.',
      ur: 'موٹروے ایم 5 اور نیشنل ہائی وے پر لمبے سفر کا بھرپور اور محفوظ تجربہ۔'
    },
    inclusions: [
      { en: 'Highway certified safety inspection', ur: 'موٹروے کے معیار کے مطابق گاڑی کی فٹنس' }
    ],
    exclusions: [
      { en: 'Motorway toll tax receipts provided', ur: 'ٹول ٹیکس کسٹمر کی ذمہ داری' }
    ],
    icon: 'Navigation',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
    startingPricePKR: 8000
  },
  {
    id: 'srv-corporate',
    slug: 'corporate-monthly-rental',
    name: {
      en: 'Corporate & Monthly Contracts',
      ur: 'کارپوریٹ اور ماہانہ کرایہ'
    },
    shortDesc: {
      en: 'Discounted tariffs for companies, NGOs, factories, and long-term expatriates.',
      ur: 'کمپنیوں، شوگر ملز، فرٹیلائزر پلانٹس اور طویل مدتی ملازمین کے لیے خصوصی رعایت۔'
    },
    description: {
      en: 'Ideal for executives working at Fauji Fertilizer (FFC), Fatima Fertilizer, or local industrial setups around Sadiqabad and Machi Goth.',
      ur: 'صادق آباد کی انڈسٹری (ایف ایف سی، فاطمہ فرٹیلائزر) اور پراجیکٹس کے لیے ماہانہ بنیاد پر گاڑیاں۔'
    },
    inclusions: [
      { en: 'Monthly billing with tax invoices', ur: 'ماہانہ بلنگ اور انوائس' },
      { en: 'Free replacement vehicle during servicing', ur: 'سروس کے دوران متبادل گاڑی کی فراہمی' }
    ],
    exclusions: [],
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    isEnabled: true,
    startingPricePKR: 90000
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1001',
    reference: 'R2G-7K3M9QXA',
    customerId: 'cust-101',
    customerName: 'Muhammad Rizwan',
    customerPhone: '+92 301 7654321',
    customerEmail: 'rizwan.ry@gmail.com',
    preferredContact: 'whatsapp',
    vehicleId: 'veh-corolla-2023',
    vehicleName: 'Toyota Corolla GLi (2023)',
    status: 'pending',
    source: 'website',
    rentalType: 'daily',
    driverOption: 'with_driver',
    pickupDate: '2026-10-25',
    pickupTime: '10:00',
    returnDate: '2026-10-27',
    returnTime: '18:00',
    pickupLocation: 'Near Railway Station, Sadiqabad',
    destination: 'Rahim Yar Khan Medical College',
    passengers: 4,
    customerNotes: 'Family trip for attending convocation. Need clean car with safe driver.',
    internalNotes: 'Customer contacted on WhatsApp; requested confirmation by evening.',
    estimate: {
      rentalDays: 3,
      baseRatePerDay: 6000,
      baseTotal: 18000,
      driverFeePerDay: 1500,
      driverTotal: 4500,
      securityDeposit: 0,
      estimatedTotal: 22500,
      needsQuote: false,
      currency: 'PKR',
      inclusions: ['Clean & inspected vehicle', '24/7 roadside assistance', 'Verified local driver'],
      exclusions: ['Fuel', 'Tolls']
    },
    paymentStatus: 'unpaid',
    createdAt: '2026-10-20T10:15:00Z',
    updatedAt: '2026-10-20T10:15:00Z',
    statusHistory: [
      {
        fromStatus: null,
        toStatus: 'pending',
        changedAt: '2026-10-20T10:15:00Z',
        changedBy: 'Customer (Online Form)'
      }
    ]
  },
  {
    id: 'bk-1002',
    reference: 'R2G-9P4W2BKL',
    customerId: 'cust-102',
    customerName: 'Engr. Tariq Mehmood',
    customerPhone: '+92 321 8899001',
    customerEmail: 'tariq.ffc@yahoo.com',
    preferredContact: 'call',
    vehicleId: 'veh-fortuner-2023',
    vehicleName: 'Toyota Fortuner Legender 4x4 (2023)',
    status: 'confirmed',
    source: 'whatsapp',
    rentalType: 'daily',
    driverOption: 'with_driver',
    pickupDate: '2026-10-22',
    pickupTime: '08:00',
    returnDate: '2026-10-24',
    returnTime: '20:00',
    pickupLocation: 'FFC Goth Machi, Sadiqabad',
    destination: 'Multan Industrial Estate via M-5',
    passengers: 3,
    customerNotes: 'Official VIP delegation transport.',
    internalNotes: 'Deposit of PKR 20,000 received via Bank Transfer. Driver Aslam assigned.',
    estimate: {
      rentalDays: 3,
      baseRatePerDay: 22000,
      baseTotal: 66000,
      driverFeePerDay: 2000,
      driverTotal: 6000,
      securityDeposit: 0,
      estimatedTotal: 72000,
      needsQuote: false,
      currency: 'PKR',
      inclusions: ['VIP Chauffeur', 'AC & Bottled Water'],
      exclusions: ['Fuel & Motorway Tolls']
    },
    confirmedTotal: 72000,
    depositAmount: 20000,
    paymentStatus: 'deposit_received',
    assignedTo: 'Driver Aslam',
    createdAt: '2026-10-18T14:30:00Z',
    updatedAt: '2026-10-19T09:00:00Z',
    statusHistory: [
      {
        fromStatus: null,
        toStatus: 'pending',
        changedAt: '2026-10-18T14:30:00Z',
        changedBy: 'Admin (Manual Entry)'
      },
      {
        fromStatus: 'pending',
        toStatus: 'confirmed',
        changedAt: '2026-10-19T09:00:00Z',
        changedBy: 'Owner (Verified Deposit)'
      }
    ]
  },
  {
    id: 'bk-1003',
    reference: 'R2G-3T8H6RZX',
    customerId: 'cust-103',
    customerName: 'Chaudhry Bilal Warraich',
    customerPhone: '+92 300 4455667',
    preferredContact: 'whatsapp',
    vehicleId: 'veh-civic-2022',
    vehicleName: 'Honda Civic Oriel Sunroof (2022)',
    status: 'completed',
    source: 'website',
    rentalType: 'wedding_event',
    driverOption: 'with_driver',
    pickupDate: '2026-10-15',
    pickupTime: '12:00',
    returnDate: '2026-10-16',
    returnTime: '12:00',
    pickupLocation: 'Model Town, Sadiqabad',
    destination: 'Royal Palm Marquee, Sadiqabad',
    passengers: 2,
    customerNotes: 'Baraat car for groom.',
    estimate: {
      rentalDays: 1,
      baseRatePerDay: 9500,
      baseTotal: 9500,
      driverFeePerDay: 1500,
      driverTotal: 1500,
      securityDeposit: 0,
      estimatedTotal: 11000,
      needsQuote: false,
      currency: 'PKR',
      inclusions: ['Clean car', 'Driver'],
      exclusions: ['Flower deco']
    },
    confirmedTotal: 11000,
    depositAmount: 11000,
    paymentStatus: 'paid',
    createdAt: '2026-10-10T12:00:00Z',
    updatedAt: '2026-10-16T14:00:00Z',
    statusHistory: [
      { fromStatus: null, toStatus: 'pending', changedAt: '2026-10-10T12:00:00Z', changedBy: 'Website' },
      { fromStatus: 'pending', toStatus: 'confirmed', changedAt: '2026-10-11T10:00:00Z', changedBy: 'Admin' },
      { fromStatus: 'confirmed', toStatus: 'completed', changedAt: '2026-10-16T14:00:00Z', changedBy: 'Admin' }
    ]
  }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Haji Abdul Sattar',
    rating: 5,
    comment: {
      en: 'Booked Toyota Fortuner for our daughter’s wedding in Sadiqabad. The car arrived sparkling clean 30 minutes before time. Highly recommended!',
      ur: 'بیٹی کی شادی کے لیے فارچونر بک کی تھی۔ گاڑی وقت سے آدھا گھنٹہ پہلے صاف ستھری پہنچ گئی۔ صادق آباد میں بہترین سروس۔'
    },
    trip: {
      en: 'Wedding Booking in Sadiqabad',
      ur: 'شادی کے لیے گاڑی بکنگ'
    },
    vehicleName: 'Toyota Fortuner Legender',
    date: '12 Oct 2026',
    isApproved: true,
    source: 'Verified Customer'
  },
  {
    id: 'rev-2',
    name: 'Dr. Zeeshan Haider',
    rating: 5,
    comment: {
      en: 'Traveled to Sukkur Airport with family. Driver Nasir was extremely polite, drove carefully on the highway, and helped with all luggage.',
      ur: 'فیملی کے ہمراہ سکھر ائیرپورٹ کا سفر کیا۔ ڈرائیور ناصر بہت بااخلاق اور محفوظ ڈرائیونگ کرنے والے تھے۔'
    },
    trip: {
      en: 'Sadiqabad to Sukkur Airport Drop',
      ur: 'صادق آباد سے سکھر ائیرپورٹ ڈراپ'
    },
    vehicleName: 'Toyota Corolla GLi',
    date: '08 Oct 2026',
    isApproved: true,
    source: 'Verified Customer'
  },
  {
    id: 'rev-3',
    name: 'Kamran Farooq (FFC)',
    rating: 5,
    comment: {
      en: 'Our company regularly rents Civics and Corollas from Rent2Go for site visitors. Very professional invoicing and hassle-free service.',
      ur: 'ہماری کمپنی فیکٹری مہمانوں کے لیے باقاعدگی سے رینٹ ٹو گو استعمال کرتی ہے۔ وقت کی پابندی اور بہترین گاڑیاں۔'
    },
    trip: {
      en: 'Corporate Booking (Goth Machi)',
      ur: 'کارپوریٹ بکنگ (گوٹھ مچھی)'
    },
    vehicleName: 'Honda Civic Oriel',
    date: '02 Oct 2026',
    isApproved: true,
    source: 'Corporate Client'
  }
];

export const INITIAL_SETTINGS: SiteSettings = {
  businessName: {
    en: 'Rent2Go Rent-a-Car',
    ur: 'رینٹ ٹو گو کار رینٹل'
  },
  tagline: {
    en: 'Rent Easy. Travel Better.',
    ur: 'آسان کرایہ، بہتر سفر'
  },
  phone: '03007865432',
  phoneFormatted: '+92 300 7865432',
  whatsappNumber: '923007865432',
  email: 'info@rent2go-sadiqabad.pk',
  address: {
    en: 'Main KLP Road, Near Sadiqabad Bypass, Sadiqabad, Punjab',
    ur: 'مین کے ایل پی روڈ، نزد صادق آباد بائی پاس، صادق آباد، پنجاب'
  },
  city: 'Sadiqabad',
  businessHours: {
    en: 'Monday - Sunday: 24/7 Available (Office: 8:00 AM - 10:00 PM)',
    ur: 'پیر تا اتوار: 24 گھنٹے سروس دستیاب (دفتر: صبح 8 تا رات 10 بجے)'
  },
  whatsappMessageTemplate: 'Assalam-o-Alaikum Rent2Go! I would like to inquire about booking {car} from {pickup} to {return}. Reference: {ref}',
  announcementBar: {
    enabled: true,
    text: {
      en: '🎉 Wedding Season Offer: Book luxury Fortuner or Civic 3 days in advance and get free floral ribbon decoration!',
      ur: '🎉 شادی سیزن آفر: فارچونر یا سیوک 3 دن پہلے بک کروانے پر ربن سجاوٹ بالکل مفت!'
    },
    linkUrl: '/book'
  },
  features: {
    selfDriveEnabled: true,
    hourlyRentalEnabled: true,
    floatingWhatsAppEnabled: true,
    reviewsSectionEnabled: true
  },
  themeTokens: {
    primaryColor: '#0B1F3A',
    primaryHover: '#142F57',
    accentColor: '#F5B301',
    surfaceColor: '#F5F7FA',
    borderRadius: '0.75rem'
  }
};

export const INITIAL_CMS_PAGE: CMSPage = {
  id: 'page-home',
  slug: 'home',
  title: {
    en: 'Home Page',
    ur: 'مرکزی صفحہ'
  },
  isCustom: false,
  version: 1,
  publishedAt: '2026-10-20T00:00:00Z',
  seo: {
    title: {
      en: 'Rent2Go - Best Car Rental in Sadiqabad | Verified Fleet & Drivers',
      ur: 'رینٹ ٹو گو صادق آباد - تصدیق شدہ گاڑیاں اور بہترین کرایہ'
    },
    description: {
      en: 'Rent clean, inspected cars with professional drivers or self-drive in Sadiqabad, Rahim Yar Khan, and all Punjab routes.',
      ur: 'صادق آباد اور پنجاب بھر کے لیے ڈرائیور کے ساتھ یا سیلف ڈرائیو پر بہترین گاڑیاں کرائے پر حاصل کریں۔'
    }
  },
  sections: [
    {
      id: 'sec-hero',
      blockType: 'hero',
      title: {
        en: 'Rent a Car in Sadiqabad with Complete Peace of Mind',
        ur: 'صادق آباد میں مکمل اطمینان اور آسانی کے ساتھ گاڑی کرائے پر لیں'
      },
      subtitle: {
        en: 'Modern fleet, verified polite chauffeurs, transparent pricing, and 24/7 roadside assistance across Punjab & Sindh highways.',
        ur: 'جدید ترین گاڑیاں، بااخلاق ڈرائیورز، شفاف کرایہ اور موٹروے پر 24 گھنٹے مدد کی ضمانت۔'
      },
      props: {
        badgeText: { en: 'Sadiqabad’s #1 Trusted Car Rental', ur: 'صادق آباد کا سب سے قابلِ اعتماد کار رینٹل' },
        primaryBtnText: { en: 'Explore All Fleet', ur: 'تمام گاڑیاں دیکھیں' },
        secondaryBtnText: { en: 'Book on WhatsApp', ur: 'واٹس ایپ پر رابطہ' },
        bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80'
      },
      isVisible: true,
      sortOrder: 1
    },
    {
      id: 'sec-search',
      blockType: 'quick_search',
      title: {
        en: 'Find Your Ideal Car',
        ur: 'اپنی پسندیدہ گاڑی تلاش کریں'
      },
      props: {},
      isVisible: true,
      sortOrder: 2
    },
    {
      id: 'sec-featured',
      blockType: 'featured_cars',
      title: {
        en: 'Featured Vehicles in Sadiqabad',
        ur: 'ہماری نمایاں گاڑیاں'
      },
      subtitle: {
        en: 'Inspect real photos, transparent daily rates, and verified capacity before booking.',
        ur: 'بکنگ سے قبل اصل تصاویر، روزانہ کا کرایہ اور تمام سہولیات دیکھیں۔'
      },
      props: {
        limit: 6
      },
      isVisible: true,
      sortOrder: 3
    },
    {
      id: 'sec-services',
      blockType: 'services_list',
      title: {
        en: 'Our Tailored Rental Services',
        ur: 'ہماری خصوصی رینٹل سروسز'
      },
      subtitle: {
        en: 'From airport drop-offs to lavish wedding convoys and monthly factory contracts.',
        ur: 'ائیرپورٹ پک اینڈ ڈراپ سے لے کر شادیوں اور فیکٹریوں کے ماہانہ معاہدوں تک۔'
      },
      props: {},
      isVisible: true,
      sortOrder: 4
    },
    {
      id: 'sec-why',
      blockType: 'why_us',
      title: {
        en: 'Why Sadiqabad Chooses Rent2Go',
        ur: 'صادق آباد کے شہری رینٹ ٹو گو کو کیوں ترجیح دیتے ہیں؟'
      },
      subtitle: {
        en: 'We uphold the highest standards of safety, honesty, and punctuality on every trip.',
        ur: 'ہم ہر سفر میں حفاظت، دیانتداری اور وقت کی پابندی کے اعلیٰ ترین معیار پر پورا اترتے ہیں۔'
      },
      props: {
        points: [
          {
            icon: 'ShieldCheck',
            title: { en: '100% Verified Fleet', ur: 'تصدیق شدہ اور محفوظ گاڑیاں' },
            desc: { en: 'Every car is sanitized, mechanically inspected, and GPS monitored.', ur: 'ہر گاڑی سفر سے قبل مکینیکل چیک کی جاتی ہے اور صاف ستھری ملتی ہے۔' }
          },
          {
            icon: 'UserCheck',
            title: { en: 'Licensed Polite Drivers', ur: 'بااخلاق و تجربہ کار ڈرائیورز' },
            desc: { en: 'Local drivers familiar with M-5 motorways, Sukkur routes, and local shortcuts.', ur: 'موٹروے اور شاہراہوں سے مکمل واقفیت رکھنے والے باکردار ڈرائیورز۔' }
          },
          {
            icon: 'Banknote',
            title: { en: 'Zero Hidden Charges', ur: 'کوئی پوشیدہ چارجز نہیں' },
            desc: { en: 'Clear quotes agreed beforehand. What you see is what you pay.', ur: 'بکنگ سے پہلے طے شدہ کرایہ، کوئی ناجائز کٹوتی یا چارجز نہیں۔' }
          },
          {
            icon: 'Clock',
            title: { en: '24/7 Roadside Assistance', ur: '24 گھنٹے ہنگامی مدد' },
            desc: { en: 'Instant backup vehicle support if any rare mechanical trouble happens.', ur: 'کسی بھی تکنیکی خرابی کی صورت میں فوری متبادل گاڑی کی سہولت۔' }
          }
        ]
      },
      isVisible: true,
      sortOrder: 5
    },
    {
      id: 'sec-steps',
      blockType: 'how_it_works',
      title: {
        en: 'Book in 4 Simple Steps',
        ur: 'گاڑی بک کرنے کا آسان طریقہ'
      },
      subtitle: {
        en: 'Fast, hassle-free booking through our bilingual website or instant WhatsApp chat.',
        ur: 'صرف چند منٹوں میں آن لائن یا واٹس ایپ پر اپنی گاڑی بک کریں۔'
      },
      props: {
        steps: [
          {
            num: '01',
            title: { en: 'Select Your Car', ur: 'گاڑی کا انتخاب کریں' },
            desc: { en: 'Browse sedans, SUVs, or 14-seater passenger vans according to your needs.', ur: 'اپنی ضرورت اور فیملی کے سائز کے مطابق پسندیدہ گاڑی چنیں۔' }
          },
          {
            num: '02',
            title: { en: 'Choose Dates & Route', ur: 'تاریخ اور سفر کا تعین کریں' },
            desc: { en: 'Specify pickup location in Sadiqabad and your destination or rental duration.', ur: 'صادق آباد میں پک اپ کا مقام اور منزل کا انتخاب کریں۔' }
          },
          {
            num: '03',
            title: { en: 'Get Transparent Quote', ur: 'فوری ایسٹیمیٹ حاصل کریں' },
            desc: { en: 'Review breakdown of base rent, driver fees, and terms before submitting.', ur: 'کرایہ کی تفصیلات کا جائزہ لیں اور بکنگ کی درخواست بھیجیں۔' }
          },
          {
            num: '04',
            title: { en: 'Trip Confirmation', ur: 'گاڑی آپ کی دہلیز پر' },
            desc: { en: 'Our team verifies availability and sends your confirmed booking reference.', ur: 'ہماری ٹیم فوری رابطہ کرے گی اور گاڑی وقت پر آپ کے دروازے پر ہوگی۔' }
          }
        ]
      },
      isVisible: true,
      sortOrder: 6
    },
    {
      id: 'sec-reviews',
      blockType: 'reviews',
      title: {
        en: 'What Our Customers Say',
        ur: 'ہمارے معزز کسٹمرز کی آراء'
      },
      props: {},
      isVisible: true,
      sortOrder: 7
    },
    {
      id: 'sec-faq',
      blockType: 'faq',
      title: {
        en: 'Frequently Asked Questions',
        ur: 'اکثر پوچھے جانے والے سوالات'
      },
      props: {
        items: [
          {
            q: { en: 'What documents are required for self-drive car rental?', ur: 'سیلف ڈرائیو کے لیے کن کاغذات کی ضرورت ہوتی ہے؟' },
            a: {
              en: 'You need an original Computerized National Identity Card (CNIC), a valid Driving License, and a refundable security deposit.',
              ur: 'اصل شناختی کارڈ (CNIC)، ویلڈ ڈرائیونگ لائسنس اور واپسی کے قابل سیکیورٹی ڈپازٹ درکار ہوتا ہے۔'
            }
          },
          {
            q: { en: 'Is fuel included in the daily rental rate?', ur: 'کیا روزانہ کے کرائے میں پیٹرول یا ڈیزل شامل ہوتا ہے؟' },
            a: {
              en: 'Standard rates exclude fuel. The vehicle is delivered with fuel and returned with the same level (tank-to-tank policy). We can also provide a full-fuel inclusive package upon request.',
              ur: 'معمول کا کرایہ بغیر ایندھن کے ہوتا ہے۔ جتنے پیٹرول کے ساتھ گاڑی دی جاتی ہے اتنے پر ہی واپس کی جاتی ہے۔'
            }
          },
          {
            q: { en: 'Can I travel to other cities like Sukkur, Multan, or Lahore?', ur: 'کیا سکھر، ملتان یا لاہور کے لیے گاڑی مل سکتی ہے؟' },
            a: {
              en: 'Yes! Our cars are permitted for nationwide travel across Punjab, Sindh, and northern areas via M-5 motorway and major highways.',
              ur: 'جی ہاں! ہماری تمام گاڑیاں پورے پاکستان میں موٹرویز اور جی ٹی روڈ پر سفر کی مکمل اجازت رکھتی ہیں۔'
            }
          },
          {
            q: { en: 'What happens if the vehicle has a breakdown during the trip?', ur: 'اگر دورانِ سفر گاڑی میں کوئی خرابی آ جائے تو کیا ہوگا؟' },
            a: {
              en: 'We provide 24/7 emergency roadside response. If an issue cannot be resolved swiftly, we dispatch a replacement vehicle immediately.',
              ur: 'ہماری 24 گھنٹے ہیلپ لائن دستیاب ہے۔ ضرورت پڑنے پر فوری طور پر متبادل گاڑی مہیا کی جاتی ہے۔'
            }
          }
        ]
      },
      isVisible: true,
      sortOrder: 8
    },
    {
      id: 'sec-cta',
      blockType: 'cta_banner',
      title: {
        en: 'Ready to Travel with Comfort & Confidence?',
        ur: 'کیا آپ آرام دہ اور محفوظ سفر کے لیے تیار ہیں؟'
      },
      subtitle: {
        en: 'Book your vehicle online in under 2 minutes or chat directly with our booking manager on WhatsApp.',
        ur: 'ابھی آن لائن بکنگ کریں یا ہمارے مینیجر سے براہِ راست واٹس ایپ پر بات کریں۔'
      },
      props: {
        primaryBtn: { en: 'Request a Car Online', ur: 'آن لائن بکنگ کی درخواست کریں' },
        whatsappBtn: { en: 'Chat on WhatsApp', ur: 'واٹس ایپ پر میسج کریں' }
      },
      isVisible: true,
      sortOrder: 9
    }
  ]
};

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-1',
    actor: 'Muhammad Usman (Owner)',
    role: 'owner',
    module: 'CMS Engine',
    action: 'Published Revision v1',
    details: 'Initial bilingual launch version of Home page and rental services',
    timestamp: '2026-10-20T12:00:00Z'
  },
  {
    id: 'aud-2',
    actor: 'Muhammad Usman (Owner)',
    role: 'owner',
    module: 'Vehicles',
    action: 'Fleet Seed Completed',
    details: 'Added 7 verified vehicles: Corolla, Civic, Fortuner, Yaris, Alto, Hiace, Mercedes',
    timestamp: '2026-10-20T11:45:00Z'
  }
];
