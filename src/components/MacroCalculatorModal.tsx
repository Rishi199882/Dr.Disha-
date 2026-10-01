import React, { useState } from 'react';
import { Calculator, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { PatientProfile } from '../types/nutrition';
import { StorageService } from '../services/storage';

interface MacroCalculatorModalProps {
  patient: PatientProfile;
  isOpen: boolean;
  onClose: () => void;
  onTargetUpdated?: () => void;
}

export const MacroCalculatorModal: React.FC<MacroCalculatorModalProps> = ({
  patient,
  isOpen,
  onClose,
  onTargetUpdated
}) => {
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [age, setAge] = useState<number>(40);
  const [weightLbs, setWeightLbs] = useState<number>(170);
  const [heightInches, setHeightInches] = useState<number>(65);
  const [activity, setActivity] = useState<number>(1.375); // Light active
  const [goal, setGoal] = useState<'deficit' | 'maintenance' | 'surplus'>('deficit');
  const [proteinRatio, setProteinRatio] = useState<number>(1.0); // 1.0g per lb of lean / target mass
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Mifflin-St Jeor formula calculation
  const weightKg = weightLbs * 0.453592;
  const heightCm = heightInches * 2.54;
  
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  if (gender === 'Male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  const tdee = Math.round(bmr * activity);

  let targetCalories = tdee;
  if (goal === 'deficit') targetCalories = Math.round(tdee * 0.80); // 20% deficit
  if (goal === 'surplus') targetCalories = Math.round(tdee * 1.15); // 15% surplus

  // Macros:
  // Protein: weightLbs * proteinRatio (e.g. ~110-140g)
  // Fat: 30% of total calories (9 kcal/g)
  // Carbs: Remaining calories / 4 kcal/g
  const targetProteinG = Math.round(Math.min(220, Math.max(90, weightLbs * 0.75)));
  const targetFatG = Math.round((targetCalories * 0.35) / 9);
  const remainingKcal = Math.max(0, targetCalories - (targetProteinG * 4) - (targetFatG * 9));
  const targetCarbsG = Math.round(remainingKcal / 4);

  const handleApplyToPatient = () => {
    const patients = StorageService.getPatients().map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          targetCalories,
          targetProteinG,
          targetCarbsG,
          targetFatG
        };
      }
      return p;
    });

    localStorage.setItem('nutri_patients_v1', JSON.stringify(patients));
    StorageService.addAuditLog('Dr. Elena Vance', 'UPDATE_BIOMETRICS', `/patients/${patient.id}/macro-targets`);
    setAppliedNotice(`Updated daily targets for ${patient.fullName}: ${targetCalories} kcal (${targetProteinG}g P / ${targetCarbsG}g C / ${targetFatG}g F)`);
    if (onTargetUpdated) onTargetUpdated();
    setTimeout(() => {
      setAppliedNotice(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Calculator className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                Clinical Energetics Formula
              </div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Mifflin-St Jeor Macro & Calorie Calculator
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {appliedNotice && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Biological Sex</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Weight (lbs)</label>
            <input
              type="number"
              value={weightLbs}
              onChange={(e) => setWeightLbs(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
            />
          </div>
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Height (inches)</label>
            <input
              type="number"
              value={heightInches}
              onChange={(e) => setHeightInches(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
            />
          </div>
        </div>

        <div className="text-xs space-y-3">
          <div>
            <label className="block text-stone-600 mb-1 font-medium">Activity Factor</label>
            <select
              value={activity}
              onChange={(e) => setActivity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
            >
              <option value={1.2}>Sedentary (Desk work, minimal exercise)</option>
              <option value={1.375}>Lightly Active (1-3 days/week exercise)</option>
              <option value={1.55}>Moderately Active (3-5 days/week exercise)</option>
              <option value={1.725}>Very Active (6-7 days/week hard exercise)</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-600 mb-1 font-medium">Clinical Therapeutic Goal</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
            >
              <option value="deficit">Metabolic Fat Loss & Euglycemia (-20% Deficit)</option>
              <option value="maintenance">Metabolic Equilibrium (Maintenance)</option>
              <option value="surplus">Athletic Mass & Performance Tuning (+15% Surplus)</option>
            </select>
          </div>
        </div>

        {/* Calculated Results Box */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-3 font-mono-numbers">
          <div className="flex justify-between text-stone-600 border-b border-stone-200 pb-2">
            <span>BMR (Basal Metabolic Rate):</span>
            <span className="font-bold">{Math.round(bmr)} kcal</span>
          </div>
          <div className="flex justify-between text-stone-600 border-b border-stone-200 pb-2">
            <span>TDEE (Maintenance):</span>
            <span className="font-bold">{tdee} kcal</span>
          </div>
          <div className="flex justify-between text-emerald-900 font-bold text-sm">
            <span>Prescribed Daily Caloric Target:</span>
            <span>{targetCalories} kcal</span>
          </div>

          {/* Gram Breakdown */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-sans">Protein</span>
              <span className="font-bold text-emerald-800">{targetProteinG}g</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-sans">Net Carbs</span>
              <span className="font-bold text-stone-800">{targetCarbsG}g</span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-sans">Fat</span>
              <span className="font-bold text-stone-800">{targetFatG}g</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyToPatient}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Apply Targets to {patient.fullName}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
