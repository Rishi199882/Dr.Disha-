import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SpecialtiesSection } from './components/SpecialtiesSection';
import { ApproachSection } from './components/ApproachSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { EducationalVideoSection } from './components/EducationalVideoSection';
import { BookingSystem } from './components/BookingSystem';
import { RecipeBlog } from './components/RecipeBlog';
import { PatientPortal } from './components/PatientPortal';
import { MedicalRecords } from './components/MedicalRecords';
import { EmailReminders } from './components/EmailReminders';
import { PaymentGateway } from './components/PaymentGateway';
import { ClinicalToolsSection } from './components/ClinicalToolsSection';
import { PatientLogin } from './components/PatientLogin';
import { Footer } from './components/Footer';
import { HipaaComplianceModal } from './components/HipaaComplianceModal';
import { AuditLogModal } from './components/AuditLogModal';
import { MacroCalculatorModal } from './components/MacroCalculatorModal';
import { LockScreenModal } from './components/LockScreenModal';
import { ErrorBoundary } from './components/ErrorBoundary';

import { PatientProfile, BookingAppointment, FoodDiaryItem, UserRole } from './types/nutrition';
import { StorageService } from './services/storage';
import { CLINICAL_PROVIDER, CONSULTATION_TYPES, MOCK_RECIPES } from './data/mockData';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  FileText, 
  Activity,
  HeartPulse,
  Dna,
  PlayCircle,
  Percent,
  Wrench,
  Megaphone,
  LogIn,
  CreditCard,
  Apple
} from 'lucide-react';

