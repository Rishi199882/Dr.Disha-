import React from 'react';
import { CLINICAL_PROVIDER } from '../data/mockData';
import { ShieldCheck, Heart, PlayCircle, Wrench, Percent, LogIn } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenHipaa: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenHipaa
}) => {
  return (
    <footer className="bg-white border-t border-stone-200 mt-20 text-xs text-stone-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-800 text-stone-100 flex items-center justify-center font-serif text-sm font-semibold">
                D
              </span>
              <span className="font-serif-display text-base font-semibold text-stone-900">
                Dr. Disha
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Clinical Nutrition & Functional Medicine Dietetics. Specialized in metabolic remission, gut microbiome restoration, and precision biomarker medicine. Flexible EMI plans available.
            </p>
            <div className="text-[10px] text-stone-400 font-mono-numbers">
              NPI: {CLINICAL_PROVIDER.npi} · Tax ID: {CLINICAL_PROVIDER.taxId}
            </div>
          </div>

          {/* Clinical Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              Clinical Services
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-stone-900 transition-colors">
                  Initial Clinical Assessment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-stone-900 transition-colors">
                  Gut Microbiome Protocol
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-stone-900 transition-colors">
                  Metabolic & CGM Tuning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-stone-900 transition-colors flex items-center gap-1">
                  <Percent className="w-3 h-3 text-emerald-800" />
                  <span>Flexible 0% EMI Installments</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Patient Portal & Resources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              Patient Portal & Resources
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-stone-900 transition-colors flex items-center gap-1 text-emerald-800 font-semibold">
                  <LogIn className="w-3 h-3" />
                  <span>Patient Portal Sign In</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('video')} className="hover:text-stone-900 transition-colors flex items-center gap-1 text-emerald-800 font-medium">
                  <PlayCircle className="w-3 h-3" />
                  <span>Lifestyle Importance Video</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools')} className="hover:text-stone-900 transition-colors flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  <span>Drug-Nutrient & Fasting Tools</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recipes')} className="hover:text-stone-900 transition-colors">
                  Dr. Disha Clinical Recipes
                </button>
              </li>
              <li>
                <button onClick={onOpenHipaa} className="hover:text-stone-900 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-800" />
                  <span>HIPAA 256-Bit Vault & NPP</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              Consultation Clinic
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              {CLINICAL_PROVIDER.clinicAddress}
            </p>
            <p className="text-[11px] text-stone-500 font-mono-numbers">
              Phone: {CLINICAL_PROVIDER.clinicPhone}<br />
              Secure Email: {CLINICAL_PROVIDER.clinicEmail}
            </p>
          </div>

        </div>

        {/* Medical & Emergency Disclaimer */}
        <div className="mt-10 pt-6 border-t border-stone-200 text-[10px] text-stone-500 leading-relaxed space-y-2">
          <p>
            <strong>Medical Disclaimer:</strong> The clinical information, recipes, and dietary protocols provided on this site are for therapeutic nutrition education and patient management under the guidance of Dr. Disha, MS, RDN, CDN. This service is not an emergency response service. If you are experiencing a medical emergency, call 911 or visit your nearest emergency room immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-stone-400 pt-2 gap-2">
            <span>&copy; {new Date().getFullYear()} Dr. Disha Clinical Nutrition & Functional Medicine. All rights reserved.</span>
            <span>HIPAA 45 CFR Part 164 Compliant · Zero PHI Tracking</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
