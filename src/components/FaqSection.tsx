import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, HeartPulse, CreditCard, Clock, Calendar } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'care' | 'insurance' | 'consultation' | 'privacy';
}

const FAQS: FaqItem[] = [
  {
    category: 'consultation',
    question: 'What can I expect during my initial clinical nutrition assessment?',
    answer: 'Your first 75-minute consultation is a comprehensive clinical deep-dive. Dr. Disha reviews your complete medical and metabolic history, recent blood work, medication and supplement regimen, daily eating rhythms, gastrointestinal symptoms, and personal wellness goals. Together, you will co-create an individualized, actionable nutrition roadmap rather than a rigid generic diet plan.'
  },
  {
    category: 'insurance',
    question: 'Does insurance cover my nutrition consultations?',
    answer: 'Many private insurance plans (including Aetna, Blue Cross Blue Shield, UnitedHealthcare, and Cigna) provide out-of-network coverage for Medical Nutrition Therapy (MNT). We provide comprehensive, itemized Superbills containing standard diagnostic ICD-10 and CPT codes (such as 97802 for initial assessments and 97803 for follow-ups) which you can submit directly to your insurer for reimbursement. In addition, all consultations and packages are fully eligible for HSA (Health Savings Account) and FSA (Flexible Spending Account) payment.'
  },
  {
    category: 'insurance',
    question: 'How do the 0% APR EMI installment payment plans work?',
    answer: 'To make expert clinical care accessible, we offer interest-free 0% APR installment plans through our secure checkout. You can split 3-month or 6-month clinical care packages into 3, 6, 9, or 12 manageable monthly installments with no hidden fees, prepayment penalties, or impact on your credit score.'
  },
  {
    category: 'care',
    question: 'How are meal recommendations personalized to my needs?',
    answer: 'Dr. Disha utilizes a bio-individual approach that integrates biochemical data (fasting glucose, HbA1c, lipid sub-fractions, metabolic hormone panels) with your cultural food traditions, culinary skills, and daily schedule. We emphasize whole-food cellular nourishment, optimal macronutrient distribution, and gut barrier support rather than restrictive calorie counting.'
  },
  {
    category: 'care',
    question: 'What health conditions does Dr. Disha specialize in?',
    answer: 'Dr. Disha specializes in clinical dietetics and functional nutrition for metabolic disorders (prediabetes, insulin resistance, metabolic syndrome), gastrointestinal issues (IBS, SIBO, leaky gut, chronic bloating, food sensitivities), women\'s endocrine health (PCOS, thyroid imbalances, perimenopause), cardiovascular optimization, and sustainable body composition.'
  },
  {
    category: 'consultation',
    question: 'How often will we meet, and how do follow-up sessions work?',
    answer: 'Most patients benefit from meeting every 2 to 3 weeks initially to review continuous glucose or food diary feedback, adjust targeted meal strategies, and calibrate clinical supplement protocols. As symptoms resolve and habits solidify, sessions transition to monthly maintenance check-ins. All appointments take place via secure, high-definition telehealth video.'
  },
  {
    category: 'privacy',
    question: 'How is my Protected Health Information (PHI) kept secure?',
    answer: 'Our entire digital practice is engineered to comply with HIPAA 45 CFR Part 164 standards. Patient data, food logs, biometric measurements, and telehealth interactions are protected with 256-bit AES-GCM encryption in transit and at rest. We never sell, share, or monetize your health data under any circumstances.'
  }
];

export const FaqSection: React.FC<{ onBookClick?: () => void }> = ({ onBookClick }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all'
    ? FAQS
    : FAQS.filter(f => f.category === selectedCategory);

  return (
    <section className="py-20 bg-stone-50 border-t border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Everything You Need to Know About Nutrition Care
          </h2>
          <p className="text-sm text-stone-600 mt-3 leading-relaxed">
            Transparent answers on what to expect, insurance reimbursement, appointment cadence, and how personalized nutrition care works.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'consultation', label: 'Consultations & Care' },
            { id: 'insurance', label: 'Insurance & Pricing' },
            { id: 'care', label: 'Specialties & Methods' },
            { id: 'privacy', label: 'HIPAA & Privacy' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-sm sm:text-base text-stone-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-emerald-800' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 text-center space-y-3">
          <h4 className="font-serif-display text-lg font-bold text-emerald-950">
            Have a Specific Question About Your Health Goals?
          </h4>
          <p className="text-xs text-stone-600 max-w-lg mx-auto">
            We are here to support your journey. Schedule a consultation or reach out to our clinical triage team directly.
          </p>
          <div className="pt-1 flex items-center justify-center gap-3">
            {onBookClick && (
              <button
                onClick={onBookClick}
                className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Book Initial Consultation
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
