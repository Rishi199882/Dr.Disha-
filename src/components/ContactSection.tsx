import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import { CLINICAL_PROVIDER } from '../data/mockData';

export const ContactSection: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    clinicalInterest: 'Metabolic & Glycemic Remission',
    hasInsurance: 'yes',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, valid email address, and a brief description of your health goals.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="bg-stone-50 py-16" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch with Dr. Disha</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Begin Your Personalized Nutrition Journey
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Have questions about our clinical programs, insurance superbill reimbursement, or telehealth availability? Send a message to our clinical triage team or book directly online.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                  Clinical Inquiry Received
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.fullName}</strong>. Dr. Disha's clinical triage coordinator will review your inquiry regarding <strong>{formData.clinicalInterest}</strong> and reply to <strong>{formData.email}</strong> within 1 business day.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', phone: '', clinicalInterest: 'Metabolic & Glycemic Remission', hasInsurance: 'yes', message: '' }); }}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-xl text-xs font-semibold"
                  >
                    Send Another Inquiry
                  </button>
                  <button
                    onClick={onBookClick}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Immediate Open Calendar Slots</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif-display text-xl font-bold text-stone-900 mb-1">
                  Send a Confidential Clinical Inquiry
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  All messages are encrypted and reviewed strictly by licensed clinical staff.
                </p>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="sarah@example.com"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Primary Clinical Specialty of Interest
                    </label>
                    <select
                      value={formData.clinicalInterest}
                      onChange={(e) => setFormData({ ...formData, clinicalInterest: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-800 bg-white"
                    >
                      <option value="Metabolic & Glycemic Remission">Metabolic & Glycemic Remission</option>
                      <option value="Gut Microbiome & Dysbiosis">Gut Microbiome & Dysbiosis (IBS/SIBO)</option>
                      <option value="Women's Hormonal Health & PCOS">Women's Hormonal Health & PCOS</option>
                      <option value="Cardiovascular & Lipid Optimization">Cardiovascular & Lipid Optimization</option>
                      <option value="Sports Performance & Recovery">Sports Performance & Recovery</option>
                      <option value="Sustainable Weight Management">Sustainable Weight Management</option>
                      <option value="General Clinical Nutrition">General Clinical Nutrition</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    How Can We Help You? (Health background, symptoms, or goals) *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe what challenges you are facing or what you would like to achieve..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:border-emerald-800 leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>Protected by HIPAA 256-Bit SSL Encryption</span>
                  </span>
                  <span>Zero Data Sharing</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Clinical Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Practice Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                Clinic & Consultation Information
              </h3>

              <div className="space-y-4 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Physical Practice Location</strong>
                    <p className="text-stone-500 leading-relaxed">{CLINICAL_PROVIDER.clinicAddress}</p>
                    <p className="text-[11px] text-emerald-800 font-medium mt-1">In-person visits by scheduled appointment only.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Practice Telephone</strong>
                    <p className="text-stone-500">{CLINICAL_PROVIDER.clinicPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Clinical Hours</strong>
                    <p className="text-stone-500">Monday – Thursday: 8:30 AM – 6:00 PM EST</p>
                    <p className="text-stone-500">Friday: 8:30 AM – 4:00 PM EST</p>
                    <p className="text-stone-500">Saturday: Telehealth Morning Slots (9 AM – 1 PM)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Ready to Book Directly?
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Skip the inquiry form and reserve your initial 75-minute clinical nutrition assessment directly on Dr. Disha&apos;s real-time appointment calendar.
                </p>
                <button
                  onClick={onBookClick}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Open Appointment Booking Calendar</span>
                </button>
              </div>

            </div>

            {/* Emergency Notice */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <strong>Emergency Notice:</strong> This clinical inquiry form is not for emergency or urgent medical needs. If you are experiencing acute medical symptoms, call 911 or visit the nearest emergency facility.
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
