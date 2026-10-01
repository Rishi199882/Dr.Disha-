import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Check, 
  FileText, 
  Download, 
  Calculator, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Printer, 
  X,
  Calendar,
  Percent,
  Layers,
  Banknote
} from 'lucide-react';
import { InvoiceSuperbill, BookingAppointment, EmiPlanOption, EmiContract } from '../types/nutrition';
import { CLINICAL_PROVIDER } from '../data/mockData';
import { StorageService } from '../services/storage';

interface PaymentGatewayProps {
  initialBooking?: BookingAppointment | null;
  onPaymentSuccess?: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ 
  initialBooking,
  onPaymentSuccess
}) => {
  const [invoices, setInvoices] = useState<InvoiceSuperbill[]>(() => StorageService.getInvoices());
  const [emiContracts, setEmiContracts] = useState<EmiContract[]>(() => StorageService.getEmiContracts());

  const [selectedPackage, setSelectedPackage] = useState({
    title: initialBooking?.consultationTitle || '3-Month Gut & Microbiome Reset Program',
    price: initialBooking?.price || 540,
    cpt: '97802, 97803',
    icd10: 'K58.9 (IBS) / R73.03'
  });

  // Payment mode toggle: Full Pay vs EMI Installments
  const [paymentMode, setPaymentMode] = useState<'full' | 'emi'>('emi');
  const [selectedEmiMonths, setSelectedEmiMonths] = useState<number>(3);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(180);

  // Sliding scale calculator state
  const [showSlidingScale, setShowSlidingScale] = useState(false);
  const [annualIncome, setAnnualIncome] = useState<number>(65000);
  const [householdSize, setHouseholdSize] = useState<number>(2);

  // Checkout modal
  const [showCheckout, setShowCheckout] = useState(!!initialBooking);
  const [cardName, setCardName] = useState('Sarah Jenkins');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('842');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paidInvoice, setPaidInvoice] = useState<InvoiceSuperbill | null>(null);

  // Calculate sliding scale discount
  const getDiscountPct = () => {
    const povertyGuideline = 15060 + (householdSize - 1) * 5380;
    const ratio = annualIncome / povertyGuideline;
    if (ratio < 2.0) return 40;
    if (ratio < 3.0) return 25;
    if (ratio < 4.0) return 15;
    return 0;
  };

  const discountPct = getDiscountPct();
  const basePrice = selectedPackage.price;
  const discountedPrice = Math.round(basePrice * (1 - discountPct / 100));

  // EMI Options Calculation
  const emiPlans: EmiPlanOption[] = [
    { months: 3, interestRatePct: 0, monthlyInstallment: Math.round((discountedPrice - downPaymentAmount) / 3), totalPayable: discountedPrice, processingFee: 0 },
    { months: 6, interestRatePct: 2.5, monthlyInstallment: Math.round(((discountedPrice - downPaymentAmount) * 1.025) / 6), totalPayable: Math.round(discountedPrice * 1.025), processingFee: Math.round(discountedPrice * 0.025) },
    { months: 9, interestRatePct: 3.5, monthlyInstallment: Math.round(((discountedPrice - downPaymentAmount) * 1.035) / 9), totalPayable: Math.round(discountedPrice * 1.035), processingFee: Math.round(discountedPrice * 0.035) },
    { months: 12, interestRatePct: 4.5, monthlyInstallment: Math.round(((discountedPrice - downPaymentAmount) * 1.045) / 12), totalPayable: Math.round(discountedPrice * 1.045), processingFee: Math.round(discountedPrice * 0.045) }
  ];

  const activeEmiPlan = emiPlans.find(p => p.months === selectedEmiMonths) || emiPlans[0];
  const finalDueToday = paymentMode === 'full' ? discountedPrice : downPaymentAmount;

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      // 1. Create Invoice
      const newInvoice: InvoiceSuperbill = {
        id: `inv-${Date.now().toString().slice(-4)}`,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: 'patient-01',
        patientName: cardName,
        serviceDescription: selectedPackage.title,
        cptCode: selectedPackage.cpt,
        icd10Code: selectedPackage.icd10,
        amount: finalDueToday,
        tax: 0.00,
        total: finalDueToday,
        date: new Date().toISOString().split('T')[0],
        status: paymentMode === 'emi' ? 'emi-active' : 'paid',
        paymentMethod: `Visa •••• ${cardNumber.slice(-4)} (${paymentMode === 'emi' ? `${selectedEmiMonths}-Mo EMI Plan` : 'Paid in Full'})`,
        providerNpi: CLINICAL_PROVIDER.npi,
        taxId: CLINICAL_PROVIDER.taxId,
        clinicAddress: CLINICAL_PROVIDER.clinicAddress,
        emiPlanDetails: paymentMode === 'emi' ? {
          months: selectedEmiMonths,
          monthlyAmount: activeEmiPlan.monthlyInstallment,
          remainingBalance: Math.max(0, activeEmiPlan.totalPayable - downPaymentAmount)
        } : undefined
      };

      StorageService.addInvoice(newInvoice);
      setInvoices(StorageService.getInvoices());

      // 2. If EMI, record contract
      if (paymentMode === 'emi') {
        const contract: EmiContract = {
          id: `emi-${Date.now()}`,
          patientId: 'patient-01',
          patientName: cardName,
          serviceTitle: selectedPackage.title,
          principalAmount: activeEmiPlan.totalPayable,
          downPayment: downPaymentAmount,
          months: selectedEmiMonths,
          monthlyAmount: activeEmiPlan.monthlyInstallment,
          paidMonths: 1,
          nextDueDate: '2026-11-01',
          status: 'active'
        };
        StorageService.createEmiContract(contract);
        setEmiContracts(StorageService.getEmiContracts());
      }

      setPaidInvoice(newInvoice);
      setIsProcessing(false);
      setShowCheckout(false);
      if (onPaymentSuccess) onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl">
        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          Flexible Healthcare Finance & Superbills
        </div>
        <h2 className="font-serif-display text-3xl font-bold text-stone-900">
          Payment Gateway & Flexible EMI Installment Plans
        </h2>
        <p className="text-sm text-stone-600 mt-2">
          Quality clinical nutrition should be accessible to all. Pay in full, use your HSA/FSA debit card, or spread care across <strong>3, 6, 9, or 12 monthly installments with 0% APR</strong> options with Dr. Disha.
        </p>
      </div>

      {/* EMI Calculator Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-[11px] font-semibold text-emerald-200">
            <Percent className="w-3.5 h-3.5" />
            <span>0% Interest on 3-Month EMI Plans</span>
          </div>
          <h3 className="font-serif-display text-xl sm:text-2xl font-bold">
            Zero-Barrier Care with Dr. Disha Flexible Installments
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Split any 3-month or 6-month clinical program into manageable monthly payments. No hidden credit bureau penalties, instant pre-approval, and eligible for HSA/FSA reimbursement.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center shrink-0 min-w-56 font-mono-numbers space-y-1">
          <span className="text-[10px] uppercase font-sans text-stone-300 block">Starting As Low As</span>
          <span className="text-3xl font-bold text-emerald-300">$120/mo</span>
          <span className="text-[11px] text-stone-300 block font-sans">for 3-Month Gut Reset Program</span>
        </div>
      </div>

      {/* Pricing Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tier 1 */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-6 shadow-sm hover:border-stone-300 transition-all">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Single Evaluation
            </span>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Initial Clinical Assessment
            </h3>
            <div className="flex items-baseline gap-1 font-mono-numbers">
              <span className="text-3xl font-bold text-stone-900">$245</span>
              <span className="text-xs text-stone-500">/ 75-minute consultation</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Complete baseline biomarker evaluation, genetic/metabolic history mapping, dietary intake audit, and personalized protocol roadmap with Dr. Disha.
            </p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>75-Minute 1-on-1 Video Session</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Full Lab & CGM Data Interpretation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Superbill with CPT 97802 diagnostic codes</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setSelectedPackage({
                title: 'Comprehensive Initial Clinical Assessment (75 Min)',
                price: 245,
                cpt: '97802',
                icd10: 'R73.03 (Prediabetes)'
              });
              setPaymentMode('full');
              setShowCheckout(true);
            }}
            className="w-full py-2.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
          >
            Checkout Single Session ($245)
          </button>
        </div>

        {/* Tier 2: 3-Month Gut & Microbiome Reset */}
        <div className="bg-white rounded-2xl border-2 border-emerald-800 p-6 flex flex-col justify-between space-y-6 shadow-md relative">
          <div className="absolute -top-3 left-6 bg-emerald-800 text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full">
            EMI Available · 0% APR
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Targeted Protocol
            </span>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              3-Month Gut & Microbiome Reset
            </h3>
            <div className="flex items-baseline gap-1 font-mono-numbers">
              <span className="text-3xl font-bold text-emerald-900">$540</span>
              <span className="text-xs text-stone-500">or 3 payments of $120/mo</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Targeted 4-R intestinal mucosal repair protocol for IBS, SIBO, leaky gut, and stubborn chronic food sensitivities.
            </p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Initial 75m + 3 Bi-weekly 45m Follow-ups</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Microbiome GI Map Stool Test Review</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Direct HIPAA Secure Chat with Dr. Disha</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setSelectedPackage({
                  title: '3-Month Gut & Microbiome Reset Program',
                  price: 540,
                  cpt: '97802, 97803',
                  icd10: 'K58.9 (IBS) / R73.03'
                });
                setPaymentMode('emi');
                setShowCheckout(true);
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Enroll with EMI ($120/mo)</span>
            </button>
            <button
              onClick={() => {
                setSelectedPackage({
                  title: '3-Month Gut & Microbiome Reset Program',
                  price: 540,
                  cpt: '97802, 97803',
                  icd10: 'K58.9 (IBS) / R73.03'
                });
                setPaymentMode('full');
                setShowCheckout(true);
              }}
              className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:underline text-center"
            >
              or Pay in Full ($540)
            </button>
          </div>
        </div>

        {/* Tier 3: 6-Month Metabolic Health */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between space-y-6 shadow-sm hover:border-stone-300 transition-all">
          <div className="space-y-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Total Remission
            </span>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              6-Month Metabolic Remission
            </h3>
            <div className="flex items-baseline gap-1 font-mono-numbers">
              <span className="text-3xl font-bold text-stone-900">$980</span>
              <span className="text-xs text-stone-500">or 6 payments of $145/mo</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Designed specifically to reverse pre-diabetes, normalize HbA1c below 5.7%, and resolve cellular insulin resistance for good.
            </p>
            <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Initial 75m + 6 Monthly Follow-up Sessions</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Continuous Glucose Monitor (CGM) Sync</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Full Monthly Insurance Superbills</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setSelectedPackage({
                  title: '6-Month Metabolic Remission Program',
                  price: 980,
                  cpt: '97802, 97803',
                  icd10: 'R73.03 (Prediabetes) / E66.9'
                });
                setPaymentMode('emi');
                setShowCheckout(true);
              }}
              className="w-full py-2.5 text-xs font-semibold text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200/80 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-800" />
              <span>Enroll with EMI ($145/mo)</span>
            </button>
            <button
              onClick={() => {
                setSelectedPackage({
                  title: '6-Month Metabolic Remission Program',
                  price: 980,
                  cpt: '97802, 97803',
                  icd10: 'R73.03 (Prediabetes) / E66.9'
                });
                setPaymentMode('full');
                setShowCheckout(true);
              }}
              className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:underline text-center"
            >
              or Pay in Full ($980)
            </button>
          </div>
        </div>

      </div>

      {/* Sliding Scale Financial Hardship Calculator Toggle */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif-display text-lg font-bold text-stone-900">
              Sliding Scale Fee Assistance & HSA/FSA Eligibility
            </h4>
            <p className="text-xs text-stone-500">
              Dr. Disha provides income-based sliding scale fee reductions up to 40% for qualifying households.
            </p>
          </div>
          <button
            onClick={() => setShowSlidingScale(!showSlidingScale)}
            className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors flex items-center gap-2"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>{showSlidingScale ? 'Hide Calculator' : 'Check Sliding Scale Discount'}</span>
          </button>
        </div>

        {showSlidingScale && (
          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Annual Household Income: ${annualIncome.toLocaleString()}
              </label>
              <input
                type="range"
                min="20000"
                max="150000"
                step="5000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Household Members: {householdSize}
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={householdSize}
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="p-3 bg-white rounded-xl border border-stone-200 flex flex-col justify-center">
              <span className="text-[10px] uppercase font-semibold text-stone-400">Assistance Status</span>
              <span className="text-base font-bold text-emerald-800 font-mono-numbers">
                {discountPct > 0 ? `${discountPct}% Sliding Scale Discount` : 'Standard Clinic Rate'}
              </span>
              <span className="text-[11px] text-stone-500">
                Discount automatically applied during checkout.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Active EMI Installment Contracts */}
      {emiContracts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Active Patient EMI Contracts ({emiContracts.length})
            </h3>
            <span className="text-xs text-stone-500">Flexible Installment Ledger</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emiContracts.map(contract => (
              <div key={contract.id} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 text-xs shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                      EMI Plan #{contract.id}
                    </span>
                    <h4 className="font-semibold text-stone-900 mt-0.5">{contract.serviceTitle}</h4>
                    <p className="text-stone-400 text-[11px]">Patient: {contract.patientName}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    {contract.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono-numbers bg-stone-50 p-2.5 rounded-lg border border-stone-100 text-[11px]">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Monthly Due</span>
                    <span className="font-bold text-stone-900">${contract.monthlyAmount}/mo</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Installments</span>
                    <span className="font-bold text-stone-900">{contract.paidMonths} / {contract.months}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Next Due Date</span>
                    <span className="font-bold text-emerald-800">{contract.nextDueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Invoices & Medical Superbill History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-xl font-bold text-stone-900">
            Medical Superbills & Receipts ({invoices.length})
          </h3>
          <span className="text-xs text-stone-500">IRS Code 213(d) Qualified Healthcare Expenses</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 text-xs shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 tracking-wider">
                    {inv.invoiceNumber}
                  </span>
                  <h4 className="font-semibold text-stone-900 mt-0.5">{inv.serviceDescription}</h4>
                  <p className="text-stone-400 text-[11px] font-mono-numbers">
                    Date: {inv.date} · Patient: {inv.patientName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono-numbers text-stone-900">${inv.total}.00</span>
                  <span className="block text-[10px] text-emerald-700 font-semibold uppercase">{inv.status}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-100 font-mono-numbers text-[11px] space-y-0.5">
                <div>Provider NPI: {inv.providerNpi} · Tax ID: {inv.taxId}</div>
                <div>Billing CPT: {inv.cptCode} · Diagnostic ICD-10: {inv.icd10Code}</div>
                <div>Payment Method: {inv.paymentMethod}</div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-400">Ready for Insurance Submission</span>
                <button
                  onClick={() => setPaidInvoice(inv)}
                  className="text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Official Superbill</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHECKOUT MODAL (Simulated Stripe + EMI Split) */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleProcessPayment} className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-xs uppercase font-semibold text-emerald-800">Secure Payment Terminal</span>
                <h3 className="font-serif-display text-xl font-bold text-stone-900">
                  {selectedPackage.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Selector: Pay in Full vs EMI */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMode('full')}
                className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                  paymentMode === 'full'
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Pay in Full (${discountedPrice})
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('emi')}
                className={`py-2 px-3 rounded-xl font-semibold border transition-all ${
                  paymentMode === 'emi'
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-900 shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                Flexible EMI Installments
              </button>
            </div>

            {/* EMI Duration Selector */}
            {paymentMode === 'emi' && (
              <div className="space-y-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Choose EMI Tenure:</span>
                  <span className="text-emerald-800 font-medium">0% APR on 3-Mo</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {emiPlans.map(plan => (
                    <button
                      key={plan.months}
                      type="button"
                      onClick={() => setSelectedEmiMonths(plan.months)}
                      className={`p-2 rounded-lg text-center font-mono-numbers border transition-all ${
                        selectedEmiMonths === plan.months
                          ? 'border-emerald-800 bg-white ring-2 ring-emerald-800/20 font-bold text-stone-900 shadow-xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-[10px] text-stone-500 font-sans">{plan.months} Mos</div>
                      <div className="text-xs font-bold text-emerald-800">${plan.monthlyInstallment}/mo</div>
                      <div className="text-[9px] text-stone-400 font-sans">{plan.interestRatePct === 0 ? '0% Fee' : `+${plan.interestRatePct}%`}</div>
                    </button>
                  ))}
                </div>

                {/* Down Payment Option */}
                <div className="pt-2 border-t border-stone-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-stone-600 font-medium">Initial Down Payment Today:</span>
                    <span className="font-bold font-mono-numbers text-stone-900">${downPaymentAmount}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max={discountedPrice / 2}
                    step="20"
                    value={downPaymentAmount}
                    onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono-numbers">
                    <span>Min $100</span>
                    <span>Max ${(discountedPrice / 2).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono-numbers">
              <div className="flex justify-between text-stone-600">
                <span>Standard Clinical Package Fee:</span>
                <span>${basePrice}.00</span>
              </div>
              {discountPct > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Sliding Scale Discount (-{discountPct}%):</span>
                  <span>-${basePrice - discountedPrice}.00</span>
                </div>
              )}
              {paymentMode === 'emi' && (
                <div className="flex justify-between text-stone-600">
                  <span>Subsequent Monthly Installments:</span>
                  <span>{selectedEmiMonths} × ${activeEmiPlan.monthlyInstallment}/mo</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Total Due Today:</span>
                <span className="text-emerald-900">${finalDueToday}.00</span>
              </div>
            </div>

            {/* Simulated Card Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1 font-medium">Cardholder Name (Patient / Guarantor)</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Card Number (Visa, MC, Amex, HSA/FSA)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                  <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 font-medium">Expiration (MM/YY)</label>
                  <input
                    type="text"
                    required
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1 font-medium">CVC Security Code</label>
                  <input
                    type="text"
                    required
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 font-mono-numbers"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/50">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>PCI-DSS Level 1 Encrypted. Official insurance Superbill generated immediately after checkout.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? 'Authorizing Payment...' : `Authorize & Pay $${finalDueToday}.00`}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUPERBILL VIEWER MODAL */}
      {paidInvoice && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Official Medical Superbill / CMS-1500 Standard
                </span>
                <h3 className="font-serif-display text-xl font-bold text-stone-900">
                  {CLINICAL_PROVIDER.clinicName}
                </h3>
                <p className="text-xs text-stone-500">{CLINICAL_PROVIDER.clinicAddress}</p>
                <p className="text-xs text-stone-500">Phone: {CLINICAL_PROVIDER.clinicPhone} · Email: {CLINICAL_PROVIDER.clinicEmail}</p>
              </div>
              <button
                onClick={() => setPaidInvoice(null)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Provider & Patient Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono-numbers bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <div>
                <div className="text-stone-400 font-sans text-[10px] uppercase">Rendering Provider</div>
                <div className="font-bold text-stone-800">{CLINICAL_PROVIDER.name}</div>
                <div>NPI: {paidInvoice.providerNpi}</div>
                <div>Tax ID (EIN): {paidInvoice.taxId}</div>
              </div>
              <div>
                <div className="text-stone-400 font-sans text-[10px] uppercase">Patient Information</div>
                <div className="font-bold text-stone-800">{paidInvoice.patientName}</div>
                <div>Invoice #: {paidInvoice.invoiceNumber}</div>
                <div>Date of Service: {paidInvoice.date}</div>
              </div>
            </div>

            {/* Diagnostic Codes & Line Item */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-stone-800 uppercase tracking-wider text-[10px]">
                Diagnostic & Procedure Codes (CPT / ICD-10)
              </div>
              <table className="w-full text-left font-mono-numbers border-t border-b border-stone-200">
                <thead>
                  <tr className="text-stone-400 text-[10px] uppercase">
                    <th className="py-2">Description</th>
                    <th className="py-2">CPT Code</th>
                    <th className="py-2">ICD-10 Code</th>
                    <th className="py-2 text-right">Paid Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-2.5 font-sans font-medium text-stone-900">{paidInvoice.serviceDescription}</td>
                    <td className="py-2.5 text-emerald-800 font-bold">{paidInvoice.cptCode}</td>
                    <td className="py-2.5 text-stone-700">{paidInvoice.icd10Code}</td>
                    <td className="py-2.5 text-right font-bold text-stone-900">${paidInvoice.total}.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {paidInvoice.emiPlanDetails && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs font-mono-numbers">
                <span className="font-semibold text-stone-800 font-sans block text-[11px]">EMI Agreement Terms:</span>
                <div>{paidInvoice.emiPlanDetails.months}-Month Installment Plan</div>
                <div>Monthly Payment: ${paidInvoice.emiPlanDetails.monthlyAmount}/mo</div>
                <div>Remaining Balance: ${paidInvoice.emiPlanDetails.remainingBalance}.00</div>
              </div>
            )}

            <div className="flex justify-between items-center text-xs bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
              <span className="text-emerald-900 font-medium">Payment Status: Authorized ({paidInvoice.paymentMethod})</span>
              <span className="font-bold text-emerald-950 font-mono-numbers">${paidInvoice.total}.00</span>
            </div>

            <div className="text-[11px] text-stone-500 italic">
              Instructions for Patient: Submit this statement directly to your private insurer (Aetna, BCBS, Cigna, UHC) with your claim form for out-of-network reimbursement.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Superbill</span>
              </button>
              <button
                onClick={() => setPaidInvoice(null)}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
