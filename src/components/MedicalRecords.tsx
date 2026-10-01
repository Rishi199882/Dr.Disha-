import React, { useState } from 'react';
import { 
  FileText, 
  FlaskConical, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Calendar,
  Building
} from 'lucide-react';
import { SoapNote, LabReport, PatientProfile } from '../types/nutrition';
import { CLINICAL_PROVIDER } from '../data/mockData';
import { StorageService } from '../services/storage';

interface MedicalRecordsProps {
  patient: PatientProfile;
}

export const MedicalRecords: React.FC<MedicalRecordsProps> = ({ patient }) => {
  const [activeSubTab, setActiveSubTab] = useState<'soap' | 'labs'>('soap');
  const [soapNotes, setSoapNotes] = useState<SoapNote[]>(() => StorageService.getSoapNotes(patient.id));
  const [labReports, setLabReports] = useState<LabReport[]>(() => StorageService.getLabReports(patient.id));
  
  // New SOAP modal state
  const [showAddSoap, setShowAddSoap] = useState(false);
  const [newSoap, setNewSoap] = useState({
    encounterDate: new Date().toISOString().split('T')[0],
    consultationType: 'Clinical Follow-Up & Biometric Reassessment (45 Min)',
    subjective: 'Patient reports high adherence to low-glycemic Mediterranean meal plan. Daily fasting glucose has stabilized under 95 mg/dL. Sleep latency improved.',
    objective: 'Fasting glucose 92 mg/dL. BP: 118/76 mmHg. Weight: 169.5 lbs (-8.9 lbs loss). Waist circumference: 32.8 inches. Repeat HbA1c: 5.4%.',
    assessment: '1. Pre-diabetes (ICD-10: R73.03) in clinical biochemical remission.\n2. Metabolic syndrome risk factor normalization.',
    plan: '1. Continue personalized nutrition macro target of 110g protein / 120g net carbs / 75g fat.\n2. Maintain berberine 500mg BID prior to largest meals.\n3. Re-evaluate fasting lipid panel in 60 days.',
    icd10: 'R73.03 - Prediabetes',
    cpt: '97803 - MNT Re-assessment'
  });

  // Simulated Lab Upload
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const handleSaveSoap = (e: React.FormEvent) => {
    e.preventDefault();
    const note: SoapNote = {
      id: `soap-${Date.now()}`,
      patientId: patient.id,
      encounterDate: newSoap.encounterDate,
      provider: CLINICAL_PROVIDER.name,
      consultationType: newSoap.consultationType,
      subjective: newSoap.subjective,
      objective: newSoap.objective,
      assessment: newSoap.assessment,
      plan: newSoap.plan,
      icd10Codes: [{ code: newSoap.icd10.split(' - ')[0], description: newSoap.icd10.split(' - ')[1] || newSoap.icd10 }],
      cptCodes: [{ code: newSoap.cpt.split(' - ')[0], description: newSoap.cpt.split(' - ')[1] || newSoap.cpt }],
      signature: `Digitally Verified & Signed: ${CLINICAL_PROVIDER.name} (Lic# NY-CDN-009482)`,
      locked: true
    };

    StorageService.addSoapNote(note);
    setSoapNotes(StorageService.getSoapNotes(patient.id));
    setShowAddSoap(false);
  };

  const handleSimulateLabUpload = () => {
    setUploadNotice('Encrypting and parsing diagnostic HL7/PDF lab file with 256-bit AES...');
    setTimeout(() => {
      setUploadNotice('Lab panel verified & integrated into patient electronic health record!');
      setTimeout(() => setUploadNotice(null), 3000);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Clinical Health Records & Diagnostic Biomarkers
          </div>
          <h2 className="font-serif-display text-3xl font-bold text-stone-900">
            EHR Documentation & Laboratory Panels
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Patient: <strong className="text-stone-800">{patient.fullName}</strong> · MRN: {patient.mrn} · HIPAA 45 CFR Part 164 Compliant
          </p>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveSubTab('soap')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSubTab === 'soap' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-stone-600'
            }`}
          >
            Clinical SOAP Notes ({soapNotes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('labs')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSubTab === 'labs' ? 'bg-white text-emerald-900 shadow-xs font-semibold' : 'text-stone-600'
            }`}
          >
            Laboratory Biomarkers ({labReports.length})
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {/* SUBTAB 1: CLINICAL SOAP NOTES */}
      {activeSubTab === 'soap' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Provider: {CLINICAL_PROVIDER.name} (NPI: {CLINICAL_PROVIDER.npi})
            </span>
            <button
              onClick={() => setShowAddSoap(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Clinical Encounter Note</span>
            </button>
          </div>

          {soapNotes.map(note => (
            <div key={note.id} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-display text-lg font-bold text-stone-900">
                      {note.consultationType}
                    </h3>
                    {note.locked && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-stone-100 text-stone-600 font-medium">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Signed & Locked</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 font-mono-numbers mt-0.5">
                    Encounter Date: {note.encounterDate} · Attending Dietitian: {note.provider}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono-numbers">
                  {note.cptCodes.map(c => (
                    <span key={c.code} className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold">
                      CPT {c.code}
                    </span>
                  ))}
                  {note.icd10Codes.map(i => (
                    <span key={i.code} className="px-2 py-1 bg-stone-100 text-stone-700 rounded">
                      ICD {i.code}
                    </span>
                  ))}
                </div>
              </div>

              {/* SOAP Quadrants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
                  <div className="font-semibold text-emerald-900 uppercase tracking-wider text-[11px]">
                    Subjective (Patient Reported)
                  </div>
                  <p className="text-stone-700 whitespace-pre-line">{note.subjective}</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
                  <div className="font-semibold text-emerald-900 uppercase tracking-wider text-[11px]">
                    Objective (Biometrics & Labs)
                  </div>
                  <p className="text-stone-700 whitespace-pre-line font-mono-numbers">{note.objective}</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
                  <div className="font-semibold text-emerald-900 uppercase tracking-wider text-[11px]">
                    Assessment (Clinical Diagnosis)
                  </div>
                  <p className="text-stone-700 whitespace-pre-line">{note.assessment}</p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1.5">
                  <div className="font-semibold text-emerald-900 uppercase tracking-wider text-[11px]">
                    Plan (Therapeutic Nutrition Protocol)
                  </div>
                  <p className="text-stone-800 whitespace-pre-line">{note.plan}</p>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="italic">{note.signature}</span>
                <span className="font-mono-numbers">Security Hash: SHA-256 Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: LABORATORY BIOMARKERS */}
      {activeSubTab === 'labs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Accredited Clinical Lab: Quest Diagnostics & LabCorp Interface
            </span>
            <button
              onClick={handleSimulateLabUpload}
              className="px-4 py-2 text-xs font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-800" />
              <span>Upload Diagnostic Lab (PDF/HL7)</span>
            </button>
          </div>

          {labReports.map(lab => (
            <div key={lab.id} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-2">
                <div>
                  <h3 className="font-serif-display text-xl font-bold text-stone-900">
                    {lab.panelName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono-numbers mt-0.5">
                    Draw Date: {lab.testDate} · Facility: {lab.labFacility} · Ordering: {lab.orderingProvider}
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs font-semibold">
                  All Critical Indices Verified
                </span>
              </div>

              {/* Biomarkers Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 font-sans uppercase tracking-wider text-[10px]">
                      <th className="py-2.5">Biomarker Name</th>
                      <th className="py-2.5 font-mono-numbers">Patient Result</th>
                      <th className="py-2.5 font-mono-numbers">Functional Ref Range</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5">Clinical Significance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {lab.markers.map((m, idx) => (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="py-3 font-semibold text-stone-900">{m.name}</td>
                        <td className="py-3 font-mono-numbers font-bold text-emerald-800">
                          {m.value} {m.unit}
                        </td>
                        <td className="py-3 font-mono-numbers text-stone-500">
                          {m.refLow} - {m.refHigh} {m.unit}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            m.status === 'normal' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {m.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-stone-600 max-w-sm">{m.clinicalInterpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Physician Comments Box */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs space-y-1">
                <div className="font-semibold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Clinical Evaluation from {CLINICAL_PROVIDER.name}:</span>
                </div>
                <p className="text-stone-700 leading-relaxed italic">
                  &ldquo;{lab.physicianComments}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE SOAP NOTE MODAL */}
      {showAddSoap && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveSoap} className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Create Clinical SOAP Encounter Note
            </h3>
            <p className="text-xs text-stone-500">
              Standard medical nutrition record for billing & continuity of care.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1 font-medium">Encounter Date</label>
                <input
                  type="date"
                  value={newSoap.encounterDate}
                  onChange={(e) => setNewSoap({ ...newSoap, encounterDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
              <div>
                <label className="block text-stone-700 mb-1 font-medium">Consultation Modality</label>
                <input
                  type="text"
                  value={newSoap.consultationType}
                  onChange={(e) => setNewSoap({ ...newSoap, consultationType: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-stone-700 mb-1 font-semibold uppercase text-[10px]">Subjective</label>
                <textarea
                  rows={2}
                  value={newSoap.subjective}
                  onChange={(e) => setNewSoap({ ...newSoap, subjective: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-semibold uppercase text-[10px]">Objective</label>
                <textarea
                  rows={2}
                  value={newSoap.objective}
                  onChange={(e) => setNewSoap({ ...newSoap, objective: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-semibold uppercase text-[10px]">Assessment</label>
                <textarea
                  rows={2}
                  value={newSoap.assessment}
                  onChange={(e) => setNewSoap({ ...newSoap, assessment: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-semibold uppercase text-[10px]">Plan</label>
                <textarea
                  rows={2}
                  value={newSoap.plan}
                  onChange={(e) => setNewSoap({ ...newSoap, plan: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 font-medium">Diagnostic ICD-10</label>
                  <input
                    type="text"
                    value={newSoap.icd10}
                    onChange={(e) => setNewSoap({ ...newSoap, icd10: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1 font-medium">Billing CPT Code</label>
                  <input
                    type="text"
                    value={newSoap.cpt}
                    onChange={(e) => setNewSoap({ ...newSoap, cpt: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowAddSoap(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs"
              >
                Sign & Lock SOAP Note
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
