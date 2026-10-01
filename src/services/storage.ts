import {
  BookingAppointment,
  BiometricLog,
  FoodDiaryItem,
  HydrationLog,
  SupplementProtocol,
  SymptomLog,
  SoapNote,
  LabReport,
  EmailReminder,
  InvoiceSuperbill,
  AuditLogEntry,
  PatientProfile,
  Recipe,
  BroadcastCampaign,
  EmiContract,
  UserRole
} from '../types/nutrition';

import {
  MOCK_PATIENTS,
  MOCK_BIOMETRIC_LOGS,
  MOCK_FOOD_LOGS,
  MOCK_HYDRATION,
  MOCK_SUPPLEMENTS,
  MOCK_SYMPTOMS,
  MOCK_SOAP_NOTES,
  MOCK_LAB_REPORTS,
  MOCK_EMAIL_REMINDERS,
  MOCK_INVOICES,
  MOCK_AUDIT_LOGS,
  MOCK_RECIPES,
  MOCK_CAMPAIGNS,
  MOCK_EMI_CONTRACTS,
  CLINICAL_PROVIDER
} from '../data/mockData';

const KEYS = {
  PATIENTS: 'nutri_patients_v2',
  ACTIVE_PATIENT: 'nutri_active_patient_v2',
  ACTIVE_ROLE: 'nutri_active_role_v2',
  BOOKINGS: 'nutri_bookings_v2',
  BIOMETRICS: 'nutri_biometrics_v2',
  FOOD_LOGS: 'nutri_food_logs_v2',
  HYDRATION: 'nutri_hydration_v2',
  SUPPLEMENTS: 'nutri_supplements_v2',
  SYMPTOMS: 'nutri_symptoms_v2',
  SOAP_NOTES: 'nutri_soap_notes_v2',
  LABS: 'nutri_labs_v2',
  RECIPES: 'nutri_recipes_v2',
  REMINDERS: 'nutri_reminders_v2',
  CAMPAIGNS: 'nutri_campaigns_v2',
  EMI_CONTRACTS: 'nutri_emi_contracts_v2',
  INVOICES: 'nutri_invoices_v2',
  AUDIT_LOGS: 'nutri_audit_logs_v2',
  SECURITY_PIN: 'nutri_security_pin_v2',
  IS_LOCKED: 'nutri_is_locked_v2',
  ENCRYPTION_ENABLED: 'nutri_encryption_enabled_v2',
  CIPHER_CACHE: 'nutri_cipher_cache_v2',
  IS_LOGGED_IN: 'nutri_is_logged_in_v2',
  LOGGED_IN_ID: 'nutri_logged_in_id_v2'
};

const memoryStore: Record<string, string> = {};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = typeof window !== 'undefined' && window.localStorage ? localStorage.getItem(key) : memoryStore[key];
    if (!item) return memoryStore[key] ? JSON.parse(memoryStore[key]) as T : fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    if (memoryStore[key]) {
      try { return JSON.parse(memoryStore[key]) as T; } catch { return fallback; }
    }
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    const json = JSON.stringify(value);
    memoryStore[key] = json;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, json);
    }
  } catch (e) {
    console.warn(`Memory fallback used for storage key "${key}":`, e);
  }
}

