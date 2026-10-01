import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Clock, 
  Timer, 
  Activity, 
  AlertCircle, 
  Check, 
  RotateCcw, 
  Play, 
  Pause, 
  Printer, 
  HeartPulse, 
  Sparkles, 
  Flame, 
  Dna,
  ShieldCheck,
  FileBadge
} from 'lucide-react';
import { MOCK_DRUG_NUTRIENTS, CLINICAL_PROVIDER } from '../data/mockData';
import { PatientProfile } from '../types/nutrition';

interface ClinicalToolsSectionProps {
  activePatient: PatientProfile;
}

export const ClinicalToolsSection: React.FC<ClinicalToolsSectionProps> = ({ activePatient }) => {
  const [activeTool, setActiveTool] = useState<'drug-depletion' | 'fasting-timer' | 'bristol-guide' | 'emergency-card'>('drug-depletion');

  // Drug Nutrient State
  const [selectedDrugIndex, setSelectedDrugIndex] = useState(0);

  // Fasting Tracker State
  const [fastingTargetHours, setFastingTargetHours] = useState<number>(16);
  const [fastingElapsedSeconds, setFastingElapsedSeconds] = useState<number>(14 * 3600 + 24 * 60); // 14h 24m
  const [isFastingActive, setIsFastingActive] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (isFastingActive) {
      interval = setInterval(() => {
        setFastingElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFastingActive]);

  const fastingProgressPct = Math.min(100, Math.round((fastingElapsedSeconds / (fastingTargetHours * 3600)) * 100));

  const formatHoursMins = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Bristol Stool Guide
  const [selectedBristol, setSelectedBristol] = useState<number>(4);
  const bristolDescriptions = [
    { type: 1, title: 'Separate hard lumps, like nuts', transit: 'Very Slow (72+ hrs)', interpretation: 'Severe constipation; indicate dehydration and sluggish colonic motility. Dr. Disha recommends magnesium citrate + 800mL warm water.' },
    { type: 2, title: 'Sausage-shaped but lumpy', transit: 'Slow (48-72 hrs)', interpretation: 'Mild constipation; insufficient dietary soluble fiber. Add 2 tbsp ground golden flaxseed.' },
    { type: 3, title: 'Like a sausage with cracks on surface', transit: 'Normal (36-48 hrs)', interpretation: 'Healthy normal stool; adequate mucosal hydration.' },
    { type: 4, title: 'Smooth and soft, like a snake (Ideal)', transit: 'Optimal (24-36 hrs)', interpretation: 'Gold standard clinical target. Indicates healthy gut microbiome, active short-chain fatty acids (SCFAs), and robust intestinal lining.' },
    { type: 5, title: 'Soft blobs with clear-cut edges', transit: 'Fast (18-24 hrs)', interpretation: 'Lacking dietary fiber bulking; common with stress or high caffeine intake.' },
    { type: 6, title: 'Fluffy pieces with ragged edges, mushy', transit: 'Very Fast (12-18 hrs)', interpretation: 'Mild diarrhea; potential osmotic pull from excess sugar alcohols or food sensitivities (SIBO/FODMAP).' },
    { type: 7, title: 'Watery, no solid pieces (Entirely liquid)', transit: 'Rapid (<12 hrs)', interpretation: 'Inflammatory colonic hypermotility or acute bacterial dysbiosis. Requires electrolyte replacement.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          Evidence-Based Diagnostics & Bio-Hacking Console
        </div>
        <h2 className="font-serif-display text-3xl font-bold text-stone-900">
          Dr. Disha Clinical Precision Tools
        </h2>
        <p className="text-sm text-stone-600 mt-2">
          Clinical drug-nutrient interaction screening, circadian intermittent fasting timer with autophagy milestones, and medical identification cards.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTool('drug-depletion')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTool === 'drug-depletion' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Drug-Nutrient Depletion Checker</span>
        </button>

        <button
          onClick={() => setActiveTool('fasting-timer')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTool === 'fasting-timer' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Fasting Tracker & Autophagy Timer</span>
        </button>

        <button
          onClick={() => setActiveTool('bristol-guide')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTool === 'bristol-guide' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Bristol Stool Motility Analyzer</span>
        </button>

        <button
          onClick={() => setActiveTool('emergency-card')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTool === 'emergency-card' ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileBadge className="w-3.5 h-3.5" />
          <span>Patient Emergency Health Card</span>
        </button>
      </div>

      {/* TOOL 1: DRUG-NUTRIENT DEPLETION CHECKER */}
      {activeTool === 'drug-depletion' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Prescription Medication & Micronutrient Depletion Matrix
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Pharmaceuticals frequently bind or accelerate clearance of essential co-factors. Select a medication class to see Dr. Disha&apos;s recommended dietary repletion protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">Select Common Prescription:</span>
              {MOCK_DRUG_NUTRIENTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDrugIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedDrugIndex === idx
                      ? 'border-emerald-800 bg-emerald-50/70 font-semibold text-stone-900 ring-2 ring-emerald-800/20'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  <div className="text-stone-900 font-semibold">{item.drugClass}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{item.commonMedications.join(', ')}</div>
                </button>
              ))}
            </div>

            <div className="md:col-span-2 bg-stone-50 rounded-xl p-6 border border-stone-200/80 space-y-4 text-xs">
              <div className="border-b border-stone-200 pb-3">
                <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">Depleted Essential Nutrients</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {MOCK_DRUG_NUTRIENTS[selectedDrugIndex].depletedNutrients.map((n, i) => (
                    <span key={i} className="px-2.5 py-1 bg-rose-100 text-rose-800 font-semibold rounded-md">
                      &darr; {n}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-stone-800 uppercase tracking-wider text-[10px]">Pharmacological Mechanism:</span>
                <p className="text-stone-600 leading-relaxed">{MOCK_DRUG_NUTRIENTS[selectedDrugIndex].physiologicalMechanism}</p>
              </div>

              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-semibold text-emerald-950 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Dr. Disha Clinical Nutrition Intervention:</span>
                </span>
                <p className="text-stone-800 leading-relaxed font-medium">{MOCK_DRUG_NUTRIENTS[selectedDrugIndex].clinicalDietaryIntervention}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: FASTING TRACKER & AUTOPHAGY TIMER */}
      {activeTool === 'fasting-timer' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                Intermittent Fasting & Cellular Autophagy Countdown
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Tracks digestive rest duration, liver glycogen depletion, and AMPK activation.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[14, 16, 18, 20].map(hrs => (
                <button
                  key={hrs}
                  onClick={() => setFastingTargetHours(hrs)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono-numbers transition-colors ${
                    fastingTargetHours === hrs
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {hrs}:{(24 - hrs)} Fast
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Countdown Circle */}
            <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-3">
              <span className="text-[10px] uppercase font-semibold text-stone-400 font-mono tracking-wider">
                Elapsed Fasting Window
              </span>
              <div className="font-serif-display text-4xl font-bold text-stone-900 font-mono-numbers">
                {formatHoursMins(fastingElapsedSeconds)}
              </div>
              <div className="w-full h-3 rounded-full bg-stone-200 overflow-hidden">
                <div className="h-full bg-emerald-700 transition-all duration-500" style={{ width: `${fastingProgressPct}%` }} />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-stone-500">
                <span>{fastingProgressPct}% Complete</span>
                <span>Target: {fastingTargetHours}h 00m</span>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsFastingActive(!isFastingActive)}
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 flex items-center gap-1.5"
                >
                  {isFastingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isFastingActive ? 'Pause Fast' : 'Resume Fast'}</span>
                </button>
                <button
                  onClick={() => setFastingElapsedSeconds(0)}
                  className="p-2 text-stone-500 hover:bg-stone-200 rounded-lg"
                  title="Reset Fast"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Physiological Milestones */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <span className="font-semibold text-stone-800 uppercase tracking-wider text-[11px]">
                Metabolic Milestone Stages (Dr. Disha Functional Guidance):
              </span>

              <div className={`p-3 rounded-xl border flex items-center gap-3 ${fastingElapsedSeconds >= 8 * 3600 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="block text-stone-900">08 - 12 Hours: Glycogen Depletion & Insulin Clearance</strong>
                  <span className="text-[11px] text-stone-600">Circulating insulin drops to basal baseline; body transitions from glucose utilization to lipolytic fatty acid oxidation.</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 ${fastingElapsedSeconds >= 14 * 3600 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="block text-stone-900">14 - 16 Hours: AMPK Activation & Autophagy Initiation</strong>
                  <span className="text-[11px] text-stone-600">Mitochondrial quality control; cellular clearing of senescent proteins and intracellular metabolic debris.</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border flex items-center gap-3 ${fastingElapsedSeconds >= 18 * 3600 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-400'}`}>
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <strong className="block text-stone-900">18+ Hours: Deep Ketogenesis & Endothelial Healing</strong>
                  <span className="text-[11px] text-stone-600">Serum beta-hydroxybutyrate (BHB) ketones rise to therapeutic ranges, nourishing brain cortical tissue.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: BRISTOL STOOL MOTILITY ANALYZER */}
      {activeTool === 'bristol-guide' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Bristol Stool Form Scale & Colonic Motility Analyzer
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Colonic transit time and gut microbiome integrity are reflected directly in stool morphology. Click a type below to view Dr. Disha&apos;s clinical recommendations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {bristolDescriptions.map(b => (
              <button
                key={b.type}
                onClick={() => setSelectedBristol(b.type)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedBristol === b.type
                    ? 'border-emerald-800 bg-emerald-50 ring-2 ring-emerald-800/20 font-bold text-stone-900 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                }`}
              >
                <span className="text-xs font-mono font-bold block text-emerald-800">Type {b.type}</span>
                <span className="text-[10px] text-stone-500 block line-clamp-1 mt-1">{b.title}</span>
              </button>
            ))}
          </div>

          {/* Selected Type Diagnostic Card */}
          {(() => {
            const current = bristolDescriptions.find(b => b.type === selectedBristol) || bristolDescriptions[3];
            return (
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Selected Diagnostic: Type {current.type}
                    </span>
                    <h4 className="font-serif-display text-lg font-bold text-stone-900">{current.title}</h4>
                  </div>
                  <span className="px-3 py-1 bg-white border border-stone-200 rounded-lg font-mono-numbers text-stone-700 font-semibold">
                    Transit: {current.transit}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-stone-800 uppercase tracking-wider text-[10px]">Clinical Interpretation:</span>
                  <p className="text-stone-700 leading-relaxed">{current.interpretation}</p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TOOL 4: EMERGENCY MEDICAL QUICK-ACCESS CARD */}
      {activeTool === 'emergency-card' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                Patient Emergency Health & Clinical Contact Card
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Printable emergency wallet card summarizing primary physician, dietary allergies, and current medical nutrition therapies.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Wallet Card</span>
            </button>
          </div>

          {/* Wallet Card Frame */}
          <div className="max-w-md mx-auto bg-stone-900 text-white rounded-2xl p-6 border-2 border-emerald-500 shadow-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-stone-700 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Emergency Medical Nutrition Card</span>
                <div className="font-bold text-sm text-white font-sans">{activePatient.fullName}</div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                {activePatient.mrn}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-400 block text-[9px] uppercase font-sans">Attending Dietitian</span>
                <span className="text-white font-semibold font-sans">{CLINICAL_PROVIDER.name}</span>
                <span className="text-stone-400 block text-[9px]">NPI: {CLINICAL_PROVIDER.npi}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[9px] uppercase font-sans">Emergency Clinic Phone</span>
                <span className="text-emerald-400 font-semibold">{CLINICAL_PROVIDER.clinicPhone}</span>
                <span className="text-stone-400 block text-[9px]">care@drdisha-nutrition.com</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 space-y-1 text-[11px]">
              <span className="text-stone-400 text-[9px] uppercase font-sans block">Clinical Conditions & Allergies:</span>
              <div className="text-stone-200 font-sans">{activePatient.clinicalFocus}</div>
              <div className="text-rose-400 font-semibold font-sans">Known Allergies: Tree Nuts, Severe Lactose Sensitivity</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
