import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, ShieldCheck } from 'lucide-react';
import { StorageService } from '../services/storage';

interface LockScreenModalProps {
  isLocked: boolean;
  onUnlock: () => void;
}

export const LockScreenModal: React.FC<LockScreenModalProps> = ({ isLocked, onUnlock }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(false);
      if (nextPin.length === 4) {
        if (StorageService.verifyPin(nextPin)) {
          StorageService.setSecurityLocked(false);
          setPin('');
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center space-y-6 shadow-2xl border border-stone-200">
        
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="font-serif-display text-xl font-bold text-stone-900">
            Session Locked for PHI Privacy
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            HIPAA technical safeguard § 164.312(a)(2)(iii). Enter your 4-digit clinical access PIN to resume.
          </p>
          <p className="text-[11px] text-emerald-800 font-semibold mt-1">
            Default Demo PIN: 1 2 3 4
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-3 py-2">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                pin.length > idx 
                  ? 'bg-emerald-800 scale-110' 
                  : error 
                    ? 'border-2 border-rose-500 bg-rose-100' 
                    : 'border-2 border-stone-300'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="text-xs text-rose-600 font-medium">
            Incorrect PIN code. Please try again.
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto text-sm font-semibold font-mono-numbers">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(n => (
            <button
              key={n}
              onClick={() => handleKeyPress(n)}
              className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              {n}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="py-3 rounded-xl text-xs text-stone-500 hover:bg-stone-100"
          >
            Clear
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 rounded-xl text-xs text-stone-500 hover:bg-stone-100"
          >
            &larr;
          </button>
        </div>

      </div>
    </div>
  );
};
