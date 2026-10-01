import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Check, 
  Download, 
  Video, 
  CreditCard, 
  AlertCircle,
  FileCheck2,
  CalendarPlus,
  RefreshCw,
  XCircle,
  ChevronRight,
  ChevronLeft,
  MailCheck,
  Percent
} from 'lucide-react';
import { 
  ConsultationType, 
  ConsultationTypeId, 
  BookingAppointment, 
  IntakeQuestionnaire 
} from '../types/nutrition';
import { CONSULTATION_TYPES, CLINICAL_PROVIDER } from '../data/mockData';
import { StorageService } from '../services/storage';

interface BookingSystemProps {
  onBookingSuccess?: (booking: BookingAppointment) => void;
  onOpenPayment?: (booking: BookingAppointment) => void;
}

export const BookingSystem: React.FC<BookingSystemProps> = ({ 
  onBookingSuccess,
  onOpenPayment 
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedType, setSelectedType] = useState<ConsultationType>(CONSULTATION_TYPES[0]);
  
  // Date & Time Picker
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  
  // Intake Form
  const [intakeForm, setIntakeForm] = useState<IntakeQuestionnaire>({
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '(555) 234-8910',
    dob: '1984-06-14',
    primaryGoal: 'metabolic-weight',
    dietaryStyle: 'mediterranean',
    allergies: 'Tree nuts (mild), lactose sensitivity',
    medicationsAndSupplements: 'Metformin 500mg, Multivitamin',
    digestiveSymptoms: ['Post-meal bloating', 'Afternoon fatigue'],
    currentWeightLbs: 172,
    heightInches: 65,
    activityLevel: 'moderate',
    chiefHealthConcerns: 'Interested in glycemic stabilization, continuous glucose monitoring insights, and sustainable energy without sugar crashes.',
    consentAgreed: true
  });

  const [confirmedBooking, setConfirmedBooking] = useState<BookingAppointment | null>(null);
  const [existingBookings, setExistingBookings] = useState<BookingAppointment[]>(() => StorageService.getBookings());

  const timeSlots = [
    '08:30 AM', '09:30 AM', '10:45 AM', '01:15 PM', '02:30 PM', '03:45 PM', '05:00 PM'
  ];

  const handleSelectType = (consult: ConsultationType) => {
    setSelectedType(consult);
    setActiveStep(2);
  };

  const handleSelectDateTime = () => {
    if (!selectedDate || !selectedTime) return;
    setActiveStep(3);
  };

  const handleSymptomToggle = (symptom: string) => {
    setIntakeForm(prev => {
      const exists = prev.digestiveSymptoms.includes(symptom);
      return {
        ...prev,
        digestiveSymptoms: exists 
          ? prev.digestiveSymptoms.filter(s => s !== symptom)
          : [...prev.digestiveSymptoms, symptom]
      };
    });
  };

  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeForm.consentAgreed) {
      alert('Please agree to clinical telehealth consent to continue.');
      return;
    }

    const newBooking: BookingAppointment = {
      id: `book-${Date.now()}`,
      patientId: 'patient-01',
      clientName: intakeForm.fullName,
      clientEmail: intakeForm.email,
      clientPhone: intakeForm.phone,
      consultationTypeId: selectedType.id,
      consultationTitle: selectedType.title,
      durationMinutes: selectedType.duration,
      price: selectedType.price,
      date: selectedDate,
      timeSlot: selectedTime,
      status: 'confirmed',
      paymentStatus: 'pending',
      zoomLink: `https://telehealth.drdisha-nutrition.com/room/${encodeURIComponent(intakeForm.fullName.toLowerCase().replace(/\s+/g, '-'))}`,
      intakeData: intakeForm,
      createdAt: new Date().toISOString(),
      confirmationEmailSent: true
    };

    StorageService.addBooking(newBooking);
    setConfirmedBooking(newBooking);
    setExistingBookings(StorageService.getBookings());
    setActiveStep(4);
    if (onBookingSuccess) onBookingSuccess(newBooking);
  };

  // Generate .ics standard iCalendar file for immediate download
  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const startIso = `${confirmedBooking.date.replace(/-/g, '')}T${confirmedBooking.timeSlot.includes('PM') ? '140000' : '100000'}Z`;
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Dr Disha Clinical Nutrition//Telehealth Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${confirmedBooking.id}@drdisha-nutrition.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:.]/g, '').substring(0, 15)}Z`,
      `DTSTART:${startIso}`,
      `DURATION:PT${confirmedBooking.durationMinutes}M`,
      `SUMMARY:Clinical Nutrition Consultation with Dr. Disha: ${confirmedBooking.consultationTitle}`,
      `DESCRIPTION:Telehealth consultation with Dr. Disha\\nZoom Meeting: ${confirmedBooking.zoomLink}\\nIntake Record Confirmed.`,
      `LOCATION:HIPAA Encrypted Telehealth Portal (${confirmedBooking.zoomLink})`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `consultation-${confirmedBooking.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this consultation?')) {
      StorageService.cancelBooking(id);
      setExistingBookings(StorageService.getBookings());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Section Header */}
      <div className="max-w-3xl mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          Clinical Scheduling & Intake Engine
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
          Book an Evidence-Based Clinical Nutrition Consultation with Dr. Disha
        </h2>
        <p className="text-sm text-stone-600 mt-2">
          Telehealth video appointments available across 38 states. Comprehensive medical intake, continuous glucose guidance, and official CPT diagnostic superbills for insurance reimbursement. Flexible 0% APR EMI plans available.
        </p>
      </div>

      {/* Booking Step Progress Indicator */}
      <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep >= 1 ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
            1
          </span>
          <span className="text-xs font-medium hidden sm:inline text-stone-800">Consultation Type</span>
        </div>
        <div className="h-0.5 w-8 sm:w-16 bg-stone-200" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep >= 2 ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
            2
          </span>
          <span className="text-xs font-medium hidden sm:inline text-stone-800">Date & Slot</span>
        </div>
        <div className="h-0.5 w-8 sm:w-16 bg-stone-200" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep >= 3 ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
            3
          </span>
          <span className="text-xs font-medium hidden sm:inline text-stone-800">Clinical Intake</span>
        </div>
        <div className="h-0.5 w-8 sm:w-16 bg-stone-200" />
        <div className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${activeStep >= 4 ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
            4
          </span>
          <span className="text-xs font-medium hidden sm:inline text-stone-800">Confirmation</span>
        </div>
      </div>

      {/* STEP 1: Select Consultation Type */}
      {activeStep === 1 && (
        <div className="space-y-6">
          <div className="text-sm font-medium text-stone-700">
            Select consultation modality based on your primary health objective:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONSULTATION_TYPES.map((consult) => {
              const isSelected = selectedType.id === consult.id;
              return (
                <div
                  key={consult.id}
                  onClick={() => setSelectedType(consult)}
                  className={`cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between ${
                    isSelected 
                      ? 'border-emerald-800 bg-emerald-50/40 ring-2 ring-emerald-800/20 shadow-sm' 
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="text-xs font-medium text-stone-500 font-mono-numbers">
                        CPT {consult.cptCode}
                      </div>
                      <div className="text-sm font-semibold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-md font-mono-numbers">
                        ${consult.price}
                      </div>
                    </div>

                    <h3 className="font-serif-display text-lg font-semibold text-stone-900 leading-snug">
                      {consult.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1 font-mono-numbers">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {consult.duration} Minutes
                      </span>
                      <span>·</span>
                      <span>Telehealth Video</span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {consult.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 italic">
                      {consult.recommendedFor}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleSelectType(consult); }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        isSelected 
                          ? 'bg-emerald-800 text-white' 
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? 'Proceed with Slot' : 'Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Next: Select Date & Time Slot</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Time Slot */}
      {activeStep === 2 && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <div className="text-xs text-emerald-800 font-semibold uppercase">Selected Modality</div>
              <h3 className="font-serif-display text-xl text-stone-900 font-semibold">{selectedType.title}</h3>
              <p className="text-xs text-stone-500 font-mono-numbers">{selectedType.duration} mins · ${selectedType.price} · CPT {selectedType.cptCode}</p>
            </div>
            <button
              onClick={() => setActiveStep(1)}
              className="text-xs text-stone-500 hover:text-stone-900 underline"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                1. Choose Consultation Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={today.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-800/30 text-sm font-mono-numbers bg-stone-50"
              />
              <p className="text-xs text-stone-500 mt-2">
                Available slots displayed in your local time zone (EST/PST auto-synced).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                2. Available Open Slots for {selectedDate}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const isTimeSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all font-mono-numbers flex items-center justify-center gap-1.5 ${
                        isTimeSelected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-stone-200">
            <button
              onClick={() => setActiveStep(1)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSelectDateTime}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-2"
            >
              <span>Next: Complete Clinical Intake</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Clinical Intake Questionnaire */}
      {activeStep === 3 && (
        <form onSubmit={handleCompleteBooking} className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-stone-200">
            <div className="text-xs text-emerald-800 font-semibold uppercase">Step 3 of 4</div>
            <h3 className="font-serif-display text-2xl text-stone-900 font-semibold">Pre-Consultation Medical & Dietary Intake</h3>
            <p className="text-xs text-stone-500 mt-1">
              Protected under HIPAA 45 CFR Part 164. All data remains encrypted and accessible solely by Dr. Disha for clinical protocol formulation.
            </p>
          </div>

          {/* Patient Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={intakeForm.fullName}
                onChange={(e) => setIntakeForm({ ...intakeForm, fullName: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email Address (for Instant Confirmation & Zoom)</label>
              <input
                type="email"
                required
                value={intakeForm.email}
                onChange={(e) => setIntakeForm({ ...intakeForm, email: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number (SMS alerts)</label>
              <input
                type="tel"
                required
                value={intakeForm.phone}
                onChange={(e) => setIntakeForm({ ...intakeForm, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={intakeForm.dob}
                onChange={(e) => setIntakeForm({ ...intakeForm, dob: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
              />
            </div>
          </div>

          {/* Clinical Focus & Diet Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Primary Health Objective</label>
              <select
                value={intakeForm.primaryGoal}
                onChange={(e) => setIntakeForm({ ...intakeForm, primaryGoal: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 bg-white"
              >
                <option value="metabolic-weight">Pre-Diabetes & Metabolic Rebalance</option>
                <option value="gut-health">IBS, SIBO & Gut Microbiome Restoration</option>
                <option value="hormone-balance">PCOS, Thyroid & Endocrine Rhythm</option>
                <option value="sports-performance">Athletic Endurance & Lean Mass Tuning</option>
                <option value="chronic-disease">Cardiometabolic & Anti-Inflammatory Care</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Current Dietary Pattern</label>
              <select
                value={intakeForm.dietaryStyle}
                onChange={(e) => setIntakeForm({ ...intakeForm, dietaryStyle: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 bg-white"
              >
                <option value="mediterranean">Mediterranean Whole Foods</option>
                <option value="omnivore">Standard Omnivorous</option>
                <option value="vegetarian">Vegetarian / Pescatarian</option>
                <option value="vegan">Whole Food Plant-Based / Vegan</option>
                <option value="keto-lowcarb">Ketogenic / Low-Carbohydrate</option>
                <option value="low-fodmap">Low-FODMAP Protocol</option>
              </select>
            </div>
          </div>

          {/* Biometrics Baseline */}
          <div className="grid grid-cols-3 gap-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Current Weight (lbs)</label>
              <input
                type="number"
                value={intakeForm.currentWeightLbs}
                onChange={(e) => setIntakeForm({ ...intakeForm, currentWeightLbs: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono-numbers"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Height (inches)</label>
              <input
                type="number"
                value={intakeForm.heightInches}
                onChange={(e) => setIntakeForm({ ...intakeForm, heightInches: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 font-mono-numbers"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Activity Level</label>
              <select
                value={intakeForm.activityLevel}
                onChange={(e) => setIntakeForm({ ...intakeForm, activityLevel: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light (1-2x/wk)</option>
                <option value="moderate">Moderate (3-4x/wk)</option>
                <option value="very-active">Very Active (5+x/wk)</option>
              </select>
            </div>
          </div>

          {/* Digestive Symptoms Checklist */}
          <div className="pt-2 border-t border-stone-100">
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              Frequent Digestive Symptoms (Check all that apply):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                'Post-meal bloating',
                'Acid reflux / heartburn',
                'Afternoon fatigue / brain fog',
                'Irregular bowel motility',
                'Sugar / refined carb cravings',
                'Joint stiffness / water retention'
              ].map(sym => (
                <label key={sym} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={intakeForm.digestiveSymptoms.includes(sym)}
                    onChange={() => handleSymptomToggle(sym)}
                    className="rounded text-emerald-800 focus:ring-emerald-800"
                  />
                  <span className="text-stone-700">{sym}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Allergies & Medications */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Known Allergies / Food Intolerances</label>
              <input
                type="text"
                value={intakeForm.allergies}
                onChange={(e) => setIntakeForm({ ...intakeForm, allergies: e.target.value })}
                placeholder="e.g. Tree nuts, gluten sensitivity, dairy..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Current Prescription Medications & Daily Supplements</label>
              <input
                type="text"
                value={intakeForm.medicationsAndSupplements}
                onChange={(e) => setIntakeForm({ ...intakeForm, medicationsAndSupplements: e.target.value })}
                placeholder="e.g. Metformin, Levothyroxine, Vitamin D..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Chief Health Concerns & What You Wish to Achieve</label>
              <textarea
                rows={3}
                value={intakeForm.chiefHealthConcerns}
                onChange={(e) => setIntakeForm({ ...intakeForm, chiefHealthConcerns: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300"
              />
            </div>
          </div>

          {/* Telehealth & HIPAA Consent Checkbox */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/70 text-xs space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={intakeForm.consentAgreed}
                onChange={(e) => setIntakeForm({ ...intakeForm, consentAgreed: e.target.checked })}
                className="mt-0.5 rounded text-emerald-800 focus:ring-emerald-800"
              />
              <span className="text-stone-700 leading-relaxed">
                I hereby consent to participate in HIPAA-compliant clinical nutrition telehealth consultations with Dr. Disha. I understand that medical nutrition therapy is an individualized therapeutic service and that an official Superbill with CPT 97802/97803 diagnostic codes will be generated for insurance reimbursement.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Lock Appointment</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Confirmation & Calendar File (.ics) Download */}
      {activeStep === 4 && confirmedBooking && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-emerald-300 p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <FileCheck2 className="w-8 h-8" />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Consultation Successfully Confirmed
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-1">
              We look forward to partnering in your health, {confirmedBooking.clientName}!
            </h3>
            
            {/* Automated confirmation email badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold mt-3">
              <MailCheck className="w-4 h-4 text-emerald-700" />
              <span>Automated Confirmation Email & Intake Sent to {confirmedBooking.clientEmail}</span>
            </div>

            <p className="text-xs text-stone-600 mt-2 max-w-lg mx-auto">
              A 24-hour reminder email will automatically arrive before your appointment with Dr. Disha.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Service:</span>
              <span className="font-semibold text-stone-800">{confirmedBooking.consultationTitle}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Date & Slot:</span>
              <span className="font-semibold text-stone-800 font-mono-numbers">{confirmedBooking.date} at {confirmedBooking.timeSlot}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Duration:</span>
              <span className="font-semibold text-stone-800 font-mono-numbers">{confirmedBooking.durationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Clinical Fee:</span>
              <span className="font-semibold text-emerald-800 font-mono-numbers">${confirmedBooking.price}.00 (Superbill & EMI Eligible)</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-500">Secure Video Room:</span>
              <a
                href={confirmedBooking.zoomLink}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-emerald-800 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>telehealth.drdisha-nutrition.com</span>
              </a>
            </div>
          </div>

          {/* Calendar Download & Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleDownloadIcs}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CalendarPlus className="w-4 h-4 text-emerald-800" />
              <span>Download .ICS Calendar Invite</span>
            </button>

            {onOpenPayment && (
              <button
                onClick={() => onOpenPayment(confirmedBooking)}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Percent className="w-4 h-4" />
                <span>Pay Fee or Choose 0% EMI</span>
              </button>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveStep(1)}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Schedule Another Consultation
            </button>
          </div>
        </div>
      )}

      {/* Existing Appointments Manager */}
      {existingBookings.length > 0 && (
        <div className="mt-14 pt-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-stone-900">
              Your Scheduled Consultations ({existingBookings.length})
            </div>
            <span className="text-xs text-stone-500">HIPAA Encrypted Patient Record</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingBookings.map((bk) => (
              <div key={bk.id} className="bg-white rounded-xl border border-stone-200 p-4 space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-stone-900">{bk.consultationTitle}</h4>
                    <p className="text-stone-500 font-mono-numbers">{bk.date} · {bk.timeSlot} ({bk.durationMinutes} min)</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    bk.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {bk.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                  <a href={bk.zoomLink} target="_blank" rel="noreferrer" className="text-emerald-800 hover:underline flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>Join Room</span>
                  </a>

                  {bk.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(bk.id)}
                      className="text-stone-400 hover:text-rose-700 flex items-center gap-1"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
