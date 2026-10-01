import React, { useState } from 'react';
import { 
  Activity, 
  HeartPulse, 
  Flame, 
  Sparkles, 
  Dna, 
  Apple, 
  Smile, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Calendar,
  Users
} from 'lucide-react';

interface Specialty {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  symptomsAndConditions: string[];
  clinicalApproach: string;
  idealFor: string;
  icon: React.ReactNode;
}

const SPECIALTIES: Specialty[] = [
  {
    id: 'gut-digestive',
    title: 'Gastrointestinal & Digestive Health',
    category: 'Digestive Therapeutics',
    tagline: 'Restore mucosal barrier integrity and rebalance your microbiome.',
    description: 'Targeted medical nutrition therapy for persistent gut issues. We systematically investigate the root causes of dysbiosis, gut inflammation, and motility disturbances.',
    symptomsAndConditions: [
      'Irritable Bowel Syndrome (IBS-C, IBS-D, IBS-M)',
      'Small Intestinal Bacterial Overgrowth (SIBO)',
      'Chronic post-meal bloating & gas',
      'Food chemical sensitivities & histamine intolerance',
      'GERD, acid reflux & gastroparesis'
    ],
    clinicalApproach: '4-R Framework: Remove reactive triggers, Replace digestive enzymes, Re-inoculate beneficial bacteria, and Repair epithelial tight junctions with targeted glutamine and polyphenol protocols.',
    idealFor: 'Anyone struggling with daily digestive discomfort, unpredictable bowel habits, or recurring food reactions.',
    icon: <HeartPulse className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'metabolic-prediabetes',
    title: 'Metabolic & Prediabetes Remission',
    category: 'Cardiometabolic Health',
    tagline: 'Normalize fasting glucose and reverse insulin resistance.',
    description: 'Evidence-informed dietary interventions coupled with optional continuous glucose monitoring (CGM) telemetry to stabilize glycemic excursions and optimize cellular energy production.',
    symptomsAndConditions: [
      'Prediabetes (HbA1c 5.7% - 6.4%)',
      'Fasting insulin elevation & HOMA-IR resistance',
      'Afternoon 3 PM energy crashes & brain fog',
      'Metabolic syndrome & abdominal adiposity',
      'Family history of Type 2 Diabetes'
    ],
    clinicalApproach: 'Bio-individual carbohydrate threshold mapping, strategic nutrient sequencing (fiber, protein, then starch), and meal-timing protocols to eliminate reactive hypoglycemia.',
    idealFor: 'Individuals alerted by elevated routine lab biomarkers seeking to prevent diabetes without pharmaceutical dependency.',
    icon: <Activity className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'womens-hormonal',
    title: 'Women’s Endocrine & Hormonal Health',
    category: 'Hormone Optimization',
    tagline: 'Support ovarian, adrenal, and thyroid pathways through targeted nutrition.',
    description: 'Nutritional strategies addressing the complex interplay between insulin, cortisol, progesterone, and estrogens across every life stage.',
    symptomsAndConditions: [
      'Polycystic Ovary Syndrome (PCOS - Insulin-resistant & Inflammatory)',
      'Hypothyroidism & Hashimoto\'s Thyroiditis',
      'Perimenopause & Menopausal metabolic shift',
      'Premenstrual syndrome (PMS) & cycle irregularities',
      'Post-pill nutrient depletions'
    ],
    clinicalApproach: 'Micronutrient repletion (Inositol, Magnesium, Zinc, B-Complex), anti-inflammatory omega fats, and hormone-stabilizing protein distribution.',
    idealFor: 'Women dealing with cycle disruptions, stubborn hormonal weight shifts, fatigue, or mood fluctuations.',
    icon: <Sparkles className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'cardiovascular-lipid',
    title: 'Cardiovascular & Lipid Optimization',
    category: 'Heart Health',
    tagline: 'Optimize lipid sub-fractions and endothelial vascular function.',
    description: 'Beyond basic low-cholesterol advice: a modern clinical approach examining particle size (ApoB, LDL-P), systemic inflammation (hs-CRP), and arterial flexibility.',
    symptomsAndConditions: [
      'Elevated ApoB, LDL-C & total cholesterol',
      'High triglycerides & low HDL ratio',
      'Essential hypertension / elevated blood pressure',
      'Elevated coronary artery calcium (CAC) awareness',
      'Endothelial dysfunction & vascular stiffness'
    ],
    clinicalApproach: 'Soluble viscous fiber architecture (psyllium, beta-glucan), plant sterol integration, Mediterranean polyphenol-rich fat sources, and sodium-to-potassium electrolyte balancing.',
    idealFor: 'Individuals aiming to optimize lipid panels, maintain healthy blood pressure, and safeguard long-term vascular health.',
    icon: <HeartPulse className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'sustainable-weight',
    title: 'Sustainable Weight & Metabolic Nourishment',
    category: 'Body Composition',
    tagline: 'Break free from chronic dieting with physiologically grounded nourishment.',
    description: 'A compassionate, non-punitive clinical framework centered on lean muscle retention, satiety hormone signaling (GLP-1, PYY, Leptin), and metabolic flexibility.',
    symptomsAndConditions: [
      'Weight-loss plateaus following crash diets',
      'Loss of lean muscle mass & metabolic slowdown',
      'Constant food noise & evening sugar cravings',
      'Nutritional support alongside GLP-1 medications',
      'Unhealthy relationship with restrictive calorie counting'
    ],
    clinicalApproach: 'High-leucine protein pacing, high-volume fiber matrix, and personalized satiety indices that fuel active lives without energy deprivation.',
    idealFor: 'Anyone seeking sustainable, lifelong metabolic health without restrictive yo-yo diets.',
    icon: <Flame className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'sports-performance',
    title: 'Athletic Performance & Recovery Fueling',
    category: 'Sports Dietetics',
    tagline: 'Fuel athletic output, preserve glycogen, and accelerate recovery.',
    description: 'Precision sports dietetics for endurance athletes, strength competitors, and hybrid performers looking to train harder and recover faster.',
    symptomsAndConditions: [
      'Training fatigue, low energy & slow recovery',
      'Intra-workout cramping & electrolyte imbalances',
      'GI distress during endurance events ("runner\'s gut")',
      'Lean body mass accretion & hypertrophy goals',
      'Race-day / event fueling strategy formulation'
    ],
    clinicalApproach: 'Targeted carb-periodization, intra-workout osmotic hydration formulations, and post-exercise muscle protein synthesis timing.',
    idealFor: 'Runners, triathletes, CrossFitters, lifters, and active individuals wanting evidence-backed athletic fueling.',
    icon: <Dna className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'autoimmune-inflammation',
    title: 'Autoimmune & Systemic Inflammation',
    category: 'Immune Regulation',
    tagline: 'Calm inflammatory signaling and identify bio-individual food triggers.',
    description: 'Structured elimination and reintroduction protocols to reduce systemic inflammatory burden while maintaining nutrient density and culinary enjoyment.',
    symptomsAndConditions: [
      'Rheumatoid arthritis, lupus, or psoriasis flares',
      'Joint aches, muscle stiffness & systemic inflammation',
      'Celiac disease & non-celiac gluten sensitivity',
      'Suspected food intolerances & allergic reactions',
      'Chronic unexplained fatigue'
    ],
    clinicalApproach: 'Targeted anti-inflammatory Mediterranean-adapted protocols, gut-barrier support, and systematic single-food reintroduction tracking.',
    idealFor: 'Individuals diagnosed with or suspected of having autoimmune conditions seeking dietary strategies to calm flare-ups.',
    icon: <Apple className="w-6 h-6 text-emerald-800" />
  },
  {
    id: 'family-pediatric',
    title: 'Pediatric & Family Nutrition',
    category: 'Family Care',
    tagline: 'Build joyful, wholesome mealtime habits for the entire household.',
    description: 'Empowering parents with practical, stress-free meal strategies that foster healthy food relationships and optimal childhood growth.',
    symptomsAndConditions: [
      'Selective eating & sensory food aversions in children',
      'Growth curve deviations & nutrient deficiencies',
      'Childhood digestive complaints & food allergies',
      'Establishing balanced household dinner routines',
      'Adolescent sports nutrition'
    ],
    clinicalApproach: 'Division of responsibility in feeding, sensory food exploration frameworks, and nutrient-dense family meal plans.',
    idealFor: 'Families looking for practical, nutritious guidance that works with busy schedules and diverse family tastes.',
    icon: <Users className="w-6 h-6 text-emerald-800" />
  }
];

