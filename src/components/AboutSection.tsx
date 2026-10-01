import React from 'react';
import { 
  Award, 
  GraduationCap, 
  Building2, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react';
import { CLINICAL_PROVIDER } from '../data/mockData';

export const AboutSection: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  return (
    <div className="bg-stone-50 py-16" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Bio Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Portrait & Credentials Badge */}
          <div className="lg:col-span-5">
            <div className="relative">
              
              {/* Clinical Avatar Showcase */}
              <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-lg text-center space-y-4">
                <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-800 to-emerald-700 text-white flex items-center justify-center font-serif text-4xl font-bold shadow-inner">
                  DD
                </div>
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                    Dr. Disha, MS, RDN, CDN
                  </h3>
                  <p className="text-xs font-semibold text-emerald-800 mt-1 uppercase tracking-wider">
                    {CLINICAL_PROVIDER.title}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    NPI: {CLINICAL_PROVIDER.npi} · License: {CLINICAL_PROVIDER.licenseNumber}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3 text-left text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
                    <span className="block text-[10px] uppercase font-bold text-stone-400">Education</span>
                    <strong className="text-stone-800 text-[11px]">MS Columbia Univ.</strong>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
                    <span className="block text-[10px] uppercase font-bold text-stone-400">Credentials</span>
                    <strong className="text-stone-800 text-[11px]">RDN / CDN / IFMCP</strong>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 text-xs text-emerald-900 text-left space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Accepting Telehealth & In-Person Patients</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80">
                    Virtual care provided across licensed states with out-of-network insurance superbills.
                  </p>
                </div>

                <button
                  onClick={onBookClick}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Initial Assessment with Dr. Disha</span>
                </button>
              </div>

            </div>
          </div>

          {/* Right Column: Mission & Care Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Meet Your Clinical Dietitian</span>
            </div>

            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight leading-tight">
              Rooted in Clinical Science. Grounded in Real-Life Compassion.
            </h1>

            <p className="text-base text-stone-600 leading-relaxed">
              Dr. Disha is a board-certified Clinical Dietitian Nutritionist holding a Master of Science in Clinical Nutrition from Columbia University Medical Center, with specialized fellowship training in integrative functional medicine and clinical endocrinology.
            </p>

            <p className="text-sm text-stone-600 leading-relaxed">
              Throughout her career, Dr. Disha observed a recurring failure in modern healthcare: patients suffering from chronic metabolic resistance, gut dysbiosis, PCOS, and fatigue were either handed a generic printout of a low-calorie diet or told their lab tests were &ldquo;within normal range&rdquo; while their health continued to deteriorate.
            </p>

            <blockquote className="p-4 bg-white rounded-2xl border-l-4 border-emerald-800 text-sm text-stone-700 italic shadow-xs">
              &ldquo;My clinical philosophy is simple: your symptoms are physiological communication, not personal failures. We use advanced biomarker telemetry and gastrointestinal mapping to uncover why your body is struggling, then nourish it back to optimal cellular equilibrium.&rdquo;
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                  <GraduationCap className="w-4 h-4" />
                  <span>Rigorous Academic Training</span>
                </div>
                <p className="text-xs text-stone-500">
                  Graduate thesis focused on continuous glucose variability and gut microbial fermentation metabolites.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                  <Heart className="w-4 h-4" />
                  <span>Zero-Shame Clinical Space</span>
                </div>
                <p className="text-xs text-stone-500">
                  Care that honors your ethnic background, relationship with food, and daily emotional well-being.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Clinical Pillars & Standards */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl mb-8">
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900">
              Our 4 Clinical Practice Pillars
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Every consultation, meal architecture, and supplement protocol adheres to these core medical dietetics principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 p-5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-serif-display text-base font-bold text-stone-900">
                Biochemical Individuality
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                No two human metabolisms are identical. What restores one person&apos;s insulin sensitivity can cause digestive distress in another. We test, not guess.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-serif-display text-base font-bold text-stone-900">
                Food-First Foundation
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Supplements are targeted tools for repletion—not substitutes for wholesome culinary nutrition. We emphasize real, delicious meals you enjoy eating.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-serif-display text-base font-bold text-stone-900">
                Physician Collaboration
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                We frequently coordinate with primary care physicians, endocrinologists, and gastroenterologists to align clinical care plans and lab monitoring.
              </p>
            </div>

            <div className="space-y-2 p-5 bg-stone-50 rounded-2xl border border-stone-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="font-serif-display text-base font-bold text-stone-900">
                Lifelong Sustainability
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                If a dietary plan cannot be maintained happily for 5 years, it is clinically counter-productive. We focus on behavioral habits that endure.
              </p>
            </div>
          </div>
        </div>

        {/* Practice Contact & Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-700">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start gap-3 shadow-2xs">
            <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900 font-semibold mb-1 text-sm">Clinical Practice Location</strong>
              <p className="text-stone-500 leading-relaxed">{CLINICAL_PROVIDER.clinicAddress}</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start gap-3 shadow-2xs">
            <Phone className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900 font-semibold mb-1 text-sm">Direct Clinical Phone</strong>
              <p className="text-stone-500">{CLINICAL_PROVIDER.clinicPhone}</p>
              <p className="text-[11px] text-stone-400 mt-1">Mon–Fri: 8:30 AM – 5:30 PM EST</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 flex items-start gap-3 shadow-2xs">
            <Mail className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-stone-900 font-semibold mb-1 text-sm">HIPAA-Secure Inquiries</strong>
              <p className="text-stone-500">{CLINICAL_PROVIDER.clinicEmail}</p>
              <p className="text-[11px] text-stone-400 mt-1">Typical response within 1 business day</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