export default function App() {
  // Initialize storage
  useEffect(() => {
    StorageService.initDefaults();
  }, []);

  // Hash-based Tab Routing
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = [
      'home', 
      'about', 
      'specialties', 
      'approach', 
      'recipes', 
      'video', 
      'booking', 
      'pricing', 
      'contact', 
      'portal', 
      'tools', 
      'ehr', 
      'reminders', 
      'login'
    ];
    if (validTabs.includes(hash)) return hash;
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromHash);
  const [patients, setPatients] = useState<PatientProfile[]>(() => StorageService.getPatients());
  const [activePatientId, setActivePatientId] = useState<string>(() => StorageService.getActivePatientId());
  const [activeRole, setActiveRole] = useState<UserRole>(() => StorageService.getActiveRole());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.isPatientLoggedIn());
  
  // Pending booking passed to payment gateway
  const [pendingBooking, setPendingBooking] = useState<BookingAppointment | null>(null);

  // Modals
  const [showHipaaModal, setShowHipaaModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showMacroCalc, setShowMacroCalc] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean>(() => StorageService.isSecurityLocked());

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPatient = (id: string) => {
    StorageService.setActivePatientId(id);
    setActivePatientId(id);
  };

  const handleRoleChanged = (role: UserRole) => {
    StorageService.setActiveRole(role);
    setActiveRole(role);
  };

  const handleLoginSuccess = (patient: PatientProfile) => {
    setIsLoggedIn(true);
    setActivePatientId(patient.id);
    setPatients(StorageService.getPatients());
    handleNavigate('portal');
  };

  const handleLogout = () => {
    StorageService.logoutPatient();
    setIsLoggedIn(false);
    handleNavigate('home');
  };

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];

  const handleOpenPaymentWithBooking = (booking: BookingAppointment) => {
    setPendingBooking(booking);
    handleNavigate('pricing');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-950 transition-colors duration-300">
        
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          activePatient={activePatient}
          patients={patients}
          onSelectPatient={handleSelectPatient}
          onOpenMacroCalc={() => setShowMacroCalc(true)}
          onOpenHipaaModal={() => setShowHipaaModal(true)}
          onOpenAuditLogs={() => setShowAuditLogs(true)}
          onLockScreen={() => {
            StorageService.setSecurityLocked(true);
            setIsLocked(true);
          }}
          activeRole={activeRole}
          onRoleChanged={handleRoleChanged}
          isLoggedIn={isLoggedIn}
          onOpenLogin={() => handleNavigate('login')}
          onLogout={handleLogout}
        />

        {/* MAIN VIEW AREA */}
        <main className="flex-1">
          
          {/* TAB 1: HOME (Comprehensive Culina Health-Inspired Clinical Landing Page) */}
          {activeTab === 'home' && (
            <div>
              {/* Hero Section */}
              <HeroSection
                onNavigate={handleNavigate}
                onSelectConsultation={(id) => handleNavigate('booking')}
              />

              {/* 4-Step Care Experience Teaser Strip */}
              <section className="bg-white py-16 border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>The Care Journey</span>
                      </div>
                      <h2 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
                        How Nutrition Care Works with Dr. Disha
                      </h2>
                    </div>
                    <button
                      onClick={() => handleNavigate('approach')}
                      className="text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore the Complete 4-Step Care Method</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        num: '01',
                        title: 'Comprehensive Intake & Labs',
                        desc: 'Deep audit of your 10-year metabolic history, recent blood panels, medication depletions, and daily routine.'
                      },
                      {
                        num: '02',
                        title: 'Bio-Individual Strategy',
                        desc: 'Customized daily protein, fiber, fat & carbohydrate targets aligned with your cellular biomarkers and culture.'
                      },
                      {
                        num: '03',
                        title: 'Continuous Telehealth Guidance',
                        desc: 'Regular 1-on-1 video reviews, continuous glucose telemetry adjustments, and personalized food diary feedback.'
                      },
                      {
                        num: '04',
                        title: 'Lifelong Sustained Vitality',
                        desc: 'Empowering self-efficacy, intuitive metabolic flexibility, and joyful food freedom without restrictive diets.'
                      }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-stone-50 rounded-2xl border border-stone-200/80 p-5 space-y-2 hover:border-emerald-700/60 transition-colors">
                        <span className="font-mono-numbers text-xl font-bold text-emerald-800/40">
                          {step.num}
                        </span>
                        <h3 className="font-serif-display text-base font-bold text-stone-900">
                          {step.title}
                        </h3>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Specialties & Clinical Conditions Preview */}
              <SpecialtiesSection
                onBookConsult={(id) => handleNavigate('booking')}
              />

              {/* Educational Video Preview Strip */}
              <section className="bg-stone-900 text-stone-100 py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 max-w-2xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Featured Educational Clinical Orientation
                    </span>
                    <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                      Why a Healthy Lifestyle Truly Matters: 6-Minute Orientation with Dr. Disha
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                      Discover why chronic 3 PM fatigue and metabolic resistance aren&apos;t personal failures—they are cellular signaling errors you can reverse with targeted nutrition.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('video')}
                    className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-emerald-900" />
                    <span>Watch Full 6-Min Orientation</span>
                  </button>
                </div>
              </section>

              {/* Insurance, Superbills & 0% EMI Overview Strip (Culina Health Style) */}
              <section className="bg-white py-16 border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="bg-gradient-to-tr from-stone-50 to-emerald-50/40 rounded-3xl border border-stone-200 p-8 sm:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      
                      <div className="lg:col-span-7 space-y-4">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                          <Percent className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Insurance Reimbursement & Flexible Care</span>
                        </div>
                        <h3 className="font-serif-display text-3xl font-bold text-stone-900 tracking-tight">
                          Accessible, Transparent Nutrition Care
                        </h3>
                        <p className="text-sm text-stone-600 leading-relaxed">
                          We believe high-touch clinical nutrition should never be out of reach. We provide itemized, diagnostic-coded Superbills for out-of-network insurance reimbursement, accept HSA/FSA cards, and offer 0% APR monthly EMI installments.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-stone-700">
                          <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1">
                            <strong className="text-emerald-900 block font-semibold">Insurance Superbills</strong>
                            <span className="text-[11px] text-stone-500">Standard CPT 97802 / 97803 diagnostic receipts provided.</span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1">
                            <strong className="text-emerald-900 block font-semibold">HSA & FSA Eligible</strong>
                            <span className="text-[11px] text-stone-500">Pay with your pre-tax health savings card directly.</span>
                          </div>
                          <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1">
                            <strong className="text-emerald-900 block font-semibold">0% APR EMI Plans</strong>
                            <span className="text-[11px] text-stone-500">Split multi-month care packages over 3 to 12 months.</span>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
                        <h4 className="font-serif-display text-lg font-bold text-stone-900">
                          Calculate Your 0% EMI Installments
                        </h4>
                        <p className="text-xs text-stone-500">
                          Interested in spreading your clinical package into manageable monthly payments? Check your options with zero credit impact.
                        </p>
                        <button
                          onClick={() => handleNavigate('pricing')}
                          className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>View Insurance Guide & EMI Calculator</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </section>

              {/* FAQ Section */}
              <FaqSection
                onBookClick={() => handleNavigate('booking')}
              />

              {/* Final Booking Call-to-Action Strip */}
              <section className="bg-gradient-to-r from-emerald-900 to-teal-950 py-16 px-4 sm:px-6 lg:px-8 text-white">
                <div className="max-w-4xl mx-auto text-center space-y-5">
                  <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                    Take the Next Step Towards Sustained Vitality
                  </span>
                  <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                    Ready for Clinical Nutrition That Actually Works for Your Life?
                  </h2>
                  <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
                    Schedule your initial 75-minute clinical nutrition assessment with Dr. Disha today. Receive a personalized metabolic roadmap, continuous support, and compassionate guidance.
                  </p>
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => handleNavigate('booking')}
                      className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-stone-100 text-emerald-950 font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-emerald-800" />
                      <span>Book Initial Assessment</span>
                    </button>
                    <button
                      onClick={() => handleNavigate('contact')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold rounded-xl text-sm border border-emerald-700/80 transition-all cursor-pointer"
                    >
                      Have Questions? Contact Us
                    </button>
                  </div>
                  <div className="text-[11px] text-emerald-200/80 pt-2 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>HIPAA Compliant · Telehealth Available Across Licensed States</span>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* TAB 2: ABOUT DR. DISHA */}
          {activeTab === 'about' && (
            <AboutSection
              onBookClick={() => handleNavigate('booking')}
            />
          )}

          {/* TAB 3: SPECIALTIES & CONDITIONS */}
          {activeTab === 'specialties' && (
            <SpecialtiesSection
              onBookConsult={(id) => handleNavigate('booking')}
            />
          )}

          {/* TAB 4: OUR 4-STEP CARE METHOD */}
          {activeTab === 'approach' && (
            <ApproachSection
              onBookClick={() => handleNavigate('booking')}
            />
          )}

          {/* TAB 5: CONTACT & CLINICAL INQUIRY */}
          {activeTab === 'contact' && (
            <ContactSection
              onBookClick={() => handleNavigate('booking')}
            />
          )}

          {/* TAB 6: THERAPEUTIC RECIPE BLOG */}
          {activeTab === 'recipes' && (
            <RecipeBlog
              isAdmin={activeRole === 'admin'}
              onLogToDiary={(item) => {
                // updates automatically stored
              }}
            />
          )}

          {/* TAB 7: EDUCATIONAL VIDEO ORIENTATION */}
          {activeTab === 'video' && (
            <EducationalVideoSection
              onBookConsultation={() => handleNavigate('booking')}
            />
          )}

          {/* TAB 8: APPOINTMENT BOOKING SYSTEM */}
          {activeTab === 'booking' && (
            <BookingSystem
              onOpenPayment={handleOpenPaymentWithBooking}
              onBookingSuccess={handleOpenPaymentWithBooking}
            />
          )}

          {/* TAB 9: INSURANCE, PRICING & 0% EMI GATEWAY */}
          {activeTab === 'pricing' && (
            <PaymentGateway
              initialBooking={pendingBooking}
              onPaymentSuccess={() => {
                setPendingBooking(null);
              }}
            />
          )}

          {/* TAB 10: PATIENT PORTAL (AUTHENTICATED DASHBOARD) */}
          {activeTab === 'portal' && (
            isLoggedIn ? (
              <PatientPortal
                patient={activePatient}
                onRefreshData={() => {
                  setPatients(StorageService.getPatients());
                }}
                onNavigateToTab={handleNavigate}
              />
            ) : (
              <PatientLogin
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => handleNavigate('home')}
                targetTabName="Patient Progress Portal & Biometrics"
              />
            )
          )}

          {/* TAB 11: CLINICAL TOOLS & FASTING CALCULATOR */}
          {activeTab === 'tools' && (
            <ClinicalToolsSection
              activePatient={activePatient}
            />
          )}

          {/* TAB 12: EHR & MEDICAL LAB RECORDS */}
          {activeTab === 'ehr' && (
            isLoggedIn ? (
              <MedicalRecords
                patient={activePatient}
              />
            ) : (
              <PatientLogin
                onLoginSuccess={handleLoginSuccess}
                onNavigateHome={() => handleNavigate('home')}
                targetTabName="Electronic Health Records (EHR) & Labs"
              />
            )
          )}

          {/* TAB 13: REMINDERS & BROADCAST STUDIO */}
          {activeTab === 'reminders' && (
            <EmailReminders />
          )}

          {/* TAB 14: PATIENT SIGN IN & ACTIVATION */}
          {activeTab === 'login' && (
            <PatientLogin
              onLoginSuccess={handleLoginSuccess}
              onNavigateHome={() => handleNavigate('home')}
            />
          )}

        </main>

        {/* Global Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenHipaa={() => setShowHipaaModal(true)}
        />

        {/* MODALS */}
        <HipaaComplianceModal
          patient={activePatient}
          isOpen={showHipaaModal}
          onClose={() => setShowHipaaModal(false)}
          onOpenAuditLogs={() => setShowAuditLogs(true)}
          onRoleChanged={() => setActiveRole(StorageService.getActiveRole())}
        />

        <AuditLogModal
          isOpen={showAuditLogs}
          onClose={() => setShowAuditLogs(false)}
        />

        <MacroCalculatorModal
          patient={activePatient}
          isOpen={showMacroCalc}
          onClose={() => setShowMacroCalc(false)}
          onTargetUpdated={() => {
            setPatients(StorageService.getPatients());
          }}
        />

        <LockScreenModal
          isLocked={isLocked}
          onUnlock={() => setIsLocked(false)}
        />

      </div>
    </ErrorBoundary>
  );
}
