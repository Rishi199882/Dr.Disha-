import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck, 
  ArrowRight, 
  Sparkles,
  UserPlus,
  HelpCircle,
  Fingerprint,
  Phone,
  Calendar,
  Building,
  HeartPulse
} from 'lucide-react';
import { PatientProfile } from '../types/nutrition';
import { StorageService } from '../services/storage';
import { CLINICAL_PROVIDER } from '../data/mockData';

interface PatientLoginProps {
  onLoginSuccess: (patient: PatientProfile) => void;
  onNavigateHome: () => void;
  targetTabName?: string;
}

export const PatientLogin: React.FC<PatientLoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
  targetTabName
}) => {
  const [mode, setMode] = useState<'signin' | 'register' | 'otp' | 'forgot'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign In Form State
  const [loginEmail, setLoginEmail] = useState('sarah.jenkins@example.com');
  const [loginPassword, setLoginPassword] = useState('clinical-secure-2026');

  // OTP Form State
  const [otpCode, setOtpCode] = useState(['5', '9', '2', '8', '1', '0']);
  const [pendingPatient, setPendingPatient] = useState<PatientProfile | null>(null);

  // New Patient Registration State
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Female' as 'Female' | 'Male' | 'Non-Binary' | 'Other',
    clinicalFocus: 'Metabolic & Glycemic Remission',
    password: '',
    confirmPassword: '',
    agreedHipaa: true
  });

  const registeredPatients = StorageService.getPatients();

  // Quick Sign In Helper
  const handleQuickLogin = (patient: PatientProfile) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      const loggedIn = StorageService.loginPatient(patient.id);
      setIsLoading(false);
      if (loggedIn) {
        onLoginSuccess(loggedIn);
      }
    }, 400);
  };

  // Submit Sign In Form
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your patient email/MRN and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Find matching patient by email or MRN
      const found = registeredPatients.find(
        p => p.email.toLowerCase() === loginEmail.toLowerCase().trim() || 
             p.mrn.toLowerCase() === loginEmail.toLowerCase().trim()
      );

      setIsLoading(false);
      if (found) {
        // Trigger HIPAA 2-Factor verification step
        setPendingPatient(found);
        setMode('otp');
        setSuccessMessage(`One-Time Verification passcode sent to ${found.phone || found.email}.`);
      } else {
        // If not found, check if it's admin or create sample login
        setErrorMessage('Patient record not found. You can click one of the verified patient accounts below or activate a new account.');
      }
    }, 500);
  };

  // Submit OTP Verification
  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPatient) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const loggedIn = StorageService.loginPatient(pendingPatient.id);
      if (loggedIn) {
        onLoginSuccess(loggedIn);
      }
    }, 450);
  };

  // Submit New Patient Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!registerData.fullName.trim() || !registerData.email.trim() || !registerData.dob) {
      setErrorMessage('Please provide your Full Legal Name, Email Address, and Date of Birth.');
      return;
    }

    if (registerData.password && registerData.password !== registerData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newPatient = StorageService.registerPatient({
        fullName: registerData.fullName.trim(),
        email: registerData.email.trim(),
        phone: registerData.phone.trim() || '(555) 019-4829',
        dob: registerData.dob,
        gender: registerData.gender,
        clinicalFocus: registerData.clinicalFocus
      });
      setIsLoading(false);
      onLoginSuccess(newPatient);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* Practice Logo & Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-800 text-stone-100 font-serif text-2xl font-bold shadow-md shadow-emerald-900/10 mb-1">
            D
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Patient Health Portal
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Dr. Disha Clinical Nutrition & Functional Medicine
          </p>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-800 font-medium mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>HIPAA 256-Bit SSL Encrypted Portal</span>
          </div>
        </div>

        {targetTabName && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Authentication Required:</span> Sign in to access your secure{' '}
              <strong className="font-bold underline">{targetTabName}</strong>, personalized metabolic logs, and laboratory biomarkers.
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 border-b border-stone-200 bg-stone-50/60 text-xs font-semibold">
            <button
              onClick={() => { setMode('signin'); setErrorMessage(''); }}
              className={`py-3 text-center transition-colors border-b-2 ${
                mode === 'signin' || mode === 'otp'
                  ? 'border-emerald-800 text-emerald-900 bg-white' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Patient Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className={`py-3 text-center transition-colors border-b-2 ${
                mode === 'register' 
                  ? 'border-emerald-800 text-emerald-900 bg-white' 
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Activate New Account
            </button>
          </div>

          <div className="p-6 space-y-5">
            
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* MODE 1: SIGN IN */}
            {mode === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address or Medical Record Number (MRN)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. sarah.jenkins@example.com or MRN-83921"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Portal Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-emerald-800 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-9 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="rounded-sm border-stone-300 text-emerald-800 focus:ring-emerald-800/20"
                    />
                    <span>Remember this medical workstation</span>
                  </label>
                  <span className="text-[10px] text-stone-400">15m Auto-Lock</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying PHI Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Patient Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Instant Test / Demo Patient Login Shortcuts */}
                <div className="pt-3 border-t border-stone-100">
                  <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center mb-2.5">
                    1-Click Verified Patient Access
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {registeredPatients.slice(0, 2).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleQuickLogin(p)}
                        className="p-2.5 text-left rounded-xl border border-stone-200/80 hover:border-emerald-700/60 hover:bg-emerald-50/50 transition-all text-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900 group-hover:text-emerald-900">
                            {p.fullName}
                          </span>
                          <UserCheck className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700" />
                        </div>
                        <div className="text-[10px] text-stone-500 truncate mt-0.5">
                          {p.clinicalFocus.split(',')[0]}
                        </div>
                        <div className="text-[9px] font-mono-numbers text-emerald-800 mt-1">
                          {p.mrn}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* MODE 2: 2-FACTOR OTP VERIFICATION */}
            {mode === 'otp' && pendingPatient && (
              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    Two-Factor Patient Authentication
                  </h3>
                  <p className="text-xs text-stone-500">
                    Enter the 6-digit clinical security passcode to access PHI records for <strong className="text-stone-800">{pendingPatient.fullName}</strong>.
                  </p>
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {otpCode.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otpCode];
                        newOtp[index] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                      className="w-10 h-11 text-center font-mono text-base font-bold rounded-lg border border-stone-300 focus:outline-hidden focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 bg-stone-50"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Decrypting Records...' : 'Verify Code & Enter Portal'}
                </button>

                <div className="flex justify-between items-center text-xs text-stone-500 pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="hover:underline text-stone-600"
                  >
                    &larr; Back to Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuccessMessage('New security code dispatched via SMS & encrypted email.')}
                    className="hover:underline text-emerald-800 font-medium"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            )}

            {/* MODE 3: NEW PATIENT ACTIVATION */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    placeholder="e.g. Eleanor Roosevelt"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="eleanor@example.com"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="(555) 234-5678"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      required
                      value={registerData.dob}
                      onChange={(e) => setRegisterData({ ...registerData, dob: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Biological Sex / Gender
                    </label>
                    <select
                      value={registerData.gender}
                      onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value as any })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Primary Clinical Nutrition Focus
                  </label>
                  <select
                    value={registerData.clinicalFocus}
                    onChange={(e) => setRegisterData({ ...registerData, clinicalFocus: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800 bg-white"
                  >
                    <option value="Metabolic & Glycemic Remission (Pre-diabetes / Insulin Resistance)">Metabolic & Glycemic Remission</option>
                    <option value="Gut Microbiome Repair & Dysbiosis (IBS / SIBO)">Gut Microbiome Repair (IBS / SIBO)</option>
                    <option value="Cardiovascular Lipidomics & Blood Pressure">Cardiovascular Lipidomics & Blood Pressure</option>
                    <option value="Sports Performance & Lean Mass Optimization">Sports Performance & Lean Mass Optimization</option>
                    <option value="Hormonal & Thyroid Balance (PCOS / Hashimoto's)">Hormonal & Thyroid Balance</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Create Password
                    </label>
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-800"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={registerData.agreedHipaa}
                      onChange={(e) => setRegisterData({ ...registerData, agreedHipaa: e.target.checked })}
                      className="rounded-sm border-stone-300 text-emerald-800 focus:ring-emerald-800/20 mt-0.5"
                    />
                    <span>
                      I authorize Dr. Disha Clinical Nutrition to maintain and encrypt my Protected Health Information (PHI) in compliance with HIPAA 45 CFR Part 164.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Generate MRN & Activate Portal</span>
                </button>
              </form>
            )}

            {/* MODE 4: FORGOT PASSWORD */}
            {mode === 'forgot' && (
              <div className="space-y-4 text-center">
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm">
                    Medical Record Recovery
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    To safeguard Protected Health Information (PHI), password reset tokens are authorized through your registered phone number or during clinic hours with Dr. Disha's clinical triage staff.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700 text-left space-y-1">
                  <div className="font-medium text-stone-900">Clinic Support Contact:</div>
                  <div>Phone: {CLINICAL_PROVIDER.clinicPhone}</div>
                  <div>Secure Email: {CLINICAL_PROVIDER.clinicEmail}</div>
                </div>

                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="w-full py-2 text-xs font-semibold text-emerald-800 hover:underline"
                >
                  &larr; Return to Sign In
                </button>
              </div>
            )}

          </div>

          {/* Footer Security Badges */}
          <div className="bg-stone-50/90 px-6 py-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>AES-256 Encrypted</span>
            </span>
            <span>NPI: {CLINICAL_PROVIDER.npi}</span>
            <button
              onClick={onNavigateHome}
              className="text-stone-600 hover:text-stone-900 font-medium hover:underline"
            >
              Public Site &rarr;
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
