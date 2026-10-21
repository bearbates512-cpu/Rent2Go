import React from 'react';
import { Booking, Vehicle, SiteSettings } from '../../types/index.ts';
import { Printer, X, ShieldCheck, Car, Phone, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface RentalAgreementModalProps {
  booking: Booking;
  vehicle?: Vehicle;
  settings: SiteSettings;
  onClose: () => void;
}

export const RentalAgreementModal: React.FC<RentalAgreementModalProps> = ({
  booking,
  vehicle,
  settings,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const totalFare = booking.confirmedTotal || booking.estimate?.estimatedTotal || 0;
  const deposit = booking.depositAmount || 0;
  const balanceDue = Math.max(0, totalFare - deposit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-slate-200 print:max-h-none print:shadow-none print:border-none print:p-0">
        {/* Screen Controls (Hidden when printing) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Official Rental Voucher & Agreement
            </span>
            <span className="text-xs text-slate-500 font-mono">Ref: {booking.reference}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#142F57] text-[#F5B301] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE AGREEMENT DOCUMENT */}
        <div className="space-y-6 text-slate-800 text-xs font-sans leading-relaxed">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-[#0B1F3A] pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] text-[#F5B301] flex items-center justify-center font-black">
                  <Car className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black text-[#0B1F3A] tracking-tight">Rent2Go</h1>
                <span className="text-xs font-bold text-slate-500 uppercase px-2 py-0.5 rounded bg-slate-100">
                  Car Rental Sadiqabad
                </span>
              </div>
              <p className="text-slate-600 font-medium">
                KLP Road Bypass / Model Town Chowk, Sadiqabad, Distt. Rahim Yar Khan, Punjab
              </p>
              <p className="text-slate-500 text-[11px]">
                Phone: {settings.phoneFormatted} | WhatsApp: +{settings.whatsappNumber} | Email: {settings.email}
              </p>
            </div>

            <div className="text-end">
              <span className="text-lg font-black font-mono text-[#0B1F3A] block">{booking.reference}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Booking Voucher & Agreement</span>
              <span className="text-[11px] text-slate-600 block mt-1">Date: {new Date().toLocaleDateString('en-PK')}</span>
              <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800'
              }`}>
                Status: {booking.status}
              </span>
            </div>
          </div>

          {/* Customer & Trip Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hirer Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0B1F3A] text-xs uppercase tracking-wider border-b border-slate-200 pb-1 block">
                1. Hirer / Customer Information
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Full Name:</span>
                  <span className="font-bold text-slate-900">{booking.customerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Contact Phone:</span>
                  <span className="font-bold font-mono text-slate-900">{booking.customerPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">CNIC / ID Card:</span>
                  <span className="font-semibold text-slate-700">Verified & Recorded</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Driver Option:</span>
                  <span className="font-semibold text-slate-700 capitalize">
                    {booking.driverOption === 'with_driver' ? 'With Verified Driver' : 'Self-Drive (Personal)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle & Journey Info */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-[#0B1F3A] text-xs uppercase tracking-wider border-b border-slate-200 pb-1 block">
                2. Assigned Vehicle & Schedule
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Vehicle Model:</span>
                  <span className="font-bold text-slate-900">{booking.vehicleName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Reg / Plate No:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {vehicle?.customFields?.registrationNumber || 'RYK-2023-R2G'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Pickup Date & Time:</span>
                  <span className="font-semibold text-slate-700">{booking.pickupDate} ({booking.pickupTime || '09:00'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Return Date & Time:</span>
                  <span className="font-semibold text-slate-700">{booking.returnDate} ({booking.returnTime || '18:00'})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 block">Pickup Location / Destination:</span>
                  <span className="font-semibold text-slate-700">{booking.pickupLocation} ➔ {booking.destination}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-[#0B1F3A] text-white px-4 py-2 font-bold text-xs uppercase tracking-wider">
              3. Agreed Fare & Payment Summary
            </div>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-4 text-slate-600">Base Car Rent ({booking.estimate?.rentalDays || 1} Days @ PKR {booking.estimate?.baseRatePerDay?.toLocaleString() || 'N/A'}/day)</td>
                  <td className="py-2 px-4 text-end font-mono font-semibold text-slate-800">
                    PKR {booking.estimate?.baseTotal ? booking.estimate.baseTotal.toLocaleString() : totalFare.toLocaleString()}
                  </td>
                </tr>
                {booking.driverOption === 'with_driver' && (
                  <tr>
                    <td className="py-2 px-4 text-slate-600">Professional Driver Allowance / Service Fee</td>
                    <td className="py-2 px-4 text-end font-mono font-semibold text-slate-800">
                      PKR {(booking.estimate?.driverTotal || 0).toLocaleString()}
                    </td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2 px-4 text-slate-800">Total Confirmed Rental Amount</td>
                  <td className="py-2 px-4 text-end font-mono text-[#0B1F3A] text-sm">
                    PKR {totalFare.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 text-emerald-700 font-semibold">Advance / Deposit Amount Received</td>
                  <td className="py-2 px-4 text-end font-mono font-bold text-emerald-700">
                    - PKR {deposit.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-amber-50 font-black">
                  <td className="py-2 px-4 text-amber-950">Net Balance Due on Vehicle Handover</td>
                  <td className="py-2 px-4 text-end font-mono text-amber-950 text-sm">
                    PKR {balanceDue.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Standard Operational Terms */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-[11px] text-slate-600">
            <span className="font-bold text-[#0B1F3A] uppercase tracking-wider block text-xs">
              4. Terms of Hire & Delivery Conditions
            </span>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Fuel Policy:</strong> Tank provided full / recorded mark. Customer returns vehicle with the same fuel level.</li>
              <li><strong>Tolls & Parking:</strong> Motorway/Highway M-5 tolls, challans, and local parking fees are payable by the customer.</li>
              <li><strong>Driver Accommodations:</strong> For outstation night halts, driver food and modest accommodation are arranged or reimbursed by the hirer.</li>
              <li><strong>Speed & Safety:</strong> Vehicle is equipped with satellite tracking. Safe speed limit of 110 KM/H on highways is strictly enforced.</li>
            </ul>
          </div>

          {/* Handover & Signature Blocks */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div className="space-y-12">
              <span className="font-bold text-slate-700 block">Customer / Hirer Acceptance:</span>
              <div className="border-t border-slate-400 pt-1 text-[11px] text-slate-500">
                Signature & Date: {booking.customerName}
              </div>
            </div>

            <div className="space-y-12 text-end">
              <span className="font-bold text-slate-700 block">For Rent2Go Sadiqabad:</span>
              <div className="border-t border-slate-400 pt-1 text-[11px] text-slate-500">
                Authorized Dispatcher / Fleet Manager Stamp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
