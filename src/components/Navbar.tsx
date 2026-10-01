import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  BookOpen, 
  UserCheck, 
  FileText, 
  Lock, 
  CreditCard, 
  Menu, 
  X, 
  Calculator,
  Bell,
  PlayCircle,
  Wrench,
  Percent,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { PatientProfile, UserRole } from '../types/nutrition';
import { StorageService } from '../services/storage';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activePatient: PatientProfile;
  patients: PatientProfile[];
  onSelectPatient: (id: string) => void;
  onOpenMacroCalc: () => void;
  onOpenHipaaModal: () => void;
  onOpenAuditLogs: () => void;
  onLockScreen: () => void;
  activeRole: UserRole;
  onRoleChanged: (role: UserRole) => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activePatient,
  patients,
  onSelectPatient,
  onOpenMacroCalc,
  onOpenHipaaModal,
  onOpenAuditLogs,
  onLockScreen,
  activeRole,
  onRoleChanged,
  isLoggedIn,
  onOpenLogin,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.location.hash = tabId;
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-3">
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNav('home'); }}
              className="group flex items-center gap-2.5 text-stone-900 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-emerald-800 text-stone-100 flex items-center justify-center font-serif text-lg font-semibold shadow-xs">
                D
              </span>
              <span className="font-serif-display text-lg sm:text-xl font-semibold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                Dr. Disha
              </span>
            </a>

            {/* Role indicator pill badge */}
            <span className={`hidden xl:inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              activeRole === 'admin' 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-emerald-100 text-emerald-900'
            }`}>
              {activeRole === 'admin' ? 'Admin / Doctor' : activeRole === 'auditor' ? 'Auditor' : 'Patient'}
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleNav('home')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'home' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('video')}
              className={`hover:text-stone-900 transition-colors flex items-center gap-1 ${activeTab === 'video' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>Lifestyle Video</span>
            </button>
            <button
              onClick={() => handleNav('booking')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'booking' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              Consultations
            </button>
            <button
              onClick={() => handleNav('recipes')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'recipes' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              Recipe Blog
            </button>
            <button
              onClick={() => handleNav('portal')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'portal' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              Patient Portal
            </button>
            <button
              onClick={() => handleNav('tools')}
              className={`hover:text-stone-900 transition-colors flex items-center gap-1 ${activeTab === 'tools' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-700" />
              <span>Clinical Tools</span>
            </button>
            <button
              onClick={() => handleNav('ehr')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'ehr' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              EHR & Labs
            </button>
            <button
              onClick={() => handleNav('reminders')}
              className={`hover:text-stone-900 transition-colors ${activeTab === 'reminders' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              Reminders
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className={`hover:text-stone-900 transition-colors flex items-center gap-1 ${activeTab === 'pricing' ? 'text-emerald-800 font-semibold' : ''}`}
            >
              <Percent className="w-3 h-3 text-emerald-700" />
              <span>Plans & EMI</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Patient Auth / Portal Profile Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200/80 rounded-lg py-1 px-2">
                <button
                  onClick={() => handleNav('portal')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950"
                  title="My Patient Portal & Medical Records"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {activePatient.fullName.charAt(0)}
                  </span>
                  <span className="max-w-[75px] truncate hidden xl:inline">{activePatient.fullName.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out of Patient Session"
                  className="text-stone-400 hover:text-red-700 p-0.5 rounded transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-2.5 py-1 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1"
                title="Patient Portal Sign In"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-800" />
                <span>Patient Login</span>
              </button>
            )}

            {/* Quick Macro Calculator */}
            <button
              onClick={onOpenMacroCalc}
              title="Mifflin-St Jeor Clinical Macro Calculator"
              className="p-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              <Calculator className="w-4 h-4" />
            </button>

            {/* Role Switcher */}
            <select
              value={activeRole}
              onChange={(e) => onRoleChanged(e.target.value as UserRole)}
              className="text-xs bg-stone-200/80 px-2 py-1 rounded-lg text-stone-800 font-medium focus:outline-hidden cursor-pointer"
              title="Switch Access Control Role"
            >
              <option value="patient">Role: Patient</option>
              <option value="admin">Role: Dr. Disha (Admin)</option>
              <option value="auditor">Role: HIPAA Auditor</option>
            </select>

            {/* HIPAA Compliance & Audit */}
            <button
              onClick={onOpenHipaaModal}
              title="HIPAA Safeguards & Encryption Status"
              className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Lock Screen */}
            <button
              onClick={onLockScreen}
              title="Auto-Lock PHI Session (PIN Protected)"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 rounded-lg transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNav('booking')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              Book Consult
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onLockScreen}
              title="Lock Session"
              className="p-2 text-stone-600 rounded-lg"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-200/60 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <span className="text-xs font-medium text-stone-500">Active Role</span>
            <select
              value={activeRole}
              onChange={(e) => onRoleChanged(e.target.value as UserRole)}
              className="text-xs bg-stone-200 px-2 py-1 rounded-md text-stone-800 font-medium"
            >
              <option value="patient">Patient (Sarah)</option>
              <option value="admin">Dr. Disha (Admin)</option>
              <option value="auditor">HIPAA Auditor</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => handleNav('home')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('video')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700 font-semibold text-emerald-800"
            >
              Lifestyle Video
            </button>
            <button
              onClick={() => handleNav('booking')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Book Consult
            </button>
            <button
              onClick={() => handleNav('recipes')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Recipe Blog
            </button>
            <button
              onClick={() => handleNav('portal')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Patient Portal
            </button>
            <button
              onClick={() => handleNav('tools')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Clinical Tools
            </button>
            <button
              onClick={() => handleNav('ehr')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              EHR & Labs
            </button>
            <button
              onClick={() => handleNav('reminders')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Reminders
            </button>
            <button
              onClick={() => handleNav('pricing')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Plans & EMI
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenMacroCalc(); }}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-200/50 text-stone-700"
            >
              Macro Calculator
            </button>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {isLoggedIn ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                    {activePatient.fullName.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold text-emerald-950">{activePatient.fullName}</div>
                    <div className="text-[10px] text-emerald-700">{activePatient.mrn}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                className="w-full py-2 text-center text-xs font-semibold text-emerald-900 bg-emerald-100/70 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-emerald-800" />
                <span>Sign In to Patient Portal</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenHipaaModal(); }}
              className="w-full text-center py-2 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg"
            >
              HIPAA Compliance & Consent
            </button>
            <button
              onClick={() => handleNav('booking')}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-emerald-800 rounded-lg shadow-xs"
            >
              Book Clinical Consultation
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
