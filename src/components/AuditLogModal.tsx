import React, { useState } from 'react';
import { ShieldCheck, X, FileText, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storage';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose }) => {
  const [logs] = useState(() => StorageService.getAuditLogs());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-stone-200 shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                HIPAA Security Rule § 164.312(b)
              </div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Protected Health Information (PHI) Audit Trail
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex-1">
          <p className="text-xs text-stone-500">
            Chronological, immutable audit record of all electronic protected health information (ePHI) access, modifications, and exports.
          </p>

          <div className="overflow-x-auto border border-stone-200 rounded-xl">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-400 font-sans uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">Authorized Actor</th>
                  <th className="py-2.5 px-3">Event Action</th>
                  <th className="py-2.5 px-3">PHI Resource Path</th>
                  <th className="py-2.5 px-3">Connection Node</th>
                  <th className="py-2.5 px-3">Security State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-medium text-stone-900">{log.timestamp}</td>
                    <td className="py-2.5 px-3 font-sans">{log.actor}</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-800">{log.action}</td>
                    <td className="py-2.5 px-3 text-stone-500">{log.resource}</td>
                    <td className="py-2.5 px-3 text-[11px] text-stone-400">{log.ipAddress}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg"
          >
            Close Audit Trail
          </button>
        </div>

      </div>
    </div>
  );
};
