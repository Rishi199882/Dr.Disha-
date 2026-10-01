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
  Info,
  Apple,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  HeartPulse,
  Wrench,
  Download,
  AlertCircle,
  ExternalLink
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
  onNavigateToTab?: (tab: string) => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ 
  patient, 
  onRefreshData,
  onNavigateToTab 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'care-plan' | 'biometrics' | 'food-diary' | 'supplements' | 'symptoms' | 'appointments'
  >('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    weightLbs: 168.5,
    bodyFatPct: 29.8,
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
    calories: 380,
    protein: 28,
    carbs: 32,
    fat: 14
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
    if (!newFood.title.trim()) return;
    const item: FoodDiaryItem = {
      id: `food-${Date.now()}`,
      patientId: patient.id,
      date: todayStr,
      ...newFood,
      loggedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    StorageService.addFoodLog(item);
    setFoodLogs(StorageService.getFoodLogs(patient.id, todayStr));
    setNewFood({ mealType: 'lunch', title: '', portion: '1 serving', calories: 380, protein: 28, carbs: 32, fat: 14 });
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

  // Calorie & macro consumption
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

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-4 h-4" /> },
    { id: 'care-plan', label: 'My Care Plan', icon: <FileText className="w-4 h-4" /> },
    { id: 'biometrics', label: 'Biometrics & CGM', icon: <TrendingUp className="w-4 h-4" />, count: biometrics.length },
    { id: 'food-diary', label: 'Food & Hydration', icon: <Apple className="w-4 h-4" />, count: foodLogs.length },
    { id: 'supplements', label: 'Supplements', icon: <Pill className="w-4 h-4" />, count: supplements.length },
    { id: 'symptoms', label: 'Symptom Journal', icon: <Smile className="w-4 h-4" /> },
    { id: 'appointments', label: 'Consultations', icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-stone-100/70 min-h-[calc(100vh-4rem)]">
      
      {/* Top Breadcrumb & Status Bar */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-medium text-emerald-900">Dr. Disha Clinical Care</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-stone-800">Patient Health Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="capitalize text-emerald-800 font-bold">{activeSubTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span className="font-semibold">{patient.fullName}</span>
              <span className="text-[10px] text-emerald-700 font-mono-numbers">({patient.mrn})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowAddFood(true)}
                className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-800" />
                <span>Log Meal</span>
              </button>
              <button
                onClick={() => setShowAddBiometric(true)}
                className="px-2.5 py-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Biometrics</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Collapsible Left Navigation Sidebar (Culina Health Style) */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
            
            {/* Patient Snapshot Mini Profile */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-serif">
                  {patient.fullName.split(' ').map(n => n[0]).join('')}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-900 text-xs sm:text-sm">
                    {patient.fullName}
                  </h3>
                  <div className="text-[10px] text-stone-500 font-mono-numbers">
                    MRN: {patient.mrn} · {patient.gender}
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-stone-200/60 text-[11px] text-emerald-900">
                <span className="font-medium block text-[10px] text-stone-400 uppercase tracking-wider">Clinical Focus</span>
                <span className="font-semibold leading-tight block mt-0.5">{patient.clinicalFocus}</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    activeSubTab === item.id
                      ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={activeSubTab === item.id ? 'text-white' : 'text-emerald-800'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-mono-numbers px-1.5 py-0.2 rounded-md ${
                      activeSubTab === item.id ? 'bg-emerald-700 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Links to Clinical EHR & Tools */}
            <div className="pt-4 border-t border-stone-100 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 px-3 mb-1">
                Clinical Records
              </div>
              {onNavigateToTab && (
                <>
                  <button
                    onClick={() => onNavigateToTab('ehr')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-stone-600 hover:text-emerald-800 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-stone-500" />
                      <span>EHR & Lab Records</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </button>
                  <button
                    onClick={() => onNavigateToTab('tools')}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-stone-600 hover:text-emerald-800 hover:bg-stone-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-stone-500" />
                      <span>Fasting & Macro Tools</span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-stone-400" />
                  </button>
                </>
              )}
            </div>

            {/* HIPAA Safeguard Note */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-[10px] text-stone-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>HIPAA 256-Bit SSL Encrypted Session</span>
            </div>

          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* SUBTAB 1: OVERVIEW DASHBOARD */}
            {activeSubTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Top Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Today's Calories</span>
                    <div className="font-mono-numbers text-xl font-bold text-stone-900">
                      {consumedCalories} <span className="text-xs font-normal text-stone-400">/ {patient.targetCalories} kcal</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden mt-2">
                      <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${caloriePct}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Protein Pacing</span>
                    <div className="font-mono-numbers text-xl font-bold text-emerald-800">
                      {consumedProtein}g <span className="text-xs font-normal text-stone-400">/ {patient.targetProteinG}g</span>
                    </div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      {Math.max(0, patient.targetProteinG - consumedProtein)}g remaining
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Hydration</span>
                    <div className="font-mono-numbers text-xl font-bold text-blue-700">
                      {hydration.currentMl} <span className="text-xs font-normal text-stone-400">/ {hydration.targetMl} mL</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden mt-2">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${waterPct}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Latest Fasting Glucose</span>
                    <div className="font-mono-numbers text-xl font-bold text-stone-900">
                      {biometrics[biometrics.length - 1]?.fastingGlucoseMgDl || 92} <span className="text-xs font-normal text-stone-400">mg/dL</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                      In Target Range (&lt;99 mg/dL)
                    </div>
                  </div>
                </div>

                {/* Next Appointment Alert & Strategy Card */}
                <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-800/80 px-2.5 py-0.5 rounded-md text-emerald-200">
                      <Calendar className="w-3 h-3" />
                      <span>Upcoming Clinical Follow-Up</span>
                    </div>
                    <h3 className="font-serif-display text-xl font-bold">
                      Biometric Reassessment with Dr. Disha
                    </h3>
                    <p className="text-xs text-emerald-100/90 max-w-xl leading-relaxed">
                      Scheduled for <strong>October 14, 2026 at 10:30 AM EST</strong> via HIPAA Telehealth. We will review your 14-day CGM glucose variability and gut symptom resolution markers.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab('booking')}
                      className="px-4 py-2.5 bg-white text-emerald-950 font-semibold rounded-xl text-xs shadow-xs hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      Reschedule or Book
                    </button>
                  </div>
                </div>

                {/* Two Column Grid: Today's Food Logs + Supplement Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Meals Logged Today */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Apple className="w-4 h-4 text-emerald-800" />
                        <h4 className="font-semibold text-stone-900 text-sm">Today's Meal Timeline</h4>
                      </div>
                      <button
                        onClick={() => setShowAddFood(true)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Meal</span>
                      </button>
                    </div>

                    {foodLogs.length === 0 ? (
                      <div className="py-8 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-100">
                        No meals logged yet today. Click &ldquo;Add Meal&rdquo; to record breakfast, lunch, or dinner.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {foodLogs.map((item) => (
                          <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-stone-800 capitalize flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-500">
                                  {item.mealType}
                                </span>
                                <span>{item.title}</span>
                              </div>
                              <div className="text-[11px] text-stone-500 mt-1 font-mono-numbers">
                                {item.calories} kcal · P: {item.protein}g · C: {item.carbs}g · F: {item.fat}g
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteFood(item.id)}
                              className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete log"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Daily Supplement Protocol */}
                  <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-800" />
                        <h4 className="font-semibold text-stone-900 text-sm">Supplement Protocol</h4>
                      </div>
                      <span className="text-[11px] text-stone-400">Daily Checklist</span>
                    </div>

                    <div className="space-y-2">
                      {supplements.map((supp) => {
                        const isTaken = supp.daysChecked?.[`${todayStr}_${supp.timing}`] || false;
                        return (
                          <div
                            key={supp.id}
                            onClick={() => handleToggleSupplement(supp.id, supp.timing)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isTaken 
                                ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950' 
                                : 'bg-stone-50 border-stone-200/70 text-stone-700 hover:bg-stone-100/60'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="font-semibold flex items-center gap-1.5">
                                <span>{supp.name}</span>
                                <span className="text-[10px] text-stone-400 font-normal">({supp.dosage})</span>
                              </div>
                              <div className="text-[10px] text-stone-500">
                                {supp.purpose} · <strong className="capitalize">{supp.timing}</strong>
                              </div>
                            </div>

                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isTaken ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300 bg-white'
                            }`}>
                              {isTaken && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SUBTAB 2: MY CARE PLAN */}
            {activeSubTab === 'care-plan' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                    Individualized Clinical Care Plan
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Prescribed by Dr. Disha, MS, RDN · Formulated for: {patient.clinicalFocus}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Caloric Ceiling</span>
                    <strong className="text-base text-stone-900 font-mono-numbers">{patient.targetCalories} kcal</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Protein Floor</span>
                    <strong className="text-base text-emerald-800 font-mono-numbers">{patient.targetProteinG}g / day</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Carbohydrate Cap</span>
                    <strong className="text-base text-stone-900 font-mono-numbers">{patient.targetCarbsG}g / day</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Fluid Hydration</span>
                    <strong className="text-base text-blue-700 font-mono-numbers">{patient.targetWaterMl} mL</strong>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
                    <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-xs">
                      Clinical Objectives & Focus
                    </h4>
                    <p>
                      1. Maintain postprandial glucose excursions under 135 mg/dL through deliberate meal sequencing (consume fibrous vegetables and protein before starches).
                    </p>
                    <p>
                      2. Support intestinal epithelial restitution with daily polyphenol-rich berries, stewed apples, and targeted bone broth/collagen peptides.
                    </p>
                    <p>
                      3. Hydrate with 2,400 mL fluids daily supplemented with clean sodium/potassium electrolytes on morning workout days.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <h4 className="font-bold text-stone-900 text-xs">Foods to Emphasize</h4>
                      <ul className="space-y-1 text-stone-600">
                        <li>• Wild salmon, sardines, and pastured poultry</li>
                        <li>• Fermented foods: coconut kefir, raw sauerkraut</li>
                        <li>• Prebiotic fibers: asparagus, leeks, chia seeds</li>
                        <li>• Extra virgin olive oil and avocado</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                      <h4 className="font-bold text-stone-900 text-xs">Foods to Temporarily Limit</h4>
                      <ul className="space-y-1 text-stone-600">
                        <li>• High-FODMAP excess onions and garlic powders</li>
                        <li>• Ultra-processed seed oils and artificial sweeteners</li>
                        <li>• Refined flours and liquid sugar beverages</li>
                        <li>• Alcohol post 7:00 PM to protect sleep architecture</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 3: BIOMETRICS & GLYCEMIC CHARTS */}
            {activeSubTab === 'biometrics' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                      Biometrics & Continuous Telemetry
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tracking fasting glucose, body composition, and cardiovascular pressure
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs">
                      {(['glucose', 'weight', 'bodyFat', 'systolic'] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedMetric(m)}
                          className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                            selectedMetric === m ? 'bg-white text-emerald-950 font-bold shadow-2xs' : 'text-stone-600'
                          }`}
                        >
                          {m === 'bodyFat' ? 'Body Fat %' : m}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setShowAddBiometric(true)}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log</span>
                    </button>
                  </div>
                </div>

                {/* SVG Visual Chart */}
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <div className="h-56 w-full flex items-end gap-3 pt-6 pb-2 px-2">
                    {chartData.map((d, i) => {
                      const heightPct = Math.max(10, Math.min(100, Math.round(((d.val - minVal) / range) * 85)));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                          {/* Tooltip */}
                          <div className="absolute -top-8 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono-numbers pointer-events-none whitespace-nowrap z-10">
                            {d.val} {selectedMetric === 'glucose' ? 'mg/dL' : selectedMetric === 'weight' ? 'lbs' : ''}
                          </div>

                          <div 
                            className="w-full bg-emerald-700/80 hover:bg-emerald-800 rounded-t-md transition-all duration-300"
                            style={{ height: `${heightPct}%` }}
                          />
                          <span className="text-[10px] font-mono-numbers text-stone-500">{d.date}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                    Showing daily trend for {selectedMetric.toUpperCase()} across logged consultations. Target zone maintained.
                  </div>
                </div>

                {/* Historical Log Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-400 font-semibold uppercase text-[10px]">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Fasting Glucose</th>
                        <th className="pb-2">Weight</th>
                        <th className="pb-2">Blood Pressure</th>
                        <th className="pb-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-stone-700">
                      {biometrics.map((b) => (
                        <tr key={b.id} className="hover:bg-stone-50">
                          <td className="py-2.5 font-mono-numbers font-medium">{b.date}</td>
                          <td className="py-2.5 font-mono-numbers font-semibold text-emerald-800">{b.fastingGlucoseMgDl} mg/dL</td>
                          <td className="py-2.5 font-mono-numbers">{b.weightLbs} lbs</td>
                          <td className="py-2.5 font-mono-numbers">{b.systolicBp}/{b.diastolicBp} mmHg</td>
                          <td className="py-2.5 text-stone-500 truncate max-w-xs">{b.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* SUBTAB 4: FOOD & HYDRATION DIARY */}
            {activeSubTab === 'food-diary' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                      Food & Hydration Journal
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Log daily nourishment, macro breakdowns, and water intake
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddFood(true)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Food Item</span>
                  </button>
                </div>

                {/* Hydration Bar */}
                <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider">Hydration Status Today</span>
                    <div className="font-mono-numbers text-lg font-bold text-blue-950">
                      {hydration.currentMl} / {hydration.targetMl} mL ({waterPct}%)
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddWater(250)}
                      className="px-3 py-1.5 bg-white text-blue-900 text-xs font-semibold rounded-lg border border-blue-200 shadow-2xs hover:bg-blue-50 cursor-pointer"
                    >
                      + 250 mL Glass
                    </button>
                    <button
                      onClick={() => handleAddWater(500)}
                      className="px-3 py-1.5 bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-2xs hover:bg-blue-900 cursor-pointer"
                    >
                      + 500 mL Bottle
                    </button>
                  </div>
                </div>

                {/* Meals List */}
                <div className="space-y-3">
                  {foodLogs.length === 0 ? (
                    <div className="py-12 text-center text-xs text-stone-400 bg-stone-50 rounded-xl border border-stone-200">
                      No foods logged for today yet. Use the &ldquo;Log Food Item&rdquo; button above to track your meals.
                    </div>
                  ) : (
                    foodLogs.map((item) => (
                      <div key={item.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-stone-200 text-stone-600">
                              {item.mealType}
                            </span>
                            <strong className="text-stone-900 text-sm">{item.title}</strong>
                            <span className="text-[11px] text-stone-400 font-mono-numbers">({item.portion})</span>
                          </div>
                          <div className="font-mono-numbers text-stone-500 text-[11px]">
                            {item.calories} kcal · Protein: {item.protein}g · Carbs: {item.carbs}g · Fat: {item.fat}g
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteFood(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* SUBTAB 5: SUPPLEMENTS */}
            {activeSubTab === 'supplements' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                    Clinical Supplement Protocols
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Targeted nutrient repletion formulated by Dr. Disha based on lab biomarkers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplements.map((supp) => {
                    const isTaken = supp.daysChecked?.[`${todayStr}_${supp.timing}`] || false;
                    return (
                      <div
                        key={supp.id}
                        onClick={() => handleToggleSupplement(supp.id, supp.timing)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between text-xs ${
                          isTaken 
                            ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' 
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-stone-900 text-sm">{supp.name}</h4>
                            <span className="text-[10px] text-emerald-800 font-semibold bg-white px-2 py-0.5 rounded border border-stone-200">
                              {supp.timing}
                            </span>
                          </div>
                          <div className="text-stone-500">Dosage: {supp.dosage}</div>
                          <div className="text-[11px] text-stone-600 font-medium">Purpose: {supp.purpose}</div>
                        </div>

                        <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 mt-0.5 ${
                          isTaken ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-300 bg-white'
                        }`}>
                          {isTaken && <Check className="w-4 h-4" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUBTAB 6: SYMPTOMS & DIGESTION */}
            {activeSubTab === 'symptoms' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                      Symptom, Gut & Energy Journal
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Correlating gastrointestinal health, energy vitality, and sleep patterns
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddSymptom(true)}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Daily Symptoms</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {symptoms.map((s) => (
                    <div key={s.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-mono-numbers">
                        <span className="font-bold text-stone-900">{s.date}</span>
                        <span className="text-stone-500">Sleep: {s.sleepHours} hrs</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center font-mono-numbers">
                        <div className="p-2 bg-white rounded-lg border border-stone-200">
                          <span className="text-[10px] text-stone-400 block">Energy</span>
                          <strong className="text-emerald-800">{s.energyLevel} / 10</strong>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-stone-200">
                          <span className="text-[10px] text-stone-400 block">GI Distress</span>
                          <strong className="text-stone-800">{s.digestiveDistressScore} / 10</strong>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-stone-200">
                          <span className="text-[10px] text-stone-400 block">Bloating</span>
                          <strong className="text-stone-800">{s.bloatingLevel}</strong>
                        </div>
                      </div>
                      {s.notes && (
                        <p className="text-stone-600 text-[11px] italic bg-white p-2.5 rounded-lg border border-stone-100">
                          &ldquo;{s.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 7: APPOINTMENTS */}
            {activeSubTab === 'appointments' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                      Consultations & Video Visits
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upcoming and historical clinical nutrition appointments with Dr. Disha
                    </p>
                  </div>
                  {onNavigateToTab && (
                    <button
                      onClick={() => onNavigateToTab('booking')}
                      className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book New Consultation</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 bg-emerald-800 text-white rounded font-bold uppercase text-[10px]">
                        Confirmed Telehealth
                      </span>
                      <span className="font-mono-numbers text-emerald-900 font-semibold">October 14, 2026 · 10:30 AM EST</span>
                    </div>
                    <div>
                      <h4 className="font-serif-display text-lg font-bold text-stone-900">
                        Clinical Follow-Up & Biometric Reassessment (45 Min)
                      </h4>
                      <p className="text-xs text-stone-600 mt-1">
                        With Dr. Disha, MS, RDN · High-definition HIPAA encrypted video room
                      </p>
                    </div>
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => alert('Opening secure telehealth room...')}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg shadow-2xs cursor-pointer"
                      >
                        Enter Telehealth Waiting Room
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs text-stone-600">
                    <div>
                      <strong className="block text-stone-800">Initial Clinical Assessment (Completed)</strong>
                      <span className="text-[11px] text-stone-500 font-mono-numbers">September 12, 2026 · 75 Minutes</span>
                    </div>
                    <span className="text-emerald-800 font-semibold">SOAP Notes Signed</span>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* MODAL: ADD FOOD */}
      {showAddFood && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">Log Meal or Snack</h3>
              <button onClick={() => setShowAddFood(false)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSaveFood} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Meal Category</label>
                <select
                  value={newFood.mealType}
                  onChange={(e) => setNewFood({ ...newFood, mealType: e.target.value as any })}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Meal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wild Salmon with Steamed Broccoli"
                  value={newFood.title}
                  onChange={(e) => setNewFood({ ...newFood, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Portion</label>
                  <input
                    type="text"
                    value={newFood.portion}
                    onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estimated Calories</label>
                  <input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddFood(false)} className="px-3 py-1.5 rounded-lg border border-stone-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold">Save Meal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BIOMETRIC */}
      {showAddBiometric && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">Record Biometric Reading</h3>
              <button onClick={() => setShowAddBiometric(false)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSaveBiometric} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={newBio.fastingGlucoseMgDl}
                    onChange={(e) => setNewBio({ ...newBio, fastingGlucoseMgDl: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBio.weightLbs}
                    onChange={(e) => setNewBio({ ...newBio, weightLbs: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newBio.systolicBp}
                    onChange={(e) => setNewBio({ ...newBio, systolicBp: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={newBio.diastolicBp}
                    onChange={(e) => setNewBio({ ...newBio, diastolicBp: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Clinical Measurement Notes</label>
                <input
                  type="text"
                  value={newBio.notes}
                  onChange={(e) => setNewBio({ ...newBio, notes: e.target.value })}
                  placeholder="e.g. 12h fasting morning reading"
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddBiometric(false)} className="px-3 py-1.5 rounded-lg border border-stone-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold">Save Biometrics</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SYMPTOM */}
      {showAddSymptom && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-display text-lg font-bold text-stone-900">Log Daily Symptoms</h3>
              <button onClick={() => setShowAddSymptom(false)} className="text-stone-400 hover:text-stone-700 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleSaveSymptom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Energy Level (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newSymptom.energyLevel}
                    onChange={(e) => setNewSymptom({ ...newSymptom, energyLevel: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">GI Distress (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newSymptom.digestiveDistressScore}
                    onChange={(e) => setNewSymptom({ ...newSymptom, digestiveDistressScore: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bloating Severity</label>
                  <select
                    value={newSymptom.bloatingLevel}
                    onChange={(e) => setNewSymptom({ ...newSymptom, bloatingLevel: e.target.value as any })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  >
                    <option value="None">None</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sleep Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newSymptom.sleepHours}
                    onChange={(e) => setNewSymptom({ ...newSymptom, sleepHours: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={newSymptom.notes}
                  onChange={(e) => setNewSymptom({ ...newSymptom, notes: e.target.value })}
                  placeholder="e.g. Good focus, zero post-meal bloat"
                  className="w-full px-3 py-1.5 rounded-lg border border-stone-300"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddSymptom(false)} className="px-3 py-1.5 rounded-lg border border-stone-300">Cancel</button>
                <button type="submit" className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white font-semibold">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
