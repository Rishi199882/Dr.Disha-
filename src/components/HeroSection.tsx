import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Activity, 
  Dna, 
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  HeartPulse,
  PlayCircle
} from 'lucide-react';
import { CLINICAL_PROVIDER, CONSULTATION_TYPES } from '../data/mockData';

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
      {/* Background ambient subtle gradient */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Proposition & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Human Editorial Title */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50/80 px-3 py-1 rounded-md border border-emerald-200/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evidence-Based Clinical Dietetics & Functional Medicine</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-stone-900 tracking-tight leading-[1.12]">
              Precision nutrition engineered for cellular longevity and metabolic remission.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              Led by <strong className="text-stone-900 font-semibold">{CLINICAL_PROVIDER.name}</strong>, Columbia University trained Clinical Dietitian. We bridge continuous glucose telemetry, gut microbiome restoration, and bio-individual meal architecture into sustained physiological vitality.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('booking')}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Schedule Clinical Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('video')}
                className="px-5 py-3.5 text-sm font-semibold text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-200 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-emerald-800" />
                <span>Watch Lifestyle Video</span>
              </button>

              <button
                onClick={() => onNavigate('recipes')}
                className="px-4 py-3.5 text-sm font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors cursor-pointer"
              >
                Recipe Blog
              </button>
            </div>

            {/* Credentials & Trust Markers */}
            <div className="pt-6 border-t border-stone-200/80">
              <div className="text-xs uppercase tracking-wider font-semibold text-stone-500 mb-3">
                Board Certifications & Clinical Affiliations
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-700">
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

          {/* Right Column: Visual Showcase & Clinical Mechanism Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-2xl border border-stone-200 shadow-md p-6 sm:p-8 space-y-6">
              
              {/* Card Header with Provider Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-800 to-teal-700 text-stone-100 flex items-center justify-center font-serif text-2xl font-bold shadow-inner shrink-0">
                  DD
                </div>
                <div>
                  <h3 className="font-serif-display text-lg font-semibold text-stone-900">
                    Dr. Disha, MS, RDN
                  </h3>
                  <p className="text-xs text-stone-500">
                    NPI: 1841392810 · CDN-009482 NY
                  </p>
                  <p className="text-xs text-emerald-800 font-medium mt-1">
                    Accepting New Telehealth & Clinical Patients
                  </p>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-stone-600 leading-relaxed italic border-l-2 border-emerald-700/60 pl-3">
                &ldquo;True metabolic health isn&apos;t caloric restriction—it is targeted biochemical cellular nourishment that stabilizes glycemic swings and repairs mucosal barrier integrity.&rdquo;
              </p>

              {/* Mechanism Highlights */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
                  Care Methodologies
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <Dna className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Advanced Metabolomics</h4>
                    <p className="text-xs text-stone-500">Fasting insulin, HOMA-IR, hs-CRP, and continuous glucose trend integration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <HeartPulse className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">4-R Gut Intestinal Restoration</h4>
                    <p className="text-xs text-stone-500">Remove irritants, Replace enzymes, Re-inoculate microbiome, Repair barrier.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <CalendarCheck className="w-5 h-5 text-emerald-800 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-stone-900">Flexible 0% APR EMI Installments</h4>
                    <p className="text-xs text-stone-500">Split clinical program fees into 3, 6, 9, or 12 monthly payments.</p>
                  </div>
                </div>
              </div>

              {/* Quick Consult selector */}
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('booking')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-emerald-900 bg-emerald-100/70 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span>Select Consultation Type & View Open Slots</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Quantified Adjacency Evidence Section */}
        <div className="mt-16 pt-10 border-t border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-900">
          <div>
            <div className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 font-mono-numbers">
              1,420+
            </div>
            <div className="text-xs font-medium text-stone-600 mt-1">
              Clinical Consultations Completed
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Across 38 states via HIPAA telehealth
            </div>
          </div>

          <div>
            <div className="font-serif-display text-3xl sm:text-4xl font-bold text-emerald-800 font-mono-numbers">
              94.2%
            </div>
            <div className="text-xs font-medium text-stone-600 mt-1">
              Pre-Diabetes Remission Rate
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Normalizing HbA1c &lt; 5.7% in 12 wks
            </div>
          </div>

          <div>
            <div className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 font-mono-numbers">
              88.6%
            </div>
            <div className="text-xs font-medium text-stone-600 mt-1">
              IBS / SIBO Symptom Relief
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              4-R Microbiome Protocol cohort
            </div>
          </div>

          <div>
            <div className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 font-mono-numbers">
              256-Bit
            </div>
            <div className="text-xs font-medium text-stone-600 mt-1">
              AES-GCM WebCrypto Encryption
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Full HIPAA 45 CFR compliance
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
