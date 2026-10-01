export type UserRole = 'patient' | 'admin' | 'auditor';

export type ConsultationTypeId = 
  | 'initial-assessment' 
  | 'gut-microbiome' 
  | 'metabolic-health' 
  | 'sports-nutrition' 
  | 'follow-up' 
  | 'pediatric-nutrition';

export interface ConsultationType {
  id: ConsultationTypeId;
  title: string;
  duration: number; // in minutes
  price: number;
  description: string;
  recommendedFor: string;
  cptCode: string;
}

export interface IntakeQuestionnaire {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  primaryGoal: 'metabolic-weight' | 'gut-health' | 'hormone-balance' | 'sports-performance' | 'chronic-disease' | 'other';
  dietaryStyle: 'omnivore' | 'mediterranean' | 'vegetarian' | 'vegan' | 'keto-lowcarb' | 'paleo' | 'low-fodmap';
  allergies: string;
  medicationsAndSupplements: string;
  digestiveSymptoms: string[];
  currentWeightLbs: number;
  heightInches: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very-active' | 'athlete';
  chiefHealthConcerns: string;
  consentAgreed: boolean;
}

export interface BookingAppointment {
  id: string;
  patientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  consultationTypeId: ConsultationTypeId;
  consultationTitle: string;
  durationMinutes: number;
  price: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM"
  status: 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'emi-active' | 'hsa-fsa-pending';
  zoomLink: string;
  intakeData?: IntakeQuestionnaire;
  createdAt: string;
  confirmationEmailSent?: boolean;
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage';

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  prepTime: number; // mins
  cookTime: number; // mins
  servings: number;
  mealType: MealType;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  tags: ('Keto' | 'Vegan' | 'Low-FODMAP' | 'Anti-Inflammatory' | 'Diabetic-Friendly' | 'Gluten-Free' | 'High-Protein' | 'Renal-Friendly')[];
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  sodium: number; // mg
  potassium: number; // mg
  iron: number; // mg
  magnesium: number; // mg
  glycemicLoad: 'Low' | 'Medium' | 'High';
  ingredients: RecipeIngredient[];
  instructions: string[];
  clinicalBenefits: string;
  iconType: 'salmon' | 'quinoa' | 'granola' | 'pudding' | 'salad' | 'stew' | 'smoothie' | 'soup';
}

export interface PatientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Other';
  clinicalFocus: string;
  mrn: string; // Medical Record Number
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetWaterMl: number;
  hipaaConsentSigned: boolean;
  hipaaConsentDate: string;
  signatureDataUrl?: string;
}

export interface BiometricLog {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  weightLbs: number;
  bodyFatPct: number;
  fastingGlucoseMgDl: number;
  systolicBp: number;
  diastolicBp: number;
  waistInches: number;
  hba1c?: number;
  notes?: string;
}

export interface FoodDiaryItem {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  title: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
}

export interface HydrationLog {
  patientId: string;
  date: string; // YYYY-MM-DD
  currentMl: number;
  targetMl: number;
}

export interface SupplementProtocol {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  timing: 'morning' | 'midday' | 'evening' | 'with-meals';
  purpose: string;
  daysChecked: Record<string, boolean>; // e.g. "2026-09-30_morning": true
}

export interface SymptomLog {
  id: string;
  patientId: string;
  date: string; // YYYY-MM-DD
  energyLevel: number; // 1 - 10
  digestiveDistressScore: number; // 0 - 10
  bristolStoolType: number; // 1 - 7
  bloatingLevel: 'None' | 'Mild' | 'Moderate' | 'Severe';
  sleepHours: number;
  notes: string;
}

export interface SoapNote {
  id: string;
  patientId: string;
  encounterDate: string;
  provider: string;
  consultationType: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10Codes: { code: string; description: string }[];
  cptCodes: { code: string; description: string }[];
  signature: string;
  locked: boolean;
}

export interface LabMarker {
  name: string;
  value: number;
  unit: string;
  refLow: number;
  refHigh: number;
  status: 'normal' | 'high' | 'low';
  clinicalInterpretation: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  panelName: string;
  testDate: string;
  labFacility: string;
  orderingProvider: string;
  markers: LabMarker[];
  physicianComments: string;
}

export interface EmailReminder {
  id: string;
  type: 'booking-confirmation' | 'consultation-24h' | 'consultation-2h' | 'fasting-glucose' | 'hydration-nudge' | 'supplement-alert' | 'weekly-summary' | 'newsletter-broadcast';
  title: string;
  subject: string;
  scheduledTime: string;
  channel: 'Email' | 'SMS' | 'Both';
  enabled: boolean;
  lastDispatched?: string;
  previewTemplate: {
    heading: string;
    body: string;
    actionLabel: string;
    actionUrl: string;
  };
}

export interface BroadcastCampaign {
  id: string;
  title: string;
  subject: string;
  targetGroup: 'All Patients' | 'Metabolic & Pre-Diabetes' | 'Gut Health & SIBO' | 'Sports Nutrition';
  contentSnippet: string;
  status: 'Draft' | 'Sent' | 'Scheduled';
  sentAt?: string;
  recipientsCount: number;
  openRatePct: number;
  category: 'Newsletter' | 'New Recipe Announcement' | 'Clinical Guideline';
}

export interface EmiPlanOption {
  months: number; // e.g. 3, 6, 9, 12
  interestRatePct: number; // e.g. 0% for 3 months, 2.5% for 6, etc.
  monthlyInstallment: number;
  totalPayable: number;
  processingFee: number;
}

export interface EmiContract {
  id: string;
  patientId: string;
  patientName: string;
  serviceTitle: string;
  principalAmount: number;
  downPayment: number;
  months: number;
  monthlyAmount: number;
  paidMonths: number;
  nextDueDate: string;
  status: 'active' | 'completed' | 'pending';
}

export interface InvoiceSuperbill {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  serviceDescription: string;
  cptCode: string;
  icd10Code: string;
  amount: number;
  tax: number;
  total: number;
  date: string;
  status: 'paid' | 'pending' | 'emi-active';
  paymentMethod: string;
  providerNpi: string;
  taxId: string;
  clinicAddress: string;
  emiPlanDetails?: {
    months: number;
    monthlyAmount: number;
    remainingBalance: number;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: 'VIEW_PHI' | 'EDIT_SOAP' | 'EXPORT_EHR' | 'UPDATE_BIOMETRICS' | 'SIGN_CONSENT' | 'ACCESS_LABS' | 'LOGIN_PORTAL' | 'LOGOUT_PORTAL' | 'ENCRYPT_AT_REST' | 'DECRYPT_AT_REST' | 'EMI_PROCESSED' | 'NEWSLETTER_SENT' | 'RECIPE_CRUD';
  resource: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED';
}

export interface FastingSession {
  patientId: string;
  startTime: string; // ISO string
  targetHours: number; // 14, 16, 18, 20
  isActive: boolean;
  notes?: string;
}

export interface DrugNutrientDepletionItem {
  drugClass: string;
  commonMedications: string[];
  depletedNutrients: string[];
  physiologicalMechanism: string;
  clinicalDietaryIntervention: string;
}