export const SpecialtiesSection: React.FC<{ onBookConsult: (id?: string) => void }> = ({ onBookConsult }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);

  return (
    <section className="py-20 bg-stone-50 border-t border-stone-200" id="specialties">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Clinical Specialties & Conditions</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-stone-900 tracking-tight">
            Comprehensive Nutrition Care Tailored to Your Body
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Every clinical protocol is individually formulated by Dr. Disha based on metabolomics, lab biomarkers, gastrointestinal health, and your daily lifestyle rhythm.
          </p>
        </div>

        {/* Specialties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SPECIALTIES.map((spec) => (
            <div
              key={spec.id}
              className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col justify-between hover:border-emerald-700/60 hover:shadow-md transition-all group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {spec.icon}
                </div>
                
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50/70 px-2.5 py-0.5 rounded-md inline-block mb-2">
                  {spec.category}
                </span>

                <h3 className="font-serif-display text-lg font-bold text-stone-900 mb-2 leading-snug">
                  {spec.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {spec.tagline}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-stone-100 mb-4">
                  <div className="text-[11px] font-semibold text-stone-700">Common Focus Areas:</div>
                  {spec.symptomsAndConditions.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSpecialty(spec)}
                  className="text-xs font-semibold text-stone-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  View Details &rarr;
                </button>
                <button
                  onClick={() => onBookConsult(spec.id)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for In-Depth Specialty Details */}
        {selectedSpecialty && (
          <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {selectedSpecialty.icon}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">
                      {selectedSpecialty.category}
                    </span>
                    <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                      {selectedSpecialty.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="text-stone-400 hover:text-stone-700 text-xl font-bold p-1 cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                {selectedSpecialty.description}
              </p>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                    Conditions & Symptoms Evaluated
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                    {selectedSpecialty.symptomsAndConditions.map((cond, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                    Dr. Disha's Clinical Approach
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {selectedSpecialty.clinicalApproach}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <strong className="text-stone-800">Ideal For:</strong> {selectedSpecialty.idealFor}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={() => setSelectedSpecialty(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = selectedSpecialty.id;
                    setSelectedSpecialty(null);
                    onBookConsult(id);
                  }}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Book Consultation for This Specialty</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
