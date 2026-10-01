import React, { useState } from 'react';
import { 
  Activity, 
  Droplet, 
  Flame, 
  Pill, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  Smile, 
  Check, 
  Trash2, 
  Calendar, 
  FileText,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  PatientProfile, 
  BiometricLog, 
  FoodDiaryItem, 
  HydrationLog, 
  SupplementProtocol, 
  SymptomLog 
} from '../types/nutrition';
import { StorageService } from '../services/storage';

interface PatientPortalProps {
  patient: PatientProfile;
  onRefreshData?: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ patient, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'biometrics' | 'food-diary' | 'supplements' | 'symptoms'>('overview');
  const todayStr = new Date().toISOString().split('T')[0];

  // Local state sourced from StorageService
  const [biometrics, setBiometrics] = useState<BiometricLog[]>(() => StorageService.getBiometrics(patient.id));
  const [foodLogs, setFoodLogs] = useState<FoodDiaryItem[]>(() => StorageService.getFoodLogs(patient.id, todayStr));
  const [hydration, setHydration] = useState<HydrationLog>(() => StorageService.getHydration(patient.id, todayStr));
  const [supplements, setSupplements] = useState<SupplementProtocol[]>(() => StorageService.getSupplements(patient.id));
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(() => StorageService.getSymptoms(patient.id));

  // Chart Metric Selection
  const [selectedMetric, setSelectedMetric] = useState<'glucose' | 'weight' | 'bodyFat' | 'systolic'>('glucose');