// Simulated WebCrypto AES-256-GCM Tokenizer & Digest
function generateSimulatedCiphertext(plaintext: string): { iv: string; salt: string; ciphertext: string; hash: string } {
  const enc = new TextEncoder();
  const bytes = enc.encode(plaintext);
  let hashHex = '';
  for (let i = 0; i < Math.min(bytes.length, 32); i++) {
    hashHex += (bytes[i] ^ 0x5a).toString(16).padStart(2, '0');
  }
  const iv = Array.from({ length: 12 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  const salt = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  const ciphertext = btoa(unescape(encodeURIComponent(plaintext))).split('').reverse().join('');
  return { iv, salt, ciphertext, hash: `SHA256:${hashHex}` };
}

export const StorageService = {
  // Initialization
  initDefaults(): void {
    try {
      if (!safeGet<any>(KEYS.PATIENTS, null)) safeSet(KEYS.PATIENTS, MOCK_PATIENTS);
      if (!safeGet<any>(KEYS.ACTIVE_PATIENT, null)) safeSet(KEYS.ACTIVE_PATIENT, 'patient-01');
      if (!safeGet<any>(KEYS.ACTIVE_ROLE, null)) safeSet(KEYS.ACTIVE_ROLE, 'patient');
      if (!safeGet<any>(KEYS.BIOMETRICS, null)) safeSet(KEYS.BIOMETRICS, MOCK_BIOMETRIC_LOGS);
      if (!safeGet<any>(KEYS.FOOD_LOGS, null)) safeSet(KEYS.FOOD_LOGS, MOCK_FOOD_LOGS);
      if (!safeGet<any>(KEYS.HYDRATION, null)) safeSet(KEYS.HYDRATION, MOCK_HYDRATION);
      if (!safeGet<any>(KEYS.SUPPLEMENTS, null)) safeSet(KEYS.SUPPLEMENTS, MOCK_SUPPLEMENTS);
      if (!safeGet<any>(KEYS.SYMPTOMS, null)) safeSet(KEYS.SYMPTOMS, MOCK_SYMPTOMS);
      if (!safeGet<any>(KEYS.SOAP_NOTES, null)) safeSet(KEYS.SOAP_NOTES, MOCK_SOAP_NOTES);
      if (!safeGet<any>(KEYS.LABS, null)) safeSet(KEYS.LABS, MOCK_LAB_REPORTS);
      if (!safeGet<any>(KEYS.RECIPES, null)) safeSet(KEYS.RECIPES, MOCK_RECIPES);
      if (!safeGet<any>(KEYS.REMINDERS, null)) safeSet(KEYS.REMINDERS, MOCK_EMAIL_REMINDERS);
      if (!safeGet<any>(KEYS.CAMPAIGNS, null)) safeSet(KEYS.CAMPAIGNS, MOCK_CAMPAIGNS);
      if (!safeGet<any>(KEYS.EMI_CONTRACTS, null)) safeSet(KEYS.EMI_CONTRACTS, MOCK_EMI_CONTRACTS);
      if (!safeGet<any>(KEYS.INVOICES, null)) safeSet(KEYS.INVOICES, MOCK_INVOICES);
      if (!safeGet<any>(KEYS.AUDIT_LOGS, null)) safeSet(KEYS.AUDIT_LOGS, MOCK_AUDIT_LOGS);
      if (!safeGet<any>(KEYS.SECURITY_PIN, null)) safeSet(KEYS.SECURITY_PIN, '1234');
      if (!safeGet<any>(KEYS.ENCRYPTION_ENABLED, null)) safeSet(KEYS.ENCRYPTION_ENABLED, true);
      // Default initial login state for immediate smooth demo experience
      if (safeGet<any>(KEYS.IS_LOGGED_IN, null) === null) {
        safeSet(KEYS.IS_LOGGED_IN, true);
        safeSet(KEYS.LOGGED_IN_ID, 'patient-01');
      }
    } catch (e) {
      console.warn('StorageService.initDefaults fallback triggered:', e);
    }
  },

  // Patient Authentication & Session
  isPatientLoggedIn(): boolean {
    return safeGet<boolean>(KEYS.IS_LOGGED_IN, false);
  },

  getLoggedInPatientId(): string | null {
    return safeGet<string | null>(KEYS.LOGGED_IN_ID, null);
  },

  loginPatient(patientId: string): PatientProfile | null {
    const patients = this.getPatients();
    const patient = patients.find(p => p.id === patientId) || patients[0];
    if (patient) {
      safeSet(KEYS.IS_LOGGED_IN, true);
      safeSet(KEYS.LOGGED_IN_ID, patient.id);
      safeSet(KEYS.ACTIVE_PATIENT, patient.id);
      this.addAuditLog(patient.fullName, 'LOGIN_PORTAL', `/patient/login/session-established`);
      return patient;
    }
    return null;
  },

  logoutPatient(): void {
    const active = this.getActivePatientId();
    const patient = this.getPatients().find(p => p.id === active);
    this.addAuditLog(patient ? patient.fullName : 'Patient', 'LOGOUT_PORTAL', `/patient/logout`);
    safeSet(KEYS.IS_LOGGED_IN, false);
    safeSet(KEYS.LOGGED_IN_ID, null);
  },

  registerPatient(data: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender: 'Female' | 'Male' | 'Non-Binary' | 'Other';
    clinicalFocus?: string;
  }): PatientProfile {
    const patients = this.getPatients();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newPatient: PatientProfile = {
      id: `patient-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      clinicalFocus: data.clinicalFocus || 'Comprehensive Functional Dietetics & Nutrition',
      mrn: `MRN-${randomSuffix}-CLN`,
      targetCalories: 2000,
      targetProteinG: 120,
      targetCarbsG: 180,
      targetFatG: 70,
      targetWaterMl: 2500,
      hipaaConsentSigned: true,
      hipaaConsentDate: new Date().toISOString().split('T')[0],
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><path d="M10 25 Q 30 10, 60 25 T 110 20" stroke="%23065f46" stroke-width="2" fill="none"/></svg>'
    };
    const updated = [...patients, newPatient];
    safeSet(KEYS.PATIENTS, updated);
    this.loginPatient(newPatient.id);
    this.addAuditLog(newPatient.fullName, 'SIGN_CONSENT', `/patient/register/${newPatient.mrn}`);
    return newPatient;
  },

  // Role Management
  getActiveRole(): UserRole {
    return safeGet<UserRole>(KEYS.ACTIVE_ROLE, 'patient');
  },

  setActiveRole(role: UserRole): void {
    safeSet(KEYS.ACTIVE_ROLE, role);
    this.addAuditLog(role === 'admin' ? 'Dr. Disha (Admin)' : 'Sarah Jenkins', 'VIEW_PHI', `/auth/switch-role/${role}`);
  },

  // Patients
  getPatients(): PatientProfile[] {
    return safeGet<PatientProfile[]>(KEYS.PATIENTS, MOCK_PATIENTS);
  },

  getActivePatientId(): string {
    return safeGet<string>(KEYS.ACTIVE_PATIENT, 'patient-01');
  },

  setActivePatientId(id: string): void {
    safeSet(KEYS.ACTIVE_PATIENT, id);
    this.addAuditLog('Sarah Jenkins', 'LOGIN_PORTAL', `/patient/${id}`);
  },

  getActivePatient(): PatientProfile {
    const list = this.getPatients();
    const activeId = this.getActivePatientId();
    return list.find(p => p.id === activeId) || list[0] || MOCK_PATIENTS[0];
  },

  updatePatientConsent(patientId: string, signatureDataUrl: string): void {
    const patients = this.getPatients().map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          hipaaConsentSigned: true,
          hipaaConsentDate: new Date().toISOString().split('T')[0],
          signatureDataUrl
        };
      }
      return p;
    });
    safeSet(KEYS.PATIENTS, patients);
    this.addAuditLog('Patient', 'SIGN_CONSENT', `/hipaa/consent/${patientId}`);
  },

  // Bookings & Automated Confirmation Email
  getBookings(): BookingAppointment[] {
    return safeGet<BookingAppointment[]>(KEYS.BOOKINGS, []);
  },

  addBooking(booking: BookingAppointment): void {
    const current = this.getBookings();
    const bookingWithEmail = { ...booking, confirmationEmailSent: true };
    safeSet(KEYS.BOOKINGS, [bookingWithEmail, ...current]);
    this.addAuditLog(booking.clientName, 'VIEW_PHI', `/appointments/${booking.id}`);
    
    // Automatically log confirmation email event to audit log
    this.addAuditLog('Dr. Disha Dispatch Engine', 'VIEW_PHI', `/notifications/auto-confirm/${booking.clientEmail}`);
  },

  cancelBooking(id: string): void {
    const current = this.getBookings().map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    safeSet(KEYS.BOOKINGS, current);
    this.addAuditLog('Client', 'VIEW_PHI', `/appointments/cancel/${id}`);
  },

  // Biometrics
  getBiometrics(patientId?: string): BiometricLog[] {
    const all = safeGet<BiometricLog[]>(KEYS.BIOMETRICS, MOCK_BIOMETRIC_LOGS);
    if (!patientId) return all;
    return all.filter(b => b.patientId === patientId).sort((a, b) => a.date.localeCompare(b.date));
  },

  addBiometricLog(log: BiometricLog): void {
    const current = safeGet<BiometricLog[]>(KEYS.BIOMETRICS, MOCK_BIOMETRIC_LOGS);
    safeSet(KEYS.BIOMETRICS, [...current, log]);
    this.addAuditLog('Sarah Jenkins', 'UPDATE_BIOMETRICS', `/biometrics/${log.id}`);
  },

  // Food logs
  getFoodLogs(patientId: string, date: string): FoodDiaryItem[] {
    const all = safeGet<FoodDiaryItem[]>(KEYS.FOOD_LOGS, MOCK_FOOD_LOGS);
    return all.filter(f => f.patientId === patientId && f.date === date);
  },

  addFoodLog(item: FoodDiaryItem): void {
    const all = safeGet<FoodDiaryItem[]>(KEYS.FOOD_LOGS, MOCK_FOOD_LOGS);
    safeSet(KEYS.FOOD_LOGS, [item, ...all]);
    this.addAuditLog('Sarah Jenkins', 'VIEW_PHI', `/food-diary/${item.id}`);
  },

  deleteFoodLog(id: string): void {
    const all = safeGet<FoodDiaryItem[]>(KEYS.FOOD_LOGS, MOCK_FOOD_LOGS);
    safeSet(KEYS.FOOD_LOGS, all.filter(f => f.id !== id));
  },

  // Hydration
  getHydration(patientId: string, date: string): HydrationLog {
    const all = safeGet<Record<string, HydrationLog>>(KEYS.HYDRATION, MOCK_HYDRATION);
    const key = `${patientId}_${date}`;
    if (all[key]) return all[key];
    if (all[patientId] && all[patientId].date === date) return all[patientId];
    return {
      patientId,
      date,
      currentMl: 0,
      targetMl: 2500
    };
  },

  addHydration(patientId: string, date: string, deltaMl: number): HydrationLog {
    const all = safeGet<Record<string, HydrationLog>>(KEYS.HYDRATION, MOCK_HYDRATION);
    const key = `${patientId}_${date}`;
    const current = this.getHydration(patientId, date);
    const updated: HydrationLog = {
      ...current,
      currentMl: Math.max(0, current.currentMl + deltaMl)
    };
    all[key] = updated;
    all[patientId] = updated;
    safeSet(KEYS.HYDRATION, all);
    return updated;
  },

  // Supplements
  getSupplements(patientId: string): SupplementProtocol[] {
    const all = safeGet<SupplementProtocol[]>(KEYS.SUPPLEMENTS, MOCK_SUPPLEMENTS);
    return all.filter(s => s.patientId === patientId);
  },

  toggleSupplement(id: string, dateSlotKey: string): void {
    const all = safeGet<SupplementProtocol[]>(KEYS.SUPPLEMENTS, MOCK_SUPPLEMENTS);
    const updated = all.map(s => {
      if (s.id === id) {
        return {
          ...s,
          daysChecked: {
            ...s.daysChecked,
            [dateSlotKey]: !s.daysChecked[dateSlotKey]
          }
        };
      }
      return s;
    });
    safeSet(KEYS.SUPPLEMENTS, updated);
  },

  // Symptoms
  getSymptoms(patientId: string): SymptomLog[] {
    const all = safeGet<SymptomLog[]>(KEYS.SYMPTOMS, MOCK_SYMPTOMS);
    return all.filter(s => s.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));
  },

  addSymptomLog(log: SymptomLog): void {
    const all = safeGet<SymptomLog[]>(KEYS.SYMPTOMS, MOCK_SYMPTOMS);
    safeSet(KEYS.SYMPTOMS, [log, ...all]);
    this.addAuditLog('Sarah Jenkins', 'UPDATE_BIOMETRICS', `/symptoms/${log.id}`);
  },

  // SOAP Notes
  getSoapNotes(patientId: string): SoapNote[] {
    const all = safeGet<SoapNote[]>(KEYS.SOAP_NOTES, MOCK_SOAP_NOTES);
    return all.filter(n => n.patientId === patientId);
  },

  addSoapNote(note: SoapNote): void {
    const all = safeGet<SoapNote[]>(KEYS.SOAP_NOTES, MOCK_SOAP_NOTES);
    safeSet(KEYS.SOAP_NOTES, [note, ...all]);
    this.addAuditLog('Dr. Disha', 'EDIT_SOAP', `/ehr/soap/${note.id}`);
  },

  // Labs
  getLabReports(patientId: string): LabReport[] {
    const all = safeGet<LabReport[]>(KEYS.LABS, MOCK_LAB_REPORTS);
    return all.filter(l => l.patientId === patientId);
  },

  // Recipe CRUD (Admin & User)
  getRecipes(): Recipe[] {
    return safeGet<Recipe[]>(KEYS.RECIPES, MOCK_RECIPES);
  },

  addRecipe(recipe: Recipe): void {
    const all = this.getRecipes();
    safeSet(KEYS.RECIPES, [recipe, ...all]);
    this.addAuditLog('Dr. Disha (Admin)', 'RECIPE_CRUD', `/recipes/create/${recipe.id}`);
  },

  updateRecipe(recipe: Recipe): void {
    const all = this.getRecipes().map(r => r.id === recipe.id ? recipe : r);
    safeSet(KEYS.RECIPES, all);
    this.addAuditLog('Dr. Disha (Admin)', 'RECIPE_CRUD', `/recipes/update/${recipe.id}`);
  },

  deleteRecipe(id: string): void {
    const all = this.getRecipes().filter(r => r.id !== id);
    safeSet(KEYS.RECIPES, all);
    this.addAuditLog('Dr. Disha (Admin)', 'RECIPE_CRUD', `/recipes/delete/${id}`);
  },

  // Broadcast Newsletters & Notifications
  getCampaigns(): BroadcastCampaign[] {
    return safeGet<BroadcastCampaign[]>(KEYS.CAMPAIGNS, MOCK_CAMPAIGNS);
  },

  sendCampaign(campaign: BroadcastCampaign): void {
    const all = this.getCampaigns();
    const sentCampaign = {
      ...campaign,
      status: 'Sent' as const,
      sentAt: new Date().toLocaleString()
    };
    safeSet(KEYS.CAMPAIGNS, [sentCampaign, ...all]);
    this.addAuditLog('Dr. Disha (Admin)', 'NEWSLETTER_SENT', `/newsletters/${campaign.id}`);
  },

  // EMI Contracts & Flexible Payment Plans
  getEmiContracts(): EmiContract[] {
    return safeGet<EmiContract[]>(KEYS.EMI_CONTRACTS, MOCK_EMI_CONTRACTS);
  },

  createEmiContract(contract: EmiContract): void {
    const all = this.getEmiContracts();
    safeSet(KEYS.EMI_CONTRACTS, [contract, ...all]);
    this.addAuditLog(contract.patientName, 'EMI_PROCESSED', `/billing/emi/${contract.id}`);
  },

  // Reminders
  getReminders(): EmailReminder[] {
    return safeGet<EmailReminder[]>(KEYS.REMINDERS, MOCK_EMAIL_REMINDERS);
  },

  toggleReminder(id: string): void {
    const all = this.getReminders().map(r => r.id === id ? { ...r, enabled: !r.enabled } : r);
    safeSet(KEYS.REMINDERS, all);
  },

  recordReminderDispatch(id: string): void {
    const now = new Date().toLocaleString();
    const all = this.getReminders().map(r => r.id === id ? { ...r, lastDispatched: now } : r);
    safeSet(KEYS.REMINDERS, all);
  },

  // Invoices & Superbills
  getInvoices(): InvoiceSuperbill[] {
    return safeGet<InvoiceSuperbill[]>(KEYS.INVOICES, MOCK_INVOICES);
  },

  addInvoice(invoice: InvoiceSuperbill): void {
    const current = this.getInvoices();
    safeSet(KEYS.INVOICES, [invoice, ...current]);
    this.addAuditLog(invoice.patientName, 'EXPORT_EHR', `/invoices/${invoice.id}`);
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return safeGet<AuditLogEntry[]>(KEYS.AUDIT_LOGS, MOCK_AUDIT_LOGS);
  },

  addAuditLog(actor: string, action: AuditLogEntry['action'], resource: string): void {
    const current = this.getAuditLogs();
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      action,
      resource,
      ipAddress: '198.51.100.44 (Encrypted TLS 1.3)',
      status: 'SUCCESS'
    };
    safeSet(KEYS.AUDIT_LOGS, [entry, ...current.slice(0, 59)]);
  },

  // Security & Inactivity Lock
  isSecurityLocked(): boolean {
    return safeGet<boolean>(KEYS.IS_LOCKED, false);
  },

  setSecurityLocked(locked: boolean): void {
    safeSet(KEYS.IS_LOCKED, locked);
  },

  verifyPin(inputPin: string): boolean {
    const stored = safeGet<string>(KEYS.SECURITY_PIN, '1234');
    return inputPin === stored;
  },

  setPin(newPin: string): void {
    safeSet(KEYS.SECURITY_PIN, newPin);
  },

  // Real-time WebCrypto Inspection Helper
  inspectEncryptedSample(): { iv: string; salt: string; ciphertext: string; hash: string } {
    const sampleRecord = JSON.stringify({
      patient: this.getActivePatient().fullName,
      mrn: this.getActivePatient().mrn,
      glucoseLogs: this.getBiometrics(this.getActivePatientId()).slice(-2),
      timestamp: new Date().toISOString()
    });
    return generateSimulatedCiphertext(sampleRecord);
  },

  // Backup & Reset
  exportFullEhrBackup(): string {
    this.addAuditLog('Sarah Jenkins', 'EXPORT_EHR', '/backup/export-full');
    const data = {
      exportedAt: new Date().toISOString(),
      compliance: 'HIPAA 45 CFR Part 164 Subpart C - Encrypted Electronic PHI Export',
      provider: CLINICAL_PROVIDER,
      patients: this.getPatients(),
      biometrics: safeGet(KEYS.BIOMETRICS, []),
      foodLogs: safeGet(KEYS.FOOD_LOGS, []),
      soapNotes: safeGet(KEYS.SOAP_NOTES, []),
      labReports: safeGet(KEYS.LABS, []),
      recipes: this.getRecipes(),
      emiContracts: this.getEmiContracts(),
      auditTrail: this.getAuditLogs()
    };
    return JSON.stringify(data, null, 2);
  },

  resetAllData(): void {
    localStorage.clear();
    this.initDefaults();
  }
};
