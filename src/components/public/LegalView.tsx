import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { ShieldCheck, FileText, AlertCircle } from 'lucide-react';

export const LegalView: React.FC = () => {
  const { locale } = useApp();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cancellation'>('terms');

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#060D17] min-h-screen py-12 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {locale === 'ur' ? 'قانونی پالیسیاں اور اصول' : 'Legal Guidelines'}
          </span>
          <h1 className="text-3xl font-extrabold text-[#0B1F3A] dark:text-white">
            {locale === 'ur' ? 'شرائط، پرائیویسی اور منسوخی کی پالیسی' : 'Terms, Privacy & Cancellation Policies'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('terms')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'terms'
                ? 'border-[#0B1F3A] dark:border-amber-400 text-[#0B1F3A] dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {locale === 'ur' ? 'شرائط و ضوابط' : 'Terms & Conditions'}
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? 'border-[#0B1F3A] dark:border-amber-400 text-[#0B1F3A] dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {locale === 'ur' ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
          </button>
          <button
            onClick={() => setActiveTab('cancellation')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'cancellation'
                ? 'border-[#0B1F3A] dark:border-amber-400 text-[#0B1F3A] dark:text-amber-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {locale === 'ur' ? 'منسوخی اور ریفنڈ' : 'Cancellation & Refund'}
          </button>
        </div>

        {/* Content Card */}
        <div className="bg-white dark:bg-[#0B1523] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-sm leading-relaxed text-sm text-slate-700 dark:text-slate-300 space-y-6">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">1. Rental Agreement & Driver Rules</h2>
              <p>
                All vehicles provided by Rent2Go are subject to Pakistani traffic laws and motor vehicle ordinances. If opting for vehicle with driver, the driver will follow legal speed limits (maximum 120 km/h on M-5 Motorway).
              </p>
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">2. Self-Drive Requirements</h2>
              <p>
                Self-drive rentals require verification of original Computerized National Identity Card (CNIC), valid Pakistani driver’s license, and refundable security deposit. Vehicle inspection sheet is signed jointly at pickup.
              </p>
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">3. Fuel & Toll Charges</h2>
              <p>
                Fuel is strictly tank-to-tank unless a fuel-inclusive customized package is agreed in writing. Toll taxes (Motorway M-5, National Highway N-5) and parking tickets are paid by customer.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">1. Data Collection & Usage</h2>
              <p>
                Rent2Go collects only minimal information necessary to fulfill your car rental request: your full name, Pakistani contact number, email, and travel itinerary.
              </p>
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">2. No Sharing with Third Parties</h2>
              <p>
                We never sell, rent, or trade your contact data to marketers or external brokers. Your details are accessed strictly by our booking staff in Sadiqabad to manage your reservations.
              </p>
            </div>
          )}

          {activeTab === 'cancellation' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">1. Free Cancellation Notice</h2>
              <p>
                You may cancel any pending or confirmed booking up to 12 hours before scheduled pickup time with zero cancellation fee.
              </p>
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">2. Late Cancellation Policy</h2>
              <p>
                Cancellations made within 4 hours of scheduled departure or failure to show up may be subject to a nominal vehicle dispatch fee (1 day driver allowance or 20% of base fare).
              </p>
              <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">3. Security Deposit Refunds</h2>
              <p>
                Self-drive security deposits are refunded within 24 hours of vehicle return following post-trip inspection and clearance of any unpaid e-challans.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
