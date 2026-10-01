import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Dna, 
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  HeartPulse,
  PlayCircle,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { CLINICAL_PROVIDER } from '../data/mockData';

interface HeroSectionProps {
  onNavigate: (tab: string) => void;
  onSelectConsultation: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  onSelectConsultation
}) => {
  return (
    <div className="relative overflow-hidden bg-stone-50 border-b border-stone-200">
      {/* Background ambient subtle blur circles */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-teal-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition, Copy & Action CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Informed Clinical Dietetics & Functional Nutrition</span>
            </div>

            {/* Clear Positioning Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.12]">
              Personalized nutrition care designed for real life, rooted in science.
            </h1>

            {/* Subheading / Value Proposition */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              Work 1-on-1 with <strong className="text-stone-900 font-semibold">{CLINICAL_PROVIDER.name}</strong>, Columbia University trained Clinical Dietitian. We translate your unique lab biomarkers, continuous glucose telemetry, and gastrointestinal health into delicious, sustainable food habits that last.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('specialties')}
                className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
              >
                Explore Specialties
              </button>

              <button
                onClick={() => onNavigate('approach')}
                className="px-4 py-3.5 text-xs sm:text-sm font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* Verified Clinical Credentials & Trust Badges */}
            <div className="pt-6 border-t border-stone-200/80">
              <div className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mb-3">
                Verified Credentials & Practice Standards
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>MS Columbia Univ.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>RDN / CDN Registered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>IFMCP Functional Med</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>HIPAA 256-Bit Vault</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Clinical Provider Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-3xl border border-stone-200 shadow-lg p-6 sm:p-8 space-y-6">
              
              {/* Card Header with Provider Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-stone-100 flex items-center justify-center font-serif text-2xl font-bold shadow-inner shrink-0">
                  DD
                </div>
                <div>
                  <h3 className="font-serif-display text-lg font-bold text-stone-900">
                    Dr. Disha, MS, RDN, CDN
                  </h3>
                  <p className="text-xs text-stone-500">
                    NPI: {CLINICAL_PROVIDER.npi} · NY State License: {CLINICAL_PROVIDER.licenseNumber}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>Accepting Telehealth Patients</span>
                  </div>
                </div>
              </div>

              {/* Clinical Care Philosophy Quote */}
              <blockquote className="text-xs text-stone-600 leading-relaxed italic border-l-2 border-emerald-700/60 pl-3">
                &ldquo;True metabolic wellness is never about restriction or calorie guilt—it is about providing the precise biochemical signals your cells need to heal, stabilize blood sugar, and thrive.&rdquo;
              </blockquote>

              {/* Mechanism Highlights */}
              <div className="space-y-3 pt-1">
                <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider">
                  Core Clinical Methodologies
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <Activity className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Biomarker & CGM Integration</h4>
                    <p className="text-[11px] text-stone-500">Continuous glucose tracking, fasting insulin, HOMA-IR, and inflammatory CRP optimization.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <HeartPulse className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">4-R Gut Intestinal Restoration</h4>
                    <p className="text-[11px] text-stone-500">Targeted protocols for IBS, SIBO, leaky gut barrier repair, and food sensitivity management.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                  <ShieldCheck className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Insurance Superbills & 0% EMI</h4>
                    <p className="text-[11px] text-stone-500">Reimbursement-ready CPT 97802 invoices and flexible interest-free monthly installments.</p>
                  </div>
                </div>
              </div>

              {/* Quick Consult Button */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-3 px-4 text-xs font-semibold text-emerald-950 bg-emerald-100 hover:bg-emerald-200/90 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <span>Select Consultation Type & View Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Clinical Care Pillars Strip (Replaces fabricated claims with genuine practice standards) */}
        <div className="mt-16 pt-10 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-900">
          <div className="space-y-1">
            <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-800" />
              <span>Evidence-First</span>
            </div>
            <div className="text-xs font-semibold text-stone-700">
              Rigorous Clinical Dietetics
            </div>
            <div className="text-[11px] text-stone-500">
              Protocols grounded in peer-reviewed physiological research
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif-display text-xl sm:text-2xl font-bold text-emerald-800 flex items-center gap-2">
              <Dna className="w-5 h-5 text-emerald-800" />
              <span>Bio-Individual</span>
            </div>
            <div className="text-xs font-semibold text-stone-700">
              Tailored to Your Biology
            </div>
            <div className="text-[11px] text-stone-500">
              Honoring your genetics, lab work, culture, and lifestyle
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-800" />
              <span>1-on-1 Guidance</span>
            </div>
            <div className="text-xs font-semibold text-stone-700">
              Collaborative Partnership
            </div>
            <div className="text-[11px] text-stone-500">
              Regular telehealth touchpoints & secure portal messaging
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="text-xs font-semibold text-stone-700">
              256-Bit SSL Encryption
            </div>
            <div className="text-[11px] text-stone-500">
              Strict 45 CFR Part 164 Protected Health Information privacy
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
