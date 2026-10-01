import React from 'react';
import { CLINICAL_PROVIDER } from '../data/mockData';
import { ShieldCheck, Heart, PlayCircle, Wrench, Percent, LogIn, Mail, MapPin, Phone, Calendar } from 'lucide-react';

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
              <span className="w-8 h-8 rounded-xl bg-emerald-800 text-stone-100 flex items-center justify-center font-serif text-base font-bold shadow-xs">
                D
              </span>
              <span className="font-serif-display text-base font-bold text-stone-900">
                Dr. Disha Clinical Nutrition
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Personalized medical nutrition therapy & functional dietetics. Specializing in metabolic health, gut-barrier restoration, and bio-individual meal design.
            </p>
            <div className="text-[10px] text-stone-400 font-mono-numbers">
              NPI: {CLINICAL_PROVIDER.npi} · NY CDN: {CLINICAL_PROVIDER.licenseNumber}
            </div>
          </div>

          {/* Practice Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              Practice & Methods
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-800 transition-colors cursor-pointer">
                  Practice Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-800 transition-colors cursor-pointer">
                  About Dr. Disha
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('specialties')} className="hover:text-emerald-800 transition-colors cursor-pointer">
                  Clinical Specialties
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('approach')} className="hover:text-emerald-800 transition-colors cursor-pointer">
                  Our 4-Step Care Method
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pricing')} className="hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer">
                  <Percent className="w-3 h-3 text-emerald-800" />
                  <span>Insurance & 0% EMI</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Patient Portal & Resources */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[10px]">
              Patient Care & Portal
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-emerald-800 transition-colors flex items-center gap-1 text-emerald-900 font-semibold cursor-pointer">
                  <LogIn className="w-3 h-3 text-emerald-800" />
                  <span>Patient Portal Sign In</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('video')} className="hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer">
                  <PlayCircle className="w-3 h-3 text-emerald-800" />
                  <span>Lifestyle Video Orientation</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recipes')} className="hover:text-emerald-800 transition-colors cursor-pointer">
                  Therapeutic Recipe Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tools')} className="hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer">
                  <Wrench className="w-3 h-3 text-emerald-800" />
                  <span>Clinical Fasting & Macro Tools</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenHipaa} className="hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer">
                  <ShieldCheck className="w-3 h-3 text-emerald-800" />
                  <span>HIPAA Notice of Privacy Practices</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Consultation & Contact */}
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
            <div className="pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Confidential Clinical Inquiry Form &rarr;</span>
              </button>
            </div>
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
