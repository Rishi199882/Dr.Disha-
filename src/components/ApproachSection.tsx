import React from 'react';
import { 
  ClipboardList, 
  Dna, 
  TrendingUp, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageCircle,
  FileCheck
} from 'lucide-react';

export const ApproachSection: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const steps = [
    {
      number: '01',
      title: 'Comprehensive Intake & Biomarker Assessment',
      subtitle: 'Understanding your whole physiological picture',
      description: 'We begin with a deep exploration of your 10-year metabolic background, recent blood labs, gastrointestinal symptom chronicity, medication/supplement depletions, daily stress rhythms, and personal wellness goals.',
      icon: <ClipboardList className="w-6 h-6 text-emerald-800" />,
      deliverables: [
        'Detailed lab biomarker audit (Fasting insulin, lipid panels, HbA1c, CRP)',
        'Symptom-to-food correlation mapping',
        'GI barrier integrity & digestive enzyme evaluation'
      ]
    },
    {
      number: '02',
      title: 'Bio-Individual Nutrition Strategy Formulation',
      subtitle: 'Science-backed food architecture tailored to your life',
      description: 'No generic templated diets. Dr. Disha designs a customized meal architecture calibrated to your metabolic thresholds, cultural food preferences, culinary abilities, and family dynamics.',
      icon: <Dna className="w-6 h-6 text-emerald-800" />,
      deliverables: [
        'Personalized daily protein, fat, fiber & carbohydrate targets',
        'Strategic meal sequencing to prevent glucose spikes',
        'Curated grocery shopping lists & practical dining-out guides'
      ]
    },
    {
      number: '03',
      title: 'Continuous Telehealth Guidance & Habit Calibration',
      subtitle: 'Real-time adjustments without judgment or restriction',
      description: 'Lasting health is built on continuous support. Through regular 1-on-1 video consultations and our HIPAA-secure patient portal, we review your biometrics, food logs, and symptom patterns to fine-tune your protocol.',
      icon: <TrendingUp className="w-6 h-6 text-emerald-800" />,
      deliverables: [
        'Bi-weekly or monthly telehealth consultations',
        'Continuous glucose telemetry interpretation & food diary analysis',
        'Supplement protocol calibration as your biomarkers improve'
      ]
    },
    {
      number: '04',
      title: 'Lifelong Metabolic Flexibility & Sustained Vitality',
      subtitle: 'Confidence, food freedom, and resilient health',
      description: 'Our ultimate goal is self-efficacy. You will understand how your unique body responds to different foods, eliminating diet confusion and fostering a confident, joyful relationship with food that lasts a lifetime.',
      icon: <Heart className="w-6 h-6 text-emerald-800" />,
      deliverables: [
        'Metabolic flexibility without chronic restriction',
        'Long-term maintenance blueprints for travel, holidays, and stress',
        'Zero-diet-culture empowerment and lifelong vitality'
      ]
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-stone-200" id="approach">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Dr. Disha Nutrition Care Method</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-stone-900 tracking-tight">
            How Personalized Clinical Nutrition Care Works
          </h2>
          <p className="text-base text-stone-600 mt-4 leading-relaxed">
            Our evidence-informed, four-stage clinical methodology transforms complex biochemical data into practical, sustainable daily eating habits.
          </p>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:border-emerald-700/50 hover:shadow-md transition-all relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-mono-numbers text-2xl font-bold text-emerald-800/40 group-hover:text-emerald-800 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-[11px] font-medium text-emerald-800 mb-3">
                  {step.subtitle}
                </p>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-stone-200/60">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
                    Key Outcomes & Focus:
                  </div>
                  {step.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-stone-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-200/60 text-[11px] font-semibold text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Phase {step.number} Milestone</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Care Commitments Strip */}
        <div className="mt-16 p-8 bg-gradient-to-r from-emerald-900 to-teal-950 rounded-3xl text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                Our Non-Negotiable Clinical Promise
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                Compassionate, Science-Driven, and 100% Free from Diet-Culture Dogma.
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                We believe health is not defined by chronic calorie deprivation or moralizing food. We partner with you as an ally—honoring your cultural food heritage, listening with empathy, and formulating sustainable nutrition plans grounded in peer-reviewed physiological science.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={onBookClick}
                className="w-full py-3.5 px-6 bg-white hover:bg-stone-100 text-emerald-950 font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Initial Assessment</span>
                <ArrowRight className="w-4 h-4 text-emerald-800" />
              </button>
              
              <div className="text-[11px] text-emerald-200/80 text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Superbills for Insurance & HSA/FSA Accepted</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
