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
  User,
  HeartPulse,
  Sparkles,
  Info,
  Phone
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

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'specialties', label: 'Specialties' },
    { id: 'approach', label: 'Our Approach' },
    { id: 'recipes', label: 'Recipes' },
    { id: 'video', label: 'Video' },
    { id: 'pricing', label: 'Pricing & Insurance' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <a 
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNav('home'); }}
              className="group flex items-center gap-2.5 text-stone-900 transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-emerald-800 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:bg-emerald-900 transition-colors">
                D
              </span>
              <div className="flex flex-col">
                <span className="font-serif-display text-lg font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors leading-tight">
                  Dr. Disha
                </span>
                <span className="text-[10px] text-stone-500 font-medium tracking-wide uppercase hidden sm:inline">
                  Clinical Nutrition
                </span>
              </div>
            </a>

            {/* Role indicator pill badge */}
            <span className={`hidden 2xl:inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
              activeRole === 'admin' 
                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}>
              {activeRole === 'admin' ? 'Admin / Doctor' : activeRole === 'auditor' ? 'Auditor' : 'Patient'}
            </span>
          </div>

          {/* Zone 2: Desktop Navigation Links (Culina Health Style) */}
          <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-stone-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`hover:text-emerald-800 transition-colors cursor-pointer pb-0.5 ${
                  activeTab === link.id ? 'text-emerald-800 font-bold border-b-2 border-emerald-800' : ''
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="h-4 w-px bg-stone-200 mx-1" />

            <button
              onClick={() => handleNav('portal')}
              className={`hover:text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer ${
                activeTab === 'portal' ? 'text-emerald-800 font-bold' : ''
              }`}
            >
              <HeartPulse className="w-3.5 h-3.5 text-emerald-700" />
              <span>Portal</span>
            </button>
          </nav>

          {/* Zone 3: Desktop Primary Action & Session Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Patient Auth / Portal Profile Button */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-emerald-50/90 border border-emerald-200/80 rounded-lg py-1 px-2.5">
                <button
                  onClick={() => handleNav('portal')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 hover:text-emerald-950 cursor-pointer"
                  title="My Patient Portal & Medical Records"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                    {activePatient.fullName.charAt(0)}
                  </span>
                  <span className="max-w-[80px] truncate hidden md:inline">{activePatient.fullName.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Sign Out of Patient Session"
                  className="text-stone-400 hover:text-red-700 p-0.5 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-2.5 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Patient Portal Sign In"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-800" />
                <span>Patient Login</span>
              </button>
            )}

            {/* Quick Macro Calculator Icon */}
            <button
              onClick={onOpenMacroCalc}
              title="Clinical Macro Calculator (Mifflin-St Jeor)"
              className="p-2 text-stone-500 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
            </button>

            {/* Role Switcher */}
            <select
              value={activeRole}
              onChange={(e) => onRoleChanged(e.target.value as UserRole)}
              className="text-xs bg-stone-100 hover:bg-stone-200/70 border border-stone-200 px-2 py-1.5 rounded-lg text-stone-700 font-medium focus:outline-hidden cursor-pointer hidden lg:inline-block"
              title="Switch Access Control Role"
            >
              <option value="patient">Role: Patient</option>
              <option value="admin">Role: Dr. Disha (Admin)</option>
              <option value="auditor">Role: HIPAA Auditor</option>
            </select>

            {/* HIPAA Safeguards Modal Trigger */}
            <button
              onClick={onOpenHipaaModal}
              title="HIPAA Security & Consent"
              className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Lock Screen */}
            <button
              onClick={onLockScreen}
              title="Lock Session (PIN Protected)"
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Primary Action Button: Book a Consultation */}
            <button
              onClick={() => handleNav('booking')}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Consult</span>
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onLockScreen}
              title="Lock Session"
              className="p-2 text-stone-500 rounded-lg"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          
          {/* Active Role Selector on Mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="text-xs font-semibold text-stone-500">Active Role Mode</span>
            <select
              value={activeRole}
              onChange={(e) => onRoleChanged(e.target.value as UserRole)}
              className="text-xs bg-stone-100 border border-stone-200 px-2 py-1 rounded-md text-stone-800 font-medium"
            >
              <option value="patient">Patient (Sarah)</option>
              <option value="admin">Dr. Disha (Admin)</option>
              <option value="auditor">HIPAA Auditor</option>
            </select>
          </div>

          {/* Main Navigation Links */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Practice Navigation
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    activeTab === link.id 
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200' 
                      : 'hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clinical & Patient Management Links */}
          <div className="pt-2 border-t border-stone-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
              Patient Portal & Clinical Tools
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleNav('portal')}
                className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'portal' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-emerald-700" />
                <span>Patient Portal</span>
              </button>
              <button
                onClick={() => handleNav('ehr')}
                className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ehr' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                <span>EHR & Labs</span>
              </button>
              <button
                onClick={() => handleNav('tools')}
                className={`text-left px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'tools' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Wrench className="w-3.5 h-3.5 text-emerald-700" />
                <span>Clinical Tools</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenMacroCalc(); }}
                className="text-left px-3 py-2 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5 text-emerald-700" />
                <span>Macro Calc</span>
              </button>
            </div>
          </div>

          {/* User Sign In / Profile Box */}
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            {isLoggedIn ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                    {activePatient.fullName.charAt(0)}
                  </span>
                  <div>
                    <div className="font-semibold text-emerald-950">{activePatient.fullName}</div>
                    <div className="text-[10px] text-emerald-700">{activePatient.mrn}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                className="w-full py-2.5 text-center text-xs font-semibold text-emerald-950 bg-emerald-100/70 border border-emerald-300 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-emerald-800" />
                <span>Sign In to Patient Portal</span>
              </button>
            )}

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenHipaaModal(); }}
              className="w-full text-center py-2 text-xs font-medium text-emerald-800 bg-emerald-50 rounded-xl border border-emerald-200/60 cursor-pointer"
            >
              HIPAA Safeguards & NPP Policy
            </button>

            <button
              onClick={() => handleNav('booking')}
              className="w-full py-3 text-center text-xs font-semibold text-white bg-emerald-800 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Clinical Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