  // Modals
  const [showAddBiometric, setShowAddBiometric] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);
  const [showAddSymptom, setShowAddSymptom] = useState(false);

  // New Biometric Form State
  const [newBio, setNewBio] = useState({
    date: todayStr,
    weightLbs: 169.0,
    bodyFatPct: 30.0,
    fastingGlucoseMgDl: 92,
    systolicBp: 118,
    diastolicBp: 76,
    waistInches: 32.5,
    notes: 'Morning measurement post 12h overnight fast.'
  });

  // New Food Form State
  const [newFood, setNewFood] = useState({
    mealType: 'lunch' as const,
    title: '',
    portion: '1 serving',
    calories: 350,
    protein: 25,
    carbs: 30,
    fat: 12
  });

  // New Symptom Form State
  const [newSymptom, setNewSymptom] = useState<SymptomLog>({
    id: '',
    patientId: patient.id,
    date: todayStr,
    energyLevel: 8,
    digestiveDistressScore: 1,
    bristolStoolType: 4,
    bloatingLevel: 'None',
    sleepHours: 7.5,
    notes: 'Steady mental focus, zero cravings after balanced protein lunch.'
  });

  // Hydration Quick Action
  const handleAddWater = (deltaMl: number) => {
    const updated = StorageService.addHydration(patient.id, todayStr, deltaMl);
    setHydration(updated);
  };

  // Supplement Toggle
  const handleToggleSupplement = (id: string, slot: string) => {
    const key = `${todayStr}_${slot}`;
    StorageService.toggleSupplement(id, key);
    setSupplements(StorageService.getSupplements(patient.id));
  };

  // Save Biometric
  const handleSaveBiometric = (e: React.FormEvent) => {
    e.preventDefault();
    const log: BiometricLog = {
      id: `bio-${Date.now()}`,
      patientId: patient.id,
      ...newBio
    };
    StorageService.addBiometricLog(log);
    setBiometrics(StorageService.getBiometrics(patient.id));
    setShowAddBiometric(false);
  };

  // Save Food
  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFood.title) return;
    const item: FoodDiaryItem = {
      id: `food-${Date.now()}`,
      patientId: patient.id,
      date: todayStr,
      ...newFood,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    StorageService.addFoodLog(item);
    setFoodLogs(StorageService.getFoodLogs(patient.id, todayStr));
    setNewFood({ mealType: 'lunch', title: '', portion: '1 serving', calories: 350, protein: 25, carbs: 30, fat: 12 });
    setShowAddFood(false);
  };

  // Delete Food
  const handleDeleteFood = (id: string) => {
    StorageService.deleteFoodLog(id);
    setFoodLogs(StorageService.getFoodLogs(patient.id, todayStr));
  };

  // Save Symptom
  const handleSaveSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    const log: SymptomLog = {
      ...newSymptom,
      id: `sym-${Date.now()}`,
      patientId: patient.id
    };
    StorageService.addSymptomLog(log);
    setSymptoms(StorageService.getSymptoms(patient.id));
    setShowAddSymptom(false);
  };

  // Calculate consumed calories & macros for today
  const consumedCalories = foodLogs.reduce((acc, f) => acc + f.calories, 0);
  const consumedProtein = foodLogs.reduce((acc, f) => acc + f.protein, 0);
  const consumedCarbs = foodLogs.reduce((acc, f) => acc + f.carbs, 0);
  const consumedFat = foodLogs.reduce((acc, f) => acc + f.fat, 0);

  const caloriePct = Math.min(100, Math.round((consumedCalories / patient.targetCalories) * 100));
  const waterPct = Math.min(100, Math.round((hydration.currentMl / hydration.targetMl) * 100));

  // Biometrics Chart Data prep
  const chartData = biometrics.map(b => {
    let val = b.fastingGlucoseMgDl;
    if (selectedMetric === 'weight') val = b.weightLbs;
    if (selectedMetric === 'bodyFat') val = b.bodyFatPct;
    if (selectedMetric === 'systolic') val = b.systolicBp;
    return {
      date: b.date.substring(5), // MM-DD
      val,
      raw: b
    };
  });

  const minVal = chartData.length > 0 ? Math.min(...chartData.map(d => d.val)) * 0.95 : 0;
  const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.val)) * 1.05 : 100;
  const range = maxVal - minVal || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Patient Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm font-serif">
              {patient.fullName.split(' ').map(n => n[0]).join('')}
            </span>
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-stone-900">
                {patient.fullName}
              </h2>
              <p className="text-xs text-stone-500 font-mono-numbers">
                MRN: {patient.mrn} · DOB: {patient.dob} ({patient.gender})
              </p>
            </div>
          </div>
          <p className="text-xs text-emerald-900 bg-emerald-50 inline-block px-2.5 py-1 rounded-md font-medium mt-2">
            Clinical Focus: {patient.clinicalFocus}
          </p>
        </div>

        {/* Targets Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numbers bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
          <div>
            <span className="text-stone-400 block text-[10px]">Target Kcal</span>
            <span className="font-bold text-stone-800">{patient.targetCalories}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Target Protein</span>
            <span className="font-bold text-emerald-800">{patient.targetProteinG}g</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Target Carbs</span>
            <span className="font-bold text-stone-800">{patient.targetCarbsG}g</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Hydration Goal</span>
            <span className="font-bold text-blue-700">{patient.targetWaterMl}mL</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Daily Overview
        </button>
        <button
          onClick={() => setActiveTab('biometrics')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'biometrics'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Biometrics & Glycemic Charts ({biometrics.length})
        </button>
        <button
          onClick={() => setActiveTab('food-diary')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'food-diary'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Food & Hydration Diary ({foodLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('supplements')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'supplements'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Supplement Adherence ({supplements.length})
        </button>
        <button
          onClick={() => setActiveTab('symptoms')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'symptoms'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Symptom & Energy Journal
        </button>
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Daily Energy & Macro Ring */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Today&apos;s Caloric Intake</span>
                <span className="text-xs font-mono-numbers text-stone-500">{consumedCalories} / {patient.targetCalories} kcal</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                <div 
                  className="h-full bg-emerald-700 rounded-full transition-all duration-500" 
                  style={{ width: `${caloriePct}%` }}
                />
              </div>

              {/* Macro breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono-numbers">
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] text-stone-400">Protein</div>
                  <div className="font-bold text-emerald-800">{consumedProtein}g</div>
                  <div className="text-[10px] text-stone-400">Target: {patient.targetProteinG}g</div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] text-stone-400">Net Carbs</div>
                  <div className="font-bold text-stone-800">{consumedCarbs}g</div>
                  <div className="text-[10px] text-stone-400">Target: {patient.targetCarbsG}g</div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                  <div className="text-[10px] text-stone-400">Healthy Fat</div>
                  <div className="font-bold text-stone-800">{consumedFat}g</div>
                  <div className="text-[10px] text-stone-400">Target: {patient.targetFatG}g</div>
                </div>
              </div>
            </div>

            {/* Hydration Tracker Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Hydration Tracker</span>
                <span className="text-xs font-mono-numbers text-blue-700">{hydration.currentMl} / {hydration.targetMl} mL</span>
              </div>

              <div className="w-full h-3 rounded-full bg-stone-100 overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${waterPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>{waterPct}% of daily clinical target</span>
                <span>8-Glass Standard</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleAddWater(250)}
                  className="flex-1 py-2 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>+250 mL (1 Glass)</span>
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="flex-1 py-2 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>+500 mL (Bottle)</span>
                </button>
              </div>
            </div>

            {/* Quick Actions & Clinical Note */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Quick Actions</span>

              <div className="space-y-2">
                <button
                  onClick={() => setShowAddBiometric(true)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-800" />
                    <span>Log Fasting Glucose / Weight</span>
                  </span>
                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setShowAddFood(true)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-emerald-800" />
                    <span>Log Today&apos;s Meal</span>
                  </span>
                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                </button>

                <button
                  onClick={() => setShowAddSymptom(true)}
                  className="w-full py-2.5 px-3 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Smile className="w-4 h-4 text-emerald-800" />
                    <span>Record Energy & GI Symptoms</span>
                  </span>
                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                </button>
              </div>
            </div>

          </div>

          {/* Today's Meals Quick List */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-display text-lg font-semibold text-stone-900">
                Today&apos;s Nutrition Diary Entries ({foodLogs.length})
              </h3>
              <button
                onClick={() => setShowAddFood(true)}
                className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Entry</span>
              </button>
            </div>

            {foodLogs.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No meals logged yet today. Use the recipe blog or quick add above.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foodLogs.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-stone-100 bg-stone-50 flex items-start justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                        {item.mealType} · {item.loggedAt}
                      </span>
                      <h4 className="font-semibold text-stone-900 mt-0.5">{item.title}</h4>
                      <p className="text-stone-400 text-[11px] font-mono-numbers">
                        {item.portion} · {item.protein}g protein · {item.carbs}g carbs · {item.fat}g fat
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono-numbers text-stone-800 block">{item.calories} kcal</span>
                      <button
                        onClick={() => handleDeleteFood(item.id)}
                        className="text-stone-400 hover:text-rose-700 mt-1"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: BIOMETRICS & CHARTS */}
      {activeTab === 'biometrics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
            
            {/* Header & Metric Picker */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-display text-xl font-semibold text-stone-900">
                  Biometric Response & Glycemic Tracking
                </h3>
                <p className="text-xs text-stone-500">
                  Clinical trends plotted against Dr. Vance&apos;s functional reference zones.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setSelectedMetric('glucose')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedMetric === 'glucose' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Glucose (mg/dL)
                  </button>
                  <button
                    onClick={() => setSelectedMetric('weight')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedMetric === 'weight' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Weight (lbs)
                  </button>
                  <button
                    onClick={() => setSelectedMetric('bodyFat')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedMetric === 'bodyFat' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-stone-600'
                    }`}
                  >
                    Body Fat %
                  </button>
                </div>

                <button
                  onClick={() => setShowAddBiometric(true)}
                  className="px-3 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Entry</span>
                </button>
              </div>
            </div>

            {/* Interactive SVG Trend Chart */}
            <div className="relative h-64 w-full bg-stone-50/50 rounded-xl border border-stone-200/80 p-4">
              {/* Reference Target Range Indicator */}
              {selectedMetric === 'glucose' && (
                <div className="absolute top-8 right-6 text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded font-mono-numbers">
                  Target Fasting: &lt; 99 mg/dL
                </div>
              )}

              {chartData.length > 1 ? (
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#065f46" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#065f46" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="45" x2="500" y2="45" stroke="#e7e5e4" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="#e7e5e4" strokeDasharray="3 3" />
                  <line x1="0" y1="135" x2="500" y2="135" stroke="#e7e5e4" strokeDasharray="3 3" />

                  {/* Area fill */}
                  <polygon
                    points={`
                      0,180
                      ${chartData.map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 500;
                        const y = 180 - ((d.val - minVal) / range) * 150;
                        return `${x},${y}`;
                      }).join(' ')}
                      500,180
                    `}
                    fill="url(#chartGradient)"
                  />

                  {/* Trend line */}
                  <polyline
                    fill="none"
                    stroke="#047857"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.map((d, i) => {
                      const x = (i / (chartData.length - 1)) * 500;
                      const y = 180 - ((d.val - minVal) / range) * 150;
                      return `${x},${y}`;
                    }).join(' ')}
                  />

                  {/* Point circles & labels */}
                  {chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 500;
                    const y = 180 - ((d.val - minVal) / range) * 150;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4.5" fill="#065f46" stroke="#ffffff" strokeWidth="2" />
                        <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fill="#292524" fontWeight="600" fontFamily="monospace">
                          {d.val}
                        </text>
                        <text x={x} y="175" textAnchor="middle" fontSize="9" fill="#78716c">
                          {d.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">
                  Need at least 2 entries to display clinical progression curve.
                </div>
              )}
            </div>

            {/* Historical Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-numbers">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-sans uppercase tracking-wider text-[10px]">
                    <th className="py-2.5">Date</th>
                    <th className="py-2.5">Weight (lbs)</th>
                    <th className="py-2.5">Body Fat %</th>
                    <th className="py-2.5">Fasting Glucose</th>
                    <th className="py-2.5">Blood Pressure</th>
                    <th className="py-2.5">Waist (in)</th>
                    <th className="py-2.5">Clinical Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {biometrics.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-2.5 font-medium">{b.date}</td>
                      <td className="py-2.5 font-semibold text-emerald-800">{b.weightLbs}</td>
                      <td className="py-2.5">{b.bodyFatPct}%</td>
                      <td className="py-2.5">
                        <span className={`px-1.5 py-0.5 rounded ${b.fastingGlucoseMgDl < 100 ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-amber-100 text-amber-800'}`}>
                          {b.fastingGlucoseMgDl} mg/dL
                        </span>
                      </td>
                      <td className="py-2.5">{b.systolicBp}/{b.diastolicBp}</td>
                      <td className="py-2.5">{b.waistInches}&quot;</td>
                      <td className="py-2.5 font-sans text-stone-500 max-w-xs truncate">{b.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 3: FOOD & HYDRATION DIARY */}
      {activeTab === 'food-diary' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-xl font-semibold text-stone-900">
                Daily Food & Cellular Hydration Log
              </h3>
              <p className="text-xs text-stone-500">
                Date: {todayStr} · Macro Target: {patient.targetProteinG}g P / {patient.targetCarbsG}g C / {patient.targetFatG}g F
              </p>
            </div>
            <button
              onClick={() => setShowAddFood(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal</span>
            </button>
          </div>

          <div className="space-y-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(type => {
              const items = foodLogs.filter(f => f.mealType === type);
              const subCal = items.reduce((a, b) => a + b.calories, 0);
              const subProt = items.reduce((a, b) => a + b.protein, 0);

              return (
                <div key={type} className="border border-stone-200 rounded-xl p-4 bg-stone-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                    <span className="text-xs uppercase font-semibold text-stone-800 tracking-wider">
                      {type}
                    </span>
                    <span className="text-xs font-mono-numbers text-stone-500">
                      Subtotal: {subCal} kcal · {subProt}g protein
                    </span>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No {type} logged.</p>
                  ) : (
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-lg border border-stone-200/80 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-medium text-stone-900">{item.title}</span>
                            <span className="text-stone-400 ml-2 font-mono-numbers">({item.portion})</span>
                            <span className="text-stone-400 text-[11px] block font-mono-numbers">
                              P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g · Logged at {item.loggedAt}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold font-mono-numbers text-stone-800">{item.calories} kcal</span>
                            <button
                              onClick={() => handleDeleteFood(item.id)}
                              className="text-stone-400 hover:text-rose-700"
                              title="Delete entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: SUPPLEMENT PROTOCOL */}
      {activeTab === 'supplements' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif-display text-xl font-semibold text-stone-900">
              Clinical Supplement & Micronutrient Protocol
            </h3>
            <p className="text-xs text-stone-500">
              Formulated by Dr. Elena Vance. Check off doses as ingested today ({todayStr}).
            </p>
          </div>

          <div className="space-y-3">
            {supplements.map(sup => {
              const morningChecked = sup.daysChecked[`${todayStr}_morning`] || false;
              const eveningChecked = sup.daysChecked[`${todayStr}_evening`] || false;

              return (
                <div key={sup.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-emerald-800" />
                      <h4 className="font-semibold text-stone-900 text-sm">{sup.name}</h4>
                      <span className="text-stone-500 font-mono-numbers font-medium">({sup.dosage})</span>
                    </div>
                    <p className="text-stone-600 text-[11px] leading-relaxed">{sup.purpose}</p>
                    <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider block">
                      Timing: {sup.timing}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleToggleSupplement(sup.id, 'morning')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                        morningChecked 
                          ? 'bg-emerald-800 text-white font-semibold' 
                          : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>AM Dose</span>
                    </button>

                    <button
                      onClick={() => handleToggleSupplement(sup.id, 'evening')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                        eveningChecked 
                          ? 'bg-emerald-800 text-white font-semibold' 
                          : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>PM Dose</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 5: SYMPTOMS & ENERGY */}
      {activeTab === 'symptoms' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-xl font-semibold text-stone-900">
                Symptom & Digestive Motility Journal
              </h3>
              <p className="text-xs text-stone-500">
                Tracks Bristol Stool Scale, bloating levels, sleep duration, and daily energy vitality.
              </p>
            </div>
            <button
              onClick={() => setShowAddSymptom(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Symptoms</span>
            </button>
          </div>

          <div className="space-y-3">
            {symptoms.map(s => (
              <div key={s.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="font-semibold text-stone-800 font-mono-numbers">{s.date}</span>
                  <div className="flex items-center gap-3 font-mono-numbers">
                    <span className="text-emerald-800 font-semibold">Energy: {s.energyLevel}/10</span>
                    <span className="text-amber-800">GI Distress: {s.digestiveDistressScore}/10</span>
                    <span className="text-stone-600">Bristol Type: {s.bristolStoolType}</span>
                    <span className="text-stone-600">Sleep: {s.sleepHours}h</span>
                  </div>
                </div>
                <p className="text-stone-600 italic leading-relaxed">&ldquo;{s.notes}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD BIOMETRIC MODAL */}
      {showAddBiometric && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveBiometric} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif-display text-lg font-bold text-stone-900">Log Clinical Biometric Entry</h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newBio.date}
                  onChange={(e) => setNewBio({ ...newBio, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newBio.weightLbs}
                  onChange={(e) => setNewBio({ ...newBio, weightLbs: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Fasting Glucose (mg/dL)</label>
                <input
                  type="number"
                  required
                  value={newBio.fastingGlucoseMgDl}
                  onChange={(e) => setNewBio({ ...newBio, fastingGlucoseMgDl: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  value={newBio.bodyFatPct}
                  onChange={(e) => setNewBio({ ...newBio, bodyFatPct: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Systolic BP</label>
                <input
                  type="number"
                  value={newBio.systolicBp}
                  onChange={(e) => setNewBio({ ...newBio, systolicBp: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Diastolic BP</label>
                <input
                  type="number"
                  value={newBio.diastolicBp}
                  onChange={(e) => setNewBio({ ...newBio, diastolicBp: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-stone-600 mb-1">Notes</label>
              <input
                type="text"
                value={newBio.notes}
                onChange={(e) => setNewBio({ ...newBio, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddBiometric(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                Save Biometric Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD FOOD MODAL */}
      {showAddFood && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveFood} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif-display text-lg font-bold text-stone-900">Log Meal Entry</h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-stone-600 mb-1">Meal Category</label>
                <select
                  value={newFood.mealType}
                  onChange={(e) => setNewFood({ ...newFood, mealType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Food / Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grilled Chicken & Quinoa Salad"
                  value={newFood.title}
                  onChange={(e) => setNewFood({ ...newFood, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Portion</label>
                  <input
                    type="text"
                    value={newFood.portion}
                    onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-600 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddFood(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                Add Food to Diary
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD SYMPTOM MODAL */}
      {showAddSymptom && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveSymptom} className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif-display text-lg font-bold text-stone-900">Record Daily Symptoms & Vitality</h3>

            <div className="text-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Energy Level (1 - 10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSymptom.energyLevel}
                    onChange={(e) => setNewSymptom({ ...newSymptom, energyLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">GI Distress (0 - 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newSymptom.digestiveDistressScore}
                    onChange={(e) => setNewSymptom({ ...newSymptom, digestiveDistressScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1">Bristol Stool Type (1-7)</label>
                  <select
                    value={newSymptom.bristolStoolType}
                    onChange={(e) => setNewSymptom({ ...newSymptom, bristolStoolType: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value={1}>Type 1: Hard lumps (constipation)</option>
                    <option value={2}>Type 2: Lumpy sausage</option>
                    <option value={3}>Type 3: Sausage with cracks</option>
                    <option value={4}>Type 4: Smooth & soft (Optimal)</option>
                    <option value={5}>Type 5: Soft blobs</option>
                    <option value={6}>Type 6: Mushy stool</option>
                    <option value={7}>Type 7: Liquid consistency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 mb-1">Sleep Duration (hrs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSymptom.sleepHours}
                    onChange={(e) => setNewSymptom({ ...newSymptom, sleepHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Notes / Specific Triggers</label>
                <textarea
                  rows={2}
                  value={newSymptom.notes}
                  onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddSymptom(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                Save Symptom Record
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
