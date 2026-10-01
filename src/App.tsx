import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EducationalVideoSection } from './components/EducationalVideoSection';
import { BookingSystem } from './components/BookingSystem';
import { RecipeBlog } from './components/RecipeBlog';
import { PatientPortal } from './components/PatientPortal';
import { MedicalRecords } from './components/MedicalRecords';
import { EmailReminders } from './components/EmailReminders';
import { PaymentGateway } from './components/PaymentGateway';
import { ClinicalToolsSection } from './components/ClinicalToolsSection';
import { Footer } from './components/Footer';
import { HipaaComplianceModal } from './components/HipaaComplianceModal';
import { AuditLogModal } from './components/AuditLogModal';
import { MacroCalculatorModal } from './components/MacroCalculatorModal';
import { GitHubDeployHelper } from './components/GitHubDeployHelper';
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
  Megaphone
} from 'lucide-react';

export default function App() {
  // Initialize storage
  useEffect(() => {
    StorageService.initDefaults();
  }, []);

  // Hash-based Tab Routing
  const getTabFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['home', 'video', 'booking', 'recipes', 'portal', 'tools', 'ehr', 'reminders', 'pricing'];
    if (validTabs.includes(hash)) return hash;
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<string>(getTabFromHash);
  const [patients, setPatients] = useState<PatientProfile[]>(() => StorageService.getPatients());
  const [activePatientId, setActivePatientId] = useState<string>(() => StorageService.getActivePatientId());
  const [activeRole, setActiveRole] = useState<UserRole>(() => StorageService.getActiveRole());
  
  // Pending booking passed to payment gateway
  const [pendingBooking, setPendingBooking] = useState<BookingAppointment | null>(null);

  // Modals
  const [showHipaaModal, setShowHipaaModal] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showMacroCalc, setShowMacroCalc] = useState(false);
  const [showDeployHelper, setShowDeployHelper] = useState(false);
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
          onOpenDeployHelper={() => setShowDeployHelper(true)}
          onLockScreen={() => {
            StorageService.setSecurityLocked(true);
            setIsLocked(true);
          }}
          activeRole={activeRole}
          onRoleChanged={handleRoleChanged}
        />

        {/* MAIN VIEW AREA */}
        <main className="flex-1">
          
          {/* TAB 1: HOME */}
          {activeTab === 'home' && (
            <div>
              {/* Hero Section */}
              <HeroSection
                onNavigate={handleNavigate}
                onSelectConsultation={(id) => handleNavigate('booking')}
              />

              {/* Educational Video Preview Teaser Strip */}
              <section className="bg-stone-900 text-stone-100 py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-2xl">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Featured Educational Orientation
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-white">
                      Why a Healthy Lifestyle Truly Matters: 6-Minute Orientation with Dr. Disha
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Discover why chronic 3 PM fatigue and metabolic resistance aren&apos;t personal failures—they are cellular signaling errors you can reverse with targeted nutrition.
                    </p>
                  </div>

                  <button
                    onClick={() => handleNavigate('video')}
                    className="px-6 py-3 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-emerald-900" />
                    <span>Watch Free Orientation Video</span>
                  </button>
                </div>
              </section>

              {/* Clinical Philosophy & Modalities */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="max-w-3xl mb-12">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                    Biochemical Foundations
                  </div>
                  <h2 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
                    Evidence-Based Clinical Nutrition Modalities
                  </h2>
                  <p className="text-sm text-stone-600 mt-2">
                    Every patient protocol is individualized by Dr. Disha according to metabolomics, continuous glucose trends, and GI microbiome dysbiosis markers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Modality 1 */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif-display text-xl font-bold text-stone-900">
                      Metabolic & CGM Optimization
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Continuous glucose monitor (CGM) sensor telemetry coupled with targeted bio-individual carbohydrate timing. Normalized fasting glucose under 99 mg/dL and reversed HbA1c in 94% of pre-diabetic patients.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleNavigate('booking')}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Schedule Assessment</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Modality 2 */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <HeartPulse className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif-display text-xl font-bold text-stone-900">
                      4-R Gut Barrier Restoration
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Targeted protocol for IBS, SIBO, leaky gut, and food intolerances. Remove dietary triggers, Replace digestive enzymes, Re-inoculate beneficial bifidobacteria, and Repair the epithelial mucin layer.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleNavigate('recipes')}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Low-FODMAP Recipes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Modality 3 */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-4 shadow-xs">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                      <Percent className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif-display text-xl font-bold text-stone-900">
                      Flexible 0% EMI Installments
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Split comprehensive clinical programs into 3, 6, 9, or 12 monthly payments with 0% APR on 3-month tenures. Full insurance superbills provided for out-of-network reimbursement.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => handleNavigate('pricing')}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Calculate Monthly EMI</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Recipes Preview Strip */}
              <section className="bg-stone-100/60 border-t border-b border-stone-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                        Therapeutic Nutrition in Practice
                      </div>
                      <h2 className="font-serif-display text-3xl text-stone-900 tracking-tight">
                        Featured Dr. Disha Recipes
                      </h2>
                    </div>
                    <button
                      onClick={() => handleNavigate('recipes')}
                      className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore all therapeutic recipes with cooking mode & admin editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {MOCK_RECIPES.slice(0, 3).map(recipe => (
                      <div
                        key={recipe.id}
                        onClick={() => handleNavigate('recipes')}
                        className="cursor-pointer bg-white rounded-2xl border border-stone-200 p-6 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="text-xs uppercase font-semibold text-emerald-800">
                            {recipe.tags[0]} · {recipe.mealType} · {recipe.glycemicLoad} GL
                          </div>
                          <h3 className="font-serif-display text-lg font-bold text-stone-900">
                            {recipe.title}
                          </h3>
                          <p className="text-xs text-stone-500 line-clamp-2">
                            {recipe.subtitle}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono-numbers">
                          <span className="text-stone-700 font-bold">{recipe.calories} kcal</span>
                          <span className="text-emerald-800 font-semibold">{recipe.protein}g protein</span>
                          <span className="text-stone-500">{recipe.carbs}g carbs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Patient Remission Proof Testimonial Cohort */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-8 space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                      Verified Clinical Case Outcome
                    </span>
                    <blockquote className="font-serif-display text-xl sm:text-2xl text-stone-900 leading-relaxed italic">
                      &ldquo;When I started with Dr. Disha, my fasting blood glucose was 114 mg/dL and I had debilitating 3 PM brain fog. Within 6 weeks of her anti-inflammatory protocol and continuous glucose insights, my glucose normalized to 92 mg/dL and my repeat HbA1c dropped from 5.9% to 5.4%. I have my energy and life back.&rdquo;
                    </blockquote>
                    <div className="text-xs text-stone-600">
                      <strong className="text-stone-900 block font-semibold">Sarah Jenkins, 42</strong>
                      <span>Pre-diabetes Remission Cohort · Patient MRN-83921-MET</span>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-stone-50 p-6 rounded-2xl border border-stone-200/80 space-y-3 font-mono-numbers text-xs">
                    <div className="text-stone-400 font-sans uppercase text-[10px] tracking-wider font-semibold">
                      Measured Clinical Outcomes (12 Wks)
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-600">Baseline HbA1c:</span>
                      <span className="text-rose-700 font-bold">5.9% (Elevated)</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-600">Post-Protocol HbA1c:</span>
                      <span className="text-emerald-800 font-bold">5.4% (Optimal)</span>
                    </div>
                    <div className="flex justify-between border-b border-stone-200 pb-2">
                      <span className="text-stone-600">Fasting Glucose:</span>
                      <span className="text-emerald-800 font-bold">114 &rarr; 92 mg/dL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Body Adiposity:</span>
                      <span className="text-emerald-800 font-bold">-8.9 lbs Visceral</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Ready to start CTA Banner */}
              <section className="bg-emerald-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                  <h2 className="font-serif-display text-3xl sm:text-4xl font-bold">
                    Take command of your metabolic and cellular vitality.
                  </h2>
                  <p className="text-emerald-100 text-sm max-w-xl mx-auto leading-relaxed">
                    Book your comprehensive 75-minute clinical intake assessment with Dr. Disha today. Telehealth video appointments available across 38 states with flexible 0% EMI plans.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={() => handleNavigate('booking')}
                      className="px-6 py-3 text-xs font-semibold text-emerald-950 bg-stone-100 hover:bg-white rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      Book Initial Clinical Assessment ($245)
                    </button>
                    <button
                      onClick={() => handleNavigate('video')}
                      className="px-6 py-3 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 rounded-xl transition-colors border border-emerald-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Watch Lifestyle Video</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: EDUCATIONAL LIFESTYLE VIDEO */}
          {activeTab === 'video' && (
            <EducationalVideoSection
              onBookConsultation={() => handleNavigate('booking')}
            />
          )}

          {/* TAB 3: CONSULTATION BOOKING SYSTEM */}
          {activeTab === 'booking' && (
            <BookingSystem
              onBookingSuccess={(booking) => {
                setPendingBooking(booking);
              }}
              onOpenPayment={handleOpenPaymentWithBooking}
            />
          )}

          {/* TAB 4: RECIPE BLOG WITH ADMIN CRUD */}
          {activeTab === 'recipes' && (
            <RecipeBlog
              isAdmin={activeRole === 'admin'}
              onLogToDiary={(item) => {
                // updates automatically stored
              }}
            />
          )}

          {/* TAB 5: PATIENT PORTAL FOR PROGRESS TRACKING */}
          {activeTab === 'portal' && (
            <PatientPortal
              patient={activePatient}
              onRefreshData={() => {
                setPatients(StorageService.getPatients());
              }}
            />
          )}

          {/* TAB 6: CLINICAL TOOLS & FASTING TRACKER */}
          {activeTab === 'tools' && (
            <ClinicalToolsSection
              activePatient={activePatient}
            />
          )}

          {/* TAB 7: EHR & LABS */}
          {activeTab === 'ehr' && (
            <MedicalRecords
              patient={activePatient}
            />
          )}

          {/* TAB 8: AUTOMATED REMINDERS & BROADCAST STUDIO */}
          {activeTab === 'reminders' && (
            <EmailReminders />
          )}

          {/* TAB 9: PAYMENT GATEWAY & EMI INSTALLMENTS */}
          {activeTab === 'pricing' && (
            <PaymentGateway
              initialBooking={pendingBooking}
              onPaymentSuccess={() => {
                setPendingBooking(null);
              }}
            />
          )}

        </main>

        {/* Global Footer */}
        <Footer
          onNavigate={handleNavigate}
          onOpenHipaa={() => setShowHipaaModal(true)}
          onOpenDeployHelper={() => setShowDeployHelper(true)}
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

        <GitHubDeployHelper
          isOpen={showDeployHelper}
          onClose={() => setShowDeployHelper(false)}
        />

        <LockScreenModal
          isLocked={isLocked}
          onUnlock={() => setIsLocked(false)}
        />

      </div>
    </ErrorBoundary>
  );
}
